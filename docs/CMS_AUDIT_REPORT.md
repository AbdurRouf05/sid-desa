# 📊 Homepage CMS Integration Audit
**Date:** 2026-02-08
**Scope:** Homepage (`app/page.tsx`) & Layout Components

This document details which parts of the Homepage are **Dynamic** (manageable via Admin Panel) and which are **Static** (Hardcoded in code).

## ✅ Fully Dynamic (Managed via Panel)

These sections are connected to PocketBase and will update immediately when changed in the Admin Dashboard.

| Section | Content Source | Collection | Notes |
| :--- | :--- | :--- | :--- |
| **Navbar Logo & Name** | `site_config` | `logo_primary`, `logo_secondary`, `company_name` | Updates globally. |
| **Hero Slideshow** | `hero_banners` | `image`, `title`, `subtitle`, `cta_link` | Supports active/inactive toggling and ordering. |
| **Trust Stats (Floating)** | `site_config` | `total_assets`, `total_members`, `total_branches` | Real-time numbers. |
| **News & Updates** | `news` | `title`, `thumbnail`, `category`, `slug` | Shows latest 3 published articles. |
| **Map Embed** | `site_config` | `map_embed_url` (fallback to social_links) | iframe URL is dynamic. |
| **Footer Contact Info** | `site_config` | `address`, `phone_wa`, `email_official` | Updates address across the site. |

---

## ⚠️ Partially Dynamic (Hybrid)

These sections use some database values but contain significant hardcoded text or structure.

| Section | Dynamic Part | Hardcoded Part | Severity |
| :--- | :--- | :--- | :--- |
| **Jaringan Kantor** | `{stats.branches}` (The number "16") | "Kamis hadir lebih dekat...", "Senin-Sabtu..." | Low (Static business hours). |

---

## ❌ Hardcoded (Static)

These sections require **Code Changes** to update. They are not editable via the Admin Panel.

| Section | File | Current Content | Recommendation |
| :--- | :--- | :--- | :--- |
| **Value Proposition** | `app/page.tsx` | "Kenapa Memilih BMT?", "Bebas Riba", "Tanpa Potongan" | Keep static (Core brand values rarely change). |
| **Social Media Hub** | `app/page.tsx` | YouTube Video, Instagram specific caption, TikTok Titles | **High Priority** to make dynamic or at least fetch links from `site_config`. |
| **Product Highlights** | `app/page.tsx` | "Tabungan Sirela", "Haji", "Pembiayaan" Cards | **Critical**. Should fetch products where `is_featured = true` from DB. |
| **Final CTA** | `app/page.tsx` | "Siap Menjadi Bagian...", "Hubungi via WhatsApp" | Low. Generic CTA. |
| **Footer Links** | `modern-footer.tsx` | "Tentang Kami", "Laporan RAT", "Haji" | Low. Standard navigation structure. |
| **Footer Social Icons** | `modern-footer.tsx` | Facebook, Instagram, Youtube (Links are `#`) | **High Priority**. Should use `site_config.social_links`. |

---

## 🛠Recommended Next Steps (V2 Improvements)

1.  **Dynamic Product Highlights**:
    *   **Action**: Update `app/page.tsx` to fetch `pb.collection('products').getList({ filter: 'is_featured = true' })`.
    *   **Benefit**: Admin can swap "Featured Products" directly from the dashboard.

2.  **Social Links Integration**:
    *   **Action**: Update `modern-footer.tsx` to read `site_config.social_links` JSON field.
    *   **Benefit**: Changing Instagram URL in panel updates the footer icon link.

3.  **Social Hub Widget**:
    *   **Action**: Create a `social_feeds` collection or just use `site_config` to store the "Latest Video URL".
    *   **Benefit**: Marketing team can update the homepage video without engineering help.
