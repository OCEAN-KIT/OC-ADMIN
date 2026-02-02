import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "@/api/upload-image";
import { postMediaLog, patchMediaLog, deleteMediaLog } from "../api/mediaLogs";
import type { MediaCategory } from "../../create/api/types";

type PostMediaLogInput = {
  file: File;
  recordDate: string;
  caption: string;
  category: MediaCategory;
};

type PatchMediaLogInput = {
  logId: number;
  file: File;
  recordDate: string;
  caption: string;
  category: MediaCategory;
};

export function usePostMediaLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "post-media-log"],
    mutationFn: async (input: PostMediaLogInput) => {
      const key = await uploadImage(input.file);
      return postMediaLog(areaId, {
        recordDate: input.recordDate,
        mediaUrl: key,
        caption: input.caption,
        category: input.category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "media-logs"],
      });
    },
  });
}

export function usePatchMediaLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "patch-media-log"],
    mutationFn: async (input: PatchMediaLogInput) => {
      const key = await uploadImage(input.file);
      return patchMediaLog(areaId, input.logId, {
        recordDate: input.recordDate,
        mediaUrl: key,
        caption: input.caption,
        category: input.category,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "media-logs"],
      });
    },
  });
}

export function useDeleteMediaLog(areaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", areaId, "delete-media-log"],
    mutationFn: (logId: number) => deleteMediaLog(areaId, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", areaId, "media-logs"],
      });
    },
  });
}
