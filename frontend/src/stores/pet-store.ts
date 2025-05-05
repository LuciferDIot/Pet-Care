// stores/pet-store.ts
import { SortOption } from "@/components/sort-dropdown";
import { calculateMood } from "@/lib/pet-utils";
import { MoodEnum, Pet } from "@/types/pet";
import { create } from "zustand";

interface PetStore {
  pets: Pet[];
  filteredPets: Pet[];
  speciesList: string[];
  personalityList: string[];
  selectedMood: MoodEnum | "all";
  selectedSort: SortOption;
  isLoading: boolean;
  setPets: (pets: Pet[]) => void;
  setFilteredPets: (pets: Pet[]) => void;
  setSpeciesList: (species: string[]) => void;
  setPersonalityList: (personalities: string[]) => void;
  setSelectedMood: (mood: MoodEnum | "all") => void;
  setSelectedSort: (sort: SortOption) => void;
  setIsLoading: (loading: boolean) => void;
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  adoptPet: (id: string) => void;
  addSpecies: (species: string) => void;
  addPersonality: (personality: string) => void;
}

export const usePetStore = create<PetStore>((set) => ({
  pets: [],
  filteredPets: [],
  speciesList: [],
  personalityList: [],
  selectedMood: "all",
  selectedSort: "newest",
  isLoading: true,
  setPets: (pets) => set({ pets }),
  setFilteredPets: (filteredPets) => set({ filteredPets }),
  setSpeciesList: (speciesList) => set({ speciesList }),
  setPersonalityList: (personalityList) => set({ personalityList }),
  setSelectedMood: (selectedMood) => set({ selectedMood }),
  setSelectedSort: (selectedSort) => set({ selectedSort }),
  setIsLoading: (isLoading) => set({ isLoading }),
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
  updatePet: (updatedPet) =>
    set((state) => ({
      pets: state.pets.map((pet) =>
        pet.id === updatedPet.id
          ? {
              ...updatedPet,
              mood: calculateMood(updatedPet.created_at),
            }
          : pet
      ),
    })),
  deletePet: (id) =>
    set((state) => ({ pets: state.pets.filter((pet) => pet.id !== id) })),
  adoptPet: (id) =>
    set((state) => ({
      pets: state.pets.map((pet) =>
        pet.id === id
          ? {
              ...pet,
              adopted: true,
              adoption_date: new Date(),
            }
          : pet
      ),
    })),
  addSpecies: (species) =>
    set((state) => ({
      speciesList: state.speciesList.includes(species)
        ? state.speciesList
        : [...state.speciesList, species],
    })),
  addPersonality: (personality) =>
    set((state) => ({
      personalityList: state.personalityList.includes(personality)
        ? state.personalityList
        : [...state.personalityList, personality],
    })),
}));
