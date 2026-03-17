import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import type { EnvironmentLogEntry } from "../components/environment-log";
import type { EnvironmentCondition } from "../../create/api/types";

const makeRecordDate = (month: number, day: number) =>
  [2026, month, day] as unknown as string;

const buildEnvironmentEntries = (areaId: number): EnvironmentLogEntry[] => {
  const safeId = Math.trunc(areaId);
  if (!Number.isFinite(safeId) || safeId < 1 || safeId > 10) {
    throw new Error("Environment mock not found");
  }

  const conditionSeq: EnvironmentCondition[] = ["GOOD", "NORMAL", "POOR"];
  const month = ((safeId + 4) % 12) + 1;

  return [
    {
      id: safeId * 3000 + 1,
      recordDate: makeRecordDate(month, 5),
      temperature: Number((11 + safeId * 0.2).toFixed(1)),
      visibility: conditionSeq[(safeId - 1) % conditionSeq.length] ?? "NORMAL",
      current: conditionSeq[safeId % conditionSeq.length] ?? "NORMAL",
      surge: conditionSeq[(safeId + 1) % conditionSeq.length] ?? "NORMAL",
      wave: conditionSeq[(safeId + 2) % conditionSeq.length] ?? "NORMAL",
    },
    {
      id: safeId * 3000 + 2,
      recordDate: makeRecordDate(month, 16),
      temperature: Number((11.5 + safeId * 0.2).toFixed(1)),
      visibility: conditionSeq[safeId % conditionSeq.length] ?? "NORMAL",
      current: conditionSeq[(safeId + 1) % conditionSeq.length] ?? "NORMAL",
      surge: conditionSeq[(safeId + 2) % conditionSeq.length] ?? "NORMAL",
      wave: conditionSeq[(safeId - 1) % conditionSeq.length] ?? "NORMAL",
    },
    {
      id: safeId * 3000 + 3,
      recordDate: makeRecordDate(month, 27),
      temperature: Number((12 + safeId * 0.2).toFixed(1)),
      visibility: conditionSeq[(safeId + 1) % conditionSeq.length] ?? "NORMAL",
      current: conditionSeq[(safeId + 2) % conditionSeq.length] ?? "NORMAL",
      surge: conditionSeq[(safeId - 1) % conditionSeq.length] ?? "NORMAL",
      wave: conditionSeq[safeId % conditionSeq.length] ?? "NORMAL",
    },
  ];
};

export default function useEnvironmentLogs(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.environmentLogs(areaId),
    queryFn: () => Promise.resolve(buildEnvironmentEntries(areaId)),
    retry: false,
    enabled: Number.isFinite(areaId),
  });
}
