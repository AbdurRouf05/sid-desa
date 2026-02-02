# PANDUAN AKSES & TESTING (ACCESS & TESTING GUIDE)

Dokumen ini menjelaskan cara menjalankan, mengakses, dan melakukan testing pada aplikasi BMT NU Lumajang, baik di lingkungan lokal maupun production.

## 1. Lingkungan Lokal (Local Development)

Aplikasi menggunakan arsitektur **Subdomain** yang dipisahkan oleh `middleware.ts`.

- **Port Default:** `3040`
- **Host:** `localhost` atau Custom Domain Lokal (`bmtnulmj.local`)

### A. Persiapan (Setup Hosts File)

Agar simulasi subdomain (`cp.`) berjalan lancar di lokal, tambahkan entry berikut ke file hosts komputer Anda:

**Windows:** `C:\Windows\System32\drivers\etc\hosts` (Edit as Administrator)
**Mac/Linux:** `/etc/hosts`

```text
127.0.0.1 bmtnulmj.local
127.0.0.1 www.bmtnulmj.local
127.0.0.1 cp.bmtnulmj.local
```

### B. Menjalankan Server

Gunakan perintah `pnpm` (bukan npm):

```bash
pnpm run dev
```

Terminal akan berjalan di `http://localhost:3040`.

### C. URL Akses (Testing)

| Lingkungan | URL | Keterangan |
| :--- | :--- | :--- |
| **Public Site** | `http://bmtnulmj.local:3040` | Halaman utama untuk nasabah (Home, Produk, Berita). |
| **Admin Panel** | `http://cp.bmtnulmj.local:3040` | Dashboard admin. Akan redirect ke `/login` jika belum masuk. |
| *Alternatif Header* | `curl -H "Host: cp.localhost" http://localhost:3040` | Jika testing menggunakan CLI/Postman. |

> **Catatan:** Jika Anda mengakses `http://localhost:3040` langsung, middleware akan menganggapnya sebagai Public Site.

---

## 2. Lingkungan Hosting (Production/Staging)

Saat aplikasi di-deploy (misalnya ke VPS atau Vercel), konfigurasi DNS diperlukan agar subdomain berfungsi.

### A. Konfigurasi DNS

Anda perlu mengatur **A Record** atau **CNAME** untuk domain utama dan subdomain `cp`.

| Type | Name | Value | Logic |
| :--- | :--- | :--- | :--- |
| A / CNAME | `@` (Root) | IP/Domain Server | Mengarah ke Public Site |
| A / CNAME | `www` | IP/Domain Server | Mengarah ke Public Site |
| A / CNAME | `cp` | IP/Domain Server | Mengarah ke Admin Panel |

### B. Environment Variables

Pastikan di server production, variabel environment diset sesuai domain asli:

```ini
# .env.local di Production
NEXT_PUBLIC_APP_URL="https://bmtnulmj.com"
NEXT_PUBLIC_ROOT_DOMAIN="bmtnulmj.com" 
```

### C. Testing Production

Setelah DNS propagate (1x24 jam), akses langsung via browser:

1. **Public:** `https://bmtnulmj.com` (atau `www.bmtnulmj.com`)
2. **Admin:** `https://cp.bmtnulmj.com`

---

## 3. Troubleshooting Umum

**Q: Tampilan (CSS) Berantakan / Unstyled?**
- **Sebab:** Cache Tailwind atau Middleware memblokir CSS.
- **Solusi:**
    1. Matikan server (`Ctrl+C`).
    2. Hapus folder build lama: `Remove-Item -Recurse -Force .next` (PowerShell) atau `rm -rf .next` (Bash).
    3. Jalankan ulang: `pnpm run dev`.
    4. Cek Console Browser (F12) jika ada error "Content Security Policy".

**Q: Redirect Loop pada Admin?**
- **Sebab:** Middleware salah mendeteksi hostname.
- **Solusi:** Pastikan `NEXT_PUBLIC_ROOT_DOMAIN` di `.env` sudah sesuai dengan domain yang Anda akses.

**Q: "Address already in use :::3040"?**
- **Sebab:** Server sebelumnya belum tertutup sempurna.
- **Solusi:** Kill process di port 3040 atau restart komputer.
