import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postEnvironmentLog,
  patchEnvironmentLog,
  deleteEnvironmentLog,
} from "../api/environmentLogs";
import type { EnvironmentLogPayload } from "../../create/api/types";

export function usePostEnvironmentLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "post-environment-log"],
    mutationFn: (payload: EnvironmentLogPayload) =>
      postEnvironmentLog(areaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "environment-logs"],
      });
    },
  });
}

export function usePatchEnvironmentLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "patch-environment-log"],
    mutationFn: ({ logId, payload }: { logId: number; payload: EnvironmentLogPayload }) =>
      patchEnvironmentLog(areaId, logId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "environment-logs"],
      });
    },
  });
}

export function useDeleteEnvironmentLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "delete-environment-log"],
    mutationFn: (logId: number) => deleteEnvironmentLog(areaId, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "environment-logs"],
      });
    },
  });
}
