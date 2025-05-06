import { petService } from "@/services/pet.service";
import { usePetStore } from "@/stores/pet-store";
import { Pet } from "@/types/pet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const usePetsQuery = () => {
  const { setPets, setFilteredPets, setIsLoading, setError } = usePetStore();

  const queryResult = useQuery<Pet[], Error>({
    queryKey: ["pets"],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const data = await petService.fetchAll();
        setPets(data);
        setFilteredPets(data);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (queryResult.isError) {
      setError(queryResult.error?.message || "Error loading pets");
    }
  }, [queryResult.isError, queryResult.error, setError]);

  return queryResult;
};

export const usePetMutations = () => {
  const { addPet, updatePet, deletePet, adoptPet, addSpecies, addPersonality } =
    usePetStore();

  const addPetMutation = useMutation({
    mutationFn: petService.create,
    onSuccess: (pet) => {
      addPet(pet);
      if (pet.species) addSpecies(pet.species);
      if (pet.personality) addPersonality(pet.personality);
      toast.success(`${pet.name} added successfully!`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const updatePetMutation = useMutation({
    mutationFn: petService.update,
    onSuccess: (pet) => {
      updatePet(pet);
      toast.success(`${pet.name} updated successfully!`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deletePetMutation = useMutation({
    mutationFn: petService.delete,
    onSuccess: (id) => {
      deletePet(id);
      toast.success("Pet deleted successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const adoptPetMutation = useMutation({
    mutationFn: petService.adopt,
    onSuccess: (updatedPet) => {
      if (updatedPet.id) {
        adoptPet(updatedPet.id);
        toast.success("Pet adopted successfully!");
      } else {
        toast.error("Pet ID is missing, adoption failed.");
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    addPetMutation,
    updatePetMutation,
    deletePetMutation,
    adoptPetMutation,
  };
};
