# Referensi Redesain Tampilan Publik SID

Dokumen ini berisi kumpulan referensi desain, fitur, dan aksesibilitas untuk perombakan tampilan publik Sistem Informasi Desa (SID) Sumberanyar.

## 1. Referensi Utama: [Tamang Digital Desa](https://tamang.digitaldesa.id/)
**Karakteristik:** Minimalis, Modern, Berorientasi pada Aksesibilitas.

### Fitur Unggulan:
- **Hero Slider**: Gambar latar belakang berkualitas tinggi dengan overlay gelap untuk teks putih yang kontras.
- **Floating Accessibility Widget**: Menu melayang untuk mengubah ukuran teks, kontras, spasi, dan alat bantu baca.
- **Bento-style Grid**: Penggunaan kartu (cards) yang bersih untuk navigasi layanan utama.
- **Ringkasan Anggaran (APB Desa)**: Visualisasi pendapatan dan belanja yang simpel namun menarik di halaman depan.
- **Statistik Demografis**: Penggunaan angka besar (bold) dengan label yang jelas.

### Screenshot Referensi Tamang:
- [Hero & Navbar](file:///C:/Users/arack/.gemini/antigravity/brain/ba73abb9-aaac-43b5-baeb-cc4a940ffc96/tamang_hero_navbar_final_1775107594000.png)
- [Aksesibilitas Menu](file:///C:/Users/arack/.gemini/antigravity/brain/ba73abb9-aaac-43b5-baeb-cc4a940ffc96/tamang_accessibility_menu_1775107704733.png)
- [APB Desa Simpel](file:///C:/Users/arack/.gemini/antigravity/brain/ba73abb9-aaac-43b5-baeb-cc4a940ffc96/tamang_apb_desa_1775107642675.png)

---

## 2. Referensi Pendukung: [Desa Lubuk Lawas](https://lubuklawas.desa.id/)
**Karakteristik:** Informatif, Transparan, Data-Centric.

### Fitur Unggulan:
- **Petugas Siaga**: Menampilkan status kehadiran perangkat desa secara real-time di kantor.
- **Progres Anggaran (APBDesa)**: Visualisasi detail menggunakan progress bar untuk realisasi anggaran versus target.
- **Tren Kependudukan**: Statistik perubahan bulanan (lahir, mati, masuk, pindah) yang dinamis.
- **Working Hours Widget**: Menampilkan jam operasional kantor secara jelas.

### Screenshot Referensi Lubuk Lawas:
- [Petugas Siaga](file:///C:/Users/arack/.gemini/antigravity/brain/ba73abb9-aaac-43b5-baeb-cc4a940ffc96/lubuklawas_petugas_penduduk_1775108121521.png)
- [Transparansi Progres Anggaran](file:///C:/Users/arack/.gemini/antigravity/brain/ba73abb9-aaac-43b5-baeb-cc4a940ffc96/lubuklawas_transparency_section_1775108146477.png)

---

## Rencana Perbaikan untuk SID Sumberanyar

### A. UI/UX Global
1.  **Palet Warna**: Mengadopsi kombinasi *Nature Green* (untuk nuansa desa) dan *Clean White* dengan aksen *Soft Gray*.
2.  **Transisi Navbar**: Mengubah navbar menjadi transparan di hero section dan menjadi solid saat di-scroll.
3.  **Tipografi**: Menggunakan font sans-serif modern (seperti Inter atau Outfit) dengan hierarki visual yang kuat.

### B. Fitur Baru yang Diusulkan
1.  **Widget Aksesibilitas**: Implementasi menu melayang untuk membantu warga dengan kebutuhan khusus (perbesar teks, mode kontras tinggi, dll).
2.  **Summary APBDesa Berbasis Progres**: Menambahkan section anggaran di homepage dengan progress bar yang ditarik dari data backend.
3.  **Status Perangkat Desa (Petugas Siaga)**: Menampilkan siapa saja perangkat desa yang bertugas/ada di kantor hari ini.
4.  **Floating Action Button (FAB)**: Untuk akses cepat ke Pengaduan atau WhatsApp petugas.

### C. Restrukturisasi Konten Homepage
1.  **Hero Section**: Slider berita utama atau visi-misi dengan CTA yang jelas.
2.  **Portal Quick Links**: 4-6 menu utama (Pelayanan, Transparansi, Berita, Profil).
3.  **Statistik Cepat**: Populasi total, KK, dan sebaran jenis kelamin.
4.  **Berita Terbaru**: Card layout modern dengan badge tanggal yang menonjol.
