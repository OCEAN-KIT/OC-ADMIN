import axiosInstance from "@/utils/axiosInstance";
import type { GrowthLogsResponse } from "./types";

export async function getGrowthLogs(
  areaId: number,
): Promise<GrowthLogsResponse> {
  const res = await axiosInstance.get<GrowthLogsResponse>(
    `/api/dashboard/areas/${areaId}/growth-logs`,
  );
  return res.data;
}
