import { useQuery } from "@tanstack/react-query";
import { getMediaLogs } from "../api/mediaLogs";
import type { MediaLogEntry } from "../../create/components/MediaLogSection";
import type { MediaCategory } from "../../create/api/types";

export default function useMediaLogs(areaId: number) {
  return useQuery({
    queryKey: ["areas", areaId, "media-logs"],
    queryFn: () => getMediaLogs(areaId),
    enabled: areaId > 0,
    select: (res): MediaLogEntry[] =>
      res.data.content.map((item) => ({
        id: item.id,
        recordDate: item.recordDate,
        mediaUrl: item.mediaUrl,
        caption: item.caption,
        category: item.category as MediaCategory,
      })),
  });
}
