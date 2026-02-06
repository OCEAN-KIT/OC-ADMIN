import axiosInstance from "@/utils/axiosInstance";
import type {
  SpeciesListResponse,
  CreateSpeciesRequest,
  CreateSpeciesResponse,
} from "./types";

export async function getSpecies(): Promise<SpeciesListResponse> {
  const res = await axiosInstance.get<SpeciesListResponse>("/api/bio/species");
  return res.data;
}

export async function createSpecies(
  data: CreateSpeciesRequest,
): Promise<CreateSpeciesResponse> {
  const res = await axiosInstance.post<CreateSpeciesResponse>(
    "/api/bio/species",
    data,
  );
  return res.data;
}

export async function updateSpecies(
  id: number,
  data: CreateSpeciesRequest,
): Promise<CreateSpeciesResponse> {
  const res = await axiosInstance.patch<CreateSpeciesResponse>(
    `/api/bio/species/${id}`,
    data,
  );
  return res.data;
}

export async function deleteSpecies(id: number): Promise<void> {
  await axiosInstance.delete(`/api/bio/species/${id}`);
}
