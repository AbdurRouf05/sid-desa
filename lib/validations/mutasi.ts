import { z } from "zod";

export const MutasiSchema = z.object({
  id: z.string().optional(),
  nik: z.string().optional(), // Opsional karena untuk yang lahir mungkin belum punya
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter").max(255, "Nama lengkap maksimal 255 karakter"),
  jenis_mutasi: z.enum(["Lahir", "Mati", "Datang", "Pergi"]),
  tanggal_mutasi: z.string().min(1, "Tanggal wajib diisi"), // Menyimpan YYYY-MM-DD
  keterangan: z.string().optional(),
  // dokumen_bukti ditangani manual via form data saat upload karena bertipe file
});

export type MutasiData = z.infer<typeof MutasiSchema>;
