# LOGBOOK MINGGUAN — Member 1 (Modul Keuangan BKU & Pajak)

> **Nama:** [ISI_NAMA]
> **NIM:** [ISI_NIM]
> **Peran:** Fullstack Developer — Modul Keuangan
> **Proyek:** SID Sumberanyar

---

## Minggu 1 — Pembersihan Legacy
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Studi arsitektur modul Buku Kas Umum (BKU) | Mempelajari alur keuangan desa, relasi rekening, dan skema pajak yang akan dibangun di Bulan 3 |
| Membantu PM dalam proses pembersihan boilerplate | Ikut serta dalam penghapusan modul legacy BMT NU |

---

## Minggu 2 — Portal Informasi Warga
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Persiapan referensi sistem akuntansi desa | Mempelajari format Buku Kas Umum resmi dan aturan perpajakan PPN/PPh untuk implementasi di sprint berikutnya |

---

## Minggu 3 — Dashboard Transparansi APBDes
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Konfigurasi koleksi `apbdes_realisasi` di PocketBase | Skema data (Pendapatan, Belanja, Pembiayaan) berhasil dirancang |
| Membangun form input data APBDes di panel admin | Form CRUD APBDes selesai — `apbdes/form.tsx` (12KB), `page.tsx` (11.8KB) |

---

## Minggu 4 — Pengaduan Mandiri
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Persiapan desain arsitektur tabel keuangan BKU | Merancang relasi tabel `rekening_kas`, `bku_transaksi`, dan `pajak_log` |

---

## Minggu 5–8 — (Periode Member 2 Aktif / Persuratan)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Studi lanjutan perpajakan dan skema transaksi BKU | Finalisasi desain database relasional keuangan sebelum implementasi di Bulan 3 |
| Support review ke member lain jika dibutuhkan | Membantu testing modul mutasi dan persuratan |

---

## Minggu 9 — Relasional Kas Dasar BKU
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Membangun modul CRUD Master Rekening Desa | Form dan tabel rekening (Tunai/Bank) selesai — `bku/rekening/form.tsx` (21.8KB), `page.tsx` (14.5KB) |
| Membangun form transaksi Kas Masuk & Kas Keluar | Input nominal, pilihan rekening, kategori, upload bukti nota — `bku/transaksi/form.tsx` (25.1KB) |

---

## Minggu 10 — Pindah Buku (Transfer Lintas Kas)
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Membangun logika form Pindah Buku | Dropdown Rekening Sumber → Tujuan, validasi tipe perpindahan (Tunai↔Bank, Bank↔Bank, dst) selesai |
| Implementasi validasi saldo real-time | Sistem Running Balance menolak transaksi jika saldo sumber tidak mencukupi |

---

## Minggu 11 — Sistem Kalkulasi Pajak BKU
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Menambahkan kalkulasi otomatis PPN 11% / PPh manual | Checkbox pajak di form Transaksi Keluar berfungsi dengan kalkulasi otomatis |
| Membangun halaman Log Pencatatan Pajak | Tabel pajak dengan status "Belum Disetor" / "Sudah Disetor" — `bku/pajak/page.tsx` (25.4KB) |

---

## Minggu 12 — Pembayaran Pajak & Ekspor BKU
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Fitur pelunasan pajak | Update status + upload bukti slip setor NTPN berfungsi |
| Fitur ekspor XLSX laporan BKU | Ekspor Excel dengan rumus arus kas bulanan selesai — `bku/transaksi/page.tsx` (26.7KB) |

---

## Minggu 13 — Manajemen Aset
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Support testing dan review modul Aset (M4) | Membantu verifikasi integrasi data aset |

---

## Minggu 14 — Cleanup Storage
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Verifikasi cascade delete pada modul BKU | Nota/bukti transaksi terhapus otomatis saat record BKU dihapus — berfungsi benar |

---

## Minggu 15 — Polishing UI
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Integrasi Toast (Sonner) pada seluruh form BKU | Notifikasi Sukses/Error konsisten di form transaksi, rekening, dan pajak |

---

## Minggu 16 — UAT & Deployment
**Tanggal:** [ISI_TANGGAL]

| Aktivitas | Hasil |
|-----------|-------|
| Simulasi UAT Bendahara | Alur lengkap: Input transaksi → Pindah Buku → Pajak → Pelunasan → Ekspor XLSX berjalan tanpa error |
