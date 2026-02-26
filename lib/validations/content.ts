import { z } from "zod";

export const BeritaDesaSchema = z.object({
  id: z.string().optional(),
  judul: z.string().min(5),
  slug: z.string(),
  konten: z.string().optional(),
  thumbnail: z.string().optional(),
  kategori: z.enum(["Berita", "Pengumuman", "Kegiatan"]),
  is_published: z.boolean().default(false),
  created: z.string().optional(),
  updated: z.string().optional(),
});

export type BeritaDesa = z.infer<typeof BeritaDesaSchema>;
