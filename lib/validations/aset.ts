import { z } from "zod";

export const TanahDesaSchema = z.object({
  id: z.string().optional(),
  lokasi: z.string(),
  luas_m2: z.number().positive(),
  peruntukan: z.string().optional(),
  pemegang_hak: z.string().optional(),
});

export type TanahDesa = z.infer<typeof TanahDesaSchema>;
