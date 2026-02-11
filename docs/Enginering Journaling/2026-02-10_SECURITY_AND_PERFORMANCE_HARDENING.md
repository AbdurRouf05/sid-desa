# Engineering Journal: Security Hardening & Performance Optimization
**Date:** 2026-02-10
**Author:** AI Agent (Antigravity)
**Project:** BMT NU Lumajang (Next.js + PocketBase)

## 1. Context & Problem Statement
As we prepared for production deployment on Netlify, we encountered two critical issues that threatened the success of the project:

### A. The "Cold Start" Performance bottleneck
*   **Initial Approach:** We used Next.js `rewrites` to proxy requests to PocketBase (e.g., `/cdn/...` -> `https://db...`).
*   **The Issue:** On Netlify, every rewrite triggers a Serverless Function. This caused massive "Cold Start" delays (3-10 seconds) for image loading, destroying the Core Web Vitals (LCP) and user experience.
*   **Verdict:** The "Reverse Proxy" pattern, while secure for hiding URLs, is performance suicide on serverless platforms for static assets.

### B. The "Open Door" Security Vulnerability
*   **Initial Approach:** Verification scripts showed that while the frontend was working, the backend API rules were permissive (default `true` or empty).
*   **The Risk:** An audit script (`scripts/test-permissions.js`) revealed that **Anonymous users could Create, Update, and Delete** records in critical collections like `news` and `products`.
*   **Verdict:** The application was functionally complete but disastrously insecure.

---

## 2. Solution: The "Direct Access" Strategy (Performance)
To solve the performance bottleneck, we pivoted from a Proxy strategy to a Direct Access strategy.

### Implementation Checklist:
1.  **Remove Rewrites**: Deleted all `rewrites()` from `next.config.ts`.
2.  **Browser Direct Access**: Configured `images.remotePatterns` to allow the Next.js Image Optimization API to fetch directly from the PocketBase URL.
3.  **Server-Side Thumbnails**: Updated our `getAssetUrl` helper to automatically append `?thumb=500x0` to all image requests.
    *   *Why?* It forces PocketBase to do the heavy lifting of resizing images *before* sending them over the wire, saving bandwidth and boosting LCP.
4.  **Component Refactoring**: All components (`NewsFeed`, `ProductsShowcase`, etc.) were updated to use `next/image` with these optimized URLs.

**Result:** Images load instantly via CDN/Next.js Optimization, bypassing Netlify's serverless cold starts.

---

## 3. Solution: API Lockdown (Backend Security)
To secure the "Open Door", we implemented a rigorous audit and lockdown procedure.

### Implementation Checklist:
1.  **The "Live Fire" Audit**: created `scripts/test-permissions.js` that acts as both a Hacker (Anonymous) and a Client (Admin).
    *   *Hacker Test*: Must fail all Write operations.
    *   *Client Test*: Must succeed all CRUD operations.
2.  **The Lockdown Script**: Created `scripts/secure-api-rules.js` to systematically apply rules.
    *   **Content Rules** (News, Products, Banners):
        *   `list/view`: `""` (Public)
        *   `create/update/delete`: `null` (Admin Only)
    *   **Inquiry Rules** (Contact Form):
        *   `create`: `""` (Public)
        *   `list/view/update/delete`: `null` (Admin Only)

**Result:** The database is now secure against unauthorized tampering while remaining fully accessible to the public (read-only) and the admin dashboard.

---

## 4. Solution: UI Hardening (Frontend Security)
To protect the client's intellectual property and prevent casual tampering, we implemented "ClientGuard".

### Implementation Checklist:
1.  **Global Guard**: Created `components/security/client-guard.tsx` and mounted it in `app/layout.tsx`.
2.  **Protections**:
    *   **Disable Right-Click**: Prevents "Save Image As" and context menu inspection.
    *   **Disable DevTools Shortcuts**: Intercepts `F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+U`, `Ctrl+S`.
    *   **Disable Dragging**: Prevents dragging images to safe them.

**Note:** This is "Security by Obscurity" and does not stop a determined hacker (API rules do that), but it stops 99% of casual users from "borrowing" assets or source code.

---

## 5. Survival Guide: Pre-Publish Checklist
**For all future projects, apply these steps BEFORE verifying with the client:**

### Phase 1: Performance
- [ ] **Check `next.config.ts`**: Ensure NO `rewrites` are pointing to image backends if deploying to Vercel/Netlify.
- [ ] **Enforce Thumbnails**: Ensure your image helper appends `?thumb=` or utilizes the platform's image optimization string.
- [ ] **Lighthouse Test**: Run a local audited measure of LCP. If > 2.5s, verify image strategy.

### Phase 2: Security Audit
- [ ] **Create Audit Script**: copy `scripts/test-permissions.js` and adapt it.
- [ ] **Run "Hacker" Test**: Verify anonymous users get 403 Forbidden on writes.
- [ ] **Run "Client" Test**: Verify the Admin Dashboard user works perfectly.
- [ ] **Apply Rules**: Use `scripts/secure-api-rules.js` to automate this. Do NOT rely on manual dashboard clicking (prone to error).

### Phase 3: UI Protection
- [ ] **Install ClientGuard**: Drop the `ClientGuard` component into the root layout.
- [ ] **Verify Shortcuts**: Press F12 and Right-Click to ensure they are blocked.

_Applying this standard ensures we deliver performant, secure, and professional-grade applications every time._
