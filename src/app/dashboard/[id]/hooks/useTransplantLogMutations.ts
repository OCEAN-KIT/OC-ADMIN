import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postTransplantLog,
  patchTransplantLog,
  deleteTransplantLog,
} from "../api/transplantLogs";
import type { TransplantLogPayload } from "../../create/api/types";

export function usePostTransplantLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "post-transplant-log"],
    mutationFn: (payload: TransplantLogPayload) =>
      postTransplantLog(areaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "transplant-logs"],
      });
    },
  });
}

export function usePatchTransplantLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "patch-transplant-log"],
    mutationFn: ({ logId, payload }: { logId: number; payload: TransplantLogPayload }) =>
      patchTransplantLog(areaId, logId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "transplant-logs"],
      });
    },
  });
}

export function useDeleteTransplantLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "delete-transplant-log"],
    mutationFn: (logId: number) => deleteTransplantLog(areaId, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "transplant-logs"],
      });
    },
  });
}
