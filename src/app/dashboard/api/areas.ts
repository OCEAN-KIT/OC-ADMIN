import axiosInstance from "@/utils/axiosInstance";
import type { AreasResponse } from "./types";

export async function getAreas(page: number): Promise<AreasResponse> {
  const res = await axiosInstance.get<AreasResponse>("/api/dashboard/areas", {
    params: { page },
  });

  return res.data;
}

export async function deleteArea(areaId: number): Promise<void> {
  await axiosInstance.delete(`/api/dashboard/areas/${areaId}`);
}
