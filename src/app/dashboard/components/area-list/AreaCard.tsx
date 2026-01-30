import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Calendar,
  Waves,
} from "lucide-react";
import type { AreaItem } from "./constants";
import {
  regionLabels,
  levelLabels,
  habitatLabels,
  statusLabels,
  statusColors,
} from "./constants";

type Props = {
  area: AreaItem;
};

export default function AreaCard({ area }: Props) {
  return (
    <Link
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
  );
}
