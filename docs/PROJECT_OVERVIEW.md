# Project Overview: SID Magang (Sistem Informasi Desa)

## 📋 Executive Summary

**SID Magang** is a comprehensive Village Information Management System built for Indonesian village administration. It provides both public-facing services for citizens and an administrative panel for village officials.

---

## 🏗️ Architecture

### Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.6 (App Router) |
| **Frontend** | React 19.2.3 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4.17 |
| **UI Components** | Radix UI, shadcn/ui patterns |
| **Rich Text Editor** | TipTap |
| **Backend/Database** | PocketBase |
| **Forms** | React Hook Form + Zod validation |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Testing** | Jest + Testing Library |

### Project Structure

```
sid-magang/
├── app/
│   ├── (admin)/           # Admin panel (subdomain: cp.*)
│   │   └── panel/
│   │       ├── dashboard/
│   │       └── login/
│   │
│   ├── (public)/          # Public website
│   │   ├── home/          # Homepage
│   │   ├── berita/        # News section
│   │   ├── kontak/        # Contact page
│   │   ├── layanan/       # Services
│   │   ├── legal/         # Legal documents
│   │   ├── pengaduan/     # Citizen complaints
│   │   ├── tentang-kami/  # About page
│   │   └── transparansi/  # Transparency (APBDes)
│   │
│   ├── actions/           # Server Actions
│   │   ├── scrape-metadata.ts
│   │   └── upload-image.ts
│   │
│   ├── api/               # API routes
│   ├── cdn/               # CDN endpoints
│   └── pencarian/         # Search functionality
│
├── backend/
│   └── pb_schema.json     # PocketBase database schema
│
├── __tests__/             # Test files
├── docs/                  # Documentation
└── middleware.ts          # Subdomain routing + security
```

---

## 🎯 Key Features

### Public Portal (`www.*` or root domain)

1. **Homepage** - Village landing page with announcements and quick links
2. **News Section** - Village news and updates
3. **Transparency** - APBDes (village budget) visualization
4. **Services** - Administrative document requests
5. **Complaint System** - Citizen feedback/complaints
6. **Search** - Content search functionality

### Admin Panel (`cp.*` subdomain)

1. **Dashboard** - Overview and statistics
2. **Content Management** - News, pages, media
3. **Population Management** - Resident data, mutations (birth/death/migration)
4. **Financial Management** - BKU (general cash book), tax logs, budget realization
5. **Asset Management** - Village assets inventory
6. **Letter Management** - Official document generation
7. **Complaint Management** - Process citizen reports

---

## 🔐 Security Features

### Middleware Protection
- **Bot Blocking**: Blocks GPTBot, CCBot, Omgilibot, FacebookBot
- **Subdomain-based Routing**: 
  - `cp.*` → Admin panel access
  - Root domain → Public website
- **CSP Headers**: Strict Content Security Policy
- **X-Frame-Options**: DENY (clickjacking protection)

### Authentication
- PocketBase authentication for admin users
- Protected routes via middleware
- Rate limiting with Upstash (available in dependencies)

---

## 🗄️ Database Schema (PocketBase)

### Collections

| Collection | Purpose | Access |
|------------|---------|--------|
| `profil_desa` | Village profile data | Public read |
| `mutasi_penduduk` | Population mutations (birth, death, migration) | Auth only |
| `pengaduan_warga` | Citizen complaints | Public submit, auth manage |
| `apbdes_realisasi` | Budget realization data | Public read |
| `rekening_kas` | Cash/bank accounts | Auth only |
| `bku_transaksi` | Financial transactions | Auth only |
| `pajak_log` | Tax transaction logs | Auth only |
| `surat_keluar` | Official letters | Auth only |
| `aset_desa` | Village assets | Auth only |

---

## 🚀 Development

### Prerequisites
- Node.js 20+
- pnpm (package manager)
- PocketBase backend

### Installation

```bash
# Install dependencies
pnpm install

# Run development server (port 3040)
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Environment Setup

The application expects:
- PocketBase instance URL
- Database connection (if using external DB)
- Image storage configuration

---

## 📦 Key Dependencies

### Core
- `next` - React framework
- `react` / `react-dom` - UI library
- `pocketbase` - Backend SDK

### UI/UX
- `@radix-ui/*` - Headless UI components
- `lucide-react` - Icon library
- `framer-motion` - Animations
- `sonner` - Toast notifications
- `cmdk` - Command palette

### Forms & Validation
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@hookform/resolvers` - Zod resolver

### Rich Text
- `@tiptap/*` - WYSIWYG editor

### Data Visualization
- `recharts` - Charts
- `jspdf` / `jspdf-autotable` - PDF generation
- `xlsx` - Excel export

### Utilities
- `date-fns` - Date formatting
- `clsx` / `tailwind-merge` - Class management
- `browser-image-compression` - Image optimization

---

## 🌐 Deployment

### Supported Hosts
- **Netlify** (netlify.toml present)
- **Vercel** (Next.js native)
- Custom server (Node.js)

### Image Domains Configured
- `sid-magang.sagamuda.cloud`
- `images.unsplash.com`
- `images.pexels.com`
- YouTube, TikTok, Instagram CDNs

---

## 📝 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch
```

Test configuration:
- Jest with jsdom environment
- Testing Library for React components
- Setup file: `jest.setup.js`

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js config (images, server actions) |
| `tailwind.config.ts` | Tailwind CSS customization |
| `tsconfig.json` | TypeScript configuration |
| `middleware.ts` | Request middleware |
| `eslint.config.mjs` | ESLint rules |
| `jest.config.js` | Jest test config |
| `netlify.toml` | Netlify deployment settings |

---

## 📊 Routes & Pages

### Public Routes
- `/` → Homepage
- `/berita` → News listing
- `/kontak` → Contact form
- `/layanan` → Public services
- `/legal` → Legal documents
- `/pengaduan` → Complaint submission
- `/tentang-kami` → About village
- `/transparansi` → Budget transparency

### Admin Routes (cp.* subdomain)
- `/panel/dashboard` → Admin dashboard
- `/panel/login` → Admin login
- `/panel/*` → Various admin modules

### API Routes
- `/api/*` → Backend API endpoints
- `/cdn/*` → CDN/image serving

---

## 🎨 Design System

- **Typography**: System fonts with Next.js font optimization
- **Colors**: Tailwind CSS default palette
- **Components**: Radix UI primitives with custom styling
- **Responsive**: Mobile-first Tailwind breakpoints

---

## 📞 Contact & Support

This project appears to be developed for **Sumberanyar Village** based on:
- Domain configurations (`sumberanyar.local`, `sumberanyar.id`)
- CSP rules referencing `sumberanyar`
- Admin subdomain pattern `cp.*`

---

*Documentation generated: February 26, 2026*
