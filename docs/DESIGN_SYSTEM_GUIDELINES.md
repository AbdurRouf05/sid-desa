# Design & Visual Standards Guidelines

Dokumen ini berfungsi sebagai acuan standar visual untuk panel admin SID Desa, guna menjaga konsistensi antarmuka (UI) di seluruh modul.

## 1. Header & Judul Halaman
Setiap halaman dashboard utama wajib mengikuti struktur dan gaya berikut:

### Judul (Page Title)
- **Style**: `text-2xl font-black text-slate-800 tracking-tight uppercase`
- **Aturan**: Judul harus selalu kapital (Uppercase) dan menggunakan ketebalan `font-black` untuk kesan yang kuat dan formal.

### Deskripsi (Page Description)
- **Style**: `text-sm text-slate-500 mt-1`
- **Aturan**: Memberikan penjelasan singkat mengenai fungsi halaman tersebut. Jangan gunakan label versi atau kode teknis internal (seperti "V3") dalam deskripsi publik.

### Konteks & Background
- **Aturan**: Header harus bersifat **Transparan** (menyatu dengan background canvas) dan **Tidak Sticky** (kecuali diperintahkan khusus). Hindari penggunaan background "kotak putih" atau border bawah pada header utama untuk menjaga clean-look yang konsisten dengan modul lainnya.

## 2. Tombol Aksi Utama (Primary Buttons)
Tombol untuk menambah data (seperti "Tambah Penerima", "Tambah Layanan") harus seragam:

- **Padding**: `px-5 py-2.5`
- **Rounding**: `rounded-xl`
- **Font**: `font-bold`
- **Effects**: `transition-all active:scale-95 group`
- **Shadow**: `shadow-sm`
- **Icon**: Gunakan `Lucide` icon dengan ukuran `w-5 h-5`.

## 3. Layout Dashboard Compact (Standard Baru)
Untuk modul yang memiliki banyak data (seperti Bansos), gunakan pendekatan layout "Compact" untuk menghemat ruang vertikal:

### Kartu Statistik (Stats Cards)
- **Rounding**: `rounded-2xl` (Jangan gunakan pembulatan ekstrim seperti `2.5rem`).
- **Padding**: `p-5`.
- **Angka**: `text-2xl font-black`.
- **Icon Container**: `p-2.5 rounded-xl`.

### Tabel Data
- **Spacing**: Gunakan `border-separate border-spacing-y-2` untuk memberikan jarak antar baris tanpa memakan terlalu banyak ruang.
- **Row Styling**: 
  - Background: `bg-slate-50/50`.
  - Border: `border border-slate-100`.
  - Border Radius: `rounded-xl` pada sisi kiri dan kanan baris.
- **Hover**: `hover:translate-x-1 transition-all`.
- **Padding Cell**: `px-4 py-4`.

### Search & Filter
- **Input Search**: `py-3 rounded-xl pl-12 pr-6 text-sm`.
- **Icon Search**: `absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4`.
- **Tab Filter**: `px-3 py-1.5 rounded-lg text-[11px] font-bold`.

## 4. Perbaikan Visual & Bug Fixes (Recent Changes)
- **Penerima Bansos**: Berhasil dirampingkan dari ukuran "Giant" menjadi "Compact" agar lebih informatif tanpa perlu banyak scrolling.
- **Profil & Sejarah Desa**: Transformasi dari layout vertikal panjang menjadi **2-Kolom (Responsive)** untuk efisiensi ruang di layar desktop.
- **Pembersihan UI**: Penghapusan elemen "kotak putih" dan efek glassmorphism pada header admin guna mencapai **Standarisasi Global** yang lebih bersih dan seragam.

---

## 5. Troubleshooting & Common Pitfalls (Log Error & Solusi)

Berikut adalah catatan kesalahan teknis yang sering ditemui selama pengembangan dan cara penyelesaiannya:

### A. PocketBase: ClientResponseError 404 / Konflik Skema
- **Gejala**: Error 404 saat fetch data atau "Collection not found" saat import schema.
- **Penyebab**: PocketBase tidak bisa mengubah tipe field secara otomatis (misal: dari `Text` menjadi `Relation`) jika field tersebut sudah berisi data.
- **Solusi**:
  1. Hapus field yang bermasalah secara manual di Admin PocketBase.
  2. Klik "Save Changes".
  3. Lakukan "Import Collections" ulang menggunakan file `pb_schema.json`.

### B. Runtime Error: "ReferenceError: X is not defined"
- **Gejala**: Halaman crash/putih dengan pesan "control is not defined", "ShieldAlert is not defined", atau "Search is not defined".
- **Penyebab**: Lupa melakukan destructuring pada hook (seperti `control` di `useForm`) atau lupa mengimpor komponen ikon dari `lucide-react` saat menambah elemen UI baru.
- **Solusi**:
  - Pastikan `const { ..., control } = useForm(...)` sudah lengkap sebelum menggunakan `Controller`.
  - **Sangat Penting**: Periksa bagian `import { ... } from "lucide-react"` di atas file. Setiap ikon baru yang digunakan (misal: `ShieldAlert`, `Search`, `FileText`) wajib didaftarkan di sana.
  - Jika melakukan copy-paste blok UI dari file lain, pastikan seluruh dependensi ikon ikut terbawa.

### E. Build Error: "Return statement is not allowed here"
- **Gejala**: Program gagal di-build dengan pesan error parsing di sekitar baris `return`.
- **Penyebab**: Struktur fungsi rusak akibat kesalahan edit (seperti menghapus deklarasi fungsi `const X = () => {` tapi menyisakan isi dan kurung tutupnya `};`).
- **Solusi**: Pastikan setiap blok fungsi memiliki deklarasi yang benar dan kurung kurawal `{ }` yang berpasangan sempurna. Gunakan Indentasi yang rapi untuk mempermudah pengecekan mata.

### C. Data "Kategori Dihapus" Setelah Refaktor Relasi
- **Gejala**: Row tabel menampilkan "Kategori Dihapus" atau data kosong setelah migrasi ke sistem Relasi (Relation).
- **Penyebab**: Data lama masih tersimpan dalam format teks (string), sementara kode baru mengharapkan ID Relasi.
- **Solusi**: Edit record tersebut melalui form UI dan simpan ulang menggunakan pilihan kategori yang baru untuk menyambungkan relasi ID-nya.

### D. Form Layout & Responsive
- **Gejala**: Input form meluap (overflow) atau terlalu lebar di layar kecil.
- **Penyebab**: Penggunaan grid yang terlalu kompleks atau padding yang berlebihan.
- **Solusi**: Gunakan `grid-cols-1 md:grid-cols-2` dan pastikan container utama memiliki padding yang cukup (`px-4`). Untuk form panjang, pertimbangkan layout 2-kolom pada layar besar.

### F. API Rule: Expand Relasi Gagal (Data Berupa ID)
- **Gejala**: Kolom relasi menampilkan kode ID (seperti `7ct0x...`) alih-alih nama teks di halaman publik.
- **Penyebab**: Koleksi yang di-*expand* (misal: `kategori_bantuan`) memiliki **API Rule (List/View)** yang masih terkunci (`@request.auth.id != ""`).
- **Solusi**: Ubah API Rule pada koleksi referensi tersebut menjadi **Kosong (Public)** agar user tanpa login tetap bisa melihat data hasil ekspansi.

---
*Gunakan panduan ini saat membuat modul baru atau melakukan pembaruan pada modul yang sudah ada.*
