# LOGBOOK MINGGUAN UMUM — Tim SID Sumberanyar

> **Proyek:** Sistem Informasi Desa (SID) Sumberanyar
> **Periode:** 16 Minggu (4 Bulan)
> **Anggota Tim:** PM (Project Manager), Member 1, Member 2, Member 3, Member 4

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
