import { z } from "zod";

// Zod schemas for Species
export const SpeciesSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

export const SpeciesArraySchema = z.array(SpeciesSchema);
