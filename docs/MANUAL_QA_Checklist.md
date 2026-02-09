# Beta Tester Mission Log: BMT NU Lumajang Web App

**Objective**: Verify the application from a "User Perspective" before official launch.
**Tester Role**: Non-technical staff / Potential Member.
**Status**: Ready for Beta Testing.

---

## 1. The "First Impression" Test (UI/UX)
*Goal: Ensure the site looks premium and works restricted conditions.*

| ID        | Scenario                    | What to Do                                                                           | Expected Result                                                                                        | Pass |
| :-------- | :-------------------------- | :----------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- | :--: |
| **UI-01** | **Slow Network Simulation** | Open Chrome DevTools (F12) -> Network -> Select **"Fast 3G"**. Reload the Home Page. | Site should load content gracefully (Skeleton loaders or Blur placeholders visible). No layout shifts. | [ ]  |
| **UI-02** | **Tiny Screen Test**        | Open on mobile (or DevTools "iPhone SE" mode). Scroll down to the Footer.            | Layout stays intact. No horizontal scrolling. Text is readable (not too small).                        | [ ]  |
| **UI-03** | **Legal Trust Check**       | Go to **"Tentang Kami"** page. Look for NIB & Badan Hukum numbers.                   | NIB and BH numbers are clearly visible, readable, and look official.                                   | [ ]  |
| **UI-04** | **Landscape Mode**          | Rotate phone to landscape orientation.                                               | Navigation bar adjusts correctly. Content is still accessible.                                         | [ ]  |

## 2. The "Critical Path" Test (Functionality)
*Goal: Verify the main reasons people visit the site.*

| ID | Scenario | What to Do | Expected Result | Pass |
|:---|:---|:---|:---|:---:|
| **FN-01** | **Check Sirela Savings** | Click **"Produk"** in Navbar -> Click **"Tabungan Sirela"** tab (or card). | Card expands/opens. "Setoran Awal: **Rp 20.000**" is clearly visible. | [ ] |
| **FN-02** | **Contact Form Validation** | Go to **"Kontak"**. Fill Name & Message but **LEAVE Email & Phone BLANK**. Click Send. | System shows error message "Wajib diisi" (or similar). Form is **NOT** submitted. | [ ] |
| **FN-03** | **Successful Inquiry** | Fill Contact Form completely. Click Send. | Success message appears ("Pesan Terkirim"). Form clears itself. | [ ] |
| **FN-04** | **Mobile Navigation** | On Mobile: Click the **Hamburger Menu** (3 lines) in top right. | Menu slides in smoothly from the right (or drops down). Links are clickable. | [ ] |
| **FN-05** | **Map Interaction** | On Contact Page: Try to zoom or move the Google Map. | Map is interactive. Location pin shows "BMT NU Lumajang". | [ ] |

## 3. The "Admin Power" Test (CMS Logic)
*Goal: Ensure staff can manage content easily.*

| ID | Scenario | What to Do | Expected Result | Pass |
|:---|:---|:---|:---|:---:|
| **AD-01** | **Secure Login** | Go to `/panel`. Enter valid credentials. | Redirects to Dashboard. Sidebar shows "Dashboard", "Berita", "Produk". | [ ] |
| **AD-02** | **Heavy Image Upload** | Create a new News/Article. Upload a **large photo (>5MB)** as thumbnail. | System accepts it and auto-compresses it (or shows explicit error if over limit). UI doesn't crash. | [ ] |
| **AD-03** | **Real-time Updates** | Go to **Settings**. Change "Total Aset" (e.g., from "28 M" to "30 M"). Click Save. | Success notification. | [ ] |
| **AD-04** | **Public Verification** | Open new tab -> Go to Home Page (`/`). Refresh. | The Stats Widget now shows **"30 M"** (Immediate update). | [ ] |

## 4. The "Security & Error" Test (Monkey Testing)
*Goal: Try to break the system.*

| ID | Scenario | What to Do | Expected Result | Pass |
|:---|:---|:---|:---|:---:|
| **SEC-01**| **Unauthorized Access** | Logout from Admin. Then try to revisit `/panel/dashboard` directly via URL. | Immediate redirect back to `/panel/login`. Access Denied. | [ ] |
| **SEC-02**| **404 Handling** | Type a random URL: `bmtnulmj.com/halaman-ngawur-yang-tidak-ada`. | Displays a custom **404 Page** (Not a generic browser error). "Halaman Tidak Ditemukan" + Button to Home. | [ ] |
| **SEC-03**| **Script Injection** | In Contact Form "Message", type `<script>alert('hacked')</script>`. Send. | System sanitizes input. Admin panel reads it as plain text, NO popup alert appears. | [ ] |

---

**Tester Signature:** ____________________
**Date:** ____________________
