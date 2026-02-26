import { z } from "zod";

export const PengaduanSchema = z.object({
  id: z.string().optional(),
  nama_pelapor: z.string().min(3, "Nama pelapor minimal 3 karakter").max(255, "Nama pelapor maksimal 255 karakter"),
  tempat_tinggal: z.string().min(5, "Alamat minimal 5 karakter").max(500, "Alamat terlalu panjang"),
  isi_laporan: z.string().min(10, "Isi laporan minimal 10 karakter"),
  status: z.enum(["Baru", "Diproses", "Selesai"]).default("Baru"),
});

export type PengaduanData = z.infer<typeof PengaduanSchema>;
