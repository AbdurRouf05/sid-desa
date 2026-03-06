# Pembagian Tugas Tim & Manajemen Branch (Studi Kasus SID Sumberanyar)

Berdasarkan sitemap dan `DIAGRAM_APLIKASI.md`, sistem SID Sumberanyar memiliki 4 **Modul/Cabang Utama**.

Agar pekerjaan tidak saling tumpang tindih, kita menggunakan strategi **Fullstack per Modul**. Artinya, setiap anggota tim bertanggung jawab membuat UI (Frontend) sekaligus logika databasenya (Backend) secara utuh _hanya untuk modul yang ditugaskan kepadanya_.

Berikut adalah pembagian tugas untuk 4 anggota tim:

---

## 👥 Pembagian Berdasarkan Modul Utama

### 1. TUGAS MEMBER 1: Modul Keuangan (Buku Kas & Pajak)

**Titik Fokus:** Fitur pencatatan keuangan internal aparat desa.
**Pekerjaan Fullstack:**

- **Frontend**: Membuat halaman antarmuka form Tambah Kas Masuk/Keluar, form Pindah Buku, fitur penghitungan Pajak, tabel laporan bulanan, dan Dashboard Grafik APBDes agregasi tahunan.
- **Backend (PocketBase)**: Mengurus _collection_ `bku_transaksi`, `pajak_log`, dan `apbdes_realisasi` beserta fungsi validasi saldonya.

* **Format Nama Branch Utama:**
  ```bash
  git checkout -b modul-bku
  ```

---

### 2. TUGAS MEMBER 2: Modul Persuratan & Data Warga (Kependudukan)

**Titik Fokus:** Pusat data penduduk dan layanan administrasi surat menyurat desa.
**Pekerjaan Fullstack:**

- **Frontend**: Membuat form pencarian NIK (di Front-End publik), form tambah/edit/import data penduduk manual di panel admin, buku agenda surat, dan halaman Generator Cetak Surat PDF.
- **Backend (PocketBase)**: Mengurus tabel Penduduk/Data Keluarga dan menyimpan arsip PDF cetak surat ke server.

* **Format Nama Branch Utama:**
  ```bash
  git checkout -b modul-persuratan
  ```

---

### 3. TUGAS MEMBER 3: Modul Portal Publik & Pengaduan Warga

**Titik Fokus:** Wajah aplikasi untuk masyarakat desa di beranda dan fitur interaksi dua arah (Pengaduan).
**Pekerjaan Fullstack:**

- **Frontend**: Mendesain _Homepage_ website Publik, merapikan layout Berita/Pengumuman, profil wilayah, stuktur perangkat, serta Form input "Pengaduan Mandiri" untuk warga.
- **Backend (PocketBase)**: Mengurus sistem _CMS_ Artikel (`news`), halaman statis UI/UX hero banner, dan manajemen tabel `pengaduan_warga` agar admin bisa merubah status laporan dari "Diproses" ke "Selesai".

* **Format Nama Branch Utama:**
  ```bash
  git checkout -b modul-publik
  ```

---

### 4. TUGAS MEMBER 4: Modul Manajemen Aset

**Titik Fokus:** Inventarisasi kekayaan yang dimiliki pemerintahan desa (Tanah, Bangunan, Kendaraan Dinas, Alat Kantor).
**Pekerjaan Fullstack:**

- **Frontend**: Membuat tabel dan form penginputan kekayaan desa, fitur rekaman "Mutasi/Kondisi" barang (misal dari "Baik" menjadi "Rusak Berat"), serta kalkulasi Nilai Buku Aset.
- **Backend (PocketBase)**: Membuat tabel master Manajemen Aset dan relasi riwayat mutasi kondisinya. Mengurus integrasi fitur hapus otomatis (Cascade Cleanup) jika aset dihapus.

* **Format Nama Branch Utama:**
  ```bash
  git checkout -b modul-aset
  ```

---

## 🚦 Aturan Emas Kolaborasi Git per Modul

Karena 4 orang bekerja mandiri di foldernya masing-masing, _conflict / bentrok_ kemungkinan besar tidak akan terjadi. Namun, Anda tetap wajib mengikuti tata cara ini:

### 1. Update Sebelum Bekerja

Setiap pergantian hari, tarik (_pull_) progress teman-teman Anda sebelum kembali melanjutkan pekerjaan modul Anda:

```bash
git checkout main
git pull origin main
git checkout nama-branch-anda-sendiri
# ...lanjutkan kerja...
```

### 2. Menyatukan Modul ke Cabang Utama (Pull Request)

- Jika modul "Public Portal" yang dikerjakan **Member 3** sudah 100% jadi, ia **TIDAK BOLEH** langsung mem-push ke `main`.
- Member 3 mem-_push_ ke branch `modul-publik`, lalu membuka repository GitHub dan membuat **Pull Request** ke `main`.
- Anggota lain (atau PM) mem-verifikasi agar kodenya tidak merusak menu Sidebar sistem sebelum di _Approve/Merge_.

### 3. Peringatan: Jangan Menyentuh Hak Milik Teman

- Member 1 yang mengerjakan "Keuangan BKU" **DILARANG KERAS** mengedit file di dalam folder Persuratan (`app/(admin)/panel/dashboard/surat`) miliknya Member 2.
- Jika satu modul butuh komponen modul lain, **bicarakan di grup**, jangan diubah secara sepihak!
