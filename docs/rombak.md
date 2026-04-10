# Catatan Pengembangan & Kloning UI V3 (Tema Ngembal Kulon -> SID Sumberanyar)

Dokumen ini adalah rekapitulasi akhir dari seluruh perombakan struktur *Front-End* (Situs Publik) dan *Back-End* (Admin CP), disesuaikan dengan *Blueprint/Mindmap* final SID Sumberanyar.

## Fase 1-4: Penjahitan Identitas & Komponen Inti (SELESAI)
- **Aset Visual**: Seluruh _dummy placeholder_ (termasuk logo) telah diganti menjadi `logo3-removebg-preview.png` dan aset desa orisinil (`image copy 3.png` & `image copy 4.png`).
- **Splash Screen**: Layar loading *fade-out* hijau menggunakan logo desa resmi.
- **Transparansi Hero Image**: Estetika modern dengan lapisan *gradient* tembus pandang (80%) di bagian navigasi dan beranda utama.
- **Integrasi Komponen Ekstra**: 
  - Admin Panel telah mengadopsi format *Dashboard Klasik* yang stabil.
  - Form klasifikasi **Surat Keluar** sudah mendapat amunisi tambahan opsi (*Dropdown* Keterangan Berkelakuan Baik, Penghasilan Orang Tua, Kuasa).
  - Integrasi catatan PBB di buku saku Admin.

---

## Fase 5: Restrukturisasi Navigasi 5-Bilah Khusus Publik (SELESAI)
Berdasarkan *Mindmap* baru yang membuang entitas kurang esensial (seperti Kelembagaan, Administrasi Umum, dan Peta terpisah), **Panel Navigasi Kiri** telah disusutkan menjadi 5 Tombol Vital yang selaras sempurna:

1. **Berita & Profil (Home Landing)**
   - Merupakan gabungan *Sejarah, Visi Misi, dan Jendela Berita*.
   - Data Profil otomatis terhubung ke `profil_desa`.
   - Data Kabar Desa (Carousel/List) mengambil JSON dari `berita_desa`.

2. **Organisasi (Aparatur Pemerintahan)**
   - Merender deretan susunan *Card Pegawai* desa secara dinamis dari `perangkat_desa`.
   - Mengganti status kehadiran statis menjadi tombol Tautan Media Sosial (FB, IG, WA, X) interaktif.

3. **Transparansi (Grafik APBDes)**
   - Angka Persentase APBDes berdampingan riil dengan total anggaran secara *real-time*.
   - Mengakumulasi data dari `apbdes_realisasi`.

4. **Pusat Layanan Terpadu**
   - Bukan sekadar laci samping (*Drawer*), navigasi ini memuat Halaman Tengah yang mempesona (*Center Hub View*).
   - Menghidupkan kembali nyawa tata letak lama, mewadahi Grid Interaktif untuk 4 sub-layanan: Panduan Pengajuan Persuratan, Form Pengaduan Warga, Cek Penerima Bansos (NIK), dan Surat Online Rantau.
   - Sisi Admin tinggal membaca data dari `pengaduan_warga` dan mengatur status `penerima_bansos`.

5. **Peta Desa Geospasial**
   - Menambahkan menu ke-5 untuk merender Google Maps embed, memudahkan warga / kurir melihat letak Balai Desa secara presisi.

---

## DAFTAR DATABASE (POCKETBASE) YANG DIBUTUHKAN

Untuk Anda yang akan mengatur/meng-*import* ulang layanan database PocketBase (*Backend*), pastikan **Collection (Tabel)** berikut ini ada agar seluruh fitur publik di atas tidak ada yang *error*:

| Nama Collection | Type | Field Utama yang Dibutuhkan Frontend |
|---|---|---|
| `profil_desa` | Base | `nama_desa`, `sejarah_desa`, `visi_misi`, `logo_primary`, `logo_secondary` |
| `perangkat_desa` | Base | `nama`, `jabatan`, `foto`, `is_aktif` |
| `berita_desa` | Base | `title`, `thumbnail`, `is_published` |
| `apbdes_realisasi` | Base | `tahun_anggaran`, `kategori`*(Pendapatan/Belanja)*, `anggaran`, `realisasi` |
| `pengaduan_warga` | Base | `nama_pelapor`, `tempat_tinggal`, `isi_laporan`, `status` |
| `penerima_bansos` | Base | `nama`, `nik`, `jenis_bantuan`, `tahun_penerimaan` |
| `surat_keluar` | Base | `nomor_agenda`, `nik_pemohon`, `nama_pemohon`, `jenis_surat`, `tanggal_dibuat`, `keterangan` |

*Opsional (Jika digunakan di modul Demografi/Pembangunan):*
- `data_penduduk` (Master NIK, Nama Lengkap, dsb).
- `statistik_demografi` (Kategori, Label, Nilai).

✅ **STATUS PROYEK OVERALL:** SIAP MENGUDARA (*PRODUCTION-READY*).
