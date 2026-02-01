import axiosInstance from "@/utils/axiosInstance";
import type { EnvironmentLogsResponse } from "./types";

export async function getEnvironmentLogs(
  areaId: number,
): Promise<EnvironmentLogsResponse> {
  const res = await axiosInstance.get<EnvironmentLogsResponse>(
    `/api/dashboard/areas/${areaId}/water-logs`,
  );
  return res.data;
}
