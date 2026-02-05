import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postGrowthLog,
  patchGrowthLog,
  deleteGrowthLog,
  patchRepresentativeSpecies,
} from "../api/growthLogs";
import type { GrowthLogPayload } from "../../create/api/types";

export function usePostGrowthLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "post-growth-log"],
    mutationFn: (payload: GrowthLogPayload) =>
      postGrowthLog(areaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "growth-logs"],
      });
    },
  });
}

export function usePatchGrowthLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "patch-growth-log"],
    mutationFn: ({ logId, payload }: { logId: number; payload: GrowthLogPayload }) =>
      patchGrowthLog(areaId, logId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "growth-logs"],
      });
    },
  });
}

export function useDeleteGrowthLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "delete-growth-log"],
    mutationFn: (logId: number) => deleteGrowthLog(areaId, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "growth-logs"],
      });
    },
  });
}

export function usePatchRepresentativeSpecies(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "patch-representative-species"],
    mutationFn: (speciesId: number | null) =>
      patchRepresentativeSpecies(areaId, speciesId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "representative-species"],
      });
    },
  });
}
