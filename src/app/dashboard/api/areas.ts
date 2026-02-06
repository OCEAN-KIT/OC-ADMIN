import axiosInstance from "@/utils/axiosInstance";
import type { AreaFilters, AreasResponse } from "./types";

export async function getAreas(
  page: number,
  filters: AreaFilters,
): Promise<AreasResponse> {
  const res = await axiosInstance.get<AreasResponse>("/api/dashboard/areas", {
    params: {
      page,
      ...(filters.region && { region: filters.region }),
      ...(filters.level && { level: filters.level }),
      ...(filters.habitat && { habitat: filters.habitat }),
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to }),
      ...(filters.keyword && { keyword: filters.keyword }),
    },
  });

  return res.data;
}

export async function deleteArea(areaId: number): Promise<void> {
  await axiosInstance.delete(`/api/dashboard/areas/${areaId}`);
}
