import axiosInstance from "@/utils/axiosInstance";
import type { AreaDetailResponse } from "./types";

export async function getAreaDetail(id: number): Promise<AreaDetailResponse> {
  const res = await axiosInstance.get<AreaDetailResponse>(
    `/api/dashboard/areas/${id}`,
  );
  return res.data;
}
