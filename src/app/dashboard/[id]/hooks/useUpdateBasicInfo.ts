import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { patchBasicInfo } from "../api/areaDetail";
import type { BasicPayload } from "../../create/api/types";

export default function useUpdateBasicInfo(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", id, "update-basic"],
    mutationFn: (payload: BasicPayload) => patchBasicInfo(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.areas.detail(id) });
    },
  });
}
