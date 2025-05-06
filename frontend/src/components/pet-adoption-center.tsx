// components/pet-adoption-center.tsx
import { usePetsQuery } from "@/hooks/usePets";
import { calculateMood } from "@/lib/pet-utils";
import { usePetStore } from "@/stores/pet-store";
import { MoodEnum, Pet } from "@/types/pet";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import FilterBar from "./filter-bar";
import PetForm from "./pet-form";
import PetGrid from "./pet-grid";
import type { SortOption } from "./sort-dropdown";

export default function PetAdoptionCenter() {
  const {
    pets,
    selectedMood,
    selectedSort,
    isAddingPet,
    editingPet,
    setSelectedMood,
    setSelectedSort,
    setIsAddingPet,
    setEditingPet,
    setFilteredPets,
  } = usePetStore();

  const petsQuery = usePetsQuery();

  // Update moods based on time in system
  useEffect(() => {
    const interval = setInterval(() => {
      usePetStore.getState().setPets(
        pets.map((pet) => ({
          ...pet,
          mood: calculateMood(pet.created_at, pet.adopted),
        }))
      );
    }, 5 * 60 * 60 * 1000); // Check every 5 hours

    return () => clearInterval(interval);
  }, [pets]);

  // Filter and sort pets when pets, filter, or sort changes
  useEffect(() => {
    if (pets.length === 0) return;

    let result = [...pets];

    if (selectedMood !== "all") {
      result = result.filter((pet) => pet.mood === selectedMood);
    }

    result = sortPets(result, selectedSort);
    setFilteredPets(result);
  }, [selectedMood, selectedSort, pets, setFilteredPets]);

  const sortPets = (petsToSort: Pet[], sortOption: SortOption): Pet[] => {
    const sorted = [...petsToSort];

    switch (sortOption) {
      case "newest":
        return sorted.sort(
          (a, b) => b.created_at.getTime() - a.created_at.getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) => a.created_at.getTime() - b.created_at.getTime()
        );
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "adopted-first":
        return sorted.sort((a, b) =>
          a.adopted === b.adopted ? 0 : a.adopted ? -1 : 1
        );
      case "unadopted-first":
        return sorted.sort((a, b) =>
          a.adopted === b.adopted ? 0 : a.adopted ? 1 : -1
        );
      case "species-asc":
        return sorted.sort((a, b) =>
          a.species.name.localeCompare(b.species.name)
        );
      case "personality-asc":
        return sorted.sort((a, b) =>
          a.personality.name.localeCompare(b.personality.name)
        );
      default:
        return sorted;
    }
  };

  const handleFilterChange = (mood: MoodEnum | "all") => {
    setSelectedMood(mood);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          Virtual Pet Adoption Center
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </h1>
        <p className="text-lg text-purple-600 max-w-2xl mx-auto">
          Find your perfect virtual companion! Browse our adorable pets and give
          them a loving home.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4">
        <FilterBar
          selectedMood={selectedMood}
          onFilterChange={handleFilterChange}
          selectedSort={selectedSort}
          onSortChange={handleSortChange}
        />

        <div className="flex justify-end">
          <button
            onClick={() => setIsAddingPet(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Add New Pet
          </button>
        </div>
      </div>

      {petsQuery.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-bounce flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-purple-600 font-medium">Loading pets...</p>
          </div>
        </div>
      ) : petsQuery.isError ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 font-medium mb-4">
              Failed to load pets. Please try again.
            </p>
            <button
              onClick={() => petsQuery.refetch()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <PetGrid onEdit={setEditingPet} />
      )}

      {isAddingPet && <PetForm onCancel={() => setIsAddingPet(false)} />}

      {editingPet && <PetForm onCancel={() => setEditingPet(null)} />}
    </div>
  );
}
