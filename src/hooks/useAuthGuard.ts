// src/hooks/useAuthGuard.ts
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMyInfo } from "./useMyInfo";

type Mode = "gotoLogin" | "gotoHome";

type Options = {
  /** 보호 페이지면 "gotoLogin", 게스트 전용 페이지면 "gotoHome" */
  mode: Mode;
  /** 로그인 페이지 경로 (gotoLogin에서 사용). 기본값 "/login" */
  loginPath?: string;
  /** 홈 경로 (gotoHome에서 사용). 기본값 "/home" */
  homePath?: string;
  /** gotoLogin일 때 현재 경로를 ?next=로 붙일지. 기본값 true */
  includeNext?: boolean;
};

export function useAuthGuard({
  mode,
  loginPath = "/login",
  homePath = "/home",
  includeNext = true,
}: Options) {
  // test 브랜치용 임시 설정: 스크린샷 촬영 중에는 인증 가드 비활성화
  const DISABLE_AUTH_GUARD_FOR_SCREENSHOT = true;
  if (DISABLE_AUTH_GUARD_FOR_SCREENSHOT) {
    return { checking: false, isLoggedIn: true };
  }

  const { data, isLoading, isError } = useMyInfo();
  const router = useRouter();
  const pathname = usePathname();

  const checking = isLoading;
  const isLoggedIn = !isLoading && !isError && !!data;

  // 모드별 리다이렉트
  useEffect(() => {
    if (checking) return;

    if (mode === "gotoLogin" && !isLoggedIn) {
      if (pathname?.startsWith(loginPath)) return;
      const url =
        includeNext && pathname
          ? `${loginPath}?next=${encodeURIComponent(pathname)}`
          : loginPath;
      router.replace(url);
      return;
    }

    if (mode === "gotoHome" && isLoggedIn) {
      if (pathname === homePath) return;
      router.replace(homePath);
    }
  }, [
    checking,
    isLoggedIn,
    mode,
    loginPath,
    homePath,
    includeNext,
    pathname,
    router,
  ]);

  return { checking, isLoggedIn };
}
