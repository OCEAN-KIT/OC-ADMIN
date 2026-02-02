import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";

export default function AreaPageHeader() {
  return (
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
          <h1 className="text-2xl font-bold text-gray-900">작업영역 관리</h1>
          <p className="mt-1 text-gray-500">
            대시보드에 표시 될 작업영역을 조회하고 관리합니다.
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
  );
}
