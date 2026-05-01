# DOKUMEN LOGBOOK LENGKAP — SID Sumberanyar
# (Mentahan + Umum + Per-Anggota — Satu File)

Dokumen ini menggabungkan **seluruh logbook** proyek SID Sumberanyar menjadi satu file tunggal sebagai sumber kebenaran (*Source of Truth*).

**Daftar Isi:**
1. [Kunci Pembagian Tugas Tim](#kunci-pembagian-tugas-tim)
2. [BAGIAN A — Logbook Mingguan Umum (Tim)](#bagian-a--logbook-mingguan-umum-tim)
3. [BAGIAN B — Mentahan Logbook (Umum + Per-Anggota Gabungan)](#bagian-b--mentahan-logbook-umum--per-anggota-gabungan)
4. [BAGIAN C — Logbook Individual: Project Manager (PM)](#bagian-c--logbook-individual-project-manager-pm)
5. [BAGIAN D — Logbook Individual: Member 1 (Modul BKU & Pajak)](#bagian-d--logbook-individual-member-1-modul-bku--pajak)
6. [BAGIAN E — Logbook Individual: Member 2 (Modul Persuratan & Kependudukan)](#bagian-e--logbook-individual-member-2-modul-persuratan--kependudukan)
7. [BAGIAN F — Logbook Individual: Member 3 (Modul Portal Publik & Pengaduan)](#bagian-f--logbook-individual-member-3-modul-portal-publik--pengaduan)
8. [BAGIAN G — Logbook Individual: Member 4 (Modul Manajemen Aset)](#bagian-g--logbook-individual-member-4-modul-manajemen-aset)
9. [LAMPIRAN — Fitur Bonus, Statistik, & Teknologi](#lampiran--fitur-bonus-statistik--teknologi)

---

## Kunci Pembagian Tugas Tim

| Kode | Penanggung Jawab | Modul Utama | Branch |
|------|-------------------|-------------|--------|
| **PM** | Project Manager (Abdur Rouf) | Infrastruktur, Review, Koordinasi | `main` |
| **M1** | Member 1 — [ISI_NAMA] | Keuangan (BKU, Pajak, APBDes) | `modul-bku` |
| **M2** | Member 2 — [ISI_NAMA] | Persuratan & Data Warga (Kependudukan) | `modul-persuratan` |
| **M3** | Member 3 — [ISI_NAMA] | Portal Publik & Pengaduan Warga | `modul-publik` |
| **M4** | Member 4 — [ISI_NAMA] | Manajemen Aset | `modul-aset` |

---
---
---

# BAGIAN A — LOGBOOK MINGGUAN UMUM (TIM)

> **Proyek:** Sistem Informasi Desa (SID) Sumberanyar
> **Periode:** 16 Minggu (4 Bulan)

---

## Minggu 1 — Pembersihan Legacy & Fondasi Rebranding
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Menghapus modul "Produk/E-Commerce" sisa boilerplate BMT NU | Seluruh rute publik, rute admin, dan komponen UI terkait produk dihapus total dari codebase agar tidak membebani bundle aplikasi |
| Konfigurasi database Profil Desa & Perangkat Desa | Koleksi `profil_desa` (Single Table) dan `perangkat_desa` dikonfigurasi agar dapat diakses secara read-only oleh publik |
| Rebranding identitas visual | Logo "BMT NU" diganti menjadi logo "SID Sumberanyar" dengan palet warna Desa Teal & Soil Orange pada Navbar dan Footer |
| Mempertahankan fitur Hero Banners | Fitur slideshow foto beranda dipertahankan agar admin tetap bisa mengelola banner secara dinamis |
| Repurpose halaman Wilayah Dusun | Fungsi halaman admin "Wilayah Dusun" diubah menjadi manajemen Struktur Organisasi (Perangkat Desa) |

---

## Minggu 2 — Portal Informasi Warga (Reuse Berita & Social Wall)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Reuse komponen Social Wall | Komponen Magic Fetch Social Feeds didaur ulang 100% tanpa mengubah logika, hanya penyesuaian palet warna ke tema Desa |
| Rename modul News → Berita Desa | Skema dan rute "News" diganti menjadi "Berita Desa". Rich-Text Editor (TipTap) bawaan boilerplate digunakan untuk CRUD pengumuman |
| Repurpose halaman Layanan Desa | Halaman "Layanan Desa" yang aslinya berisi layanan perbankan BMT diubah menjadi papan informasi syarat pembuatan surat (KTP, SKTM, dll) |
| Membangun halaman Berita Publik | Halaman Grid berita terbaru untuk pengunjung publik selesai dibangun |

---

## Minggu 3 — Dashboard Transparansi APBDes
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Konfigurasi koleksi APBDes | Koleksi `apbdes_realisasi` di PocketBase dikonfigurasi untuk menampung data Pendapatan, Belanja, dan Pembiayaan |
| Form input APBDes di Admin | Formulir di Panel Admin selesai dibangun untuk memasukkan data master APBDes (Anggaran vs Realisasi per kategori) |
| Visualisasi grafik APBDes publik | Dashboard Infografis menggunakan Recharts menampilkan grafik APBDes (Target vs Realisasi) di halaman publik |

---

## Minggu 4 — Interaksi Komunitas (Pengaduan Mandiri)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Form pengaduan publik | Form pengaduan warga (Nama, Alamat, Kronologi) selesai dibangun di sisi publik, bisa diakses tanpa login |
| Manajemen pengaduan admin | Menu "Pesan Masuk" di sidebar admin diubah menjadi "Pengaduan Warga". Tabel inbox terkoneksi ke koleksi `pengaduan_warga` dengan status tracking: Baru → Diproses → Selesai |

---

## Minggu 5 — Buku Mutasi Penduduk (Lahir & Mati)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Pembuatan skema mutasi penduduk | Skema `mutasi_penduduk` dengan field NIK, nama lengkap, jenis mutasi (Lahir/Mati/Datang/Pergi), dan tanggal mutasi selesai dikonfigurasi |
| Form input mutasi Lahir/Mati | Antarmuka form input mutasi bagi perangkat desa untuk merekam kelahiran dan kematian warga selesai dibangun |
| Tabel register mutasi | Halaman dasbor tabel register mutasi menampilkan riwayat data keluar-masuk penduduk secara kronologis |

---

## Minggu 6 — Buku Mutasi Penduduk (Datang & Pergi)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Form mutasi Datang/Pergi | Logika conditional form mutasi untuk jenis "Datang" dan "Pergi" selesai ditambahkan |
| Fitur attachment surat pindah | Fitur upload Surat Pengantar Pindah/SKPWNI untuk warga pindahan terintegrasi dalam form |
| Filter visual pada register | Filter Chip/Dropdown ditambahkan agar list register bisa difilter berdasarkan jenis mutasi |

---

## Minggu 7 — Layanan Persuratan Manual & Buku Agenda
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Katalog syarat pencetakan surat (publik) | Halaman informasi syarat dokumen untuk warga sebelum datang ke balai desa selesai dibangun |
| Buku Agenda Surat Keluar (admin) | Sistem input manual Nama, NIK, Keperluan, dan Alamat pemohon ke dalam Log Buku Agenda Surat Keluar dengan penomoran otomatis selesai |

---

## Minggu 8 — Generator Cetak PDF Persuratan
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| PDF Template Renderer | Data input admin diintegrasikan ke template HTML/PDF untuk menghasilkan dokumen surat resmi desa siap cetak |
| Fitur Surat Pintar | Generator surat otomatis dengan template dinamis dan integrasi data penduduk berhasil dibangun (fitur bonus melampaui rencana awal) |
| Arsip dokumen otomatis | Dokumen PDF yang dihasilkan otomatis tersimpan ke arsip sistem |

---

## Minggu 9 — Relasional Kas Dasar BKU
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Master Dompet Rekening Desa | Admin dapat membuat dan mengelola dompet "Kas Tunai Desa" dan "Bank Desa" dengan CRUD lengkap |
| Transaksi Kas Masuk & Keluar | Form transaksi harian selesai dibangun: input nominal, pilihan dompet/rekening, kategori pengeluaran, dan fitur upload bukti nota/struk |

---

## Minggu 10 — Pindah Buku (Transfer Lintas Kas)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Fitur Pindah Buku | Fitur transfer antar rekening selesai: Tunai↔Bank, Bank↔Bank, Tunai↔Tunai dengan dropdown sumber dan tujuan |
| Validasi Running Balance | Sistem validasi saldo real-time berhasil diterapkan. Transaksi ditolak otomatis jika saldo sumber tidak mencukupi |

---

## Minggu 11 — Sistem Kalkulasi Pajak BKU
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Kalkulasi PPN/PPh otomatis | Checkbox pajak opsional ditambahkan pada form Transaksi Keluar. Sistem menghitung otomatis PPN 11% atau persentase manual |
| Log pencatatan pajak | Sinkronisasi nominal pajak ke tabel `pajak_log` sebagai tagihan "Belum Disetor" berhasil diterapkan |

---

## Minggu 12 — Pembayaran Pajak & Ekspor BKU
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Pelunasan pajak | Admin dapat mengubah status tagihan menjadi "Sudah Disetor" disertai bukti slip setor/NTPN |
| Ekspor XLSX BKU | Fitur ekspor laporan arus kas bulanan ke format Excel (XLSX) selesai dibangun dengan formula: Kas Awal + Pemasukan - Pengeluaran - Pajak |

---

## Minggu 13 — Manajemen Aset Pemerintahan Desa
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Modul Inventaris Desa | CRUD pencatatan aset barang kantor (Nama, Kategori, Tahun Perolehan, Kuantitas, Kondisi) selesai dibangun |
| Modul Tanah Kas Desa | CRUD pencatatan tanah desa (Lokasi, Luas m², Peruntukan, Pemegang Hak) selesai dibangun |
| Update kondisi aset | Fitur update kondisi/mutasi aset berkala (Baik → Rusak Ringan → Rusak Berat → Dihapus) berhasil diterapkan |

---

## Minggu 14 — Hook Cleanup Storage (Optimasi Backend)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Cascade delete nota BKU | Script trigger di PocketBase untuk menghapus file gambar nota/PDF dari storage saat row transaksi dihapus |
| Cascade delete file pengaduan & surat | Pembersihan relasi file orphaned: file attachment ikut terhapus saat record agenda/pengaduan dihapus |

---

## Minggu 15 — UI/UX Master Polishing & Empty States
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| Skeleton loading animations | Animasi loading Skeleton diterapkan pada komponen yang membutuhkan data fetching, mengurangi layout jumps (CLS) |
| Empty States | Ilustrasi data kosong ditambahkan pada halaman yang datanya masih nol (APBDes, Pengaduan, dll) |
| Standarisasi UI Emerald Green | Seluruh admin panel distandardisasi ke palet Emerald Green yang konsisten |
| Toast notifications | Sistem notifikasi Sonner (Sukses/Error) diintegrasi di seluruh modul admin |

---

## Minggu 16 — E2E User Acceptance Testing & Deployment
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Keterangan |
|-----------|------------|
| UAT simulasi Bendahara | Uji alur lengkap BKU: Input transaksi → Pindah Buku → Kalkulasi Pajak → Pelunasan → Ekspor XLSX |
| UAT simulasi Kasi Kependudukan | Uji alur: Input Mutasi → Buat Surat → Cetak PDF → Arsip Agenda |
| Optimalisasi Build | Resolusi lint/build warnings. Production build (`next build`) tanpa console logs |
| Deployment & SEO | Finalisasi konfigurasi deployment, robots.ts, sitemap.ts, dan security headers middleware |

---
---
---

# BAGIAN B — MENTAHAN LOGBOOK (UMUM + PER-ANGGOTA GABUNGAN)

Bagian ini berisi rekap **per-minggu** yang mencantumkan narasi umum DAN tabel siapa mengerjakan apa.

---

## BULAN 1: Cleanup Boilerplate, Portal Publik, & APBDes

### MINGGU 1 — Pembersihan Legacy & Fondasi Rebranding

**Logbook Umum Tim:**
- Melakukan penghapusan total (rm -rf) seluruh modul "Produk/E-Commerce" sisa boilerplate BMT NU yang tidak relevan dengan SID Desa, termasuk rute publik, rute admin, dan komponen UI terkait produk.
- Mengonfigurasi koleksi database `profil_desa` (Single Table) dan `perangkat_desa` agar dapat diakses secara read-only oleh publik.
- Melakukan rebranding identitas visual: mengganti logo "BMT NU" menjadi logo "SID Sumberanyar" dengan palet warna Desa Teal & Soil Orange pada Navbar dan Footer.
- Mempertahankan dan menyesuaikan fitur Hero Banners agar admin tetap bisa mengelola slideshow foto beranda secara dinamis.
- Mengubah fungsi halaman "Wilayah Dusun" di admin menjadi manajemen Struktur Organisasi (Perangkat Desa).

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **PM** | Menghapus seluruh folder dan rute terkait modul Produk BMT NU dari codebase. Mengatur ulang konfigurasi sidebar admin. Setup awal repositori dan branch strategy. | `components/products/` (DELETED), sidebar admin, `.gitignore` |
| **M3** | Menyesuaikan komponen Navbar & Footer publik: mengganti logo, warna, dan teks identitas dari BMT NU ke SID Sumberanyar. Meng-adjust Hero Banner agar sesuai tema pemerintahan desa. | `components/layout/`, `components/home/`, `app/(public)/home/` |
| **M2** | Mengonfigurasi skema database `profil_desa` dan `perangkat_desa` di PocketBase. Memastikan akses publik read-only berfungsi. | Backend PocketBase, `dashboard/profil/`, `dashboard/perangkat-desa/` |
| **M1** | Standby / Mempersiapkan studi arsitektur modul BKU yang akan dikerjakan di Bulan 3. Membantu PM dalam proses pembersihan. | Dokumentasi internal |
| **M4** | Standby / Mempersiapkan referensi pengelolaan inventaris. Membantu rebranding UI minor. | Dokumentasi internal |

---

### MINGGU 2 — Portal Informasi Warga (Reuse Berita & Social Wall)

**Logbook Umum Tim:**
- Mendaur ulang (reuse) 100% komponen Magic Fetch Social Feeds (Social Wall) tanpa mengubah logika, hanya menyesuaikan palet warna ke tema Desa.
- Mengganti nama skema dan rute modul "News" menjadi "Berita Desa". Memanfaatkan Rich-Text Editor bawaan boilerplate untuk operasi CRUD pengumuman desa.
- Mengubah fungsi halaman "Layanan Desa" (aslinya layanan perbankan BMT) menjadi papan informasi syarat-syarat pembuatan surat (KTP, SKTM, dll) untuk warga.
- Membangun halaman Grid berita terbaru untuk pengunjung publik di sisi front-end.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M3** | Menyesuaikan palet warna Social Wall ke tema Desa Teal. Membangun halaman grid direktori berita publik untuk pengunjung. | `components/home/SocialWall`, `app/(public)/berita/page.tsx` (9.9KB) |
| **M2** | Me-rename skema rute "News" → "Berita Desa". Mengintegrasikan Rich-Text Editor (TipTap) untuk CRUD berita di panel admin. | `app/(admin)/panel/dashboard/berita/form.tsx` (25.4KB), `page.tsx` (14.4KB), `baru/`, `[id]/` |
| **M3** | Mengubah konten halaman "Layanan Desa" dari layanan perbankan menjadi informasi syarat pembuatan surat desa untuk warga. | `app/(admin)/panel/dashboard/layanan/`, `app/(public)/layanan/page.tsx` (12.1KB) |
| **PM** | Review hasil reuse komponen. Memastikan naming convention konsisten. | Code review, merge branch |

---

### MINGGU 3 — Dashboard Transparansi APBDes

**Logbook Umum Tim:**
- Mengonfigurasi dan memastikan koleksi `apbdes_realisasi` di PocketBase siap menampung kriteria data Pendapatan, Belanja, dan Pembiayaan desa.
- Membangun formulir input di Panel Admin untuk memasukkan data master APBDes (perbandingan Anggaran vs Realisasi per kategori operasional).
- Menampilkan Dashboard Infografis menggunakan library Recharts yang memvisualisasikan data `apbdes_realisasi` berupa grafik Target vs Realisasi untuk konsumsi publik.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M1** | Mengonfigurasi koleksi `apbdes_realisasi` di PocketBase (skema Pendapatan, Belanja, Pembiayaan). Membangun form input data APBDes di panel admin. | `app/(admin)/panel/dashboard/apbdes/form.tsx` (12KB), `page.tsx` (11.8KB), `baru/`, `[id]/` |
| **M3** | Membangun halaman visualisasi grafik APBDes untuk publik menggunakan Recharts (BarChart, PieChart). | `app/(public)/v3/page.tsx` (37.6KB — halaman publik terbesar) |
| **PM** | Review integrasi data APBDes dari admin ke tampilan publik. | Code review |

---

### MINGGU 4 — Interaksi Komunitas (Layanan Pengaduan Mandiri)

**Logbook Umum Tim:**
- Membangun form laporan pengaduan di sisi publik (Nama, Alamat, Kronologi aduan) yang dapat diakses tanpa login (anonymous/public submit).
- Mengubah nama menu Sidebar Admin "Pesan Masuk" menjadi "Pengaduan Warga". Menyambungkan tabel UI inbox ke koleksi `pengaduan_warga` dengan status tracking: "Baru", "Diproses", "Selesai".

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M3** | Membangun form pengaduan mandiri di sisi publik (input Nama, Alamat, Kronologi) beserta notifikasi sukses kirim. | `app/(public)/pengaduan/page.tsx` (10.1KB) |
| **M3** | Memodifikasi menu sidebar admin: rename "Pesan Masuk" → "Pengaduan Warga". Menyambungkan tabel inbox ke koleksi `pengaduan_warga` dengan filter status. | `app/(admin)/panel/dashboard/inquiries/page.tsx` (11.9KB), `components/admin/sidebar.tsx` |
| **PM** | Review alur end-to-end pengaduan: publik submit → admin terima → ubah status. | Code review, merge |

---

## BULAN 2: Administrasi Mutasi Kependudukan & Layanan Surat

### MINGGU 5 — Buku Mutasi Penduduk (Lahir & Mati)

**Logbook Umum Tim:**
- Membuat dan memvalidasi skema database `mutasi_penduduk` di PocketBase dengan field: `nik`, `nama_lengkap`, `jenis_mutasi` (Lahir/Mati/Datang/Pergi), `tanggal_mutasi`, dan field pendukung lainnya.
- Membangun antarmuka form input mutasi bagi perangkat desa untuk merekam warga meninggal atau bayi baru lahir.
- Merancang halaman dasbor tabel list register mutasi yang menampilkan riwayat data penduduk masuk/keluar secara kronologis.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M2** | Membuat skema `mutasi_penduduk` di PocketBase. Membangun form input mutasi (Lahir/Mati) dengan validasi Zod. | `app/(admin)/panel/dashboard/mutasi/form.tsx` (20.5KB), `baru/` |
| **M2** | Membangun halaman tabel register kematian/kelahiran dengan data kronologis. | `app/(admin)/panel/dashboard/mutasi/page.tsx` (15.7KB) |
| **PM** | Verifikasi skema database dan review form mutasi. | Backend PocketBase, code review |

---

### MINGGU 6 — Buku Mutasi Penduduk (Datang & Pergi)

**Logbook Umum Tim:**
- Melanjutkan pengembangan form mutasi dengan menambahkan logika conditional untuk jenis "Datang" dan "Pergi".
- Mengimplementasikan fitur unggah attachment (Surat Pengantar Pindah/SKPWNI) untuk warga pindahan.
- Menambahkan visual filter (Chip/Dropdown) pada panel register agar list bisa difilter berdasarkan status mutasi tertentu.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M2** | Menambahkan logika conditional form untuk mutasi Datang/Pergi. Integrasi fitur upload attachment surat pengantar pindah. | `mutasi/form.tsx` (diperluas menjadi 20.5KB total) |
| **M2** | Menambahkan filter Chip/Dropdown pada halaman register mutasi (filter per jenis: Lahir/Mati/Datang/Pergi). | `mutasi/page.tsx` (diperluas) |
| **PM** | Review filter dan alur conditional form. | Code review |

---

### MINGGU 7 — Layanan Persuratan Manual & Buku Agenda

**Logbook Umum Tim:**
- Membangun halaman informasi publik berisi katalog syarat-syarat dokumen yang perlu disiapkan warga sebelum datang ke balai desa.
- Membangun sistem Buku Agenda Surat Keluar di panel admin: Admin memasukkan Nama, NIK, Keperluan, dan Alamat pemohon secara manual. Data disimpan dalam Log Buku Agenda Surat Keluar dengan penomoran otomatis.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M2** | Membangun halaman publik katalog syarat pencetakan surat (informasi statis syarat KTP, SKTM, dll). | `app/(public)/layanan/persuratan/`, `app/(public)/pelayanan/administrasi-desa/` |
| **M2** | Membangun sistem Buku Agenda Surat Keluar: form input manual (Nama, NIK, Keperluan, Alamat) dengan penomoran agenda otomatis. | `app/(admin)/panel/dashboard/surat/page.tsx` (15.5KB), `form.tsx` (15.2KB), `baru/` |
| **PM** | Review sistem penomoran otomatis agenda surat. | Code review, merge |

---

### MINGGU 8 — Generator Cetak PDF Persuratan

**Logbook Umum Tim:**
- Mengintegrasikan data input admin (dari form Buku Agenda) ke dalam template kanvas statis HTML/PDF untuk menghasilkan dokumen surat resmi desa.
- Menghasilkan file PDF siap cetak untuk disahkan oleh Kepala Desa. Dokumen otomatis disimpan ke arsip sistem.
- Membangun fitur "Surat Pintar" yang melampaui rencana awal — generator surat otomatis dengan template dinamis.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M2** | Membangun PDF Template Renderer: mengawinkan data input admin ke template surat statis, menghasilkan file PDF siap cetak via jsPDF. | `app/(admin)/panel/dashboard/surat/templates/` (form 15.8KB, page 7.2KB) |
| **M2** | Membangun fitur "Surat Pintar" — generator surat otomatis dengan integrasi data penduduk dan template dinamis. | `app/(admin)/panel/dashboard/surat/pintar/page.tsx` (26KB) |
| **PM** | Review output PDF, verifikasi format surat resmi desa. | Code review, UAT surat |

---

## BULAN 3: Sistem Akuntansi Desa / Buku Kas Umum (BKU)

### MINGGU 9 — Relasional Kas Dasar BKU

**Logbook Umum Tim:**
- Membangun modul Master Dompet Rekening Desa: Admin dapat membuat/mengelola dompet "Kas Tunai Desa" dan "Bank Desa" dengan CRUD lengkap (tipe: Tunai/Bank).
- Membangun form transaksi harian Kas Masuk & Kas Keluar: input nominal, pilihan dompet/rekening, kategori pengeluaran, serta fitur unggah bukti nota/struk fisik.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M1** | Membangun modul CRUD Master Rekening Desa (Tunai/Bank) termasuk form input dan halaman list dompet. | `app/(admin)/panel/dashboard/bku/rekening/form.tsx` (21.8KB), `page.tsx` (14.5KB), `baru/`, `[id]/` |
| **M1** | Membangun form transaksi Kas Masuk & Kas Keluar: nominal, pilihan rekening, kategori, upload bukti nota. | `app/(admin)/panel/dashboard/bku/transaksi/form.tsx` (25.1KB) |
| **PM** | Setup koleksi `rekening_kas` dan `bku_transaksi` di PocketBase. Review arsitektur relasi antar tabel. | Backend PocketBase, code review |

---

### MINGGU 10 — Pindah Buku (Transfer Lintas Kas)

**Logbook Umum Tim:**
- Mengembangkan fitur Pindah Buku: memilih Rekening Sumber untuk mengirim saldo ke Rekening Tujuan (misal: tarik uang dari rekening bank ke laci kas tunai kelurahan).
- Mengimplementasikan validasi Running Balance: sistem memastikan saldo rekening sumber harus mencukupi sebelum transaksi pindah buku dieksekusi.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M1** | Membangun logika form Pindah Buku: dropdown Rekening Sumber → Rekening Tujuan, validasi tipe perpindahan (Tunai↔Bank, Bank↔Bank, dst). | `bku/transaksi/form.tsx` (diperluas, total 25.1KB) |
| **M1** | Mengimplementasikan validasi saldo real-time (Running Balance). Sistem menolak transaksi jika saldo sumber tidak mencukupi. | `bku/transaksi/form.tsx` (logika validasi) |
| **PM** | Review logika validasi saldo dan skenario edge-case transfer antar dompet. | Code review |

---

### MINGGU 11 — Sistem Kalkulasi Pajak BKU

**Logbook Umum Tim:**
- Menambahkan fitur opsional checkbox pajak pada form Transaksi Keluar. Jika diaktifkan, sistem menghitung otomatis PPN 11% atau persentase pajak manual yang diinput admin.
- Membangun sinkronisasi nominal pajak ke tabel `pajak_log` sebagai tagihan berstatus "Belum Disetor".

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M1** | Menambahkan checkbox dan kalkulasi otomatis PPN 11% / PPh manual pada form Transaksi Keluar. | `bku/transaksi/form.tsx` (field pajak terintegrasi) |
| **M1** | Membangun halaman Log Pencatatan Pajak: sinkronisasi data pajak dari transaksi, tampilan status "Belum Disetor" / "Sudah Disetor". | `app/(admin)/panel/dashboard/bku/pajak/page.tsx` (25.4KB) |
| **PM** | Review kalkulasi pajak dan sinkronisasi data ke `pajak_log`. | Code review, verifikasi hitung |

---

### MINGGU 12 — Pembayaran Pajak & Ekspor BKU

**Logbook Umum Tim:**
- Menyelesaikan fitur monitor pelunasan pajak: Admin dapat mengubah status tagihan menjadi "Sudah Disetor" disertai bukti slip setor/NTPN.
- Membangun fitur Ekspor XLSX Arus Kas Laporan: merangkum rumus (Kas Awal + Pemasukan - Pengeluaran - Pajak) menjadi file Excel Bulanan Buku Kas Umum siap cetak.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M1** | Menyelesaikan fitur pelunasan pajak: update status + upload bukti slip setor NTPN. | `bku/pajak/page.tsx` (diperluas) |
| **M1** | Membangun fitur ekspor laporan BKU ke format XLSX (Excel). Merangkum formula arus kas bulanan. | `bku/transaksi/page.tsx` (26.7KB), dependency `xlsx` |
| **PM** | UAT alur lengkap BKU dari input transaksi hingga ekspor laporan. Review formula arus kas. | End-to-end testing |

---

## BULAN 4: Inventarisasi Aset, Polishing & Peluncuran

### MINGGU 13 — Manajemen Aset Pemerintahan Desa

**Logbook Umum Tim:**
- Membangun modul pencatatan aset desa dengan arsitektur 2 collection terpisah: `inventaris_desa` (barang kantor) dan `tanah_desa` (tanah kas desa).
- Membangun fitur update kondisi/mutasi aset secara berkala (Baik → Rusak Ringan → Rusak Berat → Dihapus/Dilelang).

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M4** | Membangun modul CRUD Inventaris Desa: form input (Nama, Kategori, Tahun Perolehan, Kuantitas, Kondisi) dan tabel daftar inventaris. | `aset/inventaris/form.tsx` (17.4KB), `page.tsx` (17.9KB), `baru/`, `[id]/` |
| **M4** | Membangun modul CRUD Tanah Kas Desa: form input (Lokasi, Luas m², Peruntukan, Pemegang Hak) dan tabel daftar tanah. | `aset/tanah/form.tsx` (15KB), `page.tsx` (15.5KB), `baru/`, `[id]/` |
| **M4** | Mengimplementasikan fitur update kondisi/mutasi aset berkala di kedua sub-modul. | Form update kondisi di `inventaris/` dan `tanah/` |
| **PM** | Setup koleksi `inventaris_desa` dan `tanah_desa` di PocketBase. Review arsitektur 2-collection. | Backend PocketBase, code review |

---

### MINGGU 14 — Hook Cleanup Storage (Optimasi Backend)

**Logbook Umum Tim:**
- Membuat script trigger di PocketBase untuk cascade delete: memusnahkan file gambar nota/PDF dari storage server ketika row Transaksi Kas dihapus/dibatalkan oleh Admin.
- Membersihkan relasi file yatim piatu (orphaned files) pada modul Pengaduan dan Surat.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **PM** | Membuat PocketBase hooks/trigger untuk cascade delete file nota BKU saat transaksi dihapus. | Backend PocketBase hooks |
| **PM** | Membuat PocketBase hooks untuk cascade delete file attachment pengaduan dan surat saat record dihapus. | Backend PocketBase hooks |
| **M1** | Membantu verifikasi cascade delete pada modul BKU — memastikan nota/bukti terhapus bersih. | Testing modul BKU |
| **M2** | Membantu verifikasi cascade delete pada modul Surat dan Pengaduan. | Testing modul Surat |

---

### MINGGU 15 — UI/UX Master Polishing & Empty States

**Logbook Umum Tim:**
- Mengimplementasikan animasi loading Skeleton pada komponen-komponen yang membutuhkan fetching data dari PocketBase, mengurangi layout jumps (CLS).
- Menambahkan indikator Empty States dan Toast notifications (Sonner) di seluruh modul admin.
- Melakukan standarisasi UI admin ke palet Emerald Green yang konsisten di seluruh modul.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **M3** | Mengimplementasikan skeleton loading animations pada halaman publik (Home, Berita, Transparansi). | `components/home/`, `app/(public)/` |
| **PM** | Menstandarisasi seluruh admin panel ke desain Emerald Green. Menghilangkan sisa tema dark/slate-900 legacy. | `components/admin/`, seluruh `dashboard/` pages |
| **M3** | Menambahkan Empty State illustrations pada modul Pengaduan dan APBDes. | `dashboard/inquiries/`, `dashboard/apbdes/` |
| **ALL** | Integrasi sistem Toast (Sonner) untuk notifikasi Sukses/Error di seluruh form CRUD. | Seluruh file `form.tsx` |

---

### MINGGU 16 — E2E User Acceptance Testing & Deployment

**Logbook Umum Tim:**
- Melakukan simulasi end-to-end dari sudut pandang Bendahara Desa dan Kasi Kependudukan.
- Resolusi Lint/Build Warnings. Pengerucutan Production Build (`next build`) untuk final rilis ke Publik.
- Finalisasi konfigurasi deployment (Netlify/Vercel), SEO, dan security headers.

**Logbook Per-Anggota:**

| Anggota | Aktivitas Minggu Ini | File/Folder Terkait |
|---------|---------------------|---------------------|
| **PM** | Menjalankan `next build` dan menyelesaikan seluruh lint/build warnings. Mengonfigurasi deployment Netlify/Vercel. | `next.config.ts`, `netlify.toml`, `eslint.config.mjs` |
| **M1** | Simulasi UAT alur Bendahara: Input transaksi → Pindah Buku → Kalkulasi Pajak → Pelunasan → Ekspor XLSX. | Seluruh `bku/` |
| **M2** | Simulasi UAT alur Kependudukan: Input Mutasi → Buat Surat → Cetak PDF → Arsip Agenda. | Seluruh `mutasi/`, `surat/`, `penduduk/` |
| **M3** | Verifikasi seluruh halaman publik: Home, Berita, Transparansi, Layanan, Pengaduan. Memastikan responsif di mobile. | Seluruh `app/(public)/` |
| **M4** | Verifikasi modul Aset: CRUD Inventaris, CRUD Tanah, update kondisi. | Seluruh `aset/` |
| **PM** | Finalisasi SEO (robots.ts, sitemap.ts), security CSP headers, dan konfigurasi subdomain cp.* | `app/robots.ts`, `app/sitemap.ts`, `middleware.ts` |

---
---
---

# BAGIAN C — LOGBOOK INDIVIDUAL: PROJECT MANAGER (PM)

> **Nama:** [ISI_NAMA_PM]
> **NIM:** [ISI_NIM]
> **Peran:** Project Manager & Infrastructure

| Minggu | Judul | Aktivitas | Hasil |
|--------|-------|-----------|-------|
| 1 | Pembersihan Legacy | Menghapus seluruh folder/rute modul Produk BMT NU. Mengatur ulang sidebar admin. Setup repositori dan branch strategy. | Folder `components/products/` dihapus bersih. Branch `main`, `modul-bku`, `modul-persuratan`, `modul-publik`, `modul-aset` dibuat. |
| 2 | Portal Informasi | Review hasil reuse komponen Social Wall dan Berita. Merge branch. | Naming convention konsisten. Kode M2 dan M3 di-merge ke main. |
| 3 | APBDes | Review integrasi data APBDes. Code review PR dari M1 dan M3. | Alur admin → grafik publik berjalan benar. PR di-approve. |
| 4 | Pengaduan | Review alur end-to-end pengaduan. Merge branch modul-publik. | Alur publik submit → admin terima → ubah status berjalan tanpa error. |
| 5 | Mutasi Lahir/Mati | Verifikasi skema database mutasi. Review form dari M2. | Koleksi `mutasi_penduduk` terkonfigurasi benar. Form Lahir/Mati di-approve. |
| 6 | Mutasi Datang/Pergi | Review filter dan conditional form. | Logika conditional dan filter Chip berjalan sesuai spesifikasi. |
| 7 | Persuratan | Review sistem penomoran otomatis agenda surat. Merge branch. | Penomoran auto-increment berjalan benar. |
| 8 | Generator PDF | Review output PDF surat. Verifikasi Surat Pintar. | Generator PDF menghasilkan dokumen layak cetak. |
| 9 | Kas Dasar BKU | Setup koleksi `rekening_kas` dan `bku_transaksi`. Review arsitektur. | Skema database keuangan siap. Relasi tervalidasi. |
| 10 | Pindah Buku | Review logika validasi saldo dan skenario edge-case. | Semua skenario transfer lolos edge-case. |
| 11 | Kalkulasi Pajak | Review kalkulasi pajak dan sinkronisasi data. | Perhitungan PPN 11% akurat, sinkron ke `pajak_log`. |
| 12 | Ekspor BKU | UAT alur lengkap BKU. Review formula arus kas. | End-to-end berhasil tanpa error. Formula benar. |
| 13 | Manajemen Aset | Setup koleksi `inventaris_desa` dan `tanah_desa`. Review arsitektur 2-collection. | 2 collection terpisah berhasil dikonfigurasi. |
| 14 | Cleanup Storage | Membuat PocketBase hooks cascade delete nota BKU, file pengaduan & surat. | File orphaned berhasil dibersihkan otomatis. |
| 15 | UI Polishing | Standarisasi admin panel ke Emerald Green. Integrasi Toast (Sonner). | Tema legacy dihilangkan. Notifikasi konsisten. |
| 16 | UAT & Deployment | `next build` tanpa warnings. Konfigurasi deployment. Finalisasi SEO, security. | Production build siap. `robots.ts`, `sitemap.ts`, `middleware.ts` final. |

---
---
---

# BAGIAN D — LOGBOOK INDIVIDUAL: MEMBER 1 (Modul BKU & Pajak)

> **Nama:** [ISI_NAMA]
> **NIM:** [ISI_NIM]
> **Peran:** Fullstack Developer — Modul Keuangan

| Minggu | Judul | Aktivitas | Hasil |
|--------|-------|-----------|-------|
| 1 | Pembersihan Legacy | Studi arsitektur modul BKU. Membantu PM pembersihan boilerplate. | Alur keuangan desa dan skema pajak dipelajari. |
| 2 | Portal Informasi | Persiapan referensi sistem akuntansi desa. | Format BKU resmi dan aturan PPN/PPh dipelajari. |
| 3 | APBDes | Konfigurasi koleksi `apbdes_realisasi`. Membangun form input APBDes admin. | `apbdes/form.tsx` (12KB), `page.tsx` (11.8KB) selesai. |
| 4 | Pengaduan | Persiapan desain arsitektur tabel keuangan BKU. | Relasi `rekening_kas`, `bku_transaksi`, `pajak_log` dirancang. |
| 5–8 | Support Persuratan | Studi lanjutan skema transaksi BKU. Support review member lain. | Desain database keuangan difinalisasi. Testing modul mutasi/surat. |
| 9 | Kas Dasar BKU | Membangun CRUD Master Rekening. Membangun form transaksi Kas Masuk & Keluar. | `bku/rekening/form.tsx` (21.8KB), `bku/transaksi/form.tsx` (25.1KB) selesai. |
| 10 | Pindah Buku | Membangun logika Pindah Buku. Implementasi validasi saldo real-time. | Running Balance menolak jika saldo kurang. |
| 11 | Kalkulasi Pajak | Kalkulasi otomatis PPN 11% / PPh manual. Membangun Log Pencatatan Pajak. | `bku/pajak/page.tsx` (25.4KB) selesai. |
| 12 | Ekspor BKU | Fitur pelunasan pajak. Fitur ekspor XLSX laporan BKU. | `bku/transaksi/page.tsx` (26.7KB) selesai. Ekspor Excel berfungsi. |
| 13 | Manajemen Aset | Support testing modul Aset (M4). | Verifikasi integrasi data aset. |
| 14 | Cleanup Storage | Verifikasi cascade delete pada modul BKU. | Nota/bukti terhapus otomatis saat record BKU dihapus. |
| 15 | Polishing UI | Integrasi Toast (Sonner) pada seluruh form BKU. | Notifikasi konsisten di form transaksi, rekening, pajak. |
| 16 | UAT & Deployment | Simulasi UAT Bendahara. | Alur Input → Pindah Buku → Pajak → Pelunasan → Ekspor XLSX tanpa error. |

---
---
---

# BAGIAN E — LOGBOOK INDIVIDUAL: MEMBER 2 (Modul Persuratan & Kependudukan)

> **Nama:** [ISI_NAMA]
> **NIM:** [ISI_NIM]
> **Peran:** Fullstack Developer — Modul Persuratan & Data Warga

| Minggu | Judul | Aktivitas | Hasil |
|--------|-------|-----------|-------|
| 1 | Pembersihan Legacy | Konfigurasi skema `profil_desa` dan `perangkat_desa`. Membangun halaman admin. | `profil/page.tsx` (8.6KB), `perangkat-desa/page.tsx` selesai. Akses publik read-only. |
| 2 | Portal Informasi | Rename "News" → "Berita Desa". Membangun CRUD Berita admin. | `berita/form.tsx` (25.4KB), `page.tsx` (14.4KB) selesai. TipTap terintegrasi. |
| 3 | APBDes | Support review integrasi APBDes. | Verifikasi alur data selesai. |
| 4 | Pengaduan | Persiapan desain skema kependudukan dan persuratan. | Tabel `mutasi_penduduk` dan `surat_keluar` dirancang. |
| 5 | Mutasi Lahir/Mati | Membuat skema `mutasi_penduduk`. Membangun form mutasi Lahir/Mati. Membangun tabel register. | `mutasi/form.tsx` (20.5KB), `page.tsx` (15.7KB) selesai. |
| 6 | Mutasi Datang/Pergi | Logika conditional Datang/Pergi. Upload attachment surat pindah. Filter Chip/Dropdown. | Form 4 jenis mutasi. Filter fungsional. |
| 7 | Persuratan & Agenda | Halaman publik katalog syarat surat. Buku Agenda Surat Keluar admin. | `surat/page.tsx` (15.5KB), `form.tsx` (15.2KB) selesai. Penomoran otomatis. |
| 8 | Generator PDF | PDF Template Renderer. Fitur "Surat Pintar". | `surat/pintar/page.tsx` (26KB) selesai. PDF via jsPDF. |
| 9–12 | Support BKU | Penyempurnaan persuratan. Membangun modul master Data Penduduk. Support BKU. | `penduduk/form.tsx` (25.4KB), `page.tsx` (12.1KB) selesai. |
| 13 | Manajemen Aset | Support review modul Aset (M4). | Verifikasi integrasi. |
| 14 | Cleanup Storage | Verifikasi cascade delete pada Surat dan Pengaduan. | File orphaned terhapus otomatis. |
| 15 | Polishing UI | Integrasi Toast pada form persuratan dan mutasi. | Notifikasi konsisten. |
| 16 | UAT & Deployment | Simulasi UAT Kasi Kependudukan. | Alur Mutasi → Surat → Cetak PDF → Arsip tanpa error. |

---
---
---

# BAGIAN F — LOGBOOK INDIVIDUAL: MEMBER 3 (Modul Portal Publik & Pengaduan)

> **Nama:** [ISI_NAMA]
> **NIM:** [ISI_NIM]
> **Peran:** Fullstack Developer — Modul Portal Publik & Pengaduan Warga

| Minggu | Judul | Aktivitas | Hasil |
|--------|-------|-----------|-------|
| 1 | Rebranding | Menyesuaikan Navbar & Footer publik. Menyesuaikan Hero Banner ke tema desa. | Logo, warna, teks diganti ke SID Sumberanyar. |
| 2 | Portal Informasi | Penyesuaian Social Wall. Halaman grid berita publik. Layanan Desa → syarat surat. | `(public)/berita/page.tsx` (9.9KB), `(public)/layanan/page.tsx` (12.1KB) selesai. |
| 3 | APBDes | Membangun halaman visualisasi grafik APBDes publik. | `(public)/v3/page.tsx` (37.6KB) selesai. Recharts terintegrasi. |
| 4 | Pengaduan | Form pengaduan mandiri publik. Modifikasi sidebar admin. | `(public)/pengaduan/page.tsx` (10.1KB), `inquiries/page.tsx` (11.9KB) selesai. |
| 5–8 | Support Persuratan | Penyempurnaan halaman publik. Membangun Tentang Kami, Kontak, Legal. Support testing. | `(public)/tentang-kami/`, `(public)/kontak/`, `(public)/legal/` selesai. |
| 9–12 | Support BKU | Penyempurnaan portal publik lanjutan. Membangun Pelayanan Publik baru. Pencarian Global. | `(public)/pelayanan/` (5 subdirektori), `app/pencarian/` selesai. |
| 13 | Manajemen Aset | Support review modul Aset (M4). | Verifikasi tampilan. |
| 14 | Cleanup Storage | Support testing cascade delete. | Verifikasi dari sisi publik. |
| 15 | Polishing UI | Skeleton loading halaman publik. Empty State illustrations. | Home, Berita, Transparansi mendapat animasi loading smooth. |
| 16 | UAT & Deployment | Verifikasi seluruh halaman publik. Testing navigasi dan link. | Semua responsif di mobile. Link berfungsi benar. |

---
---
---

# BAGIAN G — LOGBOOK INDIVIDUAL: MEMBER 4 (Modul Manajemen Aset)

> **Nama:** [ISI_NAMA]
> **NIM:** [ISI_NIM]
> **Peran:** Fullstack Developer — Modul Manajemen Aset

| Minggu | Judul | Aktivitas | Hasil |
|--------|-------|-----------|-------|
| 1 | Pembersihan Legacy | Membantu rebranding UI minor. Mempelajari referensi inventaris desa. | Format pencatatan aset pemerintahan dipelajari. |
| 2 | Portal Informasi | Studi referensi manajemen aset desa. | Jenis aset (Inventaris vs Tanah Kas) dan skemanya dipelajari. |
| 3 | APBDes | Support review modul APBDes. | Testing form input dan grafik. |
| 4 | Pengaduan | Support testing alur pengaduan. | Verifikasi end-to-end publik → admin. |
| 5–8 | Support Persuratan | Persiapan arsitektur modul Aset. Support testing modul M2. | Skema 2 collection: `inventaris_desa` dan `tanah_desa` dirancang. |
| 9–12 | Support BKU | Finalisasi desain database aset. Support testing modul BKU. | Skema siap implementasi. |
| 13 | Manajemen Aset | CRUD Inventaris Desa. CRUD Tanah Kas Desa. Update kondisi/mutasi aset. | `aset/inventaris/form.tsx` (17.4KB), `page.tsx` (17.9KB), `aset/tanah/form.tsx` (15KB), `page.tsx` (15.5KB) selesai. |
| 14 | Cleanup Storage | Testing cascade delete pada modul Aset. | Data terkait terhapus bersih. |
| 15 | Polishing UI | Integrasi Toast pada form Inventaris dan Tanah. Penyesuaian UI Emerald Green. | Notifikasi konsisten. Tampilan seragam. |
| 16 | UAT & Deployment | Verifikasi modul Aset. Testing responsif mobile. | CRUD Inventaris, Tanah, update kondisi — semua berjalan tanpa error. |

---
---
---

# LAMPIRAN — FITUR BONUS, STATISTIK, & TEKNOLOGI

## Fitur Bonus (Di Luar Roadmap Asli)

| No | Fitur Bonus | File/Folder | Ukuran | Keterangan |
|----|-------------|-------------|--------|------------|
| 1 | **Penerima Bansos** | `dashboard/bansos/` | form 15.5KB, page 15.3KB | Modul baru lengkap |
| 2 | **PBB (Pajak Bumi & Bangunan)** | `dashboard/pbb/` | form 17.8KB, page 21.8KB | Modul baru lengkap |
| 3 | **Demografi** | `dashboard/demografi/page.tsx` | 17KB | Dashboard statistik |
| 4 | **Surat Online** | `dashboard/surat-online/` | 11.5KB | Interaksi publik-admin |
| 5 | **Pelayanan Publik Lanjutan** | `(public)/pelayanan/` | 5 subdirektori | Portal layanan baru |
| 6 | **Pencarian Global** | `app/pencarian/` | — | Fitur utilitas |
| 7 | **CDN Endpoint** | `app/cdn/` | — | Optimasi performa |
| 8 | **Legal Page** | `(public)/legal/` | — | Kepatuhan legal |
| 9 | **Dashboard Analitik** | `components/admin/analytics-stats.tsx` | 22.4KB | Komponen dashboard |
| 10 | **Data Penduduk Master** | `dashboard/penduduk/` | form 25.4KB, page 12.1KB | Modul data master |

## Statistik File Terbesar

| # | File | Ukuran | Modul | PJ |
|---|------|--------|-------|-----|
| 1 | `(public)/v3/page.tsx` | 37.6 KB | Transparansi Publik | M3 |
| 2 | `bku/transaksi/page.tsx` | 26.8 KB | Tabel Transaksi BKU | M1 |
| 3 | `surat/pintar/page.tsx` | 26.0 KB | Generator Surat Pintar | M2 |
| 4 | `berita/form.tsx` | 25.4 KB | Form Editor Berita | M2/M3 |
| 5 | `bku/transaksi/form.tsx` | 25.2 KB | Form Input Transaksi | M1 |
| 6 | `bku/pajak/page.tsx` | 25.4 KB | Modul Pajak BKU | M1 |
| 7 | `penduduk/form.tsx` | 25.4 KB | Form Data Penduduk | M2 |
| 8 | `analytics-stats.tsx` | 22.4 KB | Dashboard Analitik | PM |
| 9 | `bku/rekening/form.tsx` | 21.8 KB | Form Rekening Desa | M1 |
| 10 | `pbb/page.tsx` | 21.9 KB | Pajak Bumi Bangunan | M1/BONUS |

## Teknologi yang Digunakan

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| Framework | Next.js (App Router) | 16.1.6 |
| Frontend | React | 19.2.3 |
| Bahasa | TypeScript | 5 |
| Styling | Tailwind CSS | 3.4.17 |
| Komponen UI | Radix UI, shadcn/ui | — |
| Rich-Text Editor | TipTap | — |
| Backend/Database | PocketBase | — |
| Validasi Form | React Hook Form + Zod | — |
| Grafik/Chart | Recharts | — |
| Animasi | Framer Motion | — |
| PDF Generator | jsPDF, jspdf-autotable | — |
| Ekspor Excel | xlsx (SheetJS) | — |
| Notifikasi | Sonner | — |
| Icon | Lucide React | — |
| Testing | Jest + Testing Library | — |

---

*Dokumen ini adalah sumber kebenaran (Source of Truth) tunggal. Seluruh data diambil dari analisis struktur direktori codebase dan dokumen perencanaan resmi proyek.*
*Tanggal pembuatan: 21 April 2026*
