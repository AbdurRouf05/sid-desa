# Panduan Project Manager & Kolaborasi Tim (Git & GitHub)

Dokumen ini berisi panduan lengkap untuk Anda dan tim dalam mengelola dan mengerjakan project secara bersama-sama. Sistem yang digunakan untuk kolaborasi kode ini disebut **Version Control System (VCS)**, di mana kita menggunakan **Git** dan **GitHub**.

---

## 1. Tools Utama yang Digunakan

- **Git**: Program dasar yang diinstal di komputer masing-masing programmer. Tugasnya adalah mencatat setiap perubahan pada file kode dari waktu ke waktu (seperti sistem "History" atau "Save State" tanpa batas).
- **GitHub**: Layanan website (cloud) tempat Anda menyimpan project Git secara online. Ini ibarat "Google Drive" khusus untuk kode programming, di mana teman-teman Anda bisa melihat, mengunduh, dan menyatukan hasil kerja (kode) mereka.

---

## 2. Istilah-istilah Penting Wajib Tahu

Berikut adalah istilah-istilah ("bahasa gaul" programmer) saat berkolaborasi:

- **Repository (Repo)**: Folder project Anda beserta seluruh riwayat perubahannya. Repo online untuk project ini ada di GitHub.
- **Clone**: Proses men-download atau mencopy repository dari GitHub ke komputer lokal untuk pertama kalinya.
- **Commit**: Menyimpan perubahan kode secara permanen di Git komputer lokal Anda. Ibarat titik "Save Point" di dalam game. Setiap _commit_ harus disertai pesan singkat yang jelas (misal: _"memperbaiki warna tombol login"_).
- **Push**: Mengunggah (upload) titik-titik _commit_ dari komputer lokal Anda ke respository GitHub agar teman-teman tim bisa melihat perubahannya.
- **Pull / Fetch**: Mengunduh (download) dan menyatukan perubahan terbaru yang ada di GitHub ke komputer lokal Anda. (Wajib dilakukan rutin agar kode di laptop Anda selalu _up-to-date_ dengan pekerjaan teman lain).
- **Branch (Cabang)**: Fitur paling krusial untuk kolaborasi! _Branch_ memungkinkan anggota tim mengerjakan bagian/fitur yang berbeda tanpa mengubah atau merusak kode utama (`main`).
  - _Contoh:_ Anda ngoding di _branch_ `fitur-berita`, teman A ngoding di _branch_ `fitur-tanah`. Kode kalian saling terisolasi sampai kalian siap menggabungkannya.
- **Merge / Pull Request (PR)**: Proses meminta izin untuk menggabungkan kode dari kode cabang (branch) yang sudah selesai kembali ke kode utama (`main`). Biasanya dilakukan di web GitHub agar teman/project manager bisa me-review (mengecek) kodenya sebelum disetujui untuk digabung.
- **Conflict (Konflik)**: Situasi error yang terjadi jika Anda dan teman Anda tidak sengaja mengedit **baris kode yang persis sama** di file yang sama. Git akan bingung mana kode yang mau dipakai, sehingga Anda harus memilih secara manual versi mana yang ingin dipertahankan.

---

## 3. Langkah Memulai Kolaborasi (Setup Awal)

### A. Untuk Anda (Sebagai Project Manager / Pemilik Repo)

Karena repo GitHub sudah ada di `https://github.com/AbdurRouf05/sid-desa`, Anda hanya perlu mengundang teman Anda.

1. Buka browser dan pergi ke repo GitHub Anda: `https://github.com/AbdurRouf05/sid-desa`
2. Klik tab **Settings** (ikon gerigi di bagian atas kanan halaman repo).
3. Di menu sebelah kiri, pilih **Collaborators** (berada di bawah kategori _Access_).
4. Klik tombol hijau bertuliskan **Add people**.
5. Masukkan _username_ GitHub teman Anda, atau email GitHub mereka.
6. Teman-teman Anda akan menerima email undangan. Beritahu mereka untuk segera membuka email tersebut dan mengklik **Accept Invitation**.

### B. Untuk Teman Anda (Anggota Tim)

Setelah menerima undangan, anggota tim harus melakukan langkah berikut di laptop mereka:

1. Buka Terminal / Command Prompt / VS Code Terminal.
2. Jalankan perintah Clone (pastikan sudah menginstal Git di laptopnya):
   ```bash
   git clone https://github.com/AbdurRouf05/sid-desa.git
   ```
3. Masuk ke folder project yang baru dibuat:
   ```bash
   cd sid-desa
   ```
4. Install semua library/dependencies yang dibutuhkan project. **KARENA PROJECT INI MENGGUNAKAN PNPM, MAKA TEMAN ANDA WAJIB MENGGUNAKAN PNPM JUGA!**
   ```bash
   pnpm install
   ```
   > ⚠️ **PERINGATAN KERAS:** Jangan sesekali teman Anda menggunakan `npm install` atau `yarn install` di project ini! Hal ini akan menghasilkan file `.lock` ganda (misal: `pnpm-lock.yaml` dan `package-lock.json` bentrok) yang dijamin akan menyebabkan error beruntun pada project kalian berdua.
   >
   > _Jika teman Anda belum punya pnpm di laptopnya, suruh dia install dulu dengan menjalankan perintah ini sekali saja: `npm install -g pnpm`_

---

## 4. Alur Kerja (Workflow) Sehari-hari yang Wajib Diikuti

Untuk menghindari kode yang berantakan atau _conflict_ yang parah, **SELURUH ANGGOTA TIM** (termasuk Anda) sangat disarankan untuk selalu mengikuti urutan langkah ini setiap kali ingin mengerjakan fitur baru atau memperbaiki bug:

### Langkah 1: Update Kode Terbaru Sebelum Mulai Ngoding

Pastikan Anda berada di branch `main`, lalu tarik kode terbaru dari GitHub.

```bash
git checkout main
git pull origin main
```

### Langkah 2: Pindah ke Cabang (Branch) Modul Anda

**JANGAN PERNAH NGODING LANGSUNG DI BRANCH `main`!** Karena Branch Modul sudah disiapkan oleh Project Manager, Anda hanya perlu mengunduhnya dan berpindah ke sana.

```bash
git fetch origin
git checkout nama-branch-modul-anda
```

_(Contoh: `git checkout modul-bku` atau `git checkout modul-publik`. Pastikan bertanya ke PM Anda mendapat tugas modul apa)._

### Langkah 3: Ngoding Sepert Biasa & Simpan Perubahan (Commit)

Lakukan pekerjaan Anda. Jika sudah selesai bagian tertentu, simpan perubahan tersebut.

```bash
# Menambahkan semua file yang berubah ke dalam antrean Git
git add .

# Menyimpan perubahan dengan pesan deskriptif
git commit -m "feat: membuat tampilan form tambah berita"
```

_(Tips: Buat commit sesering mungkin setiap ada perubahan yang berfungsi dengan baik. Jangan menunggu semua selesai baru di-commit)._

### Langkah 4: Upload Kode Anda ke GitHub (Push)

Kirim branch kerjaan Anda ke server GitHub agar tersimpan secara online.

```bash
git push origin nama-branch-modul-anda
```

_(Ganti `nama-branch-modul-anda` sesuai nama branch Anda, misal: `git push origin modul-publik`)._

### Langkah 5: Minta Penggabungan Kode (Pull Request / PR)

1. Buka halaman repo di website GitHub.
2. Anda akan melihat tombol hijau **"Compare & pull request"** yang baru saja muncul. Klik tombol tersebut.
3. Beri judul dan penjelasan tentang fitur apa yang Anda kerjakan.
4. Klik **Create pull request**.
5. (Opsional tapi direkomendasikan): Minta teman / Project Manager untuk melihat kode Anda di halaman PR tersebut.
6. Jika semua sudah oke dan tidak ada error, klik tombol **Merge pull request** untuk menyatukan kode Anda ke branch `main`.
7. Pekerjaan selesai! Untuk fitur selanjutnya, ulangi lagi dari **Langkah 1**.

---

## 5. Tips Tambahan & Best Practices

1. **Komunikasi adalah Kunci**: Sebelum mulai ngoding, diskusikan di grup (WA/Discord) siapa mengerjakan file apa. Jangan sampai ada 2 orang mengedit file yang persis sama di waktu bersamaan untuk meminimalisir _Conflict_.
2. **Pesan Commit yang Jelas**: Gunakan awalan yang konsisten pada pesan commit agar rapi dibaca. Contoh standar:
   - `feat: [deskripsi]` -> untuk fitur baru
   - `fix: [deskripsi]` -> untuk perbaikan error/bug
   - `ui: [deskripsi]` -> untuk perubahan tampilan/CSS
   - `docs: [deskripsi]` -> untuk perubahan dokumen/readme
3. **Jika Terjadi Conflict**:
   - Git akan memberitahu file mana yang bentrok. Buka file tersebut di VS Code.
   - VS Code akan menyorot bagian yang bentrok (ada opsi _Accept Current Change_, _Accept Incoming Change_, atau _Accept Both Changes_).
   - Pilih kode mana yang benar (atau gabungkan manual), hapus penanda bentroknya, lalu lakukan `git add .` dan `git commit` lagi.

Dengan panduan ini, diharapkan proses kolaborasi tim dapat berjalan dengan lancar, rapi, dan sistematis. Selamat mengoordinasi project!
