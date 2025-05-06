// stores/pet-store.ts
import { SortOption } from "@/components/sort-dropdown";
import { calculateMood } from "@/lib/pet-utils";
import { MoodEnum, Personality, Pet, Species } from "@/types/pet";
import { create } from "zustand";

interface PetStore {
  pets: Pet[];
  filteredPets: Pet[];
  speciesList: Species[];
  personalityList: Personality[];
  selectedMood: MoodEnum | "all";
  selectedSort: SortOption;
  isLoading: boolean;
  error: string | null;
  isAddingPet: boolean;
  editingPet: Pet | null;
  setPets: (pets: Pet[]) => void;
  setFilteredPets: (pets: Pet[]) => void;
  setSpeciesList: (species: Species[]) => void;
  setPersonalityList: (personalities: Personality[]) => void;
  setSelectedMood: (mood: MoodEnum | "all") => void;
  setSelectedSort: (sort: SortOption) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsAddingPet: (isAdding: boolean) => void;
  setEditingPet: (pet: Pet | null) => void;
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  adoptPet: (id: string) => void;
  addSpecies: (species: Species) => void;
  addPersonality: (personality: Personality) => void;
}

export const usePetStore = create<PetStore>((set) => ({
  pets: [],
  filteredPets: [],
  speciesList: [],
  personalityList: [],
  selectedMood: "all",
  selectedSort: "newest",
  isLoading: true,
  error: null,
  isAddingPet: false,
  editingPet: null,
  setPets: (pets) => set({ pets }),
  setFilteredPets: (filteredPets) => set({ filteredPets }),
  setSpeciesList: (speciesList) => set({ speciesList }),
  setPersonalityList: (personalityList) => set({ personalityList }),
  setSelectedMood: (selectedMood) => set({ selectedMood }),
  setSelectedSort: (selectedSort) => set({ selectedSort }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setIsAddingPet: (isAddingPet) => set({ isAddingPet }),
  setEditingPet: (editingPet) => set({ editingPet }),
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
  updatePet: (updatedPet) =>
    set((state) => ({
      pets: state.pets.map((pet) =>
        pet.id === updatedPet.id
          ? {
              ...updatedPet,
              mood: calculateMood(updatedPet.created_at, updatedPet.adopted),
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
      speciesList: state.speciesList.some(
        (s) => s.name === species.name || s.id === species.id
      )
        ? state.speciesList
        : [...state.speciesList, species],
    })),
  addPersonality: (personality) =>
    set((state) => ({
      personalityList: state.personalityList.some(
        (p) => p.name === personality.name || p.id === personality.id
      )
        ? state.personalityList
        : [...state.personalityList, personality],
    })),
}));
