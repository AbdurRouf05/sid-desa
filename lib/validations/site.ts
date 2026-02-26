import { z } from "zod";

export const SiteConfigSchema = z.object({
  id: z.string().optional(),
  nama_desa: z.string().default("Sumberanyar"),
  alamat_lengkap: z.string().default("Jl. Raya Sumberanyar No. 1"),
  kontak_email: z.string().email().optional(),
  kontak_telp: z.string().optional(),
  kepala_desa: z.string().optional(),
  logo_url: z.string().optional(),
  social_links: z.record(z.string(), z.string()).optional(), // explicit key-value string types
  created: z.string().optional(),
  updated: z.string().optional(),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
