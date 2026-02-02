import axiosInstance from "@/utils/axiosInstance";
import type { BasicPayload, ApiResponse } from "../../create/api/types";
import type { AreaDetailResponse } from "./types";

export async function getAreaDetail(id: number): Promise<AreaDetailResponse> {
  const res = await axiosInstance.get<AreaDetailResponse>(
    `/api/dashboard/areas/${id}`,
  );
  return res.data;
}

export async function patchBasicInfo(
  id: number,
  payload: BasicPayload,
): Promise<ApiResponse<null>> {
  const res = await axiosInstance.patch<ApiResponse<null>>(
    `/api/dashboard/areas/${id}`,
    payload,
  );
  return res.data;
}
