# Phase 3: Security Hardening

## Overview

This phase implements the "Defense in Depth" strategy explicitly requested.

## 1. Next.js Middleware (`middleware.ts`)

**Goal**: Secure the edge.

- **CSP (Content Security Policy)**:
  - Inject `Content-Security-Policy` header.
  - Directives:
    - `default-src 'self'`
    - `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.google.com` (Adjust as needed)
    - `img-src 'self' https://minio.sagamuda.cloud data:`
    - `frame-src https://www.youtube.com https://www.tiktok.com` (For Bento Grid)
- **Anti-Bot**:
  - Check `User-Agent`.
  - Block: `GPTBot`, `CCBot`, `Omgilibot` (AI Scrapers).
  - Allow: `Googlebot`, `Bingbot` (SEO).
- **Rate Limiting**:
  - Use `@upstash/ratelimit` or in-memory map.
  - Apply strict limits on `/api/contact` (e.g., 5 requests per hour per IP).

## 2. PocketBase Security

**Goal**: Lock down the data vault.

- **API Rules Review**:
  - Double-check that NO collection has public `create/edit/delete` rules.
  - Verify `users` collection is not publicly listable.
- **Data Sanitization**:
  - In frontend `News` rendering, use `dompurify` to strip `<script>` and `<iframe>` (unless whitelisted).
- **Hidden Fields**:
  - Ensure sensitive Admin notes or internal flags are not exposed in the API `View` rule (use `fields` query parameter or view-rules if PB supports field-level access, otherwise handle in backend wrapper).

## 3. Storage Hardening (MinIO)

- **Bucket Policy**:
  - Set policy to `download` only (Read-only for public).
  - DISABLE directory listing (`s3:ListBucket` Denied).
- **File Naming**:
  - Implement random UUID filenames on upload to prevent enumeration. `uuid.v4() + extension`.

## 4. Validation

- Use `zod` schemas for all form submissions (Contact, Login, Data Entry).
- Validate file types and sizes on upload (e.g., Max 5MB, Images/PDF only).
