# Catatan Perbaikan Bug - Modul BKU

Dokumen ini melacak bug yang ditemukan dan diperbaiki selama tahap audit / operasional untuk Modul Buku Kas Umum (BKU).

| No | Deskripsi Bug | Lokasi Komponen | Status | Penjelasan & Solusi |
|---|---|---|---|---|
| 1 | **Tidak bisa memasukkan input / mengetik di field Nominal** pada halaman log transaksi BKU (React Hook Form state collision). | `components/ui/form-input.tsx` | **FIXED** | _Penyebab:_ Komponen `FormInput` untuk mode `numeric` merender input `<input value={displayValue} ...>` di mana `value` di-override menjadi _controlled_ tanpa menyediakan _internal state_ karena `react-hook-form` tidak memberikan `value` saat mode _uncontrolled_. Akibatnya _input_ nominal selalu tertahan di nilai kosong `""`. <br><br> _Solusi:_ Komponen `FormInput.tsx` telah di-_refactor_ untuk mengelola nilai pengetikan string lokal (`localValue`) secara hybrid, memformat titik (ribuan) secara visual selagi _user_ mengetik, lalu meneruskan nilai numerik mentah (*raw numeric string*) ke *React Hook Form* di belakang layar tanpa konflik pada DOM *component* React. |
