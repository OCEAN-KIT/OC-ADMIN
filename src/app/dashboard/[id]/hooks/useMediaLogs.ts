import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import type { MediaLogEntry } from "../components/MediaLogSection";
import type { MediaCategory } from "../../create/api/types";

const makeRecordDate = (month: number, day: number) =>
  [2026, month, day] as unknown as string;

const buildMediaEntries = (areaId: number): MediaLogEntry[] => {
  const safeId = Math.trunc(areaId);
  if (!Number.isFinite(safeId) || safeId < 1 || safeId > 10) {
    throw new Error("Media mock not found");
  }

  const month = ((safeId + 6) % 12) + 1;

  const fixed = (
    category: MediaCategory,
    day: number,
    caption: string,
  ): MediaLogEntry => ({
    id: safeId * 4000 + day,
    recordDate: makeRecordDate(month, day),
    mediaUrl: "",
    caption,
    category,
  });

  return [
    fixed("BEFORE", 3, "작업 전 구역 상태"),
    fixed("AFTER", 21, "작업 후 구역 상태"),
    fixed("TIMELINE", 10, "중간 점검"),
    fixed("TIMELINE", 17, "추가 관찰"),
  ];
};

export default function useMediaLogs(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.mediaLogs(areaId),
    queryFn: () => Promise.resolve(buildMediaEntries(areaId)),
    retry: false,
    enabled: Number.isFinite(areaId),
  });
}
