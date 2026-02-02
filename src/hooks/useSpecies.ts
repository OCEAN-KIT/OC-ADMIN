"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSpecies } from "@/api/species";

export function useSpecies() {
  return useQuery({
    queryKey: ["species"],
    queryFn: fetchSpecies,
    staleTime: 1000 * 60 * 10,
  });
}
