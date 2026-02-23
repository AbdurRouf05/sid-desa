import { z } from "zod";

export const PerangkatDesaSchema = z.object({
  id: z.string().optional(),
  nama: z.string().min(2),
  jabatan: z.string(),
  nip: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const SuratKeluarSchema = z.object({
  id: z.string().optional(),
  nomor_agenda: z.number().int().positive(),
  kode_surat: z.string(),
  tujuan: z.string(),
  tanggal_surat: z.string().datetime(),
  file_arsip: z.string().optional(),
  signed_by: z.string(), // ID of PerangkatDesa
});

export type PerangkatDesa = z.infer<typeof PerangkatDesaSchema>;
export type SuratKeluar = z.infer<typeof SuratKeluarSchema>;
