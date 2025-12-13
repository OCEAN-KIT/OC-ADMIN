"use client";

import { useEffect } from "react";
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

import { type DiverActivityLog, type ActivityKind } from "@/types/divers";
import { csvExportByIds } from "@/api/csv";
import { ClipLoader } from "react-spinners";
import { keyToPublicUrl } from "@/utils/s3"; // ✅ 여기로 교체

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

  useEffect(() => {
    if (detail) {
      console.log("[ReviewPage] detail payload:", detail);
    }
  }, [detail]);

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
        <div className="flex h-screen -mt-30 items-center justify-center text-center">
          {isFetching ? (
            <ClipLoader color="#3263F1" />
          ) : (
            "데이터를 찾을 수 없습니다."
          )}
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
      return "Other"; // 필요 시 별도 Kind 추가
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

  // ✅ 이미지일 때만 key → 절대 URL로 변환해서 UI에 전달
  const photos =
    detail.attachments
      ?.filter((a) => {
        const mt = (a.mimeType || "").toLowerCase();
        if (mt.startsWith("image/")) return true;
        const p = (a.fileUrl || "").toLowerCase();
        return [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".bmp",
          ".tif",
          ".tiff",
        ].some((ext) => p.endsWith(ext));
      })
      .map((a) => keyToPublicUrl(a.fileUrl)) ?? // ← 여기!
    [];

  return {
    env,
    activity: activityKind,
    details,
    media: photos.length ? { photos } : undefined,
    incidentOrAbnormal: detail.rejectReason || undefined,
  };
}
