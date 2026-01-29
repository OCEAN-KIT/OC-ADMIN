"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import BasicInfoSection from "./components/BasicInfoSection";
import TransplantLogSection from "./components/TransplantLogSection";
import type { SpeciesSection } from "./components/TransplantLogSection";
import { BASIC_PAYLOAD_INIT } from "./api/types";
import type { BasicPayload } from "./api/types";

export default function CreateAreaPage() {
  const { checking } = useAuthGuard({ mode: "gotoLogin" });
  const router = useRouter();

  // ── 기본정보 상태 ──
  const [basicPayload, setBasicPayload] =
    useState<BasicPayload>(BASIC_PAYLOAD_INIT);

  // ── 이식 로그 상태 ──
  const [transplantPayload, setTransplantPayload] = useState<SpeciesSection[]>(
    [],
  );

  const handleTransplantChange = (sections: SpeciesSection[]) => {
    setTransplantPayload(sections);
  };

  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setBasicPayload((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동
    console.log("BasicPayload:", basicPayload);
    alert("작업영역이 생성되었습니다. (디자인 미리보기)");
    router.push("/dashboard");
  };

  if (checking) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
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
            <span className="text-gray-900">작업영역 추가</span>
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
                새 작업영역 추가
              </h1>
              <p className="mt-1 text-gray-500">
                해양 생태 복원 프로젝트의 새로운 작업영역을 등록합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleBasicSubmit} className="space-y-6">
          <BasicInfoSection
            basicPayload={basicPayload}
            onBasicChange={handleBasicChange}
          />

          <TransplantLogSection
            transplantPayload={transplantPayload}
            onTransplantChange={handleTransplantChange}
          />
        </form>
      </div>
    </div>
  );
}
