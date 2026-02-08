"use client";

import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

type Props = {
  open: boolean;
  ids: string[]; // 반려 대상 id들 (단일/일괄 공용)
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    ids: string[];
    reason: { templateCode?: string; message: string };
  }) => void;
};

export default function RejectModal({ open, ids, loading = false, onClose, onSubmit }: Props) {
  const [message, setMessage] = useState("");
  const [templateCode, setTemplateCode] = useState<string | undefined>(
    undefined
  );
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setMessage("");
      setTemplateCode(undefined);
    }
  }, [open]);

  if (!open) return null;

  const disabled = message.trim().length === 0 || loading;

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-[200] flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="relative z-10 w-[560px] max-w-[92vw] rounded-2xl border border-white/15 bg-white text-gray-900 shadow-2xl"
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold">반려 사유 입력</h3>
          <button
            className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
            onClick={onClose}
          >
            닫기
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-sm text-gray-600">
            대상 <b>{ids.length}</b>건: {ids.join(", ")}
          </div>

          {/* 필수: 자유 입력 사유 */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">반려 사유 (필수)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="반려 사유를 입력하세요."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <div className="text-xs text-gray-400 text-right">
              {message.length}자
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-9 px-3 rounded-md text-sm border border-gray-200 bg-white hover:bg-gray-50"
          >
            취소
          </button>
          <button
            disabled={disabled}
            onClick={() => onSubmit({ ids, reason: { templateCode, message } })}
            className="h-9 px-3 rounded-md text-sm bg-rose-500 text-white shadow-sm hover:brightness-105 active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {loading && <ClipLoader size={14} color="#fff" />}
            반려 사유 제출
          </button>
        </div>
      </div>
    </div>
  );
}
