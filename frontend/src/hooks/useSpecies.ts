// hooks/useSpecies.ts
import { speciesService } from "@/services/petServices";
import { usePetStore } from "@/stores/pet-store";
import { Species } from "@/types/pet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSpeciesQuery = () => {
  const { setSpeciesList, setIsLoading } = usePetStore();

  return useQuery<Species[], Error>({
    queryKey: ["species"],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const data = await speciesService.fetchAll();
        setSpeciesList(data);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSpecies = () => {
  const { addSpecies } = usePetStore();

  return useMutation<Species, Error, Omit<Species, "id">>({
    mutationFn: speciesService.create,
    onSuccess: (data) => {
      addSpecies(data);
      toast.success("Species created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateSpecies = () => {
  const { speciesList, setSpeciesList } = usePetStore();

  return useMutation<Species, Error, Species>({
    mutationFn: speciesService.update,
    onSuccess: (updatedSpecies) => {
      setSpeciesList(
        speciesList.map((s) =>
          s.id === updatedSpecies.id ? updatedSpecies : s
        )
      );
      toast.success("Species updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteSpecies = () => {
  const { speciesList, setSpeciesList } = usePetStore();

  return useMutation<string, Error, string>({
    mutationFn: speciesService.delete,
    onSuccess: (id) => {
      setSpeciesList(speciesList.filter((s) => s.id !== id));
      toast.success("Species deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
