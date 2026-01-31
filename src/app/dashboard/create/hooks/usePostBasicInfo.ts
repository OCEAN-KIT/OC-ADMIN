import { useMutation } from "@tanstack/react-query";
import { postBasicInfo } from "../api/basicInfo";
import type { BasicPayload } from "../api/types";

export default function usePostBasicInfo() {
  return useMutation({
    mutationKey: ["areas", "post"],
    mutationFn: (payload: BasicPayload) => postBasicInfo(payload),
  });
}
