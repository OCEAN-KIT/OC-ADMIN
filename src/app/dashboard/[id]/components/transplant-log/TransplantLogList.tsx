"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import type {
  TransplantLogPayload,
  TransplantMethod,
  SpeciesAttachmentStatus,
} from "../../../create/api/types";
import { useSpecies } from "@/hooks/useSpecies";
import {
  transplantMethods,
  attachmentOptions,
  type SpeciesSection,
} from "./constants";
import TransplantLogCard from "./TransplantLogCard";

type Props = {
  sections: SpeciesSection[];
  showAddForm: boolean;
  onShowAddForm: () => void;
  form: TransplantLogPayload;
  onFieldChange: <K extends keyof TransplantLogPayload>(
    key: K,
    value: TransplantLogPayload[K],
  ) => void;
  onSaveNewSpecies: () => void;
  onCancelAddForm: () => void;
};

export default function TransplantLogList({
  sections,
  showAddForm,
  onShowAddForm,
  form,
  onFieldChange,
  onSaveNewSpecies,
  onCancelAddForm,
}: Props) {
  const { data: speciesList = [] } = useSpecies();

  const usedSpeciesNames = useMemo(
    () => new Set(sections.map((s) => s.speciesName)),
    [sections],
  );

  const selectedMethod = useMemo(
    () => transplantMethods.find((m) => m.value === form.method),
    [form.method],
  );

  const canSave =
    !!form.recordDate &&
    !!form.speciesId &&
    !!form.method &&
    !!form.attachmentStatus;

  return (
    <div className="p-6 space-y-4">
      {/* 빈 상태 안내 */}
      {sections.length === 0 && !showAddForm && (
        <div className="p-5 rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <p className="text-sm text-gray-700 font-medium">
            아직 추가된 종이 없습니다.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            &quot;종 추가&quot;를 눌러 첫 이식 기록까지 함께 입력하세요.
          </p>
        </div>
      )}

      {/* 종 추가 폼 */}
      {showAddForm && (
        <div className="p-4 rounded-lg border-2 border-dashed border-[#2C67BC]/30 bg-blue-50/30">
          <p className="text-sm font-medium text-gray-700 mb-3">
            새 종 이식 기록 추가
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            {/* 날짜 */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                기록 날짜
              </label>
              <input
                type="date"
                value={form.recordDate}
                onChange={(e) => onFieldChange("recordDate", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
              />
            </div>

            {/* 종 */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">종</label>
              <select
                value={form.speciesId}
                onChange={(e) =>
                  onFieldChange("speciesId", Number(e.target.value))
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
              >
                <option value={0}>종 선택</option>
                {speciesList
                  .filter((s) => !usedSpeciesNames.has(s.name))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* 방식 */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                이식 방식
              </label>
              <select
                value={form.method}
                onChange={(e) =>
                  onFieldChange(
                    "method",
                    e.target.value as TransplantMethod | "",
                  )
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
              >
                <option value="">방식 선택</option>
                {transplantMethods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label} ({m.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* 수량 */}
            <div className="sm:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">
                수량{" "}
                <span className="text-gray-400">
                  {selectedMethod ? `(${selectedMethod.unit})` : ""}
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.count || ""}
                  onChange={(e) =>
                    onFieldChange("count", Number(e.target.value))
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 pr-12 text-sm rounded-lg border border-gray-200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {selectedMethod?.unit ?? "-"}
                </span>
              </div>
            </div>

            {/* 면적 */}
            <div className="sm:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">
                이식 면적 (m²)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={form.areaSize || ""}
                  onChange={(e) =>
                    onFieldChange("areaSize", Number(e.target.value))
                  }
                  placeholder="0"
                  step="0.1"
                  className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-gray-200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  m²
                </span>
              </div>
            </div>
          </div>

          {/* 착생 상태 (버튼형) */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              착생 상태
            </label>
            <div className="flex gap-2">
              {attachmentOptions.map((o) => (
                <label
                  key={o.value}
                  className={`px-4 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                    form.attachmentStatus === o.value
                      ? `${o.color} ring-2 ring-offset-1`
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="transplantAttachmentStatus"
                    value={o.value}
                    checked={form.attachmentStatus === o.value}
                    onChange={() => onFieldChange("attachmentStatus", o.value)}
                    className="sr-only"
                  />
                  {o.label}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancelAddForm}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onSaveNewSpecies}
              disabled={!canSave}
              className="px-3 py-2 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              저장
            </button>
          </div>
        </div>
      )}

      {/* 종별 카드 */}
      {sections.map((sec) => (
        <TransplantLogCard
          key={sec.speciesName}
          section={sec}
        />
      ))}

      {/* 하단 CTA */}
      {sections.length > 0 && !showAddForm && (
        <button
          type="button"
          onClick={onShowAddForm}
          className="w-full px-4 py-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          다른 종 추가
        </button>
      )}
    </div>
  );
}
