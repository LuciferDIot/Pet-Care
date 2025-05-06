import { apiEndpoints } from "@/data";
import { Species } from "@/types/pet";
import { api } from "./api";

// Species endpoints
export const speciesService = {
  fetchAll: async (): Promise<Species[]> => {
    const response = await api.get(apiEndpoints.getAllSpecies);
    return response.data;
  },

  create: async (newSpecies: Omit<Species, "id">): Promise<Species> => {
    const response = await api.post(apiEndpoints.createSpecies, newSpecies);
    return response.data;
  },

  update: async (species: Species): Promise<Species> => {
    if (!species.id) {
      throw new Error("Species ID is required for updating a species.");
    }
    const response = await api.put(
      apiEndpoints.updateSpecies(species.id),
      species
    );
    return response.data;
  },

  delete: async (id: string): Promise<string> => {
    await api.delete(apiEndpoints.deleteSpecies(id));
    return id;
  },
};
