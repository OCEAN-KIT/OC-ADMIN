"use client";

import { useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import AreaPageHeader from "./components/AreaPageHeader";
import AreaSearchFilter from "./components/AreaSearchFilter";
import AreaList from "./components/area-list/AreaList";
import AreaPagination from "./components/AreaPagination";
import { dummyAreas } from "./components/area-list/constants";

export default function DashboardPage() {
  const { checking } = useAuthGuard({ mode: "gotoLogin" });
  const [currentPage, setCurrentPage] = useState(1);

  if (checking) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
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
              {dummyAreas.length}
            </span>
            개의 작업영역
          </p>
        </div>

        <AreaList areas={dummyAreas} />
        <AreaPagination
          totalPages={3}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
