# Rincian Diagram & Alur Logika Aplikasi - SID Sumberanyar

Dokumen ini berisi rincian diagram menggunakan sintaks Mermaid untuk mendokumentasikan semua alur logika, proses bisnis, modul, dan arsitektur dari Sistem Informasi Desa (SID) Sumberanyar.

---

## 1. Peta Situs & Modul (Site Map)

Berikut adalah struktur halaman dan fungsionalitas utama yang membagi sistem menjadi area Publik (Frontend) dan area Administratif (Backend/Dashboard).

```mermaid
mindmap
  root((SID Sumberanyar))
    Situs_Publik
      Beranda
        Berita_&_Pengumuman
        Profil_Wilayah
        Struktur_Organisasi
      Transparansi
        Grafik_APBDes
        Realisasi_Anggaran_Tahunan
      Layanan_Warga
        Panduan_Persuratan
        Pengaduan_Mandiri
        Cek_Identitas_NIK
    Panel_Administrasi
      Dashboard_Utama
        Ringkasan_Kas_Desa
        Statistik_Kependudukan
        Log_Aktivitas_Terakhir
      Modul_Keuangan_BKU
        Kas_Umum
          Transaksi_Masuk
          Transaksi_Keluar
          Pindah_Buku
        Perpajakan
          Manajemen_PPN_PPh
          Laporan_Setor_Pajak
      Modul_Persuratan
        Agenda_Surat_Keluar
        Cetak_Surat_Template
      Manajemen_Aset
        Tanah_Kas_Desa
        Inventaris_Kantor
      Data_Master
        Penduduk_&_Keluarga
        Kelola_Pengaduan_Warga
        Profil_Perangkat
```

---

## 2. Alur Navigasi Utama (Top-Level Flow)

Diagram ini menunjukkan bagaimana user (publik maupun admin) berinteraksi masuk ke dalam sistem sesuai hak akses.

```mermaid
graph TD
    Start[Akses Sistem via Browser] --> CheckDomain{Cek Routing / URL?}

    %% Alur Publik
    CheckDomain -- "Domain Utama (Situs Publik)" --> PublicHome[Situs Publik Sumberanyar]

    PublicHome --> FlowBerita[Baca Berita / Pengumuman]
    PublicHome --> FlowTransparansi[Lihat Transparansi APBDes]
    PublicHome --> FlowLayanan[Akses Layanan Warga]

    %% Alur Admin
    CheckDomain -- "Rute Admin (/admin atau cp.)" --> AuthGuard{Cek Sesi Login}
    AuthGuard -- "Sesi Kosong / Invalid" --> LoginPage[Halaman Login]
    LoginPage --> |Input Kredensial| ValidateCreds{Validasi User & Password}
    ValidateCreds -- "Gagal" --> LoginPage
    ValidateCreds -- "Sukses" --> DashboardAdmin[Dashboard Panel Admin]
    AuthGuard -- "Sesi Valid" --> DashboardAdmin

    DashboardAdmin --> PilihModul{Navigasi Sidebar}
    PilihModul --> KeuanganBKU[Modul Keuangan & BKU]
    PilihModul --> Persuratan[Modul Persuratan]
    PilihModul --> AsetDesa[Modul Manajemen Aset]
    PilihModul --> MasterData[Modul Penduduk & Master]
    PilihModul --> KelolaPengaduan[Modul Kelola Pengaduan]
```

---

## 3. Rincian Alur Modul Publik & Layanan Warga

### A. Alur Pengaduan Mandiri (Publik ke Admin)

Warga dapat melaporkan masalah tanpa login rumit (hanya nama dan tempat tinggal), dan laporan tersebut dikelola oleh admin.

```mermaid
sequenceDiagram
    actor Warga
    participant PublicWeb as Sistem Publik
    participant Database as Database (PocketBase)
    participant AdminWeb as Panel Admin
    actor Admin

    Warga->>PublicWeb: Buka Menu Pengaduan Mandiri
    PublicWeb-->>Warga: Tampilkan Form Pengaduan
    Warga->>PublicWeb: Input Nama, Tempat Tinggal & Isi Laporan
    PublicWeb->>Database: Simpan Laporan (Status: "Baru")
    Database-->>PublicWeb: Laporan Berhasil Disimpan
    PublicWeb-->>Warga: Tampilkan Notifikasi Sukses

    Note over Admin,Database: Di Waktu Lain / Admin Bekerja
    Admin->>AdminWeb: Buka Modul Kelola Pengaduan
    AdminWeb->>Database: Ambil Daftar Pengaduan
    Database-->>AdminWeb: Tampilkan Laporan Warga
    Admin->>AdminWeb: Baca laporan & Tindak Lanjuti
    AdminWeb->>Database: Update Status (Diproses/Selesai)
```

### B. Cek NIK dan Bantuan Persuratan

Alur warga untuk mengecek validitas data mereka dan melihat panduan membuat dokumen surat pengantar di desa.

```mermaid
graph TD
    WargaMulai[Warga Mengakses Layanan] --> PilihanLayanan{"Pilih Sektor Layanan"}

    PilihanLayanan -- "Cek NIK Sederhana" --> InputNIK[Warga Memasukkan NIK]
    InputNIK --> ValidasiDb{Cek Database Kependudukan}
    ValidasiDb -- "NIK Ditemukan" --> TampilData[Tampilkan Identitas Dasar Warga]
    ValidasiDb -- "NIK Tidak Ditemukan" --> TampilError[Tampilkan Info: Data Tidak Ditemukan]

    PilihanLayanan -- "Panduan Persuratan" --> TampilPanduan[Tampilkan Halaman Syarat-syarat Pengajuan Surat]
    TampilPanduan --> AkhirPanduan[Warga Datang ke Kantor Desa Membawa Syarat Dokumen Fisik]
```

### C. Alur Transparansi APBDes

Transparansi anggaran adalah fitur penting di akhir tahun. Karena kebutuhan administrasi berjenjang, data agregasinya ditarik dari **input manual** (rekapitulasi akhir) oleh Admin agar data publik terkurasi dan tervalidasi sebelum dipajang.

```mermaid
graph LR
    Admin[Admin Keuangan] --> |Membuat Rekap APBDes Tahunan| FormAPBDes[Input Data Transparansi (Alokasi & Realisasi)]
    FormAPBDes --> DbAPBDes[(Tabel apbdes_realisasi)]

    Warga Publik --> |Buka Menu Transparansi| PublikGrafik[Tampilan View Grafik & Laporan Publik]
    DbAPBDes --> PublikGrafik
```

---

## 4. Rincian Alur Modul Admin

### A. Modul BKU (Buku Kas Umum) & Perpajakan

Sistem ini menangani seluruh alur keuangan harian, perpindahan uang tunai dan rekening bank, hingga perhitungan pajak (otomatis dan kustom).

```mermaid
graph TD
    MasukBKU["Buka Halaman Modul BKU"] --> PilihAksi{"Pilih Tipe Transaksi"}

    %% Alur Saldo Keluar/Masuk Dasar
    PilihAksi -- "Penerimaan (Masuk)" --> FormMasuk["Input: Nominal, Tgl, Rek. Tujuan (Bank/Tunai), Uraian, Bukti"]
    PilihAksi -- "Pengeluaran (Keluar)" --> FormKeluar["Input: Nominal, Tgl, Rek. Sumber (Bank/Tunai), Uraian, Bukti"]

    %% Alur Pindah Buku Super Lengkap
    PilihAksi -- "Pindah Buku" --> PilihanPindah{"Pilih Jenis Perpindahan"}
    PilihanPindah -- "Tunai ➡ Bank" --> FormPindahSetor["Input: Nominal, Dari (Kas Tunai), Ke (Rek. Bank)"]
    PilihanPindah -- "Bank ➡ Tunai" --> FormPindahTarik["Input: Nominal, Dari (Rek. Bank), Ke (Kas Tunai)"]
    PilihanPindah -- "Tunai ➡ Tunai (Kas Lain)" --> FormPindahKas["Input: Nominal, Antar Kas Tunai"]
    PilihanPindah -- "Bank ➡ Bank" --> FormPindahTrf["Input: Nominal, Dari (Bank A), Ke (Bank B)"]

    FormPindahSetor --> CekSaldo
    FormPindahTarik --> CekSaldo
    FormPindahKas --> CekSaldo
    FormPindahTrf --> CekSaldo
    FormMasuk --> SimpanDB

    %% Alur Pajak Pengeluaran
    FormKeluar --> CekPajak{"Penanganan Pajak"}
    CekPajak -- "Tidak Ada Pajak" --> CekSaldo
    CekPajak -- "Hitung PPN 11% (Otomatis)" --> AutoPajak["Sistem Mengkalkulasi 11% dari Total"]
    CekPajak -- "Pajak Custom (Manual)" --> ManualPajak["Admin Menginput Persentase/Nominal Pajak Khusus"]

    AutoPajak --> CekSaldo
    ManualPajak --> CekSaldo

    %% Validasi Akhir
    CekSaldo{"Sistem Validasi Ketersediaan Saldo"}
    CekSaldo -- "Saldo Kurang" --> Tolak["Gagal Sistem: Saldo Tidak Mencukupi"]
    CekSaldo -- "Saldo Cukup" --> SimpanDB[("Simpan ke Database Buku Kas Umum")]

    SimpanDB --> |Jika transaksi ada pajak| SimpanPajak[("Simpan ke Tabel Pajak (Belum Disetor)")]
    SimpanDB --> SaldoUpdate["Update Saldo Real-Time"]
```

### B. Modul Persuratan (Admin)

Memfasilitasi pembuatan permohonan/pengantar tertulis untuk internal dan warga. Menggunakan template statis dari kode yang di-_pass_ data dinamisnya untuk cetak.

```mermaid
sequenceDiagram
    actor Admin
    participant ModulSurat as Modul Persuratan
    participant DBPenduduk as Database Penduduk
    participant Template as PDF Generator (Statis)

    Admin->>ModulSurat: Pilih Buat Surat Keluar Baru
    ModulSurat->>Admin: Tampilkan Pilihan Jenis Surat Pengantar / Keterangan
    Admin->>ModulSurat: Input NIK / Nama Pemohon
    ModulSurat->>DBPenduduk: Cari Data Penduduk
    DBPenduduk-->>ModulSurat: Kembalikan Identitas Penduduk
    Admin->>ModulSurat: Input Keperluan Surat & Penandatangan
    ModulSurat->>Template: Kirim Data ke Template PDF Statis
    Template-->>ModulSurat: Generate File Dokumen PDF
    ModulSurat->>Admin: Tampilkan Preview & Tombol Cetak / Download
    Admin->>ModulSurat: Simpan Ke Agenda Arsip
```

### C. Modul Data Penduduk (Master Data)

Alur dua arah untuk populasi data penduduk.

```mermaid
graph LR
    KelolaData[Masuk Kelola Data Penduduk] --> PilihanInput{"Metode Input Data"}
    PilihanInput -- "Opsi 1: Input/Update Manual" --> FormManual[Isi Form NIK, Nama, TTL, dll secara Tunggal]
    PilihanInput -- "Opsi 2: Bulk Import" --> UploadExcel[Upload File Excel .csv / .xlsx massal]

    FormManual --> ValidasiData{Cek Validitas/Duplikat NIK}
    UploadExcel --> ProgramParsing[Sistem Memparsing Data Baris per Baris] --> ValidasiData

    ValidasiData -- "Gagal (NIK Ganda/Format Salah)" --> BeriPeringatan[Tampilkan Error / Log Import Gagal]
    ValidasiData -- "Sukses" --> MasukServer[("Simpan/Perbarui Database Kependudukan")]
```

### D. Manajemen Aset Desa (Tanah & Inventaris)

Mengelola aset yang dimiliki desa melalui **2 modul terpisah** untuk presisi data:

```mermaid
graph TD
    BukaAset[Buka Modul Aset] --> PilihanModul{"Pilih Jenis Aset"}
    
    PilihanModul -- "Inventaris Barang" --> Inventaris[Modul Inventaris Desa]
    Inventaris --> FormInv["Input: Nama Barang, Kategori, Tahun Perolehan, Kuantitas, Kondisi"]
    FormInv --> UpdateKondisi["Update Kondisi Berkala: Baik → Rusak Ringan → Rusak Berat"]
    UpdateKondisi --> SDBInv[("Database: inventaris_desa")]
    
    PilihanModul -- "Tanah Kas Desa" --> Tanah[Modul Tanah Desa]
    Tanah --> FormTanah["Input: Lokasi, Luas m², Peruntukan, Pemegang Hak"]
    FormTanah --> SDBTanah[("Database: tanah_desa")]

    SDBInv --> ListAset[Tabel Daftar Aset]
    SDBTanah --> ListAset
    
    ListAset --> UpdateAset[Kelola Kondisi / Mutasi Aset]
    UpdateAset --> UbahStatus{"Ganti Kondisi Aset"}
    UbahStatus -- "Masih Digunakan" --> SDBInv
    UbahStatus -- "Rusak / Susut Nilai" --> SDBInv
    UbahStatus -- "Dijual / Dihapus" --> TandaiArsip[Tandai Non-Aktif/Diarsipkan] --> SDBInv
```

**Catatan Arsitektur:**

Sistem menggunakan **2 collection terpisah** (`inventaris_desa` dan `tanah_desa`) bukan collection umum `aset_desa` karena:

1. **Field Spesifik Berbeda:**
   - Inventaris: `tahun_perolehan`, `kuantitas`, `kondisi`
   - Tanah: `luas_m2`, `peruntukan`, `pemegang_hak`, `lokasi`

2. **Validasi Lebih Ketat:**
   - Inventaris: Kategori barang (Elektronik, Mebel, Kendaraan, dll)
   - Tanah: Luas dalam m², peruntukan spesifik

3. **Mudah Maintenance:**
   - Update schema independen
   - Query lebih efisien
   - Report terpisah per jenis aset

---

_Dokumen Blueprint Lanjutan._
_Diagram-diagram di atas menggambarkan "Logika Bisnis" (Business Logic) aplikasi secara penuh, mengacu pada model operasional administrasi desa nyata._
