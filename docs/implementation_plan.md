# Phase 6: QA, Optimization & "AI-Ready" SEO Implementation Plan

## Goal

To ensure the application is production-ready, highly discoverable by AI agents/Search Engines, and secure against basic attacks.

## User Review Required
>
> [!IMPORTANT]
> Rate Limiting will be implemented using `@upstash/ratelimit`. This requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local`. If these are missing, the rate limiter will be disabled or need a fallback. **For this local version, I will implement a memory-based fallback or simplified version if Upstash credentials are not available.**

## Proposed Changes

### 1. Security & Middleware (`middleware.ts`)

- [ ] Uncomment and refine **Content Security Policy (CSP)**.
- [ ] Implement **Rate Limiting** logic.
  - If `@upstash/ratelimit` is used, ensure graceful failure if env vars are missing.
  - Alternatively, implement a basic in-memory counter (less reliable in serverless but fine for VPS/Container) or just strict Bot blocking.

### 2. AI-Ready SEO (`app/layout.tsx`, `app/page.tsx`, `app/produk/page.tsx`, `app/berita/page.tsx`)

- [ ] **Global Metadata (`app/layout.tsx`)**: Establish base `metadata` (Title, Description, OpenGraph) using `site_config` data (async metadata).
- [ ] **Structured Data (JSON-LD)**:
  - **Global**: Add `Organization` schema to `layout.tsx`.
  - **Products**: Ensure `products` page generates `FinancialProduct` schema for each item.
  - **News**: Ensure `news` list and detail pages generate `NewsArticle` schema.

### 3. Performance

- [ ] **Font Optimization**: Verify `next/font/google` usage in `app/layout.tsx`.
- [ ] **Image Optimization**: Audit `next/image` usage for lazy loading and placeholders.

## Verification Plan

### Automated

1. **Build Check**: Run `pnpm build` to ensure no type errors with new metadata logic.
2. **Lint Check**: Run `pnpm lint`.

### Manual

1. **SEO Verification**:
    - Open `localhost:3000`.
    - Inspect Page Source.
    - Verify `<title>`, `<meta name="description">`, and `<script type="application/ld+json">` exist and contain correct data (e.g., "BMT NU Lumajang").
2. **Security Verification**:
    - Check Response Headers in Browser DevTools (Network Tab) for `Content-Security-Policy`.
    - Test Bot User-Agent blocking (e.g., using `curl -A "GPTBot" localhost:3000`).
