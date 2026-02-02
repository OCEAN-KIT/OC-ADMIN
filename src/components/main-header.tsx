// components/MainHeader.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useMyInfo } from "@/hooks/useMyInfo";
import { useQueryClient } from "@tanstack/react-query";
import { UserRound, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { logOut } from "@/api/auth";
import { useRouter } from "next/navigation";

export default function MainHeader() {
  const { data, isLoading } = useMyInfo();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const nickname = data?.data?.nickname;
  const label = isLoading ? "로그인" : nickname ?? "내 계정";

  const handleToggle = () => setOpen((v) => !v);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        anchorRef.current &&
        !anchorRef.current.contains(t)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = async () => {
    try {
      await logOut();
    } finally {
      queryClient.removeQueries();
      setOpen(false);
      router.replace("/login");
    }
  };

  return (
    <header className="w-full bg-[#2C67BC] text-white">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4">
        <Link href="/home" className="text-3xl font-extrabold tracking-tight">
          OceanCampus
        </Link>

        <div className="relative">
          <button
            ref={anchorRef}
            type="button"
            onClick={handleToggle}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label={label}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5
                       hover:bg-white/20 active:translate-y-[1px]
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <UserRound className="h-5 w-5" aria-hidden />
            <span className="hidden sm:inline text-sm">{label}</span>
          </button>

          {/* 드롭다운 */}
          {open && (
            <div
              ref={menuRef}
              role="menu"
              aria-label="user menu"
              className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-black/5 bg-white text-gray-900 shadow-lg"
            >
              <div className="px-3 py-2 text-xs text-gray-500">
                {nickname ? `${nickname} 님` : "로그인 필요"}
              </div>
              <div className="h-px bg-gray-100" />
              <Link
                href="/dashboard"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                대시보드 관리
              </Link>
              <div className="h-px bg-gray-100" />
              <button
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
