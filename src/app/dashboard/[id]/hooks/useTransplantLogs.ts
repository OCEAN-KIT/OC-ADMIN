import { useQuery } from "@tanstack/react-query";
import { getTransplantLogs } from "../api/transplantLogs";
import type { SpeciesSection } from "../../create/components/transplant-log";
import type {
  TransplantMethod,
  SpeciesAttachmentStatus,
} from "../../create/api/types";

export default function useTransplantLogs(areaId: number) {
  return useQuery({
    queryKey: ["areas", areaId, "transplant-logs"],
    queryFn: () => getTransplantLogs(areaId),
    enabled: areaId > 0,
    select: (res): SpeciesSection[] => {
      const map = new Map<number, SpeciesSection>();

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
          recordDate: item.recordDate,
          method: item.method as TransplantMethod,
          speciesId: item.speciesId,
          count: item.count,
          areaSize: item.areaSize,
          attachmentStatus: item.attachmentStatus as SpeciesAttachmentStatus,
          methodLabel: item.methodName,
          unit: item.unit,
        });
      }

      return Array.from(map.values());
    },
  });
}
