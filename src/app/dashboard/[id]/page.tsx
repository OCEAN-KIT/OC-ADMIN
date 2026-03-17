"use client";

import { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Cloud,
  Leaf,
  MapPin,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import BasicInfoSection from "../create/components/BasicInfoSection";
import TransplantLogSection from "./components/transplant-log";
import type { SpeciesSection } from "./components/transplant-log";
import GrowthLogSection from "./components/growth-log";
import type { GrowthSpeciesSection } from "./components/growth-log";
import EnvironmentLogSection from "./components/environment-log";
import type { EnvironmentLogEntry } from "./components/environment-log";
import MediaLogSection from "./components/MediaLogSection";
import type { MediaLogEntry } from "./components/MediaLogSection";
import { BASIC_PAYLOAD_INIT } from "../create/api/types";
import type { BasicPayload } from "../create/api/types";
import useAreaDetail from "./hooks/useAreaDetail";
import useTransplantLogs from "./hooks/useTransplantLogs";
import useGrowthLogs from "./hooks/useGrowthLogs";
import useEnvironmentLogs from "./hooks/useEnvironmentLogs";
import useMediaLogs from "./hooks/useMediaLogs";
import useUpdateBasicInfo from "./hooks/useUpdateBasicInfo";
import DashboardDetailNotFound from "./not-found";

function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
  );
}

function BasicInfoSectionSkeleton() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          <MapPin className="h-5 w-5 text-[#2C67BC]" />
          작업영역 기본 정보
        </h2>
        <SkeletonBar className="h-8 w-24" />
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-2">
          <SkeletonBar className="h-4 w-24" />
          <SkeletonBar className="h-11 w-full" />
        </div>

        <div className="space-y-2">
          <SkeletonBar className="h-4 w-20" />
          <SkeletonBar className="h-11 w-full" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-24" />
            <SkeletonBar className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-28" />
            <SkeletonBar className="h-11 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-24" />
            <SkeletonBar className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-11 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-24" />
            <SkeletonBar className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-11 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-11 w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionCardSkeleton({
  icon: Icon,
  title,
  actionLabel,
  description,
  blocks = 2,
}: {
  icon: LucideIcon;
  title: string;
  actionLabel: string;
  description?: string;
  blocks?: number;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-gray-900">
            <Icon className="h-5 w-5 text-[#2C67BC]" />
            {title}
          </h2>
          {description && (
            <p className="ml-7 mt-1 text-xs text-gray-400">{description}</p>
          )}
        </div>
        <div className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-400">
          {actionLabel}
        </div>
      </div>

      <div className="space-y-4 p-6">
        {Array.from({ length: blocks }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <SkeletonBar className="h-5 w-28" />
              <SkeletonBar className="h-6 w-20" />
            </div>
            <SkeletonBar className="h-4 w-3/4" />
            <SkeletonBar className="h-10 w-full" />
            <SkeletonBar className="h-10 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

function EnvironmentSectionSkeleton() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          <Cloud className="h-5 w-5 text-[#2C67BC]" />
          환경 로그 (날짜별 기록 누적)
        </h2>
        <SkeletonBar className="h-8 w-20" />
      </div>

      <div className="space-y-3 p-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-6"
          >
            <SkeletonBar className="h-10 sm:col-span-2" />
            <SkeletonBar className="h-10 sm:col-span-1" />
            <SkeletonBar className="h-10 sm:col-span-1" />
            <SkeletonBar className="h-10 sm:col-span-1" />
            <SkeletonBar className="h-10 sm:col-span-1" />
          </div>
        ))}
      </div>
    </section>
  );
}

function MediaSectionSkeleton() {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
        <h2 className="flex items-center gap-2 font-semibold text-gray-900">
          <Camera className="h-5 w-5 text-[#2C67BC]" />
          미디어 등록
        </h2>
      </div>

      <div className="space-y-6 p-6">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#2C67BC]" />
            <p className="text-sm font-semibold text-gray-800">
              비포 · 애프터 사진
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <SkeletonBar className="h-4 w-28" />
              <SkeletonBar className="h-64 w-full" />
            </div>
            <div className="space-y-3">
              <SkeletonBar className="h-4 w-28" />
              <SkeletonBar className="h-64 w-full" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-[#2C67BC]" />
              <p className="text-sm font-semibold text-gray-800">
                타임라인 사진
              </p>
            </div>
            <SkeletonBar className="h-8 w-20" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <SkeletonBar className="h-24 w-24 rounded-none sm:h-28 sm:w-28" />
                <div className="flex-1 space-y-3 p-3">
                  <SkeletonBar className="h-5 w-32" />
                  <SkeletonBar className="h-4 w-2/3" />
                </div>
                <div className="grid w-14 place-items-center border-l border-gray-100 bg-gray-50 sm:w-16">
                  <SkeletonBar className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionErrorCard({
  title,
  onRetry,
}: {
  title: string;
  onRetry: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-rose-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50 px-6 py-4">
        <h2 className="flex items-center gap-2 font-semibold text-rose-700">
          <TriangleAlert className="h-5 w-5" />
          {title}
        </h2>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-100"
        >
          다시 시도
        </button>
      </div>
      <div className="px-6 py-5 text-sm text-rose-700">
        섹션 데이터를 불러오지 못했습니다.
      </div>
    </section>
  );
}

export default function EditAreaPage() {
  const { checking } = useAuthGuard({ mode: "gotoLogin" });
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const areaId = Number(rawId);
  const hasInvalidAreaId = !rawId || Number.isNaN(areaId);

  // ── API 데이터 fetch ──
  const { data: basicData, isLoading: l1, isError: e1 } = useAreaDetail(areaId);
  const {
    data: transplantData,
    isLoading: l2,
    isError: e2,
    refetch: refetchTransplant,
  } = useTransplantLogs(areaId);
  const {
    data: growthData,
    isLoading: l3,
    isError: e3,
    refetch: refetchGrowth,
  } = useGrowthLogs(areaId);
  const {
    data: envData,
    isLoading: l4,
    isError: e4,
    refetch: refetchEnvironment,
  } = useEnvironmentLogs(areaId);
  const {
    data: mediaData,
    isLoading: l5,
    isError: e5,
    refetch: refetchMedia,
  } = useMediaLogs(areaId);

  const { mutate: updateBasic, isPending: isUpdatingBasic } =
    useUpdateBasicInfo(areaId);

  // ── 기본정보 상태 ──
  const [basicPayload, setBasicPayload] =
    useState<BasicPayload>(BASIC_PAYLOAD_INIT);

  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setBasicPayload((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // ── 이식 로그 상태 ──
  const [transplantPayload, setTransplantPayload] = useState<SpeciesSection[]>(
    [],
  );

  const handleTransplantChange = (sections: SpeciesSection[]) => {
    setTransplantPayload(sections);
  };

  // ── 성장 로그 상태 ──
  const [growthPayload, setGrowthPayload] = useState<GrowthSpeciesSection[]>(
    [],
  );

  const handleGrowthChange = (sections: GrowthSpeciesSection[]) => {
    setGrowthPayload(sections);
  };

  // ── 환경 로그 상태 ──
  const [environmentPayload, setEnvironmentPayload] = useState<
    EnvironmentLogEntry[]
  >([]);

  const handleEnvironmentChange = (entries: EnvironmentLogEntry[]) => {
    setEnvironmentPayload(entries);
  };

  // ── 미디어 로그 상태 ──
  const [mediaPayload, setMediaPayload] = useState<MediaLogEntry[]>([]);

  const handleMediaChange = (entries: MediaLogEntry[]) => {
    setMediaPayload(entries);
  };

  // ── fetch 완료 시 state 초기화 ──
  useEffect(() => {
    if (basicData) setBasicPayload(basicData);
  }, [basicData]);

  useEffect(() => {
    if (transplantData) setTransplantPayload(transplantData);
  }, [transplantData]);

  useEffect(() => {
    if (growthData) setGrowthPayload(growthData);
  }, [growthData]);

  useEffect(() => {
    if (envData) setEnvironmentPayload(envData);
  }, [envData]);

  useEffect(() => {
    if (mediaData) setMediaPayload(mediaData);
  }, [mediaData]);

  if (checking) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <ClipLoader color="#2C67BC" size={40} />
      </div>
    );
  }

  if (hasInvalidAreaId) {
    return <DashboardDetailNotFound />;
  }

  if (e1) {
    return <DashboardDetailNotFound />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-[900px] p-4">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex w-full justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                작업영역 수정
              </h1>
              <p className="text-sm  text-gray-500 self-end">
                작업영역의 정보를 수정합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {l1 ? (
            <BasicInfoSectionSkeleton />
          ) : (
            <BasicInfoSection
              basicPayload={basicPayload}
              onBasicChange={handleBasicChange}
              onEdit={() => updateBasic(basicPayload)}
              isEditing={isUpdatingBasic}
            />
          )}

          {l2 ? (
            <SectionCardSkeleton
              icon={Leaf}
              title="이식 현황 (종별 · 기록 누적)"
              actionLabel="종 추가"
            />
          ) : e2 ? (
            <SectionErrorCard
              title="이식 현황"
              onRetry={() => {
                void refetchTransplant();
              }}
            />
          ) : (
            <TransplantLogSection
              transplantPayload={transplantPayload}
              onTransplantChange={handleTransplantChange}
            />
          )}

          {l3 ? (
            <SectionCardSkeleton
              icon={TrendingUp}
              title="성장 현황 (종별 · 기록 누적)"
              actionLabel="종 추가"
              description="반드시 대표 종 한개를 선택해 주세요."
            />
          ) : e3 ? (
            <SectionErrorCard
              title="성장 현황"
              onRetry={() => {
                void refetchGrowth();
              }}
            />
          ) : (
            <GrowthLogSection
              growthPayload={growthPayload}
              onGrowthChange={handleGrowthChange}
            />
          )}

          {l4 ? (
            <EnvironmentSectionSkeleton />
          ) : e4 ? (
            <SectionErrorCard
              title="환경 로그"
              onRetry={() => {
                void refetchEnvironment();
              }}
            />
          ) : (
            <EnvironmentLogSection
              environmentPayload={environmentPayload}
              onEnvironmentChange={handleEnvironmentChange}
            />
          )}

          {l5 ? (
            <MediaSectionSkeleton />
          ) : e5 ? (
            <SectionErrorCard
              title="미디어 등록"
              onRetry={() => {
                void refetchMedia();
              }}
            />
          ) : (
            <MediaLogSection
              mediaPayload={mediaPayload}
              onMediaChange={handleMediaChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
