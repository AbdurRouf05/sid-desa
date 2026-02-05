# Panduan Deployment (Netlify)

Dokumen ini berisi langkah-langkah untuk mendeploy website BMT NU Lumajang ke Netlify.

## 1. Persiapan Akun

Pastikan Anda login ke Netlify menggunakan akun yang telah dicatat di file `.env.local` (Bagian `DEPLOYMENT INFO`).

- **Repo**: `https://github.com/sagamuda/bmtnulmj.git`
- **Branch**: `main`

## 2. Setup Project Baru di Netlify

1. Login ke Dashboard Netlify.
2. Klik **Add new site** > **Import an existing project**.
3. Pilih **GitHub**.
4. Cari repositori `sagamuda/bmtnulmj`.
5. Konfigurasi Build:
    - **Build command**: `npm run build`
    - **Publish directory**: `.next`

## 3. Environment Variables (PENTING)

Netlify **TIDAK** membaca file `.env.local` secara otomatis. Anda harus memasukkan variabel berikut secara manual di menu **Site configuration > Environment variables**.

Salin nilai ("Value") dari file `.env.local` di laptop Anda.

| Key | Value (Keterangan) |
| :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Domain Netlify (Contoh: `https://bmtnulmj.netlify.app`) |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Domain tanpa https (Contoh: `bmtnulmj.netlify.app`) |
| `NEXT_PUBLIC_POCKETBASE_URL` | `https://db-bmtnulmj.sagamuda.cloud` |
| `POCKETBASE_ADMIN_EMAIL` | *Lihat di .env.local* |
| `POCKETBASE_ADMIN_PASSWORD` | *Lihat di .env.local* |
| `MINIO_ENDPOINT` | `https://drivestorage.sagamuda.cloud` |
| `MINIO_BUCKET` | `bmtnulmj-storage` |
| `MINIO_REGION` | `ap-southeast-3` |
| `MINIO_ACCESS_KEY` | *Lihat di .env.local* |
| `MINIO_SECRET_KEY` | *Lihat di .env.local* |
| `MINIO_USE_SSL` | `true` |

> [!WARNING]
> Jangan pernah menuliskan password atau key rahasia secara langsung di file ini karena file ini ter-upload ke Git. Selalu rujuk ke `.env.local`.

## 4. Deploy

1. Klik **Deploy site**.
2. Tunggu proses build selesai (biasanya 1-2 menit).
3. Cek URL yang diberikan Netlify.

## 5. Domain Kustom (Opsional)

Jika ingin menggunakan domain `bmtnu-lumajang.id`:

1. Pergi ke **Domain management**.
2. Tambahkan domain custom.
3. Update DNS record sesuai instruksi Netlify.
4. JANGAN LUPA update `NEXT_PUBLIC_APP_URL` di Environment Variables dengan domain baru.
