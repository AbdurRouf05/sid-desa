bagus # Persiapan Teknis & Setup: SID Sumberanyar

Dokumen ini berisi _checklist_ tahapan teknis terperinci yang **WAJIB** dieksekusi sebelum memulai pengembangan fitur pada `MASTER_ROADMAP.md`. Tujuannya memastikan _backend_, _database_, dan alat pendukung sudah siap sedia dan sesuai arsitektur.

---

## 1. Setup Database PocketBase (Koleksi & Skema)

Admin harus menyiapkan skema collection (dianjurkan melalui `pb_migrations`) berikut agar front-end bisa langsung _fetch_ dan _mutate_.

- [x] **Tabel `profil_desa` (Single Table / Base Collection)**
  - `nama_desa` (Text)
  - `alamat_lengkap` (Text)
  - `kepala_desa` (Text)
  - `logo_url` (File - Image)
  - `kontak_email` / `kontak_telp` (Text)
- [x] **Tabel `penduduk` (Master Data)**
  - `nik` (Text - Unique, required)
  - `nama_lengkap` (Text - required)
  - `tempat_lahir` (Text)
  - `tanggal_lahir` (Date)
  - `jenis_kelamin` (Select: "L", "P")
  - `alamat` (Text)
  - `status_perkawinan` (Select)
  - `agama` (Select)
  - `pekerjaan` (Text)
- [x] **Tabel `pengaduan_warga`**
  - `nama_pelapor` (Text - required)
  - `tempat_tinggal` (Text - required)
  - `isi_laporan` (Text - required/long)
  - `status` (Select: "Baru", "Diproses", "Selesai") - Default: "Baru"
- [x] **Tabel `apbdes_realisasi` (Transparansi)**
  - `tahun_anggaran` (Number)
  - `kategori` (Select: "Pendapatan", "Belanja", "Pembiayaan")
  - `nama_bidang` (Text)
  - `anggaran` (Number/Integer - Rp)
  - `realisasi` (Number/Integer - Rp)
- [x] **Tabel `rekening_kas` (Master Keuangan BKU)**
  - `nama_rekening` (Text - contoh: "Kas Tunai Desa", "Bank Jatim Desa")
  - `jenis` (Select: "Tunai", "Bank")
- [x] **Tabel `bku_transaksi`**
  - `tipe_transaksi` (Select: "Masuk", "Keluar", "Pindah Buku")
  - `tanggal` (Date)
  - `rekening_sumber_id` (Relation -> `rekening_kas` - Opsional tergantung tipe)
  - `rekening_tujuan_id` (Relation -> `rekening_kas` - Opsional tergantung tipe)
  - `nominal` (Number)
  - `uraian` (Text)
  - `bukti_file` (File)
- [x] **Tabel `pajak_log`**
  - `bku_id` (Relation -> `bku_transaksi`)
  - `jenis_pajak` (Text - contoh: "PPN 11%", "PPh 21")
  - `nominal_pajak` (Number)
  - `status` (Select: "Belum Disetor", "Sudah Disetor")
- [x] **Tabel `surat_keluar` (Agenda)**
  - `nomor_agenda` (Text / Auto-generated)
  - `pemohon_nik` (Relation -> `penduduk`)
  - `jenis_surat` (Select: "Pengantar", "SKTM", dll)
  - `tanggal_dibuat` (Date)
  - `file_pdf` (File)
- [x] **Tabel `aset_desa`**
  - `nama_aset` (Text)
  - `kategori` (Select: "Tanah", "Kendaraan", "Bangunan", "Elektronik")
  - `lokasi` (Text)
  - `luas_kuantitas` (Number)
  - `kondisi` (Select: "Baik", "Rusak Ringan", "Rusak Berat", "Dihapus/Dijual")

---

## 2. Setup Library & Utilitas Front-End

- [x] **Integrasi Type-Safety**
  - Sesuaikan file `lib/pb.ts` atau `types/database.ts` (Pocketbase Typegen) agar sinkron persis dengan skema di atas.
- [x] **Instalasi Pemasok UI / Dependensi Khusus**
  - Pastikan `recharts` / `chart.js` terinstal untuk pembuatan grafik transparansi APBDes.
  - Setup library PDF Generator statis (misal: `@react-pdf/renderer` atau `jspdf`) untuk modul Persuratan.
  - Setup parser Excel (misal: `xlsx` atau `papaparse`) untuk modul Bulk Import Kependudukan.
- [x] **Konfigurasi `globals.css` / Tailwind**
  - Pastikan palet warna spesifik desa (Desa Teal, Soil Orange) terekspos rapi hingga ke _class_ Tailwind untuk memudahkan styling komponen baru agar menjaga _boilerplate UI_.

---

## 3. Aturan Main Folder (Architecture Checklist)

- [x] Memastikan pemisahan Folder _Pages_:
  - `/app/(public)/...` bebas diakses warga.
  - `/app/(admin)/...` dilindungi _middleware_ untuk Cek Session PocketBase.
- [x] Memastikan pemisahan Komponen `components/`:
  - `ui/` -> Elemen dasar _boilerplate_ (Button, Input, Badge). Jangan merusak ini!
  - `bku/` -> Ekstrak semua form dan tabel panjang terkait transaksi agar aturan "Maksimall 150 baris di file halaman" tercapai.
  - `surat/` -> Form cetak PDF.
  - `warga/` -> Komponen form publik.
