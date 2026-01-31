"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAreas, deleteArea } from "../api/areas";

const AREAS_QUERY_KEY = ["areas"];

export function useGetAreas(page: number) {
  return useQuery({
    queryKey: [...AREAS_QUERY_KEY, page],
    queryFn: () => getAreas(page),
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
