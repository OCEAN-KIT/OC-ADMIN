"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AreaPageHeader from "./components/AreaPageHeader";
import AreaSearchFilter from "./components/AreaSearchFilter";
import AreaList from "./components/area-list/AreaList";
import AreaPagination from "./components/AreaPagination";
import ClipLoader from "react-spinners/ClipLoader";
import { useGetAreas } from "./hooks/useAreas";

export default function DashboardPage() {
  const { checking } = useAuthGuard({ mode: "gotoLogin" });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetAreas(currentPage);

  const areas = data?.data.content ?? [];
  const totalPages = data?.data.totalPages ?? 0;
  const totalElements = data?.data.totalElements ?? 0;

  if (checking || isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <ClipLoader color="#2C67BC" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-red-500">데이터를 불러오지 못했습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="mx-auto max-w-[1500px] p-4">
        <AreaPageHeader />
        <AreaSearchFilter />

        {/* 결과 요약 */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            총
            <span className="font-semibold text-gray-900">
              {totalElements}
            </span>
            개의 작업영역
          </p>
        </div>

        <AreaList areas={areas} />
        <AreaPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
