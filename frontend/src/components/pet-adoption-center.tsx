import {
  calculateMood,
  defaultPersonalities,
  defaultSpecies,
  generateRandomPets,
} from "@/lib/pet-utils";
import { MoodEnum, Pet } from "@/types/pet";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import FilterBar from "./filter-bar";
import PetForm from "./pet-form";
import PetGrid from "./pet-grid";
import type { SortOption } from "./sort-dropdown";

export default function PetAdoptionCenter() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodEnum | "all">("all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("newest");
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Track available species and personalities
  const [speciesList, setSpeciesList] = useState<string[]>(defaultSpecies);
  const [personalityList, setPersonalityList] =
    useState<string[]>(defaultPersonalities);

  useEffect(() => {
    // Simulate API call to fetch pets
    const loadPets = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        const initialPets = generateRandomPets(8);
        setPets(initialPets);
        setFilteredPets(initialPets);
      } catch (error) {
        console.error("Failed to load pets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPets();
  }, []);

  // Update moods based on time in system
  useEffect(() => {
    const interval = setInterval(() => {
      setPets((currentPets) =>
        currentPets.map((pet) => ({
          ...pet,
          mood: calculateMood(pet.created_at),
        }))
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Filter and sort pets when pets, filter, or sort changes
  useEffect(() => {
    // First filter by mood
    let result = [...pets];

    if (selectedMood !== "all") {
      result = result.filter((pet) => pet.mood === selectedMood);
    }

    // Then sort
    result = sortPets(result, selectedSort);

    setFilteredPets(result);
  }, [selectedMood, selectedSort, pets]);

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
        return sorted.sort((a, b) => a.species.localeCompare(b.species));
      case "personality-asc":
        return sorted.sort((a, b) =>
          a.personality.localeCompare(b.personality)
        );
      default:
        return sorted;
    }
  };

  const handleAddSpecies = (species: string) => {
    if (!speciesList.includes(species)) {
      setSpeciesList((prev) => [...prev, species]);
    }
  };

  const handleAddPersonality = (personality: string) => {
    if (!personalityList.includes(personality)) {
      setPersonalityList((prev) => [...prev, personality]);
    }
  };

  const handleAddPet = (newPet: Omit<Pet, "id" | "mood" | "created_at">) => {
    const now = new Date();
    const pet: Pet = {
      ...newPet,
      id: Date.now().toString(),
      mood: MoodEnum.Happy,
      created_at: now,
      adopted: false,
      description: newPet.description || "",
    };

    // Add new species and personality to lists if they don't exist
    if (newPet.species && !speciesList.includes(newPet.species)) {
      setSpeciesList((prev) => [...prev, newPet.species]);
    }

    if (newPet.personality && !personalityList.includes(newPet.personality)) {
      setPersonalityList((prev) => [...prev, newPet.personality]);
    }

    setPets((prevPets) => [...prevPets, pet]);
    setIsAddingPet(false);
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    // Add new species and personality to lists if they don't exist
    if (updatedPet.species && !speciesList.includes(updatedPet.species)) {
      setSpeciesList((prev) => [...prev, updatedPet.species]);
    }

    if (
      updatedPet.personality &&
      !personalityList.includes(updatedPet.personality)
    ) {
      setPersonalityList((prev) => [...prev, updatedPet.personality]);
    }

    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === updatedPet.id
          ? {
              ...updatedPet,
              mood: calculateMood(updatedPet.created_at), // Recalculate mood
            }
          : pet
      )
    );
    setEditingPet(null);
  };

  const handleDeletePet = (id: string) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
  };

  const handleAdoptPet = (id: string) => {
    setPets((prevPets) =>
      prevPets.map((pet) =>
        pet.id === id
          ? {
              ...pet,
              adopted: true,
              adoption_date: new Date(),
            }
          : pet
      )
    );
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-bounce flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-purple-600 font-medium">Loading pets...</p>
          </div>
        </div>
      ) : (
        <PetGrid
          pets={filteredPets}
          onEdit={setEditingPet}
          onDelete={handleDeletePet}
          onAdopt={handleAdoptPet}
        />
      )}

      {isAddingPet && (
        <PetForm
          onSubmit={handleAddPet}
          onCancel={() => setIsAddingPet(false)}
          speciesList={speciesList}
          personalityList={personalityList}
          onAddSpecies={handleAddSpecies}
          onAddPersonality={handleAddPersonality}
        />
      )}

      {editingPet && (
        <PetForm
          pet={editingPet}
          onSubmit={handleUpdatePet}
          onCancel={() => setEditingPet(null)}
          speciesList={speciesList}
          personalityList={personalityList}
          onAddSpecies={handleAddSpecies}
          onAddPersonality={handleAddPersonality}
        />
      )}
    </div>
  );
}
