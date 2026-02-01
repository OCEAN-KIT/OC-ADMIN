import { useQuery } from "@tanstack/react-query";
import { getAreaDetail } from "../api/areaDetail";
import type { BasicPayload } from "../../create/api/types";

export default function useAreaDetail(id: number) {
  return useQuery({
    queryKey: ["areas", id, "detail"],
    queryFn: () => getAreaDetail(id),
    enabled: id > 0,
    select: (res): BasicPayload => {
      const o = res.data.overview;
      return {
        name: o.name,
        restorationRegion:
          o.restorationRegion as BasicPayload["restorationRegion"],
        startDate: o.startDate,
        endDate: o.endDate || undefined,
        habitat: o.habitatType as BasicPayload["habitat"],
        depth: o.avgDepth,
        areaSize: o.areaSize,
        // 상세조회 API에 없는 필드 → 불러올 수 없음
        level: "",
        attachmentStatus: "",
        lat: 0,
        lon: 0,
      };
    },
  });
}
