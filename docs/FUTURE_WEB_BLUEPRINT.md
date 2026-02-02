# Future Web Structure & Styling Definition

This document serves as the blueprint for the "Future Whole Web" of BMT NU Lumajang. It is strictly based on the **Architecture Blueprint** and **Implementation Plan**, specifically Phase 4 (Subdomain Architecture) and Phase 7 (Design System).

**References:**

- `docs/01_ARCHITECTURE_BLUEPRINT.md`
- `docs/02_IMPLEMENTATION_PLAN.md`

---

## 1. Architectural Alignment (The "Why")

The future web will evolve from the simple `home/` directory to a robust **Subdomain Architecture** to separate Public and Admin concerns, as defined in Implementation Plan Phase 4.1.

- **Public Domain** (`www.bmtnulmj.id`): Optimized for SEO, Speed (< 1.5s), and Engagement.
- **Admin Domain** (`cp.bmtnulmj.id`): Optimized for functional CMS and Data Management.

---

## 2. Future Component Architecture

We adopt an Atomic Design methodology that matches the `components/ui` (Shadcn-like) strategy defined in the Architecture.

### A. Foundation (Atoms)

1. **Typography**: `Plus Jakarta Sans` (Headings) & `Inter` (Body).
2. **Colors (Strict Brand Palette)**:
    - `Primary (BMT Green)`: `#15803d` (green-700) -> Trust & Growth.
    - `Secondary (Gold)`: `#FACC15` (yellow-400) -> Prosperity.
    - `Accents`: Dark Green `#14532d` for gradients.
3. **Interactive Elements**:
    - `Button`: Variants corresponding to brand (Solid Green, Gradient Gold, Outline).
    - `Cursor`: "Follower" style cursor to add premium feel (requested feature).

### B. Comprehensive Form System (Inputs)

1. **Text Inputs**: `InputText` (Name), `InputPassword` (Eye toggle), `InputNumber` (Currency), `InputSearch` (Searchbar), `InputOTP` (Verification).
2. **Selection Controls**: `Checkbox` (Multi), `RadioGroup` (Single), `Switch/Toggle` (Instant), `Slider` (Range).
3. **Pickers**: `Select` (Simple), `Combobox` (Searchable), `DatePicker` (Calendar).
4. **Editors**: `Textarea` (Messages), `RichTextEditor` (Articles), `FileUpload` (Dropzone).

### C. Disclosure & Navigation Patterns (Molecules)

*Interactive components for revealing information.*

1. **Accordion**: Vertically stacked headings that expand to show content (Perfect for FAQ).
2. **Tabs**: Tabbed interface to switch between views (e.g., "Simpanan" vs "Pembiayaan" tables).
3. **Sheet/Drawer**: Off-canvas panel sliding from side (Mobile Menu, Admin Details).
4. **Popover**: Small floating overlay triggered by click (Filters, DatePicker container).
5. **Tooltip**: Hover label for icons/buttons.
6. **DropdownMenu**: Actions list triggered by button (User profile menu).

### D. Feedback & Overlays

*Components that communicate state to the user.*

1. **Dialog / Modal**:
    - `AlertDialog`: Critical warnings requiring explicit action ("Are you sure you want to delete?").
    - `Dialog`: Standard modal for forms or complex info.
2. **Alert / Callout**:
    - Static blocks for emphasis (Info, Warning, Destructive) inside page content.
3. **Toast / Snackbar**:
    - Ephemeral notifications ("Data Saved") appearing at corner.
4. **Progress**:
    - `ProgressBar`: Linear indicator.
    - `Spinner`: Circular loading state.
5. **Skeleton**: Animated gray shapes for loading placeholders.

### E. Data & Visuals

1. **Avatar**: User profile image with fallback initials.
2. **Badge**: Small status label (Outline, Solid).
3. **Separator**: Horizontal or vertical divider lines.
4. **Carousel**: Interactive slider for Images/Products.
5. **Bento Grid Elements**: `SocialTile`, `VideoCard`, `ServiceHighlight`.

---

## 3. Global Styling System (CSS Strategy)

We use **Tailwind CSS** with CSS Variables for theming, fully compatible with the requested "Google Stitch" templating.

### A. Color Tokens (Converted to HSL for Opacity Support)

Derived from `01_ARCHITECTURE_BLUEPRINT.md`:

```css
:root {
  /* BMT Green #15803d */
  --primary: 142 72% 29%; 
  /* Gold #FACC15 */
  --secondary: 48 96% 53%;
  /* Slate 50 #F8FAFC */
  --background: 210 40% 98%;
  /* Slate 900 #0F172A */
  --foreground: 222 47% 11%;
  /* Input & Borders */
  --input: 214.3 31.8% 91.4%;
  --ring: 142 72% 29%;
  --muted: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
}
```

### B. Animation & Interaction

1. **Accordion**: `animate-accordion-down` / `up`.
2. **Overlay**: `animate-in fade-in` for Dialog backdrops.
3. **Cursor**: Custom `mix-blend-difference` dot and ring.

---

## 4. Future File Structure (Refactored)

Aligned with **Implementation Plan Phase 4.1**:

```
app/
├── (public)/              # Marketing Site (www)
│   ├── layout.tsx         # Public Layout (Navbar + Footer)
│   ├── page.tsx           # Landing Page (Hero, Bento, Values)
│   ├── produk/            # Product Catalog
│   ├── faq/               # FAQ (Accordion Demo)
│   └── contact/           # Static Contact Page
├── (admin)/               # Admin Panel (cp)
│   ├── layout.tsx         # Admin Sidebar
│   ├── dashboard/         # Analytics
│   └── users/             # User Management (Dialogs/Sheets)
├── globals.css            # Shared Styles
└── middleware.ts          # Subdomain/Auth Routing
```

---

## 5. Performance & Quality Strategy

1. **3-Second Rule**:
    - Use `next/image` with `placeholder="blur"`.
    - Implement `server-only` data fetching for Hero/Products.
2. **SEO**:
    - JSON-LD Structured Data for `FAQPage` (Accordion).
3. **Analytics**:
    - No-cookie session tracking via `analytics_events`.
