"use client";
"use client";

import { FileDown } from "lucide-react";
import { ClipLoader } from "react-spinners";

type Props = {
  className?: string;
  total: number;
  selectedCount: number;
  allSelected: boolean;
  onToggleAll: () => void;
  onBulkApprove: () => void;
  onOpenReject: () => void;
  onExportPdf: () => void;
  exportPending?: boolean;
  disabled?: boolean; // ✅ 추가
};

export default function ReviewBulkActions({
  className = "",
  total,
  selectedCount,
  allSelected,
  onToggleAll,
  onBulkApprove,
  onOpenReject,
  onExportPdf,
  exportPending = false,
  disabled = false,
}: Props) {
  const any = selectedCount > 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500">
        선택 {selectedCount}/{total}
      </span>

      <button
        type="button"
        onClick={onToggleAll}
        disabled={disabled || total === 0}
        className="h-9 px-3 rounded-md text-sm border border-white/10 bg-white/5
                   hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {allSelected ? "전체 해제" : "전체 선택"}
      </button>

      <button
        type="button"
        onClick={onOpenReject}
        disabled={disabled || !any}
        className="h-9 px-3 rounded-md text-sm border border-rose-400/30 bg-rose-400/15
                   hover:bg-rose-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        일괄 반려
      </button>

      <button
        type="button"
        onClick={onBulkApprove}
        disabled={disabled || !any}
        className="h-9 px-3 rounded-md text-sm border border-emerald-400/30 bg-emerald-400/15
                   hover:bg-emerald-400/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        일괄 승인
      </button>

      <button
        type="button"
        onClick={onExportPdf}
        disabled={disabled || exportPending || !any}
        className="h-9 px-3 rounded-md text-sm inline-flex items-center gap-1.5
                   border border-sky-400/30 bg-sky-400/15 hover:bg-sky-400/20
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {exportPending ? (
          <ClipLoader size={14} color="#0ea5e9" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        <span>PDF 내보내기</span>
      </button>
    </div>
  );
}
