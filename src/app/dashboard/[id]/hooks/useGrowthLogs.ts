import { useQuery } from "@tanstack/react-query";
import { getGrowthLogs } from "../api/growthLogs";
import type { GrowthSpeciesSection } from "../../create/components/growth-log";
import type { GrowthStatus } from "../../create/api/types";

export default function useGrowthLogs(areaId: number) {
  return useQuery({
    queryKey: ["areas", areaId, "growth-logs"],
    queryFn: () => getGrowthLogs(areaId),
    enabled: areaId > 0,
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
          isRepresentative: item.isRepresentative,
          recordDate: item.recordDate,
          attachmentRate: item.attachmentRate,
          survivalRate: item.survivalRate,
          growthLength: item.growthLength,
          status: item.status as GrowthStatus,
        });
      }

      return Array.from(map.values());
    },
  });
}
