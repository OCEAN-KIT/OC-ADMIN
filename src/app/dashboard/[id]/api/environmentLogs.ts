import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse, EnvironmentLogPayload } from "../../create/api/types";
import type { EnvironmentLogsResponse } from "./types";

export async function getEnvironmentLogs(
  areaId: number,
): Promise<EnvironmentLogsResponse> {
  const res = await axiosInstance.get<EnvironmentLogsResponse>(
    `/api/dashboard/areas/${areaId}/water-logs`,
  );
  return res.data;
}

export async function postEnvironmentLog(
  areaId: number,
  payload: EnvironmentLogPayload,
): Promise<ApiResponse<{ id: number }>> {
  const res = await axiosInstance.post<ApiResponse<{ id: number }>>(
    `/api/dashboard/areas/${areaId}/water-logs`,
    payload,
  );
  return res.data;
}

export async function patchEnvironmentLog(
  areaId: number,
  logId: number,
  payload: EnvironmentLogPayload,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/water-logs/${logId}`,
    payload,
  );
  return res.data;
}

export async function deleteEnvironmentLog(
  areaId: number,
  logId: number,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/water-logs/${logId}`,
  );
  return res.data;
}
