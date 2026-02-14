import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { getGrowthLogs, getRepresentativeSpecies } from "../api/growthLogs";
import type { GrowthSpeciesSection } from "../components/growth-log";
import type { GrowthStatus } from "../../create/api/types";

export default function useGrowthLogs(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.growthLogs(areaId),
    queryFn: () => getGrowthLogs(areaId),
    retry: false,
    select: (res): GrowthSpeciesSection[] => {
      const map = new Map<number, GrowthSpeciesSection>();

      for (const item of res.data.content) {
        if (!map.has(item.speciesId)) {
          map.set(item.speciesId, {
            speciesId: item.speciesId,
            speciesName: item.speciesName,
            logs: [],
          });
        }
        map.get(item.speciesId)!.logs.push({
          id: item.id,
          speciesId: item.speciesId,
          recordDate: item.recordDate,
          growthLength: item.growthLength,
          status: item.status as GrowthStatus,
        });
      }

      return Array.from(map.values());
    },
  });
}

export function useRepresentativeSpecies(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.representativeSpecies(areaId),
    queryFn: () => getRepresentativeSpecies(areaId),
    select: (res) => res.data,
  });
}
