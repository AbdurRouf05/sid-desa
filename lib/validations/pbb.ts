import { z } from "zod";

export const PbbSchema = z.object({
  id: z.string().optional(),
  nop: z.string().min(1, "Nomor Objek Pajak (NOP) wajib diisi"),
  nama_wajib_pajak: z.string().min(3, "Nama wajib pajak minimal 3 karakter"),
  status_pembayaran: z.enum(["Belum Lunas", "Lunas"]),
  nominal_tagihan: z.coerce.number().min(0, "Nominal tidak boleh negatif"),
  denda: z.coerce.number().min(0, "Denda tidak boleh negatif").optional().default(0),
  dusun_koordinator: z.string().min(1, "Nama Dusun/Koordinator wajib diisi"),
  tanggal_bayar: z.string().optional(),
});

export type PbbData = z.infer<typeof PbbSchema>;
