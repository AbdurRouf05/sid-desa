# Master Implementation Roadmap: BMT NU Lumajang

This document is the **Execution Bible** for the project. It details every step required to take the concept from "Zero" to "Production Ready".

---

## 📅 Roadmap Overview

| Phase | Focus | Estimated Duration |
| :--- | :--- | :--- |
| **Phase 1** | Project Setup & Foundation | Days 1-2 |
| **Phase 2** | PocketBase Architecture (Backend) | Days 2-3 |
| **Phase 3** | Component Library (Design System) | Days 3-5 |
| **Phase 4** | Feature Implementation (Public) | Days 5-10 |
| **Phase 5** | Admin & Logic | Days 10-14 |
| **Phase 6** | QA, Optimization & Security | Day 15 |
| **Phase 7** | Launch & Handover | Day 16 |

---

## 🛠️ Phase 1: Project Setup & Foundation

**Goal:** Establish a rock-solid development environment.

### 1.1 Next.js Initialization

- [x] **Initialize Project**:

  ```bash
  pnpm create next-app@latest . \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir=false \
    --import-alias="@/*" \
    --use-pnpm
  ```

- [x] **Install Core Dependencies**:

  ```bash
  pnpm add pocketbase lucide-react clsx tailwind-merge framer-motion @upstash/ratelimit date-fns
  ```

- [x] **Install Dev & UI Tools**:

  ```bash
  npm install -D @tailwindcss/typography
  ```

### 1.2 Configuration

- [x] **Tailwind Config (`tailwind.config.ts`)**:
  - Define Custom Colors:

    ```ts
    colors: {
      bmt: {
        green: { 700: '#15803d', 800: '#166534' }, // Primary
        gold: { 400: '#FACC15', 500: '#EAB308' },  // Secondary
      },
    }
    ```

  - Enable `typography` plugin.
- [x] **Environment Variables (`.env.local`)**:

  ```ini
  NEXT_PUBLIC_POCKETBASE_URL="https://bmt-nu.pockethost.io" (or local)
  ADMIN_EMAIL="..."
  ```

---

## 🗄️ Phase 2: PocketBase Architecture (Backend)

**Goal:** Configure the Data Vault with specific fields for BMT products.

### 2.1 Collections Setup (Schema)

*Create the following collections in PocketBase UI or `pb_schema.json`*

1. **`news`**:
    - `title` (Text)
    - `slug` (Text, Unique)
    - `content` (Editor - HTML)
    - `thumbnail` (File)
    - `category` (Select: "Berita", "Edukasi", "Promo")
    - `published` (Bool)
    - `seo_title` (Text)
    - `seo_desc` (Text)
2. **`products`**:
    - `name` (Text)
    - `slug` (Text, Unique)
    - `product_type` (Text: "Simpanan", "Pembiayaan")
    - `description` (Editor)
    - `min_deposit` (Text) -> e.g. "Rp 20.000"
    - `requirements` (Text/Editor) -> e.g. "KTP, KK"
    - `brochure` (File)
    - `icon` (File)
    - `is_featured` (Bool)
    - `published` (Bool)
    - `schema_type` (Text)
3. **`hero_banners`**:
    - `title` (Text)
    - `image` (File)
    - `cta_link` (Text)
    - `active` (Bool)
4. **`site_config`** (Singleton):
    - `company_name`, `nib`, `legal_bh`, `address`, `phone_wa`, `email_official`
    - `total_assets`, `total_members`, `total_branches`
    - `social_links` (JSON)
5. **`branches`**:
    - `name` (Text)
    - `address` (Text)
    - `phone_wa` (Text)
    - `map_link` (Text)
    - `type` (Select: Pusat, Cabang)
    - `is_active` (Bool)

### 2.2 API Security Rules

- [ ] **Apply to ALL Collections**:
  - `List/View`: `published = true` (or `active = true`)
  - `Create/Update/Delete`: `id != ""` (Authenticated Users Only)

---

## 🎨 Phase 3: Component Library (Design System)

**Goal:** Build "Lego Blocks" based on Updated Design System (Section 7).

### 3.1 Atomic Components (`components/ui`)

- [x] **`Button.tsx`**:
  - Implementation: `cva` variants (`default`, `gold`, `outline`).
  - Interaction: Hover scale effect, loading state spinner.
- [x] **`Card.tsx`** / `ArabesqueCard.tsx`:
  - Style: `bg-white rounded-2xl shadow-sm hover:shadow-green-900/5 transition-all`.
  - Variants: Simple, GoldBorder, Interactive.
- [x] **`SectionHeading.tsx`**:
  - Style: `font-bold text-3xl text-slate-800` with Gold underline accent.

### 3.2 Layout Components (`components/layout`)

- [x] **`Navbar.tsx`**:
  - Desktop: Logo Left, Links Center, "Daftar" Button Right.
  - Mobile: Hamburger Menu with Framer Motion slide-in.
  - Behavior: Sticky with glassmorphism on scroll.
- [x] **`Footer.tsx`**:
  - Dynamic: Fetch Address/Contacts from `site_config`.
  - Grid: 4 Columns (Brand, Links, Services, Contact).

---

## 🚀 Phase 4: Feature Implementation (Public)

**Goal:** user-facing pages conforming to BMT NU Lumajang Identity.

### 4.1 Subdomain Architecture (Refactor)

**Goal:** Isolate Public vs. Admin environments.

- [x] **Folder Structure**:  
  - `app/ (root)`: Contains Landing, Products, News, About.
  - `app/panel/`: Contains Dashboard, Login.
- [x] **Middleware Logic**: Rewrite URLs to map domains/paths correctly.

### 4.2 Home Page (`/`)

- [x] **Hero Slider Strategy**:
  - **Slide 1 (Branding)**: "Mitra Keuangan Syariah Terpercaya" + Kantor Pusat Image.
  - **Slide 2 (Product)**: "Tabungan Sirela - Suka Rela" + Service Image.
  - **Slide 3 (Tech)**: "Transaksi Aman dengan Notifikasi WA" + Mobile App Image.
- [x] **Stats Widget**:
  - Dynamic counters for Assets, Members, Offices.
- [x] **Product Grid**:
  - Highlight 3 items: Sirela, Haji, Pembiayaan UMKM.

### 4.3 Products Page (`/produk`)

- [x] **Tabbed Interface**:
  - **Tab A**: Simpanan (Savings).
  - **Tab B**: Pembiayaan (Financing).
- [x] **Cards (ArabesqueCard)**:
  - Display "Setoran Awal" or Key Terms.

### 4.4 About Page (`/tentang-kami`)

- [x] **History Section**: 2016 Mandate -> 2020 Establishment.
- [x] **Trust & Legal Section**: Display NIB and No. Badan Hukum.
- [x] **Dynamic Stats**: Connect "Total Assets/Members" to DB (Connected to `site_config`).

### 4.5 News & Contact

- [x] **News (`/berita`)**:
  - Categories: Activities, CSR, Tips.
- [x] **Contact (`/kontak`)**:
  - Google Maps Embed.
  - **Bento Grid Layout** for 16 Branches.

### 4.6 Analytics Engine (NEW)

**Goal**: Track visitor journey and timing.

- [x] **Backend Schema (`analytics_events`)**:
  - Fields: `event_type` (view, click), `path`, `duration` (int), `session_id`.
- [x] **Frontend Hook (`useAnalytics`)**:
  - Track mount time/unmount duration.

---

## 🛡️ Phase 5: Admin & Logic

**Goal:** CMS for BMT Staf to update Assets/Members count.

### 5.1 Admin Shell

- [x] **Route**: `/panel`.
- [x] **Sidebar**: Navigation (Dashboard, Berita, Produk, Banner, Settings).

### 5.2 CRUD Forms

- [x] **Settings Page**: Input fields for `Total Aset`, `Total Anggota` to update `site_config`.
- [x] **Rich Text**: Integrate `TipTap` for writing news.
- [x] **News Editor**:
  - Image Upload with Watermark & Compression.
  - Auto-SEO Field Generation.
  - AI Assistant Prompt Button.

---

## 🔍 Phase 6: QA, Optimization & "AI-Ready" SEO (Completed)

**Goal:** Create a "High-Resolution" Web Presence optimizing for Search Engines and AI Agents.

### 6.1 Performance & Core Vitals

- [x] **Images**: Used `next/image` with `placeholder="blur"` and WebP format.
- [x] **Lighthouse Score**: Target > 90 on all metrics (Performance, Accessibility, Best Practices, SEO).
- [x] **Font Loading**: Optimized `next/font` subsets (Latin) to zero CLS.

### 6.2 "AI-Ready" SEO Architecture (The Promise)

**Objective**: Ensure every piece of content (News, Products, Static Pages) is structured so LLMs/AI can perfectly "read" and "cite" the BMT.

- [x] **Deep Schema.org (JSON-LD)**:
  - **Global**: `Organization` schema with exact "SameAs" (Socials, Maps), NIB, and BH Number.
  - **Products**: `FinancialProduct` schema for every item.
  - **News**: `NewsArticle` with strictly defined `headline`, `datePublished`, and `author`.
- [x] **Semantic HTML5**:
  - Use `<article>`, `<section>`, `<nav>`, `<aside>` strictly.
  - AI Agents prioritize content inside `<main>` and `<article>` tags.
- [x] **Entity Linking**:
  - Ensure internal links clarify relationships.
  - Use `meta name="keywords"` and OpenGraph tags.

### 6.3 Security Audit

- [x] **Middleware**:
  - Rate Limiting on API routes.
  - Bot Detection.
- [x] **Content Security Policy**: Strict CSP for iframes (YouTube/Maps) and scripts.

---

## 🧪 Phase 7: Automated Testing (Completed)

**Goal:** Ensure code stability and prevent regressions.

- [x] **Infrastructure**: Jest + React Testing Library configured.
- [x] **Unit Tests**: Utilities (`formatRupiah`, `cn`).
- [x] **Component Tests**: `TactileButton`, `NewsCard`.
- [x] **Integration Tests**: Contact Page Form Submission (Mocked).

---

## 🚀 Phase 8: Launch & Deployment (Ready to Deliver)

**Goal:** Handover to client for production.

- [ ] **Final Build**: Run `npm run build` to verify production build.
- [ ] **Environment Setup**: Configure `.env` on production server (Vercel/Docker).
- [ ] **Domain Mapping**: Point `www.bmtnulmj.com` to deployment.
- [ ] **Handover**: Transfer source code and documentation.

---

## 🔮 Future Forecast & Analysis

**Post-Launch Roadmap for BMT NU Lumajang**

### 1. Mobile App (Flutter)

- **Concept**: Dedicated "BMT NU Mobile" for members.
- **Integration**: Reuse PocketBase backend via REST API. Add `transactions` collection.
- **Timeline**: Q3 2026.

### 2. WhatsApp Bot Integration

- **Concept**: Auto-reply for basic FAQs (Alamat, Syarat Sirela, Jam Buka).
- **Tech**: Integration with PocketBase Webhooks to query data and reply via WA Gateway.

### 3. Member Portal (Web)

- **Concept**: Secure login area for members to check mutation history (Cek Saldo).
- **Security**: Requires strict KYC verification and Role-Based Access Control (RBAC).

### 4. Analytics & BI

- **Strategy**: Advanced Manager Dashboard visualizing "Simpanan vs Pembiayaan" trends.
- **Tooling**: Self-hosted Analytics (Plausible) to track "User Journey" from Home -> Product -> WA Contact.

### 5. UX Refinement (Technical Debt)

- **Identified Issue**: Admin actions (Delete, Logout) use native browser `window.confirm` / `alert` dialogs.
- **Impact**: Styling inconsistencies with the "Arabesque" design system; non-customizable text.
- **Future Fix**: Replace specific alerts with a custom `Modal/Dialog` component (e.g., Radix UI) for a unified experience.
- **Status**: **Deferred** to V2 to prioritize core functionality and stability for Phase 1 delivery.

---

## ✅ Definition of Done (DoD)

Application is **"Ready to Deliver"** when:

1. [x] User can view all products with correct nominals (Sirela Rp 20rb etc).
2. [x] Trust signals (NIB, BH) are visible on About page.
3. [x] Admin can update Assets/Members numbers.
4. [x] Site loads < 1.5s on 4G Mobile (Optimized).
5. [x] **AI Test**: Page Metadata includes rich JSON-LD (Verified).
6. [x] No "Lorem Ipsum" remains.
7. [x] **Test Suite**: `npm test` passes (Coverage: Utils, UI, Contacts).
