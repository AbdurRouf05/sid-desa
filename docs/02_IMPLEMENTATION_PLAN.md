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

**Goal:** Configure the Data Vault.

### 2.1 Collections Setup (Schema)

*Create the following collections in PocketBase UI or `pb_schema.json`*

1. **`news`**:
    - `title` (Text)
    - `slug` (Text, Unique)
    - `content` (Editor - HTML)
    - `thumbnail` (File)
    - `category` (Select: "Berita", "Edukasi", "Promo")
    - `published` (Bool)
2. **`products`**:
    - `name` (Text)
    - `slug` (Text, Unique)
    - `type` (Select: "Simpanan", "Pembiayaan", "Emas")
    - `description` (Editor)
    - `brochure` (File)
    - `icon` (File)
    - `is_featured` (Bool)
3. **`hero_banners`**:
    - `title` (Text)
    - `image` (File)
    - `cta_link` (Text)
    - `active` (Bool)
4. **`meta_config`** (Singleton):
    - `site_name`, `whatsapp_phone`, `address`, `nib_number`, `social_links` (JSON).

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
- [x] **`Card.tsx`**:
  - Style: `bg-white rounded-2xl shadow-sm hover:shadow-green-900/5 transition-all`.
- [ ] **`SectionHeading.tsx`**:
  - Style: `font-bold text-3xl text-slate-800` with Gold underline accent.

### 3.2 Layout Components (`components/layout`)

- [x] **`Navbar.tsx`**:
  - Desktop: Logo Left, Links Center, "Daftar" Button Right.
  - Mobile: Hamburger Menu with Framer Motion slide-in.
  - Behavior: Sticky with glassmorphism on scroll.
- [x] **`Footer.tsx`**:
  - Dynamic: Fetch Address/Contacts from `meta_config`.
  - Grid: 4 Columns (Brand, Links, Services, Contact).

---

## 🚀 Phase 4: Feature Implementation (Public)

**Goal:** user-facing pages.

### 4.1 Subdomain Architecture (Refactor)

**Goal:** Isolate Public vs. Admin environments.

- [ ] **Folder Structure**:  
  - `app/(public)/`: Contains Landing, Products, News.
  - `app/(admin)/`: Contains Dashboard, Login.
- [ ] **Middleware Logic (`middleware.ts`)**:
  - Detect functionality based on `request.nextUrl.hostname`.
  - **Case 1 (`cp.bmtnulmj.com` or `cp.localhost`)**:
    - Rewrite URL to start with `/(admin)`.
    - If path is `/`, redirect to `/dashboard` (or `/login`).
  - **Case 2 (`www.` or root domain)**:
    - Rewrite URL to start with `/(public)`.
    - Block access to `/admin` or `/dashboard`.

### 4.2 Home Page

- [ ] **Hero Section**:
  - Carousel using `framer-motion` `AnimatePresence`.
  - Fetch `hero_banners` from PB.
- [ ] **Services Preview**:
  - Map through "Highlighted Products".
- [ ] **Bento Grid**:
  - Grid Layout (CSS Grid).
  - Cards: TikTok Embed, YouTube Embed, Instagram Link.

### 4.2 Products Page

- [ ] **Filter System**: Tabs for "Simpanan" vs "Pembiayaan".
- [ ] **Detail Page (`/produk/[slug]`)**:
  - "Download Brosur" Button.
  - "Tanya via WA" Floating Action Button.

### 4.3 News & Content

- [ ] **Blog List**: Pagination (10 per page).
- [ ] **Blog Detail**:
  - `dompurify` to sanitize HTML content.
  - "Share" buttons (WA, FB).

### 4.4 Analytics Engine (NEW)

**Goal**: Track visitor journey and timing.

- [ ] **Backend Schema (`analytics_events`)**:
  - Fields: `event_type` (view, click), `path`, `duration` (int), `session_id`.
  - Rule: `create` = public.
- [ ] **Frontend Hook (`useAnalytics`)**:
  - Create `components/analytics/AnalyticsTracker.tsx`.
  - `useEffect`: Track mount time. On unmount, send `duration`.
  - `useEffect`: Listen to `click` events on elements with `data-track-id`.
- [ ] **Admin Dashboard Integration**:
  - Query PB for `count(id)` grouped by `path`.
  - Visualize with `recharts`.

---

## 🛡️ Phase 5: Admin & Logic

**Goal:** CMS for BMT Staf.

### 5.1 Admin Shell

- [ ] **Route**: `/admin`.
- [ ] **Sidebar**: Navigation (Dashboard, Berita, Produk, Banner, Settings).
- [ ] **Logout**: Clear AuthStore.

### 5.2 CRUD Forms

- [ ] **Rich Text**: Integrate `TipTap` or `Quill` for writing news.
- [ ] **Image Upload**: Drag & Drop zone with Preview.
- [ ] **Feedback**: Toast notifications (Success/Error) using `sonner`.

---

## 🔍 Phase 6: QA, Optimization & Security

**Goal:** Polish before launch.

### 6.1 Performance

- [ ] **Images**: Use `next/image` with `placeholder="blur"`.
- [ ] **Fonts**: Ensure `next/font` is correctly loading subsets.
- [ ] **Lighthouse Score**: Target > 90 on all metrics.

### 6.2 Security Audit

- [ ] **Middleware**: Verify `User-Agent` blocking for AI Bots.
- [ ] **Rate Limit**: Test `/api/contact` flood protection.
- [ ] **Headers**: Check `Content-Security-Policy` and `X-Frame-Options`.

### 6.3 SEO

- [ ] **Robots.txt**: Allow Google, Block GPTBot.
- [ ] **Sitemap.xml**: Auto-generate for dynamic routes.
- [ ] **Metadata**: Dynamic `generateMetadata()` for News/Products.

---

## 🔮 Future Forecast & Analysis

**Post-Launch Roadmap**

### 1. Mobile App (Flutter)

- **Concept**: "BMT NU Mobile" for members to check balances.
- **Integration**: Reuse PocketBase backend. Add `transactions` collection.
- **Timeline**: Q3 2026.

### 2. WhatsApp Bot Integration

- **Concept**: Auto-reply for basic FAQs (Opening hours, Requirements).
- **Tech**: Twilio or Waloop API connected to PocketBase Webhooks.

### 3. Member Portal (Web)

- **Concept**: Login area for members to view mutation history.
- **Security**: Requires stricter KYC and Role-Based Access Control (RBAC).

### 4. Analytics & BI

- **Strategy**: Build a "Manager Dashboard" visualizing creating vs repayment trends.
- **Tooling**: Self-hosted `Plausible` or Google Analytics 4.

---

## ✅ Definition of Done (DoD)

Application is "Finished" when:

1. [ ] User can view all products and contact via WA.
2. [ ] Admin can easily add/edit news and products without code.
3. [ ] Site loads < 1.5s on 4G Mobile.
4. [ ] Security Headers are active (A+ on Mozilla Observatory).
5. [ ] No "Lorem Ipsum" remains.
6. [ ] Backup system is verified working.
