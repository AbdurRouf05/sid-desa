import { z } from "zod";

export const BansosSchema = z.object({
  id: z.string().optional(),
  nik: z.string()
    .length(16, "NIK harus 16 digit")
    .regex(/^[0-9]+$/, "NIK hanya boleh berisi angka"),
  nama: z.string()
    .min(3, "Nama penerima minimal 3 karakter")
    .max(255, "Nama penerima maksimal 255 karakter"),
  jenis_bantuan: z.string().min(2, "Jenis bantuan wajib dipilih"),
  tahun_penerimaan: z.coerce.number().min(2000, "Tahun tidak valid").max(2100, "Tahun maksimal 2100"),
});

export type BansosData = z.infer<typeof BansosSchema>;
