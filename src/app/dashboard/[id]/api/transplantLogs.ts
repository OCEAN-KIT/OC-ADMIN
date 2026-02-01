import axiosInstance from "@/utils/axiosInstance";
import type { TransplantLogsResponse } from "./types";

export async function getTransplantLogs(
  areaId: number,
): Promise<TransplantLogsResponse> {
  const res = await axiosInstance.get<TransplantLogsResponse>(
    `/api/dashboard/areas/${areaId}/transplant-logs`,
  );
  return res.data;
}
