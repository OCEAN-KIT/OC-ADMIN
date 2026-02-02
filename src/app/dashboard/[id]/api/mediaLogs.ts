import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse, MediaLogPayload } from "../../create/api/types";
import type { MediaLogsResponse } from "./types";

export async function getMediaLogs(
  areaId: number,
): Promise<MediaLogsResponse> {
  const res = await axiosInstance.get<MediaLogsResponse>(
    `/api/dashboard/areas/${areaId}/media-logs`,
  );
  return res.data;
}

export async function postMediaLog(
  areaId: number,
  payload: MediaLogPayload,
): Promise<ApiResponse<{ id: number }>> {
  const res = await axiosInstance.post<ApiResponse<{ id: number }>>(
    `/api/dashboard/areas/${areaId}/media-logs`,
    payload,
  );
  return res.data;
}

export async function deleteMediaLog(
  areaId: number,
  logId: number,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/media-logs/${logId}`,
  );
  return res.data;
}
