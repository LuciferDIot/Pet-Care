import { z } from "zod";

export const petCreateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string().min(1, "Species is required"),
  age: z.number().min(0, "Age must be a positive number"),
  personality: z.string().min(1, "Personality is required"),
  description: z.string(),
  image: z.string().optional(),
});

export type PetFormValues = z.infer<typeof petCreateFormSchema>;
