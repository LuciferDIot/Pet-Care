import { petService } from "@/services/petServices";
import { usePetStore } from "@/stores/pet-store";
import { Pet } from "@/types/pet";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const usePetById = (
  id: string,
  options?: Omit<UseQueryOptions<Pet, Error>, "queryKey" | "queryFn">
) => {
  const { setIsLoading } = usePetStore();
  return useQuery<Pet, Error>({
    queryKey: ["pet", id],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const data = await petService.fetchById(id);
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
};
