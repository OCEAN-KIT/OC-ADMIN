"use client";

import { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import {
  sortLabels,
  type RestorationRegion,
  type ProjectLevel,
  type HabitatType,
  type AreaSort,
} from "./area-list/constants";

export default function AreaSearchFilter() {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState<RestorationRegion>("");
  const [level, setLevel] = useState<ProjectLevel>("");
  const [habitat, setHabitat] = useState<HabitatType>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<AreaSort>("ID_DESC");
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    keyword || region || level || habitat || fromDate || toDate;

  const clearFilters = () => {
    setKeyword("");
    setRegion("");
    setLevel("");
    setHabitat("");
    setFromDate("");
    setToDate("");
    setSort("ID_DESC");
  };

  return (
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
  );
}
