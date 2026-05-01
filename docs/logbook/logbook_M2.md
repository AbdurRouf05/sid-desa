# LOGBOOK MINGGUAN — Member 2 (Modul Persuratan & Kependudukan)

> **Nama:** [ISI_NAMA]
> **NIM:** [ISI_NIM]
> **Peran:** Fullstack Developer — Modul Persuratan & Data Warga
> **Proyek:** SID Sumberanyar

---

## Minggu 1 — Pembersihan Legacy
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Konfigurasi skema database `profil_desa` dan `perangkat_desa` | Koleksi PocketBase berhasil diatur dengan akses publik read-only |
| Membangun halaman admin Profil Desa dan Perangkat Desa | `dashboard/profil/page.tsx` (8.6KB), `dashboard/perangkat-desa/page.tsx` selesai |

---

## Minggu 2 — Portal Informasi Warga
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Rename skema rute "News" → "Berita Desa" | Integrasi Rich-Text Editor (TipTap) untuk CRUD berita di panel admin selesai |
| Membangun CRUD Berita di admin | `berita/form.tsx` (25.4KB), `page.tsx` (14.4KB), `baru/`, `[id]/` selesai |

---

## Minggu 3 — Dashboard APBDes
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Support review integrasi APBDes | Membantu verifikasi alur data APBDes |

---

## Minggu 4 — Pengaduan Mandiri
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Persiapan desain skema kependudukan dan persuratan | Merancang tabel `mutasi_penduduk` dan `surat_keluar` |

---

## Minggu 5 — Buku Mutasi Penduduk (Lahir & Mati)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Membuat skema `mutasi_penduduk` di PocketBase | Field NIK, nama_lengkap, jenis_mutasi, tanggal_mutasi ter-konfigurasi |
| Membangun form input mutasi Lahir/Mati | Validasi Zod dan UI form selesai — `mutasi/form.tsx` (20.5KB) |
| Membangun tabel register kematian/kelahiran | Halaman list kronologis selesai — `mutasi/page.tsx` (15.7KB) |

---

## Minggu 6 — Buku Mutasi Penduduk (Datang & Pergi)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Menambahkan logika conditional Datang/Pergi pada form | Form mendukung 4 jenis mutasi dengan field yang berbeda per jenis |
| Integrasi upload attachment surat pindah | Fitur upload Surat Pengantar Pindah/SKPWNI berfungsi |
| Menambahkan filter Chip/Dropdown pada register | Tabel bisa difilter: Lahir, Mati, Datang, Pergi |

---

## Minggu 7 — Layanan Persuratan Manual & Buku Agenda
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Membangun halaman publik katalog syarat persuratan | Informasi syarat KTP, SKTM, dll tersedia di `(public)/layanan/persuratan/` |
| Membangun Buku Agenda Surat Keluar admin | Form input manual + penomoran agenda otomatis — `surat/page.tsx` (15.5KB), `form.tsx` (15.2KB) |

---

## Minggu 8 — Generator Cetak PDF Persuratan
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Membangun PDF Template Renderer | Data admin diintegrasikan ke template surat, menghasilkan PDF via jsPDF — `surat/templates/` |
| Membangun fitur "Surat Pintar" | Generator surat otomatis + integrasi data penduduk — `surat/pintar/page.tsx` (26KB) |

---

## Minggu 9–12 — (Periode Member 1 Aktif / BKU)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Penyempurnaan modul persuratan dan data penduduk | Perbaikan bug, penambahan validasi, dan optimasi UX form |
| Membangun modul master Data Penduduk | CRUD data kependudukan lengkap — `penduduk/form.tsx` (25.4KB), `page.tsx` (12.1KB) |
| Support review modul BKU (M1) | Membantu testing alur keuangan |

---

## Minggu 13 — Manajemen Aset
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Support review modul Aset (M4) | Membantu verifikasi integrasi |

---

## Minggu 14 — Cleanup Storage
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Verifikasi cascade delete pada modul Surat dan Pengaduan | File attachment orphaned berhasil terhapus otomatis saat record dihapus |

---

## Minggu 15 — Polishing UI
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Integrasi Toast pada form persuratan dan mutasi | Notifikasi konsisten di seluruh form CRUD kependudukan |

---

## Minggu 16 — UAT & Deployment
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Simulasi UAT Kasi Kependudukan | Alur: Input Mutasi → Buat Surat → Cetak PDF → Arsip Agenda berjalan tanpa error |
