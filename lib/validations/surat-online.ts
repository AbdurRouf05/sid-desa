import { z } from "zod";

export const SuratOnlineSchema = z.object({
  nik: z.string()
    .length(16, "NIK harus 16 digit")
    .regex(/^[0-9]+$/, "NIK hanya boleh berisi angka"),
  nama: z.string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(255, "Nama terlalu panjang"),
  jenis_surat: z.string().min(1, "Pilih jenis surat yang dibutuhkan"),
  alamat_rantau: z.string().min(5, "Alamat rantau wajib diisi lengkap"),
  no_wa: z.string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .max(15, "Nomor WhatsApp maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor hanya boleh berisi angka"),
});

export type SuratOnlineData = z.infer<typeof SuratOnlineSchema>;
