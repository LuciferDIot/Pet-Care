import { z } from "zod";

// Zod schemas for Personality
export const PersonalitySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

export const PersonalityArraySchema = z.array(PersonalitySchema);
