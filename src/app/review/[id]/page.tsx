"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import TopBar from "@/components/review-detail/top-bar";
import SessionSummary from "@/components/review-detail/session-summary";
import DiverToggle from "@/components/review-detail/diver-toggle";
import LogCard from "@/components/review-detail/log-card";

import { REVIEW_ITEMS, type ReviewItem } from "@/data/reviews";
import { DIVE_PARTICIPANTS } from "@/data/dive-session";
import { DIVER_ACTIVITY_LOGS, type DiverActivityLog } from "@/data/diver-log";

export default function ReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const diveId = String(params.id);

  const review = useMemo<ReviewItem | undefined>(
    () => REVIEW_ITEMS.find((r) => r.id === diveId),
    [diveId]
  );

  const participants = useMemo(
    () => DIVE_PARTICIPANTS[diveId]?.participants ?? [],
    [diveId]
  );

  const allLogs = useMemo<DiverActivityLog[]>(
    () => DIVER_ACTIVITY_LOGS.filter((l) => l.diveId === diveId),
    [diveId]
  );

  // 기본 선택: 첫 참가자 or 첫 로그의 다이버
  const [activeDiverId, setActiveDiverId] = useState<string>(() => {
    return participants[0]?.diverId ?? allLogs[0]?.diverId ?? "";
  });

  const diverLogs = useMemo(
    () => allLogs.filter((l) => l.diverId === activeDiverId),
    [allLogs, activeDiverId]
  );

  if (!review) {
    return (
      <div className="mx-auto max-w-[1100px] p-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#34609E] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </button>
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          데이터를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const commonDate =
    diverLogs[0]?.env?.diveDate ??
    new Date(review.datetime).toISOString().slice(0, 10);
  const participantCount = participants.length;

  return (
    <div className="mx-auto max-w-[1100px] p-6">
      <TopBar diveId={review.id} />

      <SessionSummary
        date={commonDate}
        participantCount={participantCount}
        site={review.site}
      />

      <DiverToggle
        participants={participants}
        activeDiverId={activeDiverId}
        onChange={setActiveDiverId}
      />

      <section className="mt-6 space-y-4">
        {diverLogs.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500 ring-1 ring-black/5">
            선택된 다이버의 기록이 없습니다.
          </div>
        ) : (
          diverLogs.map((log, idx) => <LogCard key={idx} log={log} />)
        )}
      </section>
    </div>
  );
}
