// api/petService.ts
import { apiEndpoints } from "@/data";
import { Pet } from "@/types/pet";
import { api } from "./api";

// Pet endpoints
export const petService = {
  fetchAll: async (): Promise<Pet[]> => {
    const response = await api.get(apiEndpoints.getAllPets);
    return response.data;
  },

  fetchById: async (id: string): Promise<Pet> => {
    const response = await api.get(apiEndpoints.getPetById(id));
    return response.data;
  },

  create: async (
    newPet: Omit<Pet, "id" | "mood" | "created_at">
  ): Promise<Pet> => {
    const response = await api.post(apiEndpoints.createPet, newPet);
    return response.data;
  },

  update: async (pet: Pet): Promise<Pet> => {
    if (!pet.id) {
      throw new Error("Pet ID is required for updating a pet.");
    }
    const response = await api.put(apiEndpoints.updatePet(pet.id), pet);
    return response.data;
  },

  delete: async (id: string): Promise<string> => {
    await api.delete(apiEndpoints.deletePet(id));
    return id;
  },

  adopt: async (id: string): Promise<Pet> => {
    const response = await api.patch(apiEndpoints.adoptPet(id));
    return response.data;
  },
};
