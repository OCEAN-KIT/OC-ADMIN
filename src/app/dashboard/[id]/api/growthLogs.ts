import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse, GrowthLogPayload } from "../../create/api/types";
import type { GrowthLogsResponse } from "./types";

export async function getGrowthLogs(
  areaId: number,
): Promise<GrowthLogsResponse> {
  const res = await axiosInstance.get<GrowthLogsResponse>(
    `/api/dashboard/areas/${areaId}/growth-logs`,
  );
  return res.data;
}

export async function postGrowthLog(
  areaId: number,
  payload: GrowthLogPayload,
): Promise<ApiResponse<{ id: number }>> {
  const res = await axiosInstance.post<ApiResponse<{ id: number }>>(
    `/api/dashboard/areas/${areaId}/growth-logs`,
    payload,
  );
  return res.data;
}

export async function patchGrowthLog(
  areaId: number,
  logId: number,
  payload: GrowthLogPayload,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/growth-logs/${logId}`,
    payload,
  );
  return res.data;
}

export async function deleteGrowthLog(
  areaId: number,
  logId: number,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/growth-logs/${logId}`,
  );
  return res.data;
}
