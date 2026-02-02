import { useQuery } from "@tanstack/react-query";
import { getAreaDetail } from "../api/areaDetail";
import type { BasicPayload } from "../../create/api/types";
import {
  toRegionCode,
  toHabitatCode,
  toLevelCode,
  toAttachmentStatusCode,
  toDateString,
} from "@/libs/mappers";

export default function useAreaDetail(id: number) {
  return useQuery({
    queryKey: ["areas", id, "detail"],
    queryFn: () => getAreaDetail(id),
    enabled: id > 0,
    select: (res): BasicPayload => {
      const o = res.data.overview;
      return {
        name: o.name,
        restorationRegion: toRegionCode(
          o.restorationRegion,
        ) as BasicPayload["restorationRegion"],
        startDate: toDateString(o.startDate),
        endDate: toDateString(o.endDate) || undefined,
        habitat: toHabitatCode(
          o.habitatType,
        ) as BasicPayload["habitat"],
        depth: o.avgDepth,
        areaSize: o.areaSize,
        level: toLevelCode(
          o.currentStatus.name,
        ) as BasicPayload["level"],
        attachmentStatus: toAttachmentStatusCode(
          o.attachmentStatus,
        ) as BasicPayload["attachmentStatus"],
        lat: o.lat,
        lon: o.lon,
      };
    },
  });
}
