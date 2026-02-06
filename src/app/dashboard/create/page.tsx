"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import BasicInfoSection from "./components/BasicInfoSection";
import usePostBasicInfo from "./hooks/usePostBasicInfo";
import { BASIC_PAYLOAD_INIT } from "./api/types";
import type { BasicPayload } from "./api/types";

export default function CreateAreaPage() {
  const { checking } = useAuthGuard({ mode: "gotoLogin" });
  const router = useRouter();
  const { mutate, isPending } = usePostBasicInfo();

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

  const isValid =
    basicPayload.name.trim() !== "" &&
    basicPayload.restorationRegion !== "" &&
    basicPayload.startDate !== "" &&
    basicPayload.habitat !== "" &&
    basicPayload.level !== "" &&
    basicPayload.attachmentStatus !== "" &&
    basicPayload.depth > 0 &&
    basicPayload.areaSize > 0 &&
    basicPayload.lat !== 0 &&
    basicPayload.lon !== 0;

  const handleNextStep = () => {
    mutate(basicPayload, {
      onSuccess: (data) => {
        router.replace(`/dashboard/${data.data.id}`);
      },
    });
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex w-full justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                새 작업영역 추가
              </h1>
              <p className="text-sm text-gray-500 self-end">
                해양 생태 복원 프로젝트의 새로운 작업영역을 등록합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BasicInfoSection
            basicPayload={basicPayload}
            onBasicChange={handleBasicChange}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={handleNextStep}
              disabled={isPending || !isValid}
            >
              {isPending ? (
                <ClipLoader size={20} color="#FFFFFF" />
              ) : (
                "다음단계"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
