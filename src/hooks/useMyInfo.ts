// src/hooks/useMyInfo.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { myInfo } from "@/api/user";
import { queryKeys } from "@/hooks/queryKeys";

export function useMyInfo() {
  return useQuery({
    queryKey: queryKeys.myInfo,
    queryFn: myInfo,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
