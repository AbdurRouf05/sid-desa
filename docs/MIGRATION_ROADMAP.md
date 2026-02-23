# Migration Roadmap: BMT NU Lumajang to SID Sumberanyar

This roadmap outlines the iterative process of migrating the existing financial sharia boilerplate to the "SID Sumberanyar" village administration system. We follow a **Frontend-First (FE/UI -> BE)** iteration framework for each phase.

## Phase 1: Foundation & Brand Identity

_Focus: Establishing the visual and technical baseline for the village domain._

### 1.1 UI/UX Iteration

- [x] **Design Tokens**: Finalize HSL variables for `Desa Teal` and `Soil Orange` in `globals.css`.
- [x] **Base Components**: Refactor `tactile-button` and `desa-badge` to use village palettes.
- [x] **Core Layouts**: Update `modern-navbar.tsx` and `modern-footer.tsx` to remove BMT branding and fetch data from `db.siteConfig`.
- [x] **Typography**: Implement `Merriweather` for headings and `Inter` for body.

### 1.2 BE Iteration

- [x] **Site Configuration**: Seed the `profil_desa` collection in PocketBase.
- [x] **Typed Client**: Finalize `lib/pb.ts` with strict Zod validation for all base configs.
- [x] **Middleware**: Secure the `cp.` subdomain and implement route guards for `(admin)` vs `(public)`.
- [x] **Admin Portal**: Rebranded login page and dashboard for SID Sumberanyar.

---

## Phase 2: Public Portal & Transparency

_Focus: Delivering the front-facing information system for citizens._

### 2.1 UI/UX Iteration

- [x] **Landing Page**: Refactor the HeroSlider and FeaturesGrid to highlight village services (Layanan Surat, Berita, Transparansi).
- [x] **News Portal**: Update `berita` listing and detail views with village-specific categories.
- [x] **Search & Navigation**: Rebranded search functionality and verified all navigation links.
- [ ] **Transparency Dashboard**: Create `BudgetCard` and `RealisasiGraph` components for APBDes visualization.

### 2.2 BE Iteration

- [x] **Analytics Engine**: Implement `AnalyticsStats` with robust failover and development mock data.
- [ ] **Transparency Data**: Setup `apbdes_realisasi` collection and typed fetching logic.
- [ ] **SEO**: Implement `GovernmentOrganization` JSON-LD schema in `RootLayout`.

---

## Phase 3: BKU Financial Module

_Focus: Digitizing the village ledger and tax management._

### 3.1 UI/UX Iteration

- [ ] **BKU Dashboard**: Implement `BKUTable` with Debet, Kredit, and Saldo indicators using `desa` styling.
- [ ] **Transaction UI**: Create multi-step forms for transaction entry with automatic tax previews.
- [ ] **Status Branding**: Use `desa-badge` for tax status (Belum Setor, Sudah Setor).

### 3.2 BE Iteration

- [ ] **Ledger Logic**: Implement `db.bku` with server-side validation for balances.
- [ ] **Tax Engine**: Implement automatic PPN 11% calculation and logging into `pajak_log`.
- [ ] **Storage Cleanup**: Implement `pb_hooks` for automatic cleanup of BKU evidence files.

---

## Phase 4: Administrative & Assets

_Focus: Streamlining governance and official documentation._

### 4.1 UI/UX Iteration

- [ ] **Official Documentation**: Create `KopSurat` component for PDF generation.
- [ ] **Correspondence UI**: Implement `SuratKeluar` agenda view and PDF previewer.
- [ ] **Asset Mapping**: Create `TanahDesa` listing and details view.

### 4.2 BE Iteration

- [ ] **Agenda Logic**: Implement auto-incrementing `nomor_agenda` for outgoing mail.
- [ ] **Staff Management**: Implement `db.perangkat` for managing active village officials.
- [ ] **File Management**: Secure PDF archival in MinIO with strict access rules.
