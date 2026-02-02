// src/hooks/useMyInfo.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { myInfo } from "@/api/user";

export function useMyInfo() {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: myInfo,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
