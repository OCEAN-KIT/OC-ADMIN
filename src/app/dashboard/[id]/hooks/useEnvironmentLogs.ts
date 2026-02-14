import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { getEnvironmentLogs } from "../api/environmentLogs";
import type { EnvironmentLogEntry } from "../components/environment-log";
import type { EnvironmentCondition } from "../../create/api/types";

export default function useEnvironmentLogs(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.environmentLogs(areaId),
    queryFn: () => getEnvironmentLogs(areaId),
    enabled: areaId > 0,
    select: (res): EnvironmentLogEntry[] =>
      res.data.content.map((item) => ({
        id: item.id,
        recordDate: item.recordDate,
        temperature: item.temperature,
        visibility: item.visibility as EnvironmentCondition,
        current: item.current as EnvironmentCondition,
        surge: item.surge as EnvironmentCondition,
        wave: item.wave as EnvironmentCondition,
      })),
  });
}
