import { z } from "zod";

export const BkuTypeSchema = z.enum(["Masuk", "Keluar", "Pindah Buku"]);

export const BkuTransaksiSchema = z.object({
  id: z.string().optional(),
  tipe_transaksi: BkuTypeSchema,
  nominal: z.number().positive({ message: "Nominal harus lebih dari 0" }),
  tanggal: z.string().min(1, { message: "Tanggal wajib diisi" }),
  uraian: z.string().min(3, { message: "Uraian terlalu pendek" }),
  rekening_sumber_id: z.string().optional(),
  rekening_tujuan_id: z.string().optional(),
  bukti_file: z.any().optional(), 
  
  // Tax logging support
  pajak_logs: z.object({
    pph21: z.number().default(0),
    pph22: z.number().default(0),
    pph23: z.number().default(0),
    ppn: z.number().default(0),
  }).optional(),

  // Legacy fields for compatibility
  has_pajak: z.boolean().optional(),
  jenis_pajak: z.string().optional(),
  nominal_pajak: z.number().optional(),

  created: z.string().optional(),
  updated: z.string().optional(),
}).refine(data => {
  if (data.tipe_transaksi === "Masuk" && !data.rekening_tujuan_id) {
    return false;
  }
  if (data.tipe_transaksi === "Keluar" && !data.rekening_sumber_id) {
    return false;
  }
  if (data.tipe_transaksi === "Pindah Buku" && (!data.rekening_sumber_id || !data.rekening_tujuan_id || data.rekening_sumber_id === data.rekening_tujuan_id)) {
    return false;
  }
  return true;
}, {
  message: "Pilihan rekening tidak valid untuk tipe transaksi ini",
  path: ["tipe_transaksi"]
});

export const RekeningJenisSchema = z.enum(["Tunai", "Bank"]);

export const RekeningKasSchema = z.object({
  id: z.string().optional(),
  nama_rekening: z.string().min(3, { message: "Nama rekening minimal 3 karakter" }),
  jenis: RekeningJenisSchema,
});

export const PajakJenisSchema = z.enum(["PPN 11%", "PPh 21", "PPh 22", "PPh 23"]);

export const PajakLogSchema = z.object({
  id: z.string().optional(),
  bku_id: z.string().min(1, { message: "Data BKU tidak valid" }),
  jenis_pajak: z.string().min(1, { message: "Jenis pajak wajib diisi" }),
  nominal_pajak: z.number().min(0, { message: "Nominal pajak minimal 0" }),
  status: z.enum(["Belum Disetor", "Sudah Disetor"]).default("Belum Disetor"),
  ntpn: z.string().optional(),
  bukti_setor: z.any().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
}).refine(data => {
  if (data.status === "Sudah Disetor" && (!data.ntpn || data.ntpn.trim() === "")) {
      return false;
  }
  return true;
}, {
  message: "NTPN wajib diisi jika status sudah disetor",
  path: ["ntpn"]
});

export type BkuTransaksiData = z.infer<typeof BkuTransaksiSchema>;
export type RekeningKasForm = z.infer<typeof RekeningKasSchema>;
export type PajakLogForm = z.infer<typeof PajakLogSchema>;

