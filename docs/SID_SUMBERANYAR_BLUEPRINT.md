# Arsitektur & Cetak Biru (Blueprint) - SID Sumberanyar

Dokumen ini mendefinisikan struktur, alur kerja, dan spesifikasi teknis untuk pengembangan Sistem Informasi Desa (SID) Sumberanyar.

---

## 1. Diagram Arsitektur

### A. Peta Fitur (Mindmap)

Peta fitur ini mendefinisikan seluruh fungsionalitas utama yang harus tersedia bagi publik maupun perangkat desa (admin).

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
        Realisasi_Anggaran
        Laporan_Tahunan
      Layanan_Warga
        Panduan_Persuratan
        Pengaduan_Mandiri
        Cek_NIK_Sederhana
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
          Pencatatan_PPN_PPh
          Laporan_Setor_Pajak
      Modul_Persuratan
        Agenda_Surat_Keluar
        Manajemen_Stempel_TTE
        Cetak_Surat_Otomatis
      Manajemen_Aset
        Tanah_Kas_Desa
        Inventaris_Kantor
        Aset_Pembangunan
      Data_Master
        Penduduk_&_Keluarga
        Lembaga_Desa_BPD_LPMD
        Profil_Perangkat
```

### B. Alur Pengguna (User Flow)

```mermaid
graph TD
    Start[Akses Sistem] --> CheckDomain{Cek Subdomain?}

    %% Alur Publik
    CheckDomain -- "www / root" --> PublicHome[Halaman Depan Publik]
    PublicHome --> ViewNews[Baca Berita/Artikel]
    PublicHome --> ViewGraph[Lihat Transparansi Anggaran]
    PublicHome --> CitizenService[Ajukan Pengaduan/Cek Layanan]

    %% Alur Admin
    CheckDomain -- "cp / admin" --> AuthCheck{Sesi Valid?}
    AuthCheck -- Tidak --> LoginPage[Halaman Login]
    LoginPage --> |Kredensial Valid| Dashboard[Panel Dashboard Admin]
    AuthCheck -- Ya --> Dashboard

    Dashboard --> SelectModule{Pilih Modul}

    %% Modul BKU
    SelectModule -- "Keuangan (BKU)" --> BKUView[Tabel Transaksi]
    BKUView --> InputTrans[Input Transaksi Baru]
    InputTrans --> |Validasi Saldo| SaveDB[(PocketBase)]
    InputTrans --> |Hitung Otomatis| PajakLog[Catat Potensi Pajak]

    %% Modul Administrasi
    SelectModule -- "Persuratan" --> Surat[Buat Agenda/Cetak Surat]
    Surat --> |Generate No. Agenda| Print[Cetak PDF / Simpan Arsip]

    %% Output
    SaveDB --> AuditLog[Log Aktivitas Perangkat]
```

### C. Skema Database (PocketBase ERD)

```mermaid
erDiagram
    USERS ||--o{ LOGS : mencatat
    USERS {
        string id PK
        string username
        string role "admin|kaur|sekdes"
    }

    BKU_TRANSAKSI ||--o{ PAJAK_LOG : memicu
    BKU_TRANSAKSI {
        string id PK
        enum tipe "masuk|keluar|pindah"
        int nominal "IDR"
        date tanggal
        string uraian
        string bukti_foto "file"
        string kode_anggaran
    }

    PAJAK_LOG {
        string id PK
        string bku_id FK
        enum jenis "ppn|pph"
        int nominal
        bool is_disetor
    }

    SURAT_KELUAR }|--|| PERANGKAT_DESA : ditandatangani_oleh
    SURAT_KELUAR {
        string id PK
        int nomor_agenda "Auto Increment"
        string kode_surat
        string tujuan
        date tanggal_surat
        string file_arsip
    }

    PERANGKAT_DESA {
        string id PK
        string nama
        string jabatan
        string nip
        bool is_aktif
    }

    NEWS ||--o{ CATEGORIES : memiliki
    NEWS {
        string id PK
        string title
        string slug
        text content
        string thumbnail
        bool is_published
    }

    TANAH_DESA {
        string id PK
        string lokasi
        float luas_m2
        string peruntukan
        string pemegang_hak
    }
```

---

## 2. Struktur Proyek & Teknis

### A. Organisasi Direktori

```text
app
├── (public)          # Rute Halaman depan (Beranda, Berita, Transparansi)
│   ├── home          # Halaman depan utama
│   ├── berita        # Pengolahan artikel & pengumuman
│   └── layanan       # Panduan warga & pengaduan
├── (admin)           # Rute Panel Kontrol (Panel Admin)
│   ├── panel
│   │   ├── dashboard # Statistik & Ringkasan
│   │   ├── bku       # Pengelolaan Keuangan
│   │   ├── surat     # Pengelolaan Persuratan
│   │   └── aset      # Inventaris & Tanah Desa
│   └── login         # Autentikasi Admin
├── api               # Handler sisi server (jika diperlukan)
└── layout.tsx        # Tata letak utama sistem
```

### B. Strategi Implementasi (DRY & Resilience)

1.  **Validasi Ketat (Zod)**: Semua data dari PocketBase divalidasi menggunakan schema Zod di `lib/validations` sebelum sampai ke komponen UI.
2.  **Akses Terpusat**: Menggunakan `lib/pb.ts` sebagai satu-satunya penyedia klien PocketBase (Singleton).
3.  **Ketahanan Backend (Resilience)**: Komponen prioritas tinggi (Statistik Dashboard) memiliki mekanisme _fallback_ jika koneksi database terganggu.
4.  **SEO Pemerintahan**: Menggunakan standar JSON-LD `GovernmentOrganization` untuk memastikan visibilitas di mesin pencari.

---

## 3. Panduan Gaya & Identitas (UI/UX)

### A. Nada & Bahasa

- **Bahasa**: Indonesia (Formal, Baku, EYD).
- **Nada**: _Amanah_ (Transparan/Jujur) dan _Profesional_ (Efisien dalam Pelayanan).

### B. Palet Warna (Pemerintah)

| Token             | Hex     | Penggunaan                           |
| ----------------- | ------- | ------------------------------------ |
| bg-desa-primary   | #0f766e | Navbar, Tombol Utama, Header Dokumen |
| bg-desa-accent    | #ea580c | Peringatan, Grafik Realisasi, Aset   |
| text-desa-heading | #1e293b | Judul Halaman & Nama Kolom           |
| bg-desa-paper     | #ffffff | Area Teks Surat, Kontainer Berita    |

---

## 4. Strategi Pengujian (Testing)

- **Unit**: Pengujian logika perhitungan pajak dan format mata uang Rupiah.
- **Integrasi**: Alur input BKU hingga pembaruan saldo otomatis.
- **Aksesibilitas (A11y)**: Memastikan tampilan kontras tinggi dan ramah pembaca layar (screen reader) untuk transparansi publik.
