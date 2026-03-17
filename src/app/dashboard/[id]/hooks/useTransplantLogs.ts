import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import type { SpeciesSection } from "../components/transplant-log";
import type {
  TransplantMethod,
  SpeciesAttachmentStatus,
} from "../../create/api/types";
import { resolveWithMockDelay } from "./mockDelay";

const makeRecordDate = (month: number, day: number) =>
  [2026, month, day] as unknown as string;

const buildTransplantSections = (areaId: number): SpeciesSection[] => {
  const safeId = Math.trunc(areaId);
  if (!Number.isFinite(safeId) || safeId < 1 || safeId > 10) {
    throw new Error("Transplant mock not found");
  }

  const methodById: { value: TransplantMethod; label: string; unit: string }[] = [
    { value: "ROPE", label: "로프", unit: "m" },
    { value: "ROCK_FIXATION", label: "암반 고정", unit: "지점" },
    { value: "TRANSPLANT_MODULE", label: "이식 모듈", unit: "기" },
    { value: "SEEDLING_STRING", label: "종묘줄", unit: "줄" },
  ];
  const method = methodById[(safeId - 1) % methodById.length] ?? {
    value: "ROPE",
    label: "로프",
    unit: "m",
  };

  const statusA: SpeciesAttachmentStatus = safeId % 2 === 0 ? "GOOD" : "NORMAL";
  const statusB: SpeciesAttachmentStatus = safeId % 3 === 0 ? "POOR" : "NORMAL";
  const month = ((safeId - 1) % 12) + 1;

  return [
    {
      speciesId: 101,
      speciesName: "감태",
      logs: [
        {
          id: safeId * 1000 + 1,
          recordDate: makeRecordDate(month, 4),
          method: method.value,
          speciesId: 101,
          count: 12 + safeId,
          areaSize: 120 + safeId * 8,
          attachmentStatus: statusA,
          methodLabel: method.label,
          unit: method.unit,
        },
        {
          id: safeId * 1000 + 2,
          recordDate: makeRecordDate(month, 18),
          method: method.value,
          speciesId: 101,
          count: 9 + safeId,
          areaSize: 95 + safeId * 7,
          attachmentStatus: statusB,
          methodLabel: method.label,
          unit: method.unit,
        },
      ],
    },
    {
      speciesId: 102,
      speciesName: "다시마",
      logs: [
        {
          id: safeId * 1000 + 3,
          recordDate: makeRecordDate(month, 26),
          method: "DIRECT_FIXATION",
          speciesId: 102,
          count: 7 + safeId,
          areaSize: 80 + safeId * 6,
          attachmentStatus: "NORMAL",
          methodLabel: "직접 고정 지점",
          unit: "지점",
        },
      ],
    },
  ];
};

export default function useTransplantLogs(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.transplantLogs(areaId),
    queryFn: () => resolveWithMockDelay(buildTransplantSections(areaId), 1800),
    retry: false,
    enabled: Number.isFinite(areaId),
  });
}
