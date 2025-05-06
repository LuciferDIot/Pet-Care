import { apiEndpoints } from "@/data";
import { api } from "./api";

import { PetArraySchema, PetSchema } from "@/schema/pet.schema";
import { Pet } from "@/types/pet";

// Pet endpoints
export const petService = {
  fetchAll: async (): Promise<Pet[]> => {
    console.log("Fetching all pets..."); // Debugging

    const response = await api.get(apiEndpoints.getAllPets);

    const validatedData = PetArraySchema.parse(response.data);

    if (!validatedData || !Array.isArray(validatedData)) {
      throw new Error("Invalid data format: Expected an array of pets.");
    }

    return validatedData;
  },

  fetchById: async (id: string): Promise<Pet> => {
    const response = await api.get(apiEndpoints.getPetById(id));
    const validatedData = PetSchema.parse(response.data);
    return validatedData;
  },

  create: async (
    newPet: Omit<Pet, "id" | "mood" | "created_at">
  ): Promise<Pet> => {
    const response = await api.post(apiEndpoints.createPet, newPet);
    const validatedData = PetSchema.parse(response.data);
    return validatedData;
  },

  update: async (pet: Pet): Promise<Pet> => {
    if (!pet.id) {
      throw new Error("Pet ID is required for updating a pet.");
    }
    const response = await api.put(apiEndpoints.updatePet(pet.id), pet);
    const validatedData = PetSchema.parse(response.data);
    return validatedData;
  },

  delete: async (id: string): Promise<string> => {
    await api.delete(apiEndpoints.deletePet(id));
    return id;
  },

  adopt: async (id: string): Promise<Pet> => {
    const response = await api.patch(apiEndpoints.adoptPet(id));
    const validatedData = PetSchema.parse(response.data);
    if (!validatedData.adopted || !validatedData.adoption_date) {
      throw new Error("Adoption failed: adopted or adoption_date not set.");
    }
    return validatedData;
  },
};
