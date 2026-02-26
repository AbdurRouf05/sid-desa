import { z } from "zod";

export const ApbdesSchema = z.object({
  id: z.string().optional(),
  tahun_anggaran: z.coerce.number().min(2000, "Tahun anggaran tidak valid").max(2100, "Tahun anggaran terlalu besar"),
  kategori: z.enum(["Pendapatan", "Belanja", "Pembiayaan"]),
  nama_bidang: z.string().min(3, "Nama bidang minimal 3 karakter").max(255, "Nama bidang maksimal 255 karakter"),
  anggaran: z.coerce.number().min(0, "Anggaran tidak boleh negatif"),
  realisasi: z.coerce.number().min(0, "Realisasi tidak boleh negatif"),
});

export type ApbdesData = z.infer<typeof ApbdesSchema>;
