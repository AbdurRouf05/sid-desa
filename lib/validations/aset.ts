import { z } from "zod";

export const TanahDesaSchema = z.object({
  id: z.string().optional(),
  lokasi: z.string(),
  luas_m2: z.number().positive(),
  peruntukan: z.string().optional(),
  pemegang_hak: z.string().optional(),
});

export type TanahDesa = z.infer<typeof TanahDesaSchema>;

export const InventarisDesaSchema = z.object({
  id: z.string().optional(),
  nama_barang: z.string().min(3, { message: "Nama barang wajib diisi minimal 3 karakter" }),
  kategori: z.enum(['Bangunan', 'Kendaraan', 'Elektronik', 'Mebel', 'Lainnya']),
  tahun_perolehan: z.number().min(1900, { message: "Tahun perolehan tidak valid" }).max(new Date().getFullYear() + 1),
  kuantitas: z.number().min(1, { message: "Kuantitas minimal 1" }),
  kondisi: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat', 'Dihapus/Lelang']),
});

export type InventarisDesaForm = z.infer<typeof InventarisDesaSchema>;
