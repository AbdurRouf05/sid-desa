import { z } from "zod";

export const SiteConfigSchema = z.object({
  id: z.string().optional(),
  name: z.string().default("Sumberanyar"),
  alamat: z.string().default("Jl. Raya Sumberanyar No. 1"),
  phone_wa: z.string().optional(),
  email_official: z.string().optional(),
  kepala_desa: z.string().optional(),
  logo_primary: z.string().optional(),
  favicon: z.string().optional(),
  og_image: z.string().optional(),
  social_links: z.record(z.string(), z.string()).optional(),
  last_revalidated: z.string().optional(),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
