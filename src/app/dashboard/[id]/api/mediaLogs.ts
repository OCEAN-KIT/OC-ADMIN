import axiosInstance from "@/utils/axiosInstance";
import type { MediaLogsResponse } from "./types";

export async function getMediaLogs(
  areaId: number,
): Promise<MediaLogsResponse> {
  const res = await axiosInstance.get<MediaLogsResponse>(
    `/api/dashboard/areas/${areaId}/media-logs`,
  );
  return res.data;
}
