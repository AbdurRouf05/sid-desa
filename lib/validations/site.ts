import { z } from "zod";

export const SiteConfigSchema = z.object({
  id: z.string().optional(),
  nama_desa: z.string().default("Sumberanyar"),
  alamat_lengkap: z.string().default("Jl. Raya Sumberanyar No. 1"),
  kontak_email: z.string().email().or(z.literal("")).optional().default(""),
  kontak_telp: z.string().optional().default(""),
  kepala_desa: z.string().optional().default("-"),
  logo_url: z.string().optional().default(""),
  logo_primary: z.string().optional(),
  logo_secondary: z.string().optional(),
  social_links: z.record(z.string(), z.string()).optional().default({}),
  created: z.string().optional(),
  updated: z.string().optional(),
});


export type SiteConfig = z.infer<typeof SiteConfigSchema>;
