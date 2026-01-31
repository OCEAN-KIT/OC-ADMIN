"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter, useParams } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import BasicInfoSection from "../create/components/BasicInfoSection";
import TransplantLogSection from "../create/components/transplant-log";
import type { SpeciesSection } from "../create/components/transplant-log";
import GrowthLogSection from "../create/components/growth-log";
import type { GrowthSpeciesSection } from "../create/components/growth-log";
import EnvironmentLogSection from "../create/components/environment-log";
import type { EnvironmentLogEntry } from "../create/components/environment-log";
import MediaLogSection from "../create/components/MediaLogSection";
import type { MediaLogEntry } from "../create/components/MediaLogSection";
import { BASIC_PAYLOAD_INIT } from "../create/api/types";
import type { BasicPayload } from "../create/api/types";

export default function EditAreaPage() {
  const { checking } = useAuthGuard({ mode: "gotoLogin" });
  const router = useRouter();
  const { id } = useParams();

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

  if (checking) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <ClipLoader color="#2C67BC" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-[900px] p-4">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/home" className="hover:text-gray-700">
              홈
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/dashboard" className="hover:text-gray-700">
              대시보드 관리
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">작업영역 수정</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                작업영역 수정
              </h1>
              <p className="mt-1 text-gray-500">
                작업영역의 정보를 수정합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BasicInfoSection
            basicPayload={basicPayload}
            onBasicChange={handleBasicChange}
          />

          <TransplantLogSection
            transplantPayload={transplantPayload}
            onTransplantChange={handleTransplantChange}
          />

          <GrowthLogSection
            growthPayload={growthPayload}
            onGrowthChange={handleGrowthChange}
          />

          <EnvironmentLogSection
            environmentPayload={environmentPayload}
            onEnvironmentChange={handleEnvironmentChange}
          />

          <MediaLogSection
            mediaPayload={mediaPayload}
            onMediaChange={handleMediaChange}
          />
        </div>
      </div>
    </div>
  );
}
