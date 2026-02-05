# Project Task Board

## Investigation Task (Completed)

- [x] **Analyze Evidence**
  - [x] Read `docs/Enginering Journaling/2026-02-04_SCHEMA_RESTORATION_POSTMORTEM.md`.
  - [x] Check `app/panel/dashboard/produk/page.tsx` (Admin Product List) - Expecting DB connection.
  - [x] Check `app/panel/dashboard/produk/form.tsx` (Admin Product Form) - Expecting DB connection.
  - [x] Re-verify `app/produk/page.tsx` (Public Product Page) - Confirmed Mock Data (needs explanation to user).
- [x] **Reconcile Status**
  - [x] Map "What is connected" vs "What is not".
  - [x] Plan the fix (likely connecting Public pages to the now-restored DB).

## Gap Analysis & Backlog (Completed)

**Goal**: Complete missing features from Phase 4 & 5 before moving to Phase 6.

## Phase 4: Public Features (Gaps)

- [x] **Products Page (`/produk`)**
  - [x] **Tabbed Interface**: Currently missing. Needs logic to switch between "Simpanan" and "Pembiayaan".
  - [x] **Data Quality**: Ensure products list matches the "Sirela", "Haji", "Modal Usaha" requirements.
- [x] **News Page (`/berita`)**
  - [x] **Categories**: Verify if filtering by "Berita" / "Edukasi" works or is just UI.
- [x] **Analytics Engine**
  - [x] **Skip/Defer**: Discuss if this is critical for MVP or can be pushed to Post-Launch. (Deferred)

## Phase 5: Admin Features (Gaps)

- [x] **Product CRUD (`/panel/dashboard/produk`)**
  - [x] **Verification**: Confirm if `page.tsx` and `form.tsx` exist and work similarly to News.

## Phase 6: QA, Optimization & "AI-Ready" SEO

**Goal**: Production readiness and AI discoverability.

- [x] **AI-Ready SEO**
  - [x] **Global Metadata (`app/layout.tsx`)**: Connect to `site_config`.
  - [x] **JSON-LD Schema**:
    - [x] Global Organization Schema.
    - [x] FinancialProduct Schema (Dynamic in `/produk`).
    - [x] NewsArticle Schema (Dynamic in `/berita` & slugs).
- [x] **Performance & Verify**
  - [x] **Font/Image Optimization**: Check `next/image` usage.
  - [x] **Build Check**: Ensure `pnpm build` passes.

## Phase 6.5: Refinements & Fixes (Current)

- [x] **Admin Settings (`/panel/dashboard/settings`)**
  - [x] **Bug Fix**: Fix "Save Success but Data Not Persisted" issue (Resolved: Map URL stored in `social_links` JSON field due to schema limitation).
  - [x] **Feature**: Smart Maps Input (Convert Link -> Lat/Long Pin).
- [x] **News API Fix**
  - [x] **Bug Fix**: Resolve 400 Bad Request on Home/Berita Page (Disabled `published` filter temporarily).
  - [x] **Bug Fix**: Fix Infinite Skeleton on Home Page (Added `loading` state to handle empty/error states).
  - [x] **Bug Fix**: Fix Admin Sidebar Gap (Removed conflicting `relative` class to fix layout).
  - [x] **Bug Fix**: Fix Dynamic Route Params Error (Updated `page.tsx` for Next.js 15+ async params).
  - [x] **Bug Fix**: Fix "Invalid Date" on Home Page (Added robust fallback for missing `created` field).
  - [x] **Feature**: Smart Image Upload (Auto Compress 7MB -> 1MB WebP + Watermark).
  - [x] **Feature**: Auto SEO (Fill empty SEO tags from Title/Content).
  - [x] **Feature**: Secure CDN Proxy (Hide DB URL behind `/cdn/secure/` proxy).
  - [x] **Verification**: Site Config Admin (Confirmed Exists).
  - [x] **Verification**: Products Page (Confirmed Exists & Dynamic).
  - [x] **Feature**: Dynamic About Page (Connected to Site Config).
  - [x] **Feature**: Hero Banner Management (Admin CRUD & Schema).
  - [x] **Feature**: Branch Management (Admin CRUD & Dynamic Contact Page).
  - [x] **Feature**: Analytics Engine (Frontend Hook Implemented).
  - [x] **Feature**: AI SEO Assistant (One-click prompt copy on Admin Panel).
  - [x] **Bug Fix**: Fix Admin "View Website" Link (Correctly link to public domain from Admin Panel).
  - [x] **Fix**: Restore Missing DB Dates (Added `created`/`updated` fields to News Schema via script).
  - [x] **Feature**: Dynamic Logo & Branding (Admin Settings -> Root Layout).
  - [x] **Feature**: Asset Management Menu (Added to Sidebar & Placeholder Page).

## Phase 7: Final Polish & Security (Deferred)

- [ ] **Security & Middleware**
  - [ ] **Content Security Policy (CSP)**: Refine in `middleware.ts`.
  - [ ] **Rate Limiting**: Implement basic rate limiting or bot protection.
