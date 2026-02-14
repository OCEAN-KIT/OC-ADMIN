"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import TopBar from "@/components/review-detail/top-bar";
import CommonSection from "@/components/review-detail/common-section";
import ActivitySection from "@/components/review-detail/activity-section";
import PhotoLightbox from "@/components/review-detail/photo-lightbox";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { queryKeys } from "@/hooks/queryKeys";
import { getSubmissionDetails } from "@/api/submissions";
import { csvExportByIds } from "@/api/csv";
import { ClipLoader } from "react-spinners";
import { extractImageUrls } from "@/utils/attachment";

export default function ReviewPage() {
  useAuthGuard({ mode: "gotoLogin" });

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const diveId = Number(params.id);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data, isFetching, isError } = useQuery({
    queryKey: queryKeys.submissionDetail(diveId),
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

  const photos = extractImageUrls(detail.attachments);

  return (
    <div className="mx-auto max-w-[1100px] p-6">
      <TopBar
        detail={detail}
        onExport={() => csvExportByIds([Number(detail.submissionId)])}
      />

      {detail.rejectReason && (
        <div className="mb-4 rounded-xl bg-rose-50 px-5 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
          <span className="font-semibold">반려 사유:</span>{" "}
          {detail.rejectReason}
        </div>
      )}

      {/* 단일 카드 안에 모든 데이터 */}
      <div className="rounded-2xl bg-white px-6 py-5 ring-1 ring-black/5">
        {/* 공통 영역 */}
        <CommonSection detail={detail} />

        {/* 작업유형별 상세 */}
        <ActivitySection detail={detail} />

        {/* 작업 설명 */}
        {detail.workDescription && (
          <section className="mt-6">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              작업 설명
            </h2>
            <p className="whitespace-pre-wrap text-sm text-gray-800">
              {detail.workDescription}
            </p>
          </section>
        )}

        {/* 첨부 사진 */}
        {photos.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              첨부 사진
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {photos.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  className="relative aspect-4/3 overflow-hidden rounded-lg ring-1 ring-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-shadow"
                  onClick={() => setLightboxIndex(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`photo-${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 라이트박스 */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChangeIndex={setLightboxIndex}
        />
      )}
    </div>
  );
}
