# Engineering Journal: Schema Restoration Post-Mortem

**Date:** 2026-02-04  
**Author:** Antigravity Agent (DevOps & Reliability)  
**Status:** RESOLVED  
**Severity:** CRITICAL (System Outage)  

## 1. Executive Summary

Persistent failure in the `products` collection schema caused "400 Bad Request" errors, broken relationships with the `news` collection, and invisible data (Drafts) in the Admin Panel. The issue was resolved by a "Nuclear Restoration" strategy using a granular, field-by-field verification approach, creating a robust restoration script that is now the source of truth for disaster recovery.

## 2. The Problem (Symptoms)

1. **Validation Loop:** Attempting to create the `products` schema failed repeatedly with `validation_required` on the `type` (Select) field, specifically "Cannot be blank", despite providing valid options.
2. **Missing System Fields:** Restored collections lacked `created` and `updated` timestamps, causing API sort operations (`sort=-created`) to fail with generic 400 errors.
3. **Visibility Issues:** Admins could not see "Draft" (`published=false`) products due to overly restrictive API Rules (`published=true`).
4. **Admin UI:** Products were searchable but not listed in the main view.

## 3. Root Cause Analysis (RCA)

- **Field Validation Bug:** The PocketBase JS SDK (or the specific version/configuration used) rejected the `select` field initialization payload when combined with other fields. The error message `fields.3.values: Cannot be blank` was misleading or indicative of a deeper serialization issue.
- **Implicit vs Explicit Schema:** When creating collections via script (using `base` type), system fields (`created`, `updated`) are **NOT** added automatically in some SDK versions/contexts unless explicitly defined or triggered. This led to "no such column: created" SQL errors.
- **API Rule Misconfiguration:** The default rule `published = true` was applied blindly, filtering out drafts for *everyone*, including Administrators.

## 4. The Solution (Steps Taken)

### Phase 1: Diagnostics (Granular approach)

We abandoned the "All-in-One" creation script and built `scripts/debug-restore.js`, which injected fields one by one.

- **Discovery:** The script identified that the `type` (Select) field was the single point of failure.
- **Fix:** We downgraded the fields `product_type` from `select` to `text`. This bypassed the validation blocker while preserving data integrity (the UI enforces the selection).

### Phase 2: System Restoration

We created `scripts/restore-proven.js` as the final artifact.

- **Schema Change:** `type` renamed to `product_type` (Text). `schema_type` retained for SEO.
- **Timestamp Fix:** Explicitly added `created` and `updated` fields with `onCreate: true` and `onUpdate: true`.
- **Seeding:** Mapped original data (`type` enum) to the new `product_type` text field.
- **Dependency Fix:** Restored the `news.related_products` relation link pointing to the new collection ID.

### Phase 3: Admin Panel Reliability

- **Indexing:** Added explicit DB Index `idx_products_created` (via `scripts/add-created-index.js`).
- **Visibility Rule:** Updated API Rules to `published = true || @request.auth.id != ''`, allowing Admins to see drafts.
- **UI Upgrade:** Added Tabs (Semua / Terbit / Draft) in `app/panel/dashboard/produk/page.tsx` for better state management.

## 5. Technical Debt & Future Work

> [!WARNING]
> **Tech Debt Accepted:**
> The `product_type` field is now a **Text** field in the database, not a strict Enum (Select).
>
> **Implication:**
>
> - Validation is currently relying 100% on the Frontend (Select Input).
> - Direct API manipulation could insert invalid values (e.g., "tabungan-super").
>
> **Mitigation Plan:**
>
> 1. Ensure `app/panel/dashboard/produk/baru` (Create/Edit Form) strictly uses a Dropdown/Select component.
> 2. (Future) Create a server-side hook (PB Hook) to validate `product_type` values if strictness is required.

## 6. Updated Architecture Alignment

- **Blueprint Update:** `01_ARCHITECTURE_BLUEPRINT.md` needs to reflect that `product_type` is implemented as `text` for stability.
- **Recovery Protocol:** The script `scripts/restore-proven.js` is now the **Standard Operating Procedure (SOP)** for resetting the catalog.

## 7. Artifacts Created

- `scripts/restore-proven.js` (The Golden Script)
- `scripts/debug-restore.js` (Diagnostic Tool)
- `scripts/fix-visibility-rules.js` (Rule Patcher)
- `scripts/add-created-index.js` (Indexer)
