import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse, TransplantLogPayload } from "./types";

type PostTransplantData = { id: number };

export async function postTransplant(
  areaId: number,
  payload: TransplantLogPayload,
): Promise<ApiResponse<PostTransplantData>> {
  const res = await axiosInstance.post<ApiResponse<PostTransplantData>>(
    `/api/dashboard/${areaId}/transplant`,
    payload,
  );
  return res.data;
}
