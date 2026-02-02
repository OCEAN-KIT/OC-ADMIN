import { useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Calendar, Waves, Trash2 } from "lucide-react";
import type { AreaItem } from "./constants";
import {
  regionLabels,
  levelLabels,
  habitatLabels,
  statusLabels,
  statusColors,
} from "./constants";
import { useDeleteArea } from "../../hooks/useAreas";

type Props = {
  area: AreaItem;
};

export default function AreaCard({ area }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: deleteArea, isPending } = useDeleteArea();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteArea(area.id, {
      onSettled: () => setConfirmOpen(false),
    });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmOpen(false);
  };

  return (
    <Link
      href={`/dashboard/${area.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group"
    >
      {/* 상단: 이름 + 상태 + 액션 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-[#2C67BC]/10 flex items-center justify-center">
            <Waves className="h-5 w-5 text-[#2C67BC]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2C67BC] transition-colors truncate">
            {area.name}
          </h3>
          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[area.attachmentStatus] ?? "bg-gray-100 text-gray-700"}`}
          >
            {statusLabels[area.attachmentStatus] ?? area.attachmentStatus}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {confirmOpen ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isPending ? "삭제 중..." : "확인"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          )}
          <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#2C67BC] transition-colors" />
        </div>
      </div>

      {/* 하단: 정보 그리드 */}
      <div className="mt-4 grid grid-cols-3 gap-y-3 gap-x-4 text-sm sm:grid-cols-4 lg:grid-cols-7">
        <div>
          <p className="text-xs text-gray-400">지역</p>
          <p className="font-medium text-gray-900 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            {regionLabels[area.restorationRegion] ?? area.restorationRegion}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">기간</p>
          <p className="font-medium text-gray-900 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {area.startDate[0]}.{area.startDate[1]}.{area.startDate[2]}
            {area.endDate
              ? ` ~ ${area.endDate[0]}.${area.endDate[1]}.${area.endDate[2]}`
              : " ~"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">단계</p>
          <p className="font-medium text-gray-900">
            {levelLabels[area.level] ?? area.level}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">서식지</p>
          <p className="font-medium text-gray-900">
            {habitatLabels[area.habitat] ?? area.habitat}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">수심</p>
          <p className="font-medium text-gray-900">{area.depth}m</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">면적</p>
          <p className="font-medium text-gray-900">
            {area.areaSize.toLocaleString()}m²
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">좌표</p>
          <p className="font-medium text-gray-900">
            {area.lat}, {area.lon}
          </p>
        </div>
      </div>
    </Link>
  );
}
