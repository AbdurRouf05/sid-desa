# Implementation Plan - Contact System & Header Refinement

## Goal

Optimize the website header for visual consistency and implement a fully dynamic Contact page backed by a database for customer inquiries.

## User Review Required
>
> [!IMPORTANT]
> A new PocketBase collection `inquiries` will be created to store contact form messages.

## Proposed Changes

### Database

#### [NEW] [create-inquiries-collection.ts](file:///d:/web-bmtnulumajang/scripts/create-inquiries-collection.ts)

- Script to create `inquiries` collection in PocketBase.
- Fields: `name`, `email`, `phone`, `subject`, `message`, `status` (select: new, processed, archived).

### Components / Layout

#### [MODIFY] [modern-navbar.tsx](file:///d:/web-bmtnulumajang/components/layout/modern-navbar.tsx)

- **Logic Change**: Fetch both `logo_primary` and `logo_secondary`.
- **UI Change**:
  - Display `logo_secondary` (white) when `!isScrolled`.
  - Display `logo_primary` (color) when `isScrolled`.
  - Hardcode/Fix Top Line Text to "BMT NU" to avoid redundancy with Bottom Line "LUMAJANG".

### Pages

#### [NEW/MODIFY] [app/kontak/page.tsx](file:///d:/web-bmtnulumajang/app/kontak/page.tsx)

- Fetch `address`, `email_official`, `phone_wa`, `map_embed_url` from `site_config`.
- Render dynamic Google Maps iframe.
- Implement Contact Form connecting to `inquiries` collection.

## Verification Plan

1. **Header Check**: verify logo swaps on scroll and text is "BMT NU" + "LUMAJANG".
2. **Contact Page**: verify map matches admin settings and form submission saves to DB.
