# Task: Apply Arabesque Gradient Design System

**Goal**: Ensure all pages (Public & Admin) utilize the defined "Gradient + Arabesque Pattern" design system for consistent brand identity.

## Checklist

- [ ] **Public Pages**
  - [x] `app/kontak/page.tsx`: Update Header/Hero section.
  - [x] `app/berita/page.tsx`: Update Header/Hero section (if exists).
  - [x] `app/produk/page.tsx`: Update Header/Hero section (if exists).
  - [x] `app/tentang-kami/page.tsx`: Update Header/Hero section (if exists).
  - [x] `app/page.tsx`: Verify Home Page alignment.

- [ ] **Admin Pages**
  - [x] `app/panel/login/page.tsx`: Add Arabesque background to login screen.
  - [x] `app/panel/dashboard/layout.tsx`: Apply branding to Admin Sidebar/Header.
  - [x] `app/panel/dashboard/page.tsx`: Update dashboard overview styling.

- [x] **Admin Features**
  - [x] `app/panel/dashboard/settings/page.tsx`: Create Settings form for Site Config.
  - [x] `lib/config.ts`: Create helper to fetch site config (singleton).
  - [x] `app/page.tsx`: Connect Stats Widget to real data.
  - [x] `components/layout/modern-footer.tsx`: Connect Footer to real contact info.
  - [x] **Verified**: News CRUD (`app/panel/dashboard/berita`) & Products CRUD (`app/panel/dashboard/produk`) are implemented.
