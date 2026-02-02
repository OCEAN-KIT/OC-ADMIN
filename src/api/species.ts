import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse } from "@/app/dashboard/create/api/types";

export type Species = {
  id: number;
  name: string;
};

export async function fetchSpecies(): Promise<Species[]> {
  const res =
    await axiosInstance.get<ApiResponse<Species[]>>("/api/bio/species");
  return res.data.data;
}
