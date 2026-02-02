import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse, TransplantLogPayload } from "../../create/api/types";
import type { TransplantLogsResponse } from "./types";

export async function getTransplantLogs(
  areaId: number,
): Promise<TransplantLogsResponse> {
  const res = await axiosInstance.get<TransplantLogsResponse>(
    `/api/dashboard/areas/${areaId}/transplants`,
  );
  return res.data;
}

export async function postTransplantLog(
  areaId: number,
  payload: TransplantLogPayload,
): Promise<ApiResponse<{ id: number }>> {
  const res = await axiosInstance.post<ApiResponse<{ id: number }>>(
    `/api/dashboard/areas/${areaId}/transplants`,
    payload,
  );
  return res.data;
}

export async function patchTransplantLog(
  areaId: number,
  logId: number,
  payload: TransplantLogPayload,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/transplants/${logId}`,
    payload,
  );
  return res.data;
}

export async function deleteTransplantLog(
  areaId: number,
  logId: number,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    `/api/dashboard/areas/${areaId}/transplants/${logId}`,
  );
  return res.data;
}
