// api/petService.ts
import { apiEndpoints } from "@/data";
import { Personality, Pet, Species } from "@/types/pet";
import axios from "axios";

// Base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Pet endpoints
export const petService = {
  fetchAll: async (): Promise<Pet[]> => {
    console.log("Fetching all pets...");

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
