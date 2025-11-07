"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import TopBar from "@/components/review-detail/top-bar";
import SessionSummary from "@/components/review-detail/session-summary";
import LogCard from "@/components/review-detail/log-card";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  getSubmissionDetails,
  type SubmissionDetailServer,
} from "@/api/submissions";

// ✅ 공용 타입을 가져옵니다 (로컬 정의 제거!)
import { type DiverActivityLog, type ActivityKind } from "@/types/divers";
import { csvExportByIds } from "@/api/csv";

export default function ReviewPage() {
  useAuthGuard({ mode: "gotoLogin" });

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const diveId = Number(params.id);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["submissionDetail", diveId],
    queryFn: () => getSubmissionDetails(diveId),
    staleTime: 30_000,
    enabled: Number.isFinite(diveId),
  });

  const detail = data?.data;

  if (isError || !detail) {
    return (
      <div className="mx-auto max-w-[1100px] p-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#34609E] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </button>
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          {isFetching ? "불러오는 중..." : "데이터를 찾을 수 없습니다."}
        </div>
      </div>
    );
  }

  const commonDate =
    detail.basicEnv?.recordDate ??
    (detail.submittedAt ? detail.submittedAt.slice(0, 10) : "");

  const participantCount = detail.participants?.participantCount ?? 0;
  const site = detail.siteName;

  const sessionLog: DiverActivityLog = toSessionLog(detail);
  const auditLogs = detail.auditLogs ?? [];

  return (
    <div className="mx-auto max-w-[1100px] p-6">
      <TopBar
        detail={detail}
        onExport={() => csvExportByIds([Number(detail.submissionId)])}
      />

      <SessionSummary
        date={commonDate}
        participantCount={participantCount}
        site={site}
      />

      <section className="mt-6 space-y-4">
        <LogCard log={sessionLog} />
      </section>

      {/* 감사 로그 ... */}
    </div>
  );
}

/** 서버 activity → UI ActivityKind 매핑 */
function toActivityKind(serverType: string | undefined): ActivityKind {
  switch ((serverType || "").toUpperCase()) {
    case "TRASH_COLLECTION":
      return "DebrisRemoval";
    case "URCHIN_REMOVAL":
      // 우니 제거가 별도 종류라면 새 Kind를 추가하세요.
      // 일단은 화면 라벨링용으로 Other로 보냅니다.
      return "Other";
    case "OTHER":
    default:
      return "Other";
  }
}

/** SubmissionDetailServer → DiverActivityLog */
function toSessionLog(detail: SubmissionDetailServer): DiverActivityLog {
  const env = detail.basicEnv
    ? {
        waterTempC: detail.basicEnv.waterTempC,
        current: detail.basicEnv.currentState,
        visibilityM: detail.basicEnv.visibilityM,
        depthM: detail.basicEnv.depthM,
      }
    : undefined;

  const activityKind = toActivityKind(
    detail.activity?.type ?? detail.activityType
  );
  const details = detail.activity?.details ?? detail.feedbackText ?? "";

  const photos =
    detail.attachments
      ?.filter((a) => (a.mimeType || "").toLowerCase().startsWith("image/"))
      .map((a) => a.fileUrl) ?? [];

  return {
    env,
    activity: activityKind, // ✅ ActivityKind로 전달
    details,
    media: photos.length ? { photos } : undefined,
    incidentOrAbnormal: detail.rejectReason || undefined,
  };
}
