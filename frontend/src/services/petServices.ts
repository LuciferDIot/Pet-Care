// api/petService.ts
import { Personality, Pet, Species } from "@/types/pet";
import axios from "axios";

// Base configuration
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Pet endpoints
export const petService = {
  fetchAll: async (): Promise<Pet[]> => {
    const response = await api.get("/pets");
    return response.data;
  },

  fetchById: async (id: string): Promise<Pet> => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  create: async (
    newPet: Omit<Pet, "id" | "mood" | "created_at">
  ): Promise<Pet> => {
    const response = await api.post("/pets", newPet);
    return response.data;
  },

  update: async (pet: Pet): Promise<Pet> => {
    const response = await api.put(`/pets/${pet.id}`, pet);
    return response.data;
  },

  delete: async (id: string): Promise<string> => {
    await api.delete(`/pets/${id}`);
    return id;
  },

  adopt: async (id: string): Promise<Pet> => {
    const response = await api.patch(`/pets/${id}/adopt`);
    return response.data;
  },
};

// Personality endpoints
export const personalityService = {
  fetchAll: async (): Promise<Personality[]> => {
    const response = await api.get("/personalities");
    return response.data;
  },

  create: async (
    newPersonality: Omit<Personality, "id">
  ): Promise<Personality> => {
    const response = await api.post("/personalities", newPersonality);
    return response.data;
  },

  update: async (personality: Personality): Promise<Personality> => {
    const response = await api.put(
      `/personalities/${personality.id}`,
      personality
    );
    return response.data;
  },

  delete: async (id: string): Promise<string> => {
    await api.delete(`/personalities/${id}`);
    return id;
  },
};

// Species endpoints
export const speciesService = {
  fetchAll: async (): Promise<Species[]> => {
    const response = await api.get("/species");
    return response.data;
  },

  create: async (newSpecies: Omit<Species, "id">): Promise<Species> => {
    const response = await api.post("/species", newSpecies);
    return response.data;
  },

  update: async (species: Species): Promise<Species> => {
    const response = await api.put(`/species/${species.id}`, species);
    return response.data;
  },

  delete: async (id: string): Promise<string> => {
    await api.delete(`/species/${id}`);
    return id;
  },
};
