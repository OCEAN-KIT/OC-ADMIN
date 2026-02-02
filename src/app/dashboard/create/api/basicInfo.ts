import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse, BasicPayload } from "./types";

type PostBasicInfoData = { id: number };

export async function postBasicInfo(
  payload: BasicPayload,
): Promise<ApiResponse<PostBasicInfoData>> {
  const res = await axiosInstance.post<ApiResponse<PostBasicInfoData>>(
    `/api/dashboard/areas`,
    payload,
  );
  return res.data;
}
