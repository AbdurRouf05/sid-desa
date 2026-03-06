# Simulasi Nyata: Cara Kerja Branch & Pull Request

Jika panduan sebelumnya masih terasa teoritis, mari kita buat **cerita simulasi nyata** agar Anda langsung paham bagaimana dua orang bisa mengerjakan satu project _(sid-magang)_ secara bersamaan tanpa saling merusak kode.

---

## Karakter dalam Cerita

- **Anda** (sebagai Project Manager & Developer A)
- **Budi** (sebagai Teman Anda / Developer B)

## Kondisi Awal

Project `sid-magang` saat ini punya satu jalur utama (Murni & Stabil) yang disebut **Branch `main`**. Anggap branch `main` ini adalah produk akhir web Anda. **Aturan Emas: Dilarang keras ngoding langsung di branch `main`**.

---

## Skenario: Menambahkan Fitur Daftar Hadir

Kalian sepakat hari ini membagi tugas:

- **Anda** bertugas membuat _halaman depan (frontend) daftar hadir_.
- **Budi** bertugas membuat _database dan fungsi simpan (backend) daftar hadir_.

---

### TAHAP 1: Persiapan (Pagi Hari)

1. **Anda** dan **Budi** membuka laptop masing-masing.
2. Karena semalam mungkin ada update, **Anda** dan **Budi** men-download kode terbaru dari GitHub ke laptop:
   ```bash
   git checkout main
   git pull origin main
   ```
   _(Sekarang laptop Anda dan Budi memiliki kode yang 100% sama dan up-to-date)._

---

### TAHAP 2: Membuat "Ruang Kerja" (Branch) Masing-masing

Karena kalian mengerjakan bagian yang berbeda, kalian tidak boleh ngoding di `main`. Kalian membuat "salinan" project sendiri-sendiri (Branch).

1. **Anda** membuat branch baru khusus untuk tugas UI:

   ```bash
   git checkout -b fitur-ui-absen
   ```

   _(Sekarang tulisan di ujung terminal Anda berubah jadi `fitur-ui-absen`. Anda kini ada di "ruang kerja" Anda sendiri)._

2. **Budi** di rumahnya juga membuat branch baru khusus tugas Database:
   ```bash
   git checkout -b fitur-db-absen
   ```
   _(Budi sekarang ada di "ruang kerja" bernama `fitur-db-absen`)._

---

### TAHAP 3: Mulai Ngoding (Siang Hari)

1. **Anda** membuka file di folder `app/(public)/absen/page.tsx` lalu membuat desain tombol dan input nama.
2. Selesai ngoding, Anda menyimpan (Commit) pekerjaan tersebut di laptop Anda:

   ```bash
   git add .
   git commit -m "feat: membuat tampilan form absen"
   ```

3. Sementara itu, **Budi** membuka file di folder `lib/pb.ts` atau membuat backend script untuk menyimpan data ke PocketBase.
4. Budi selesai ngoding, lalu menyimpan (Commit) pekerjaannya di laptop Budi:
   ```bash
   git add .
   git commit -m "feat: membuat fungsi simpan absen ke database"
   ```

_(Perhatikan: Karena kalian berada di Branch yang berbeda, kode Budi tidak ada tombol buatan Anda, dan kode Anda tidak ada fungsi database buatan Budi. Project asli di `main` juga masih kosong belum ada absensi. Semuanya masih terisolasi dengan sangat aman!)_

---

### TAHAP 4: Mengunggah (Push) Ruang Kerja ke GitHub

Kerjaan sudah selesai di laptop masing-masing. Saatnya di-upload ke GitHub agar bisa digabungkan.

1. **Anda** mengirim _branch_ Anda ke GitHub:

   ```bash
   git push origin fitur-ui-absen
   ```

   _(Branch `fitur-ui-absen` sekarang melayang-layang di server GitHub)._

2. **Budi** juga mengirim _branch_-nya ke GitHub:
   ```bash
   git push origin fitur-db-absen
   ```

---

### TAHAP 5: Pull Request (Minta Izin Gabung)

_(Tahap ini sepenuhnya dilakukan di web browser (Google Chrome), bukan di VS Code)._

**Pull Request (PR)** artinya: _"Halo Project Manager, branch saya sudah selesai dan sudah saya upload. Tolong dicek (review). Kalau aman, izinkan (pull) branch saya digabung/dimasukkan ke branch utama `main` yang bersih."_

1. **Budi** membuka halaman repo GitHub `sid-desa`.
2. Di layar akan otomatis muncul tombol hijau: **Compare & Pull Request** untuk branch `fitur-db-absen`. Budi mengkliknya.
3. Budi menulis pesan: _"Saya sudah buat database absensi. Minta tolong di-review."_ lalu membuat PR tersebut.
4. Anda sebagai _Project Manager_ mendapat notifikasi. Anda melihat kode buatan Budi lewat tab **Pull Requests** di GitHub.
5. Anda klik tab **Files changed** untuk melihat baris kode mana saja yang ditambahkan Budi. _Hmm, kodenya rapi dan aman._
6. Anda mengklik tombol **Merge pull request** dan **Confirm merge**.

_(🎉 BOOM! Kode database buatan Budi sekarang sudah masuk dan menyatu secara resmi ke branch `main`. Branch `fitur-db-absen` milik Budi akan otomatis dihapus oleh GitHub karena tugasnya sudah selesai)._

**Giliran Anda:** 7. Sekarang giliran Anda yang membuka GitHub, lalu mengklik **Compare & Pull Request** untuk branch `fitur-ui-absen` milik Anda. 8. Karena Anda juga Project Manager (PM), Anda mereview kode Anda sendiri (bisa minta teman mereview jika ingin silang), jika aman Anda klik **Merge pull request**. 9. Web GitHub akan otomatis menyatukan tampilan form absen buatan Anda ke dalam branch `main`.

_(🎉 Selesai! Branch `main` sekarang berisi fitur absensi yang utuh: Ada tampilan form dari Anda, dan ada fungsi databasenya dari Budi)._

---

### TAHAP 6: Mengakhiri Hari (Sore Hari)

Fitur sudah jadi di GitHub. Namun, hati-hati! Laptop Anda masih berada di branch lawas (`fitur-ui-absen`), dan laptop Budi masih di (`fitur-db-absen`).

Untuk bersiap tugas besok, Anda dan Budi harus pindah kembali ke ruang utama (`main`) dan menarik (download) kode `main` terbaru dari GitHub _yang sudah berisi gabungan hasil kerja Anda berdua_.

**Anda dan Budi mengetik ini di laptop masing-masing:**

```bash
git checkout main
git pull origin main
```

**Selesai!** Besok harinya saat ingin membuat fitur baru (misal: fitur profil), Anda dan Budi kembali mengulangi langkah ini dari Tahap 2: yaitu membuat branch baru lagi dari `main`.
