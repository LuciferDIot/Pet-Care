import { apiEndpoints } from "@/data";
import {
  PersonalityArraySchema,
  PersonalitySchema,
} from "@/schema/personality.schema";
import { Personality } from "@/types/pet";
import { api } from "./api";

// Personality endpoints
export const personalityService = {
  fetchAll: async (): Promise<Personality[]> => {
    const response = await api.get(apiEndpoints.getAllPersonalities);
    const validatedData = PersonalityArraySchema.parse(response.data);
    return validatedData;
  },

  create: async (
    newPersonality: Omit<Personality, "id">
  ): Promise<Personality> => {
    const response = await api.post(
      apiEndpoints.createPersonality,
      newPersonality
    );
    const validatedData = PersonalitySchema.parse(response.data);
    return validatedData;
  },

  update: async (personality: Personality): Promise<Personality> => {
    if (!personality.id) {
      throw new Error("Personality ID is required for updating a personality.");
    }
    const response = await api.put(
      apiEndpoints.updatePersonality(personality.id),
      personality
    );
    const validatedData = PersonalitySchema.parse(response.data);
    return validatedData;
  },

  delete: async (id: string): Promise<string> => {
    await api.delete(apiEndpoints.deletePersonality(id));
    return id;
  },
};
