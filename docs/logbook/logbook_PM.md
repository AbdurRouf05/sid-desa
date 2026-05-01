# LOGBOOK MINGGUAN — Project Manager (PM)

> **Nama:** [ISI_NAMA_PM]
> **NIM:** [ISI_NIM]
> **Peran:** Project Manager & Infrastructure
> **Proyek:** SID Sumberanyar

---

## Minggu 1 — Pembersihan Legacy & Fondasi Rebranding
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Menghapus seluruh folder dan rute modul Produk BMT NU dari codebase | Folder `components/products/`, rute admin dan publik produk berhasil dihapus bersih |
| Mengatur ulang konfigurasi sidebar admin | Menu sidebar disesuaikan, item produk dihilangkan |
| Setup repositori dan branch strategy | Branch `main`, `modul-bku`, `modul-persuratan`, `modul-publik`, `modul-aset` berhasil dibuat |

---

## Minggu 2 — Portal Informasi Warga
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Review hasil reuse komponen Social Wall dan Berita | Memastikan naming convention konsisten setelah rename |
| Merge branch hasil kerja member | Kode dari M2 dan M3 di-review dan di-merge ke main |

---

## Minggu 3 — Dashboard Transparansi APBDes
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Review integrasi data APBDes | Memastikan alur data dari form admin sampai tampilan grafik publik berjalan benar |
| Code review PR dari M1 dan M3 | Kode APBDes admin (M1) dan visualisasi publik (M3) di-approve |

---

## Minggu 4 — Pengaduan Mandiri
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Review alur end-to-end pengaduan | Alur: publik submit → admin terima → ubah status berjalan tanpa error |
| Merge branch modul-publik | Fitur pengaduan di-merge ke main |

---

## Minggu 5 — Mutasi Penduduk (Lahir & Mati)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Verifikasi skema database mutasi | Koleksi `mutasi_penduduk` di PocketBase ter-konfigurasi dengan benar |
| Review form mutasi dari M2 | Form input Lahir/Mati di-approve setelah validasi Zod diperiksa |

---

## Minggu 6 — Mutasi Penduduk (Datang & Pergi)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Review filter dan conditional form | Logika conditional Datang/Pergi dan filter Chip berjalan sesuai spesifikasi |

---

## Minggu 7 — Persuratan & Buku Agenda
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Review sistem penomoran otomatis agenda surat | Penomoran auto-increment berjalan benar |
| Merge branch modul-persuratan | Kode surat di-merge ke main |

---

## Minggu 8 — Generator PDF Persuratan
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Review output PDF surat resmi desa | Format surat sesuai standar surat desa |
| Verifikasi template surat dan fitur Surat Pintar | Generator PDF menghasilkan dokumen yang benar dan layak cetak |

---

## Minggu 9 — Kas Dasar BKU
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Setup koleksi `rekening_kas` dan `bku_transaksi` di PocketBase | Skema database keuangan siap digunakan |
| Review arsitektur relasi antar tabel keuangan | Relasi Rekening ↔ Transaksi ↔ Pajak tervalidasi |

---

## Minggu 10 — Pindah Buku
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Review logika validasi saldo dan skenario edge-case | Semua skenario transfer (Tunai↔Bank, Bank↔Bank) lolos edge-case |

---

## Minggu 11 — Kalkulasi Pajak
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Review kalkulasi pajak dan sinkronisasi data | Perhitungan PPN 11% dan pajak manual akurat, sinkron ke `pajak_log` |

---

## Minggu 12 — Ekspor BKU
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| UAT alur lengkap BKU | End-to-end test dari input transaksi hingga ekspor XLSX berhasil tanpa error |
| Review formula arus kas | Rumus Kas Awal + Pemasukan - Pengeluaran - Pajak menghasilkan angka yang benar |

---

## Minggu 13 — Manajemen Aset
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Setup koleksi `inventaris_desa` dan `tanah_desa` di PocketBase | 2 collection terpisah berhasil dikonfigurasi |
| Review arsitektur 2-collection aset | Pemisahan Inventaris dan Tanah disetujui karena field spesifik berbeda |

---

## Minggu 14 — Cleanup Storage Backend
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Membuat PocketBase hooks cascade delete nota BKU | File nota/bukti terhapus otomatis saat transaksi dihapus admin |
| Membuat PocketBase hooks cascade delete file pengaduan & surat | File attachment orphaned berhasil dibersihkan secara otomatis |

---

## Minggu 15 — UI/UX Polishing
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Standarisasi seluruh admin panel ke desain Emerald Green | Sisa tema dark/slate-900 legacy berhasil dihilangkan |
| Integrasi Toast notifications (Sonner) | Notifikasi Sukses/Error konsisten di seluruh form CRUD |

---

## Minggu 16 — UAT & Deployment
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Menjalankan `next build` dan menyelesaikan lint/build warnings | Production build berhasil tanpa console logs |
| Konfigurasi deployment Netlify/Vercel | File konfigurasi `netlify.toml` dan `next.config.ts` siap produksi |
| Finalisasi SEO dan security | `robots.ts`, `sitemap.ts`, dan CSP headers di `middleware.ts` terkonfigurasi |
