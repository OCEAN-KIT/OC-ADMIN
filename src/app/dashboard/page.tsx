"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  Plus,
  Search,
  ChevronRight,
  MapPin,
  Calendar,
  Waves,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";

// Enum 타입 정의
type RestorationRegion = "POHANG" | "ULJIN" | "";
type ProjectLevel = "OBSERVATION" | "SETTLEMENT" | "GROWTH" | "MANAGEMENT" | "";
type HabitatType = "ROCKY" | "MIXED" | "OTHER" | "";
type AreaSort =
  | "ID_DESC"
  | "ID_ASC"
  | "START_DATE_DESC"
  | "START_DATE_ASC"
  | "NAME_ASC"
  | "NAME_DESC";
type AttachmentStatus = "STABLE" | "DECREASED" | "UNSTABLE";

// 라벨 매핑
const regionLabels: Record<string, string> = {
  POHANG: "포항",
  ULJIN: "울진",
};

const levelLabels: Record<string, string> = {
  OBSERVATION: "관측",
  SETTLEMENT: "정착",
  GROWTH: "성장",
  MANAGEMENT: "관리",
};

const habitatLabels: Record<string, string> = {
  ROCKY: "암반",
  MIXED: "혼합",
  OTHER: "기타",
};

const statusLabels: Record<AttachmentStatus, string> = {
  STABLE: "안정",
  DECREASED: "일부 감소",
  UNSTABLE: "불안정",
};

const statusColors: Record<AttachmentStatus, string> = {
  STABLE: "bg-emerald-100 text-emerald-700",
  DECREASED: "bg-yellow-100 text-yellow-700",
  UNSTABLE: "bg-rose-100 text-rose-700",
};

const sortLabels: Record<AreaSort, string> = {
  ID_DESC: "최신순",
  ID_ASC: "오래된순",
  START_DATE_DESC: "시작일 최신순",
  START_DATE_ASC: "시작일 오래된순",
  NAME_ASC: "이름 오름차순",
  NAME_DESC: "이름 내림차순",
};

// 더미 데이터
const dummyAreas = [
  {
    id: 1,
    name: "포항 해조류 복원지 A구역",
    restorationRegion: "POHANG" as const,
    startDate: "2024-03-15",
    endDate: null,
    habitat: "ROCKY" as const,
    depth: 8.5,
    areaSize: 1200,
    level: "GROWTH" as const,
    attachmentStatus: "STABLE" as AttachmentStatus,
    lat: 36.019,
    lon: 129.343,
  },
  {
    id: 2,
    name: "울진 해중림 조성지 B구역",
    restorationRegion: "ULJIN" as const,
    startDate: "2024-01-10",
    endDate: "2024-12-31",
    habitat: "MIXED" as const,
    depth: 12.0,
    areaSize: 2500,
    level: "SETTLEMENT" as const,
    attachmentStatus: "DECREASED" as AttachmentStatus,
    lat: 36.993,
    lon: 129.4,
  },
  {
    id: 3,
    name: "포항 신규 이식지 C구역",
    restorationRegion: "POHANG" as const,
    startDate: "2024-06-01",
    endDate: null,
    habitat: "ROCKY" as const,
    depth: 6.0,
    areaSize: 800,
    level: "OBSERVATION" as const,
    attachmentStatus: "UNSTABLE" as AttachmentStatus,
    lat: 36.032,
    lon: 129.365,
  },
];

export default function DashboardPage() {
  const { checking } = useAuthGuard({ mode: "gotoLogin" });

  // 필터 상태
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState<RestorationRegion>("");
  const [level, setLevel] = useState<ProjectLevel>("");
  const [habitat, setHabitat] = useState<HabitatType>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<AreaSort>("ID_DESC");

  // 필터 패널 열림 상태
  const [showFilters, setShowFilters] = useState(false);

  if (checking) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const clearFilters = () => {
    setKeyword("");
    setRegion("");
    setLevel("");
    setHabitat("");
    setFromDate("");
    setToDate("");
    setSort("ID_DESC");
  };

  const hasActiveFilters =
    keyword || region || level || habitat || fromDate || toDate;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-[1500px] p-4">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/home" className="hover:text-gray-700">
              홈
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">대시보드 관리</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                작업영역 관리
              </h1>
              <p className="mt-1 text-gray-500">
                해양 생태 복원 작업영역을 조회하고 관리합니다.
              </p>
            </div>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2C67BC] text-white rounded-lg font-medium hover:bg-[#245299] transition-colors shrink-0"
            >
              <Plus className="h-5 w-5" />
              작업영역 추가
            </Link>
          </div>
        </div>

        {/* 검색 및 필터 영역 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          {/* 검색바 + 필터 토글 */}
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="작업영역 이름으로 검색..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors ${
                  showFilters || hasActiveFilters
                    ? "bg-[#2C67BC] text-white border-[#2C67BC]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-4 w-4" />
                필터
                {hasActiveFilters && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">
                    활성
                  </span>
                )}
              </button>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as AreaSort)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC] cursor-pointer"
                >
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 확장 필터 패널 */}
          {showFilters && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 복원 지역 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    복원 지역
                  </label>
                  <select
                    value={region}
                    onChange={(e) =>
                      setRegion(e.target.value as RestorationRegion)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
                  >
                    <option value="">전체</option>
                    <option value="POHANG">포항</option>
                    <option value="ULJIN">울진</option>
                  </select>
                </div>

                {/* 프로젝트 단계 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    프로젝트 단계
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as ProjectLevel)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
                  >
                    <option value="">전체</option>
                    <option value="OBSERVATION">관측</option>
                    <option value="SETTLEMENT">정착</option>
                    <option value="GROWTH">성장</option>
                    <option value="MANAGEMENT">관리</option>
                  </select>
                </div>

                {/* 서식지 유형 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    서식지 유형
                  </label>
                  <select
                    value={habitat}
                    onChange={(e) => setHabitat(e.target.value as HabitatType)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
                  >
                    <option value="">전체</option>
                    <option value="ROCKY">암반</option>
                    <option value="MIXED">혼합</option>
                    <option value="OTHER">기타</option>
                  </select>
                </div>

                {/* 기간 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    기간
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC] text-sm"
                    />
                    <span className="text-gray-400">~</span>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC] text-sm"
                    />
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    필터 초기화
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 결과 요약 */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            총 <span className="font-semibold text-gray-900">3</span>개의
            작업영역
          </p>
        </div>

        {/* 작업영역 리스트 */}
        <div className="grid gap-4">
          {dummyAreas.map((area) => (
            <Link
              key={area.id}
              href={`/dashboard/area/${area.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* 메인 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#2C67BC]/10 flex items-center justify-center">
                      <Waves className="h-5 w-5 text-[#2C67BC]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2C67BC] transition-colors truncate">
                          {area.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[area.attachmentStatus]}`}
                        >
                          {statusLabels[area.attachmentStatus]}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {regionLabels[area.restorationRegion]}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {area.startDate}
                          {area.endDate ? ` ~ ${area.endDate}` : " ~ 진행중"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 태그 및 수치 정보 */}
                <div className="flex items-center gap-6 lg:gap-8 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">
                      {levelLabels[area.level]}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">
                      {habitatLabels[area.habitat]}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-gray-500">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">수심</p>
                      <p className="font-semibold text-gray-900">
                        {area.depth}m
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">면적</p>
                      <p className="font-semibold text-gray-900">
                        {area.areaSize.toLocaleString()}m²
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#2C67BC] transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 페이지네이션 (간단한 버전) */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
            <button
              className="px-3 py-1.5 text-sm text-gray-400 rounded"
              disabled
            >
              이전
            </button>
            <button className="px-3 py-1.5 text-sm bg-[#2C67BC] text-white rounded font-medium">
              1
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
              2
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
              3
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
