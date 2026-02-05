"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAreas, deleteArea } from "../api/areas";
import { AreaFilters } from "../api/types";

const AREAS_QUERY_KEY = ["areas"];

export function useGetAreas(page: number, filters: AreaFilters) {
  return useQuery({
    queryKey: [...AREAS_QUERY_KEY, page, filters],
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
      queryClient.invalidateQueries({ queryKey: AREAS_QUERY_KEY });
    },
  });
}
