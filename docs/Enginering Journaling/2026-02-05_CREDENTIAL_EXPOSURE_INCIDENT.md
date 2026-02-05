# Engineering Journal: Credential Exposure Incident Post-Mortem

**Date:** 2026-02-05
**Author:** Antigravity Agent (Security & DevOps)
**Status:** RESOLVED
**Severity:** CRITICAL (Security Vulnerability)

## 1. Executive Summary

A critical security vulnerability was identified where administrative credentials (email and password) were hardcoded directly into multiple TypeScript maintenance scripts. This exposed the system to potential unauthorized access if the codebase were shared or committed to a public repository. The issue was remediated by removing all hardcoded credentials and enforcing strict environment variable usage via `.env.local`.

## 2. The Problem (Symptoms)

1. **Hardcoded Secrets:** The Admin email (`sagamuda.id@gmail.com`) and password were found written in plain text within `scripts/`.
2. **Fallback Risks:** Code prevented errors by providing "default" hardcoded credentials if environment variables were missing (e.g., `process.env.PASS || "Secret123"`), effectively negating the purpose of environment variables.
3. **Exposure Scope:** 7 critical scripts used for schema validation, seeding, and rule updates contained these secrets.

## 3. Root Cause Analysis (RCA)

- **Development Convenience:** Fallback credentials were likely added to speed up local execution without ensuring `.env` context, violating security best practices.
- **Lack of Static Analysis:** No pre-commit hooks or secret scanning tools were active to catch high-entropy strings or known credential patterns.
- **Incomplete Refactoring:** Previous efforts to move to `.env` variables were not applied consistently across all auxiliary scripts.

## 4. The Solution (Steps Taken)

### Phase 1: Immediate Remediation (The "Purge")

We aggressively scanned the codebase for the exposed strings and removed them.

**Affected Files Cleaned:**

1. `scripts/fix-branches-rules.ts`
2. `scripts/seed-config.ts`
3. `scripts/seed-branches.ts`
4. `scripts/check-schema.ts`
5. `scripts/check-news-schema.ts`
6. `scripts/check-config-schema.ts`
7. `scripts/check-branches.ts`
8. `scripts/check-banners.ts`
9. `scripts/check-products.ts`

### Phase 2: Implementation of Secure Pattern

We replaced the insecure pattern with a strict validation pattern. The scripts now **fail fast** if credentials are missing, rather than falling back to an insecure default.

**Before (Insecure):**

```typescript
const email = process.env.POCKETBASE_ADMIN_EMAIL || "admin@example.com"; // ❌ DANGEROUS
```

**After (Secure):**

```typescript
const email = process.env.POCKETBASE_ADMIN_EMAIL;
if (!email) throw new Error("Missing POCKETBASE_ADMIN_EMAIL"); // ✅ SAFE
```

### Phase 3: Type Safety & URL Refactor

- Addressed TypeScript errors (`string | undefined`) resulting from strict checking.
- Refactored hardcoded API URLs (`https://db-bmtnulmj...`) to use `process.env.NEXT_PUBLIC_POCKETBASE_URL` to ensure environment consistency (Dev vs Prod).

## 5. Security Recommendations & Next Steps

> [!DATE]
> **Action Required:**
> If this repository was ever public or shared, the exposed credentials ("Sagamuda585858") **MUST BE ROTATED IMMEDIATELY** on the production server.

1. **Credential Rotation:** Change the Admin password on the PocketBase dashboard.
2. **Secret Scanning:** Implement a standardized workspace rule to prevent committing secrets (e.g., `.gitignore` checks, misuse of fallback values).
3. **Environment Audit:** Ensure all developers have a correctly configured `.env.local` based on `.env.example`.

## 6. Artifacts Updated

- `scripts/*.ts` (All maintenance scripts patched)
- `.env.local` (Verified as the single source of truth)

---
*Verified by Antigravity Agent - 2026-02-05*
