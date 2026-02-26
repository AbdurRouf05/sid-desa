# Master Roadmap: Sistem Informasi Desa (SID) Sumberanyar

Dokumen ini adalah **Roadmap Utama (Master Roadmap)** untuk pengembangan SID Sumberanyar secara mendetail. Jadwal pelaksanaan dibagi menjadi hitungan bulan, di mana **1 Bulan terdiri dari 4 Minggu (4 Sprint)**. Setiap minggu merincikan urutan pengerjaan (Backend vs Frontend) beserta integrasi rencana _Reuse/Cleanup_ _Boilerplate_.

---

## ⚠️ Peraturan Ketat Pengembangan (Developer Rules)

- [ ] **1. Cek Dokumen Secara Berkala**: Selalu baca ulang dokumen sebelum memulai minggu baru agar tidak kehilangan konteks _business logic_.
- [ ] **2. Batas Baris Kode (Max 150 Lines)**: File komponen/halaman **TIDAK BOLEH** melebihi 150 baris kode.
- [ ] **3. Tanyakan Sebelum Mengubah Boilerplate**: Jangan merusak logika auth atau CSS global tanpa bertanya.

---

## 📅 BULAN 1: Eksekusi Boilerplate, Portal Publik, & Transparansi APBDes

Bulan pertama berfokus pembersihan sisa _legacy_, pembangunan wajah Publik, serta landasan transparansi pemerintahan.

### Minggu 1: Pembersihan Legacy (Cleanup) & Fondasi Rebranding

**Target**: Membuang fitur BMT NU yang tidak berguna dan mentransisikan identitas ke SID Sumberanyar.

- [x] **[BE/FE] Penghapusan Modul "Produk"**:
  - `rm -rf` (Hapus total) rute Publik dan Admin yang berkaitan dengan _E-Commerce/Products_ sisa BMT NU. Termasuk dari Sidebar Admin.
- [x] **[BE] Konfigurasi Profil Desa & Perangkat**:
  - Memastikan koleksi `profil_desa` (Single table) dan `perangkat_desa` dapat diakses publik (_read-only_).
- [x] **[FE] Rebranding & Repurpose Hero Banners**:
  - _Reuse_ komponen Navbar & Footer. Ubah logo "BMT NU" menjadi logo "SID Sumberanyar" (Desa Teal & Soil Orange).
  - _Keep_ fitur **Hero Banners** di Dashboard untuk admin mengelola _Slideshow_ Foto Beranda Publik secara _dynamic_.
- [x] **[FE] Repurpose Menu Wilayah Dusun**:
  - Mengubah fungsi Halaman Administrator "Wilayah Dusun" menjadi Papan Manajemen **Struktur Organisasi (Perangkat Desa)** atau **Statistik Demografi Warga**.

### Minggu 2: Portal Informasi Warga (Reuse Berita & Social Wall)

**Target**: Menerapkan modul penerbitan artikel desa secara dinamis dengan me-_reuse_ struktur _boilerplate_.

- [x] **[FE] Daur Ulang Social Wall (Reuse)**:
  - _Reuse_ 100% komponen _Magic Fetch Social Feeds_ tanpa mengubah logika, cukup sesuaikan palet warna UI ke tema Desa.
- [x] **[BE/FE] Daur Ulang Modul News -> Berita Desa (Reuse)**:
  - Ganti nama skema/rute dari "News" ke "Berita Desa".
  - Manfaatkan _Rich-Text editor_ bawaan boilerplate untuk CRUD Pengumuman.
- [x] **[FE] Daur Ulang Modul Layanan Desa -> SOP Layanan Surat (Reuse)**:
  - Ubah fungsi halaman "Layanan Desa" (yang aslinya layanan perbankan) menjadi papan informasi syarat-syarat pembuatan KTP, SKTM, dll untuk warga.
- [x] **[FE] Direktori Kabar Desa (Publik)**:
  - Membuat halaman _Grid_ berita terbaru untuk pengunjung publik.

### Minggu 3: Dashboard Transparansi APBDes

**Target**: Mewujudkan azas keterbukaan dana desa secara inklusif kepada publik.

- [x] **[BE] Konfigurasi Koleksi APBDes**:
  - Memastikan koleksi `apbdes_realisasi` siap menampung kriteria Pendapatan, Belanja, dan Pembiayaan.
- [x] **[FE] Input Kinerja APBDes (Admin)**:
  - Formulir di Panel Admin untuk memasukkan data master APBDes (Anggaran vs Realisasi per kategori operasional).
- [x] **[FE] Visualisasi Grafik APBDes (Publik)**:
  - Menampilkan Dashboard Infografis (`recharts`) yang memvisualisasikan data `apbdes_realisasi` (Target vs Realisasi).

### Minggu 4: Interaksi Komunitas (Layanan Pengaduan Mandiri)

**Target**: Sistem komunikasi dua arah pemerintah dengan masyarakat lewat pengaduan online.

- [x] **[FE] Form Laporan (Publik)**:
  - Front-End Publik form (Nama, Alamat, Kronologi aduan) untuk melempar data aduan ke Backend secara _Anonymous/Public_.
- [x] **[FE] Manajemen Pengaduan (Repurpose Pesan Masuk)**:
  - Mengubah nama Menu Sidebar Admin **"Pesan Masuk"** menjadi **"Pengaduan Warga"**.
  - Menyambungkan tabel UI _inbox_ tersebut agar terkoneksi ke koleksi `pengaduan_warga` (_Default:_ "Baru", "Proses", "Selesai").

---

## Bulan 2: Administrasi Mutasi Kependudukan & Layanan Surat

_(Fokus: Integrasi Layanan Backend Mandiri yang terfokus pada output Administrasi)_

### Minggu 1: Buku Mutasi Penduduk (Lahir & Mati)

**Target**: Peralihan dari Master NIK ke pencatatan mutasi dinamis bulanan.

- [x] **[BE] Revisi Skema Database (Mutasi)**:
  - Membuat/memastikan skema `mutasi_penduduk` ada (`nik`, `nama_lengkap`, `jenis_mutasi` [Lahir/Mati/Datang/Pergi], `tanggal_mutasi`, dsb).
- [x] **[FE] Form Input Mutasi (Lahir/Mati)**:
  - Membangun antarmuka form bagi perangkat desa untuk merekam warga yang meninggal atau bayi baru lahir (tanpa NIK).
- [x] **[FE] Tabel Register Kematian/Kelahiran**:
  - Halaman Dasbor list mutasi, menampilkan riwayat data penduduk masuk/keluar secara kronologis. warga.

### Minggu 2: Buku Mutasi Penduduk (Datang & Pergi)

**Target**: Memastikan warga yang melakukan perpindahan domisili dapat terekam.

- [x] **[FE] Form Input Mutasi Dinamis (Datang/Pergi)**:
  - Melanjutkan form Bulan 2 Minggu 1, menambahkan logika _conditional_ form.
  - Untuk warga pindahan, Admin dapat menarik _Attachment_ seperti Surat Pengantar Pindah/SKPWNI.
- [x] **[FE] Laporan Filter**:
  - Penambahan visual filter (Chip/Dropdown) pada panel register agar list hanya memunculkan warga berstatus "Datang" atau "Pergi" dsb.Mutasi Bulan X". Sistem merangkum total Lahir, Mati, Datang, Pergi ke dalam template Excel `.xlsx` yang formatnya disesuaikan untuk diserahkan ke Dispendukcapil kecamatan.

### Minggu 3: Layanan Persuratan Manual & Buku Agenda

**Target**: Pembuatan SKTM, Surat Pengantar, dan Domisili secara administratif.

- [x] **[FE] Katalog Syarat Pencetakan (Publik)**:
  - Halaman statis informasi syarat dokumen untuk warga sebelum ke balai desa.
- [x] **[FE] Buku Agenda Surat (Admin)**:
  - Karena tidak ada data NIK Master, Admin memasukkan Nama, NIK, Keperluan, dan Alamat pemohon secara manual ke dalam sistem draf surat. Disimpan dalam _Log Buku Agenda Surat Keluar_ berpenomoran otomatis.

### Minggu 4: Generator Cetak PDF Persuratan

**Target**: Dokumen blangko dinas siap cetak _on-browser_.

- [x] **[FE] PDF Template Renderer**:
  - Mengawinkan data input Admin (Minggu 3) ke dalam template kanvas statis HTML/PDF.
  - Menghasilkan file `.pdf` siap cetak untuk disahkan oleh Kepala Desa. Dokumen disimpan ke sitem (Arsip).

---

## 📅 BULAN 3: Sistem Akuntansi Desa / Buku Kas Umum (BKU)

Mulai membangun gerbang pengarsipan Arus Keluar & Masuk APBDes Internal (Pembukuan) dengan kapabilitas pencatatan pajak.

### Minggu 1: Relasional Kas Dasar BKU

**Target**: Mempersiapkan Dompet Penyetoran dan transaksi standar uang keluar dan masuk ber-nota.

- [x] **[FE] Master Dompet Rekening Desa**:
  - Admin mengatur pembuatan Dompet "Tunai Desa", dan "Bank Desa" (CRUD tipe `Tunai/Bank`).
- [x] **[FE] Transaksi Kas Masuk & Kas Keluar**:
  - Transaksi nominal, pilihan dompet bank, kategori pengeluaran, serta bukti unggah nota/struk pengeluaran fisik.

### Minggu 2: Pindah Buku (Transfer Lintas Kas)

**Target**: Mengukuhkan transaksi ganda antar dompet Desa demi rekonsiliasi total buku kas akuntansi yang sah.

- [x] **[FE] Validasi Form Pindah Buku**:
  - Memilih Rekening Sumber A mengirim saldo ke Rekening Tujuan B (Tarik uang bank ke laci tunai kelurahan).
- [x] **[FE] Limitasi Validasi Saldo**:
  - Validasi _Running balance_ (Saldo Rekening Sumber harus CUKUP saat memindahbukukan uang).

### Minggu 3: Sistem Sub-Tabel Kalkulasi Pajak BKU

**Target**: Pengeluaran operasional mencatatkan potongan PPN/PPh ke dalam Buku Pajak.

- [x] **[FE] Penghitungan Otomatis PPN/PPh BKU**:
  - Opsional _Checkbox_ Pajak di Transaksi Keluar. Jika diklik, sistem me-kalkulasi 11% PPN atau persentase Manual.
- [x] **[BE/FE] Log Pencatatan Tagihan Pajak**:
  - Sinkronisasi nominal pajak ke `pajak_log` sebagai tagihan "Belum Disetor".

### Minggu 4: Pembayaran Pajak & Ekspor BKU

**Target**: Melunasi utang pajak dan mengekspor buku kas.

- [ ] **[FE] Pelunasan Pajak**:
  - Monitor tagihan pajak. Admin mengubah status menjadi "Sudah Disetor" disertai bukti slip setor/NTPN.
- [ ] **[FE] Ekspor XLSX Arus Kas Laporan (End-of-Month)**:
  - Merangkum rumus (Kas Awal + Pemasukan - Pengeluaran - Pajak) menjadi Excel Bulanan Buku Kas Umum siap cetak.

---

## 📅 BULAN 4: Inventarisasi Aset, Polishing Terpadu & Peluncuran Rilis

Merampingkan sisa modul pelengkap, membersihkan beban basis data, lalu Go-Live.

### Minggu 1: Manajemen Aset Pemerintahan Desa

**Target**: Membuat catatan administrasi barang inventaris meja, PC, dan kapling tanah secara hierarkis.

- [x] **[FE] Modul Daftarkan Aset**:
  - Mencatat aset Tanah, Bangunan, dan Inventaris Kantor beserta Luas/Kuantitas.
- [x] **[FE] Manajemen Kondisi Mutasi Aset**:
  - _Update Status_ aset secara berkala (Semula "Baik", dua tahun kemudian dirubah ke "Rusak Berat" atau "Di-Hapus/Lelang").

### Minggu 2: Hook Cleanup Storage (Optimasi Backend)

**Target**: Membersihkan file yatim piatu di Pocketbase demi menghemat hard-disk _server_.

- [ ] **[BE] Skenario Cascade Delete Dokumen Nota BKU**:
  - Script Trigger di PB: Memusnahkan file _image receipt_/PDF dari _storage server_ manakala Row Transaksi Kas tersebut dibatalkan/dihapus Admin.
- [ ] **[BE] Skenario Cascade File Pengaduan & Surat**:
  - Membersihkan relasi file yang ditinggal mati oleh catatan agenda.

### Minggu 3: UI/UX Master Polishing & Empty States

**Target**: Memberikan pengalaman interaksi pengguna yang premium.

- [ ] **[FE] Animasi Loading (_Skeletons_)**:
  - Mengurangi layout _jumps_ (CLS) saat data menunggu _fetching_ dari Pocketbase.
- [ ] **[FE] Indikator _Empty States_ & Notifikasi**:
  - Blok Ilustrasi Data Kosong jika APBDes/Pengaduan Masih Nol. Sistem Toast (_Sukses/Error_) yang andal.

### Minggu 4: E2E User Acceptance Testing & Deployment

**Target**: Menguji aplikasi dari sudut pandang warga hingga bendahara, tanpa _bugs_.

- [ ] **[Testing] Simulasi Peran Bendahara & Kependudukan**:
  - Uji alur pembuatan Surat berkelanjutan, perhitungan pajak BKU hingga mutasi penduduk tanpa _error crashing_.
- [ ] **[Infrastruktur] Optimalisasi Lingkungan Build**:
  - Resolusi _Lint/Build Warnings_. Pengerucutan _Production Build_ (`next build`) tanpa _Console logs_ untuk final rilis ke Publik.
