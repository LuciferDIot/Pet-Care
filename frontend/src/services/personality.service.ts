import { apiEndpoints } from "@/data";
import { Personality } from "@/types/pet";
import { api } from "./api";

// Personality endpoints
export const personalityService = {
  fetchAll: async (): Promise<Personality[]> => {
    const response = await api.get(apiEndpoints.getAllPersonalities);
    return response.data;
  },

  create: async (
    newPersonality: Omit<Personality, "id">
  ): Promise<Personality> => {
    const response = await api.post(
      apiEndpoints.createPersonality,
      newPersonality
    );
    return response.data;
  },

  update: async (personality: Personality): Promise<Personality> => {
    if (!personality.id) {
      throw new Error("Personality ID is required for updating a personality.");
    }
    const response = await api.put(
      apiEndpoints.updatePersonality(personality.id),
      personality
    );
    return response.data;
  },

  delete: async (id: string): Promise<string> => {
    await api.delete(apiEndpoints.deletePersonality(id));
    return id;
  },
};
