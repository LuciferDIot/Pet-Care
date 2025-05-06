import { MoodEnum } from "@/types/pet";
import { z } from "zod";
import { SpeciesSchema } from "./species.schema";
import { PersonalitySchema } from "./personality.schema";

// Zod schemas
const MoodEnumSchema = z.nativeEnum(MoodEnum);

export const PetSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  species: SpeciesSchema,
  description: z.string(),
  age: z.number(),
  personality: PersonalitySchema,
  mood: MoodEnumSchema,
  adopted: z.boolean(),
  adoption_date: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  created_at: z.string().transform((val) => new Date(val)),
  image: z.string().optional(),
});

export const PetArraySchema = z.array(PetSchema);
