import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpecies, updateSpecies, deleteSpecies } from "../api/species";
import type { CreateSpeciesRequest } from "../api/types";

export function useCreateSpecies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["species", "create"],
    mutationFn: (data: CreateSpeciesRequest) => createSpecies(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["species"],
      });
    },
  });
}

export function useUpdateSpecies(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["species", id, "update"],
    mutationFn: (name: string) => updateSpecies(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["species"],
      });
    },
  });
}

export function useDeleteSpecies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["species", "delete"],
    mutationFn: (id: number) => deleteSpecies(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["species"],
      });
    },
  });
}
