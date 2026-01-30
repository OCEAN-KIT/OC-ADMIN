"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import type { GrowthLogPayload, GrowthStatus } from "../../api/types";
import {
  dummySpecies,
  statusOptions,
  type GrowthSpeciesSection,
} from "./constants";
import GrowthLogCard from "./GrowthLogCard";

type Props = {
  sections: GrowthSpeciesSection[];
  showAddForm: boolean;
  onShowAddForm: () => void;
  form: GrowthLogPayload;
  onFieldChange: <K extends keyof GrowthLogPayload>(
    key: K,
    value: GrowthLogPayload[K],
  ) => void;
  onSaveNewSpecies: () => void;
  onCancelAddForm: () => void;
  expanded: string[];
  onToggleExpand: (name: string) => void;
  activeSpeciesForLogAdd: string | null;
  onAddLogClick: (speciesName: string, speciesId: number) => void;
  onRemoveSpecies: (speciesName: string) => void;
  onSaveLogToSpecies: (speciesName: string) => void;
  onCancelLogAdd: () => void;
};

export default function GrowthLogList({
  sections,
  showAddForm,
  onShowAddForm,
  form,
  onFieldChange,
  onSaveNewSpecies,
  onCancelAddForm,
  expanded,
  onToggleExpand,
  activeSpeciesForLogAdd,
  onAddLogClick,
  onRemoveSpecies,
  onSaveLogToSpecies,
  onCancelLogAdd,
}: Props) {
  const usedSpeciesIds = useMemo(
    () => new Set(sections.map((s) => s.speciesId)),
    [sections],
  );

  return (
    <div className="p-6 space-y-4">
      {/* 빈 상태 안내 */}
      {sections.length === 0 && !showAddForm && (
        <div className="p-5 rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <p className="text-sm text-gray-700 font-medium">
            아직 추가된 종이 없습니다.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            &quot;종 추가&quot;를 눌러 첫 성장 기록까지 함께 입력하세요.
          </p>
        </div>
      )}

      {/* 종 추가 폼 */}
      {showAddForm && (
        <div className="p-4 rounded-lg border-2 border-dashed border-[#2C67BC]/30 bg-blue-50/30">
          <p className="text-sm font-medium text-gray-700 mb-3">
            새 종 성장 기록 추가
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
                {dummySpecies
                  .filter((s) => !usedSpeciesIds.has(s.id))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* 상태 */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">상태</label>
              <select
                value={form.status}
                onChange={(e) =>
                  onFieldChange("status", e.target.value as GrowthStatus | "")
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
              >
                <option value="">상태 선택</option>
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 착생률 */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                착생률 (%)
              </label>
              <input
                type="number"
                value={form.attachmentRate || ""}
                onChange={(e) =>
                  onFieldChange(
                    "attachmentRate",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
              />
            </div>

            {/* 생존률 */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                생존률 (%)
              </label>
              <input
                type="number"
                value={form.survivalRate || ""}
                onChange={(e) =>
                  onFieldChange(
                    "survivalRate",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
              />
            </div>

            {/* 길이 */}
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                현재 길이 (mm)
              </label>
              <input
                type="number"
                value={form.growthLength || ""}
                onChange={(e) =>
                  onFieldChange(
                    "growthLength",
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="0"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
              />
            </div>
          </div>

          {/* 대표 체크 + 버튼 */}
          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isRepresentative}
                onChange={(e) =>
                  onFieldChange("isRepresentative", e.target.checked)
                }
                className="w-4 h-4 text-[#2C67BC] border-gray-300 rounded"
              />
              대표 개체로 지정
            </label>

            <div className="flex gap-2">
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
                className="px-3 py-2 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 종별 카드 */}
      {sections.map((sec) => (
        <GrowthLogCard
          key={sec.speciesName}
          section={sec}
          isExpanded={expanded.includes(sec.speciesName)}
          onToggle={() => onToggleExpand(sec.speciesName)}
          isAddingLog={activeSpeciesForLogAdd === sec.speciesName}
          onAddLogClick={() => onAddLogClick(sec.speciesName, sec.speciesId)}
          onRemoveSpecies={() => onRemoveSpecies(sec.speciesName)}
          form={form}
          onFieldChange={onFieldChange}
          onSaveLog={() => onSaveLogToSpecies(sec.speciesName)}
          onCancelLog={onCancelLogAdd}
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
