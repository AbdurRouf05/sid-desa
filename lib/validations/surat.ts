import { z } from "zod";

export const SuratKeluarSchema = z.object({
  id: z.string().optional(),
  nomor_agenda: z.string().min(3, "Nomor Surat minimal 3 karakter").max(100, "Nomor Surat maksimal 100 karakter"),
  nik_pemohon: z.string().length(16, "NIK harus 16 digit").regex(/^[0-9]+$/, "NIK hanya boleh berisi angka"),
  nama_pemohon: z.string().min(3, "Nama pemohon minimal 3 karakter").max(255, "Nama pemohon tidak valid"),
  jenis_surat: z.enum(["Pengantar", "SKTM", "Domisili", "Keterangan Usaha", "Lainnya"]),
  tanggal_dibuat: z.string().min(1, "Tanggal surat wajib diisi"), // YYYY-MM-DD
  keterangan: z.string().optional(),
});

export type SuratKeluarData = z.infer<typeof SuratKeluarSchema>;
