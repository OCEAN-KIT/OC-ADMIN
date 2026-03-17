import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import type { BasicPayload } from "../../create/api/types";

const REGION_SEQ: BasicPayload["restorationRegion"][] = ["POHANG", "ULJIN"];
const HABITAT_SEQ: BasicPayload["habitat"][] = ["ROCKY", "MIXED", "OTHER"];
const NAME_SEQ = [
  "포항 상층암반 복원구역 A",
  "울진 갯벌 복원구역 B",
  "포항 인공어초 복원지 C",
  "울진 해조군락 보호지 D",
  "포항 수심복원지 E",
  "울진 수중산호 서식지 F",
  "포항 생태회복 해역 G",
  "울진 암반 정착지 H",
  "포항 다층부착 지점 I",
  "울진 해안 회복지 J",
] as const;
const LEVEL_SEQ: BasicPayload["level"][] = [
  "OBSERVATION",
  "SETTLEMENT",
  "GROWTH",
  "MANAGEMENT",
];
const ATTACHMENT_SEQ: BasicPayload["attachmentStatus"][] = [
  "STABLE",
  "DECREASED",
  "UNSTABLE",
];

const getMockAreaBasicPayload = (id: number): BasicPayload => {
  const safeId = Math.trunc(id);
  if (!Number.isFinite(safeId) || safeId < 1 || safeId > 10) {
    throw new Error("Dashboard area mock not found");
  }

  const mm = String(((safeId - 1) % 12) + 1).padStart(2, "0");
  const dd = String(((safeId * 2) % 28) + 1).padStart(2, "0");

  return {
    name: NAME_SEQ[safeId - 1] ?? `대시보드 관리 구역 ${String(safeId).padStart(3, "0")}`,
    restorationRegion:
      REGION_SEQ[(safeId - 1) % REGION_SEQ.length] ?? "POHANG",
    startDate: `2025-${mm}-${dd}`,
    endDate: `2026-${mm}-${dd}`,
    habitat: HABITAT_SEQ[(safeId - 1) % HABITAT_SEQ.length] ?? "ROCKY",
    depth: Number((6.5 + safeId * 0.8).toFixed(1)),
    areaSize: 700 + safeId * 120,
    level: LEVEL_SEQ[(safeId - 1) % LEVEL_SEQ.length] ?? "OBSERVATION",
    attachmentStatus:
      ATTACHMENT_SEQ[(safeId - 1) % ATTACHMENT_SEQ.length] ?? "STABLE",
    lat: Number((36 + safeId * 0.01).toFixed(6)),
    lon: Number((129.2 + safeId * 0.01).toFixed(6)),
  };
};

export default function useAreaDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.areas.detail(id),
    queryFn: () => Promise.resolve(getMockAreaBasicPayload(id)),
    retry: false,
    enabled: Number.isFinite(id),
  });
}
