# Dokumen Rencana _Reuse_ dan Pembersihan (Audit Boilerplate)

Dokumen ini merupakan hasil analisis mendalam terhadap posisi _Codebase_ kita saat ini (Berdasarkan `DIAGRAM_BOILERPLATE.md`, `DIAGRAM_APLIKASI.md`, dan `MASTER_ROADMAP.md`). Tujuannya adalah memetakan fitur mana yang akan didaur ulang (_Reuse_), fitur mana yang merupakan kewajiban (_Mandatory_), fitur opsional, dan fitur usang sisa dari identitas lama (BMT NU) yang **wajib dimusnahkan**.

---

## 1. Audit Struktur Folder: Sisa Masa Lalu (_Legacy_ BMT NU)

Dari penelusuran struktur folder asli di `app/(public)`, `app/(admin)`, dan `components/`, ditemukan banyak direktori yang secara logika bisnis **tidak relevan** dengan Sistem Informasi Desa.

### 🛑 Fitur Usang (Harus Dibersihkan / Di-_Delete_)

Fitur-fitur ini menghabiskan ruang _bundle_ dan berpotensi membuat peramban berat. Tidak ada entitas "Produk Koperasi" di dalam manajemen balai desa.

- **Folder `app/(public)/produk`**: Rute publik untuk menampilkan etalase produk tidak berguna bagi desa.
- **Folder `components/products`**: Berisi kartu UI, tabel keranjang, atau detail produk. (Bisa langsung di-_delete_ seluruh folder).
- **Folder `app/(admin)/.../products` (Jika Ada)**: Manajemen stok barang jualan (koperasi BMT) sama sekali tidak dipakai di BKU Desa.

**Tindakan Eksekusi**: "Hapus rute halaman dan komponen terkait _Products_ di tahap selanjutnya sebelum mengembangkan fitur Master Data."

---

## 2. Fitur _Boilerplate_ yang Akan Di-_Reuse_ (Didaur Ulang)

Alih-alih membuat dari nol, beberapa modul bawaan _boilerplate_ ini sudah memiliki pondasi kuat yang bisa langsung dialihfungsikan (_Repurpose_) untuk SID Sumberanyar.

### ♻️ C.R.U.D Berita -> Modul Informasi Publik

- **Asal Kode**: `app/(admin)/.../news` dan `app/(public)/berita`.
- **Rencana _Reuse_**:
  1.  Tabel Admin untuk mengelola _News_ (BMT NU) sangat pas untuk dijadikan **Berita Desa & Pengumuman**.
  2.  _Rich-Text Editor_ dan Image Upload (_Thumbnail_) yang sudah ada di dalamnya tetap dipakai utuh.
  3.  Kita hanya perlu menyambungkannya ke tabel `berita_desa` di PocketBase (bukan `news` lama).

### ♻️ Komponen Konfigurasi Profil (_Site Settings_)

- **Asal Kode**: Pengaturan `profil_desa` (Logo, Nama, Kontak).
- **Rencana _Reuse_**: Komponen statis Header/Navbar dan Footer yang me-render alamat, Telp, dan Email tidak akan dibongkar. Kita tetap me-_reuse_ pola _Server-Side Fetch_ dari tabel `profil_desa` milik Pocketbase. Menguntungkan karena kita tidak lelah membuat komponen Global Layouts.

### ♻️ _Magic Fetch_ Social Wall

- **Asal Kode**: `components/home/SocialWall` dan pengaturannya di Dashboard Admin.
- **Rencana _Reuse_**: SID Sumberanyar tetap sangat butuh menampilkan _Feed_ Instagram Balai Desa secara interaktif. Modul ini dipertahankan **100%** tanpa bongkar besar, hanya menyesuaikan palet warna Desa Teal.

## 2.B. Audit Sidbar Admin (_Legacy_ BMT NU)

Berdasarkan pengecekan pada panel Admin saat ini (Menu Kiri), berikut adalah klasifikasi nasib fitur-fitur bawaan tersebut:

### 🛑 Fitur Usang (Wajib Hapus)

1. **Produk & Layanan (Koperasi/Toko)**:
   - **Nasib**: Hapus / _Delete_.
   - **Alasan**: Sistem Pemerintahan Desa tidak berjualan "Produk" keranjang belanja. Etalase jualan BMT NU ini tidak bermanfaat dan akan kita obrak-abrik.

### ♻️ Fitur Daur Ulang Mandatori (_Repurpose_)

1. **Berita & Artikel**:
   - **Nasib**: _Reuse_ & Pindah Nama.
   - **Alasan**: Sangat berguna untuk diubah menjadi pusat **Berita & Pengumuman Desa**.

2. **Layanan Desa (Menu Layanan)**:
   - **Nasib**: _Reuse_ sebagai **SOP Cetak Surat**.
   - **Alasan**: Modul ini aslinya memajang jenis "Layanan Perbankan". Kita bisa mengakali komponen UI-nya untuk memajang **"Syarat Layanan Persuratan Kelurahan"** (Misal: Syarat Bikin SKTM, Syarat Bikin KTP) agar dibaca publik.

3. **Wilayah Dusun (Menu Wilayah)**:
   - **Nasib**: _Reuse_ sebagai **Manajemen Perangkat Desa** atau **Statistik Kependudukan**.
   - **Alasan**: UI yang menampilkan daftar area bisa kita bongkar sedikit untuk menampilkan Susunan Organisasi (Kepala Dusun A, Kepala Dusun B) atau menampilkan data sebaran Warga per RT/RW.

### ✨ Fitur Penunjang / Opsional (_Nice-to-Have_)

1. **Hero Banners**:
   - **Nasib**: _Keep_ (Pertahankan).
   - **Alasan**: Sangat, sangat berguna untuk mempercantik beranda _Website_ desa. Kepala Desa biasanya suka memasang Foto Spanduk besar penyambutan (Bulan Kemerdekaan, Idul Fitri) di halaman depan. Modul ini memungkinkan Admin mengganti-ganti gambar Banner tanpa repot modifikasi kode Next.js.

2. **Pesan Masuk**:
   - **Nasib**: _Keep_ & _Rename_ menjadi **Kotak Pengaduan Warga**.
   - **Alasan**: Form pesan masuk umum ini akan ditransformasi seratus persen menjadi tabel penerimaan aspirasi dan komplain warga (Sesuai Diagram Aplikasi kita).

---

## 3. Kebutuhan Wajib Desa (_Mandatory New Features_)

Menurut `DIAGRAM_APLIKASI.md`, fitur-fitur di bawah ini belum ada di _boilerplate_ sama sekali dan **harus dibangun dari nol**. Fitur ini adalah ruh dari aplikasi SID.

1.  **Sistem Kependudukan (_Single Source of Truth_ NIK)**:
    - Halaman input NIK, Tempat/Tanggal Lahir, Agama, Pekerjaan (Admin).
    - _Widget_ Publik untuk "Pencarian/Validasi NIK Mandiri" di beranda `app/(public)/home`.
2.  **Sistem Administrasi BKU (Buku Kas Umum)**:
    - Komponen Kalkulasi Matematika kompleks BKU. Mencakup relasi _pindah-buku_, saldo berjalan, dan ceklis porsi pajak PPN/PPh manual.
3.  **Layanan Persuratan Otomatis (_PDF Generators_)**:
    - Sistem penarikan (_autofill_) data NIK saat membuat draf surat Pengantar/SKTM.
    - Modul rendering HTML/React-to-PDF untuk langsung di-print di kecamatan.
4.  **Transparansi APBDes (Kualitas Publik)**:
    - Komponen Dasbor Infografik (memakai `recharts`) untuk rute publik agar masyarakat bisa melihat _Pie Chart_ realisasi serapan anggaran desa tahun berjalan.

---

## 4. Kebutuhan Opsional (_Optional Enhancements_)

Fitur ini baik ada untuk menambah daya tarik, tetapi bukan kewajiban dasar sistem pencatatan desa (Kuartal 4/Fase Akhir Pengerjaan):

1.  **Layanan Laporan Pengaduan Real-Time**:
    - Warga mengisi _form_ aduan rahasia di front-end.
    - Opsional: Penambahan integrasi notifikasi Email/WhatsApp ke nomor _Sekdes_ setiap kali submit pengaduan baru (_Hook Background Tasks_).
2.  **Manajemen Aset (Tanah & Bangunan)**:
    - Catatan properti aset desa (_Inventory Ledger_).
    - Sistem notifikasi _expire_ atau depresiasi inventoris elektronik (Laptop rusak bertahun).
3.  **Export CSV/Excel Massal (_Batch Reporting_)**:
    - Tombol _Download_ Laporan BKU / Buku Registe Surat / Kependudukan ke dalam format `.xlsx` demi memuaskan staf gaptek atau pimpinan tua yang meminta _print-out_ mentah. (Pengerjaannya belakangan jika waktu berlebih).

## Kesimpulan Eksekusi (_Action Items_)

Berdasarkan analisis silang tersebut, langkah **Konkret Mingguan** yang harus dikerjakan:

1.  **Minggu 1 (Tujuan Terdekat)**: Lakukan `rm -rf` (penghapusan total) pada modul-modul BMT NU "Products" (Etalase Jualan).
2.  Biarkan modul "News" karena akan kita _re-type_ menjadi "Berita Desa".
3.  Amankan utilitas UI (`components/ui`) karena ini _Golden Boilerplate_.
4.  Rintis folder baru seperti `app/(admin)/panel/kependudukan` dan `app/(admin)/panel/bku` untuk mulai menaruh logika `MASTER_ROADMAP.md` lapis demi lapis.
