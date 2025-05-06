// hooks/usePersonalities.ts
import { personalityService } from "@/services/personality.service";
import { usePetStore } from "@/stores/pet-store";
import { Personality } from "@/types/pet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePersonalitiesQuery = () => {
  const { setPersonalityList, setIsLoading } = usePetStore();

  return useQuery<Personality[], Error>({
    queryKey: ["personalities"],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const data = await personalityService.fetchAll();
        setPersonalityList(data);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePersonality = () => {
  const { addPersonality } = usePetStore();

  return useMutation<Personality, Error, Omit<Personality, "id">>({
    mutationFn: personalityService.create,
    onSuccess: (data) => {
      addPersonality(data);
      toast.success("Personality created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdatePersonality = () => {
  const { personalityList, setPersonalityList } = usePetStore();

  return useMutation<Personality, Error, Personality>({
    mutationFn: personalityService.update,
    onSuccess: (updatedPersonality) => {
      setPersonalityList(
        personalityList.map((p) =>
          p.id === updatedPersonality.id ? updatedPersonality : p
        )
      );
      toast.success("Personality updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeletePersonality = () => {
  const { personalityList, setPersonalityList } = usePetStore();

  return useMutation<string, Error, string>({
    mutationFn: personalityService.delete,
    onSuccess: (id) => {
      setPersonalityList(personalityList.filter((p) => p.id !== id));
      toast.success("Personality deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
