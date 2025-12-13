// components/review-detail/top-bar.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SubmissionDetailServer } from "@/api/submissions";

type Props = {
  detail: SubmissionDetailServer;
  onApprove?: () => void;
  onReject?: () => void;
  onExport?: () => void;
};

export default function TopBar({
  detail,
  onApprove,
  onReject,
  onExport,
}: Props) {
  const router = useRouter();

  const canExport = detail.status === "APPROVED";

  return (
    <div className="mb-6 -mt-6 flex items-center justify-between">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-[#34609E] ring-1 ring-gray-200 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로
      </button>

      <div className="text-lg font-bold tracking-tight text-gray-900">
        Dive #{detail.submissionId}
      </div>

      <div>
        <div className="relative ml-4 flex justify-start gap-2">
          {!canExport && (
            <button
              type="button"
              aria-label="반려"
              onClick={onReject}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
            >
              반려
            </button>
          )}

          {!canExport && (
            <button
              type="button"
              aria-label="승인"
              onClick={onApprove}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
            >
              승인
            </button>
          )}

          {canExport && (
            <button
              type="button"
              aria-label="내보내기"
              onClick={onExport}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-gray-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105"
            >
              내보내기
            </button>
          )}
        </div>

        <div className="h-6 w-[84px]" />
      </div>
    </div>
  );
}
