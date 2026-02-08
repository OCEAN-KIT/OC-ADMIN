"use client";

import { useRouter } from "next/navigation";
import type { Submission } from "@/api/submissions";
import { CalendarClock, MapPin, User2, Paperclip, Trash2 } from "lucide-react";
import { REVIEW_GRID } from "./review-grid";
import { activityLabel, type ActivityType } from "@/types/activity";

type Props = {
  review: Submission;
  selected?: boolean;
  onToggle?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
};

export default function ReviewCard({
  review,
  selected = false,
  onToggle,
  onApprove,
  onReject,
  onDelete,
}: Props) {
  const router = useRouter();
  const goDetail = () => router.push(`/review/${review.id}`);

  const raw = review.datetime;

  const task = activityLabel(review.task as ActivityType);

  let dateStr = "";
  if (typeof raw === "string" && raw.includes(",")) {
    const [y, m, d, hh, mm] = raw.split(",").map((v) => Number(v.trim()));

    dateStr = [
      y,
      "-",
      String(m).padStart(2, "0"),
      "-",
      String(d).padStart(2, "0"),
      " ",
      String(hh).padStart(2, "0"),
      ":",
      String(mm).padStart(2, "0"),
    ].join("");
  } else {
    // 혹시 나중에 ISO 문자열로 바뀌는 경우 대비용
    const dt = new Date(raw);
    dateStr = isNaN(dt.getTime())
      ? "-"
      : [
          dt.getFullYear(),
          "-",
          String(dt.getMonth() + 1).padStart(2, "0"),
          "-",
          String(dt.getDate()).padStart(2, "0"),
          " ",
          String(dt.getHours()).padStart(2, "0"),
          ":",
          String(dt.getMinutes()).padStart(2, "0"),
        ].join("");
  }

  const isPending = review.status === "pending";
  const isSelectable = isPending;
  const statusChip =
    review.status === "approved"
      ? {
          text: "승인",
          cls: "bg-emerald-100 text-emerald-700 ring-emerald-200",
        }
      : review.status === "rejected"
        ? { text: "반려", cls: "bg-rose-100 text-rose-700 ring-rose-200" }
        : { text: "검수대기", cls: "bg-gray-100 text-gray-700 ring-gray-200" };

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onCardClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    if (el.closest("input, button, a")) return;
    goDetail();
  };

  const stopOnlyBubble = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    
    <div
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goDetail()}
      className={[
        "group rounded-2xl bg-white px-5 py-4 cursor-pointer transition",
      ].join(" ")}
    >
      
      <div className={`${REVIEW_GRID} items-center`}>
        <div className="pl-1 flex items-center gap-2">
          {isSelectable ? (
            <input
              type="checkbox"
              checked={selected}
              onClick={stopOnlyBubble} // ⬅️ 버블만 차단
              onMouseDown={stopOnlyBubble} // ⬅️ 버블만 차단 (preventDefault ❌)
              onChange={() => onToggle?.()} // ⬅️ 상태 토글
              aria-label={`${review.id} 선택`}
              className="h-4 w-4 accent-blue-600"
            />
          ) : (
            <span className="w-4" />
          )}
          <span className="font-semibold text-gray-900">#{review.id}</span>
        </div>

        <div className="min-w-0 flex items-center gap-1.5 text-gray-700">
          <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="truncate">{review.site}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500">
          <CalendarClock className="h-4 w-4 text-gray-400" />
          <time>{dateStr}</time>
        </div>

        <div className="font-medium text-gray-700">{task}</div>

        <div className="flex items-center gap-1.5 text-gray-700">
          <User2 className="h-4 w-4 text-gray-400" />
          <span>{review.author}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-600">
          <Paperclip className="h-4 w-4 text-gray-400" />
          <span>{review.fileCount}개 파일</span>
        </div>

        <div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusChip.cls}`}
          >
            {statusChip.text}
          </span>
        </div>

        <div className="-ml-15 ㅂ flex items-center gap-2">
          {isPending && (
            <>
              <button
                type="button"
                onMouseDown={stop}
                onClick={(e) => {
                  stop(e);
                  onReject?.();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1.5
                           text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
              >
                반려
              </button>
              <button
                type="button"
                onMouseDown={stop}
                onClick={(e) => {
                  stop(e);
                  onApprove?.();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5
                           text-xs font-medium text-white shadow-sm hover:brightness-105 active:translate-y-[1px]"
              >
                승인
              </button>
            </>
          )}

          <button
            type="button"
            onMouseDown={stop}
            onClick={(e) => {
              stop(e);
              onDelete?.();
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full
                       bg-rose-500 text-white shadow-sm opacity-0 -translate-x-1
                       transition-all duration-200 ease-out
                       group-hover:opacity-100 group-hover:translate-x-0
                       group-focus-within:opacity-100 group-focus-within:translate-x-0
                       focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
