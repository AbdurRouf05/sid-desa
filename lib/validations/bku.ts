import { z } from "zod";

export const BkuTypeSchema = z.enum(["masuk", "keluar", "pindah"]);

export const BkuTransactionSchema = z.object({
  id: z.string().optional(),
  type: BkuTypeSchema,
  amount: z.number().positive(),
  tanggal: z.string().datetime(),
  uraian: z.string().min(3),
  bukti_foto: z.string().optional(), // File name/ID in PocketBase
  kode_anggaran: z.string().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
});

export const PajakJenisSchema = z.enum(["ppn", "pph"]);

export const PajakLogSchema = z.object({
  id: z.string().optional(),
  bku_id: z.string(),
  jenis: PajakJenisSchema,
  nominal: z.number().nonnegative(),
  is_disetor: z.boolean().default(false),
  created: z.string().optional(),
  updated: z.string().optional(),
});

export type BkuTransaction = z.infer<typeof BkuTransactionSchema>;
export type PajakLog = z.infer<typeof PajakLogSchema>;
