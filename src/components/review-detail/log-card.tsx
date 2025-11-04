"use client";

import {
  Thermometer,
  Waves,
  Eye,
  Anchor,
  Image as ImageIcon,
} from "lucide-react";
import type { DiverActivityLog } from "@/data/diver-log";
import InfoItem from "./info-item";
import ActivityLabel from "./activity-label";

export default function LogCard({ log }: { log: DiverActivityLog }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
      {/* 개인 환경정보 요약(있을 때만) */}
      {log.env && (
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <InfoItem
            item="수온"
            value={`${log.env.waterTempC}℃`}
            icon={<Thermometer className="h-4 w-4 text-gray-400" />}
          />
          <InfoItem
            item="조류"
            value={log.env.current}
            icon={<Waves className="h-4 w-4 text-gray-400" />}
          />
          <InfoItem
            item="가시거리"
            value={`${log.env.visibilityM}m`}
            icon={<Eye className="h-4 w-4 text-gray-400" />}
          />
          <InfoItem
            item="수심"
            value={`${log.env.depthM}m`}
            icon={<Anchor className="h-4 w-4 text-gray-400" />}
          />
        </div>
      )}

      {/* 활동 라벨 */}
      <div className="mb-3">
        <ActivityLabel activity={log.activity} />
      </div>

      {/* 세부내용 */}
      <div className="mb-4">
        <h3 className="mb-1 text-xs font-semibold text-gray-500">세부내용</h3>
        <p className="whitespace-pre-wrap text-sm text-gray-800">
          {log.details}
        </p>
      </div>

      {/* 사진 썸네일 */}
      {log.media?.photos?.length ? (
        <div className="mb-4">
          <h3 className="mb-2 text-xs font-semibold text-gray-500">
            첨부 사진
          </h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {log.media.photos.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-gray-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="dive-photo"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/40 px-1.5 py-0.5 text-[11px] text-white">
                  <ImageIcon className="h-3 w-3" />
                  photo
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 환경 이상/사고 보고 */}
      {log.incidentOrAbnormal ? (
        <div>
          <h3 className="mb-1 text-xs font-semibold text-gray-500">
            환경 이상/사고 보고
          </h3>
          <div className="rounded-lg px-0 py-0 text-sm text-gray-800">
            {log.incidentOrAbnormal}
          </div>
        </div>
      ) : null}
    </div>
  );
}
