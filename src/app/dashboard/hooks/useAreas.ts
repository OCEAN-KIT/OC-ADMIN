"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { getAreas, deleteArea } from "../api/areas";
import { AreaFilters } from "../api/types";

export function useGetAreas(page: number, filters: AreaFilters) {
  return useQuery({
    queryKey: queryKeys.areas.list(page, filters),
    queryFn: () => getAreas(page, filters),
    staleTime: 1000 * 60,
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", "post"],
    mutationFn: (areaId: number) => deleteArea(areaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.areas.all });
    },
  });
}
