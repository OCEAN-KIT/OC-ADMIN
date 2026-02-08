// components/review-detail/top-bar.tsx
"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { SubmissionDetailServer } from "@/api/submissions";
import { useApproveMutation, useRejectMutation } from "@/queries/submissions";
import RejectModal from "@/components/reject-reason-modal";

type Props = {
  detail: SubmissionDetailServer;
  onExport?: () => void;
};

export default function TopBar({ detail, onExport }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const id = String(detail.submissionId);

  const approve = useApproveMutation();
  const reject = useRejectMutation();

  const [rejectOpen, setRejectOpen] = useState(false);

  const showActions = detail.status !== "APPROVED" && detail.status !== "REJECTED";
  const canExport = detail.status === "APPROVED";

  const invalidateDetail = () =>
    qc.invalidateQueries({ queryKey: ["submissionDetail", detail.submissionId] });

  return (
    <>
      <div className="mb-6 -mt-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-[#34609E] ring-1 ring-gray-200 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </button>

        <div className="text-lg font-bold tracking-tight text-gray-900">
          {detail.siteName}
        </div>

        <div>
          <div className="relative ml-4 flex justify-start gap-2">
            {showActions && (
              <button
                type="button"
                aria-label="반려"
                onClick={() => setRejectOpen(true)}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
              >
                반려
              </button>
            )}

            {showActions && (
              <button
                type="button"
                aria-label="승인"
                disabled={approve.isPending}
                onClick={() =>
                  approve.mutate(id, { onSuccess: invalidateDetail })
                }
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px] disabled:opacity-40"
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

      <RejectModal
        open={rejectOpen}
        ids={[id]}
        loading={reject.isPending}
        onClose={() => setRejectOpen(false)}
        onSubmit={({ reason }) =>
          reject.mutate(
            { id, reason },
            {
              onSuccess: () => {
                setRejectOpen(false);
                invalidateDetail();
              },
            },
          )
        }
      />
    </>
  );
}
