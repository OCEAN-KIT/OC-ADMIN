"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopBar({ diveId }: { diveId: string }) {
  const router = useRouter();
  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-[#34609E] ring-1 ring-gray-200 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로
      </button>

      <div className="text-lg font-bold tracking-tight text-gray-900">
        Dive #{diveId}
      </div>

      <div className="h-6 w-[84px]" />
    </div>
  );
}
