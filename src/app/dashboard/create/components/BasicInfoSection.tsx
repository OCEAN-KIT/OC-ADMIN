"use client";

import type { ChangeEvent } from "react";
import { MapPin, Pencil } from "lucide-react";
import { ClipLoader } from "react-spinners";
import type { BasicPayload } from "../api/types";

// ── select 옵션 ──
const regionOptions = [
  { value: "POHANG", label: "포항" },
  { value: "ULJIN", label: "울진" },
];

const habitatOptions = [
  { value: "ROCKY", label: "암반" },
  { value: "MIXED", label: "혼합" },
  { value: "OTHER", label: "기타" },
];

const levelOptions = [
  { value: "OBSERVATION", label: "관측" },
  { value: "SETTLEMENT", label: "정착" },
  { value: "GROWTH", label: "성장" },
  { value: "MANAGEMENT", label: "관리" },
];

const attachmentOptions = [
  { value: "STABLE", label: "안정" },
  { value: "DECREASED", label: "일부 감소" },
  { value: "UNSTABLE", label: "불안정" },
];

// ── Props ──
type Props = {
  basicPayload: BasicPayload;
  onBasicChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEdit?: () => void;
  isEditing?: boolean;
};

export default function BasicInfoSection({
  basicPayload,
  onBasicChange,
  onEdit,
  isEditing,
}: Props) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#2C67BC]" />
          작업영역 기본 정보
        </h2>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            disabled={isEditing}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90 disabled:opacity-50"
          >
            {isEditing ? (
              <ClipLoader color="#fff" size={14} />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
            수정 제출
          </button>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* 작업 영역명 */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            작업 영역명          </label>
          <input
            id="name"
            name="name"
            value={basicPayload.name}
            onChange={onBasicChange}
            placeholder="예: 포항 A-1 구역"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
          />
        </div>

        {/* 복원 지역 */}
        <div>
          <label
            htmlFor="restorationRegion"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            복원 지역          </label>
          <select
            id="restorationRegion"
            name="restorationRegion"
            value={basicPayload.restorationRegion}
            onChange={onBasicChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
          >
            <option value="">선택하세요</option>
            {regionOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* 복원 시작일 / 복원 종료일(선택) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              복원 시작일            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={basicPayload.startDate}
              onChange={onBasicChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              복원 종료일 (선택)
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={basicPayload.endDate || ""}
              onChange={onBasicChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            />
          </div>
        </div>

        {/* 서식지 유형 / 프로젝트 단계 / 영역 착생 상태 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label
              htmlFor="habitat"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              서식지 유형            </label>
            <select
              id="habitat"
              name="habitat"
              value={basicPayload.habitat}
              onChange={onBasicChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            >
              <option value="">선택하세요</option>
              {habitatOptions.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="level"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              프로젝트 단계            </label>
            <select
              id="level"
              name="level"
              value={basicPayload.level}
              onChange={onBasicChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            >
              <option value="">선택하세요</option>
              {levelOptions.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="attachmentStatus"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              영역 착생 상태            </label>
            <select
              id="attachmentStatus"
              name="attachmentStatus"
              value={basicPayload.attachmentStatus}
              onChange={onBasicChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            >
              <option value="">선택하세요</option>
              {attachmentOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 평균 수심(m) / 면적(m²) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="depth"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              평균 수심(m)            </label>
            <input
              type="number"
              id="depth"
              name="depth"
              value={basicPayload.depth || ""}
              onChange={onBasicChange}
              placeholder="0"
              min="0"
              step="0.1"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            />
          </div>

          <div>
            <label
              htmlFor="areaSize"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              면적(m²)            </label>
            <input
              type="number"
              id="areaSize"
              name="areaSize"
              value={basicPayload.areaSize || ""}
              onChange={onBasicChange}
              placeholder="0"
              min="0"
              step="0.1"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            />
          </div>
        </div>

        {/* 위도/경도 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="lat"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              위도(lat)            </label>
            <input
              type="number"
              id="lat"
              name="lat"
              value={basicPayload.lat || ""}
              onChange={onBasicChange}
              placeholder="예: 36.0190"
              step="0.0001"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            />
          </div>

          <div>
            <label
              htmlFor="lon"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              경도(lon)            </label>
            <input
              type="number"
              id="lon"
              name="lon"
              value={basicPayload.lon || ""}
              onChange={onBasicChange}
              placeholder="예: 129.3430"
              step="0.0001"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C67BC]/20 focus:border-[#2C67BC]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
