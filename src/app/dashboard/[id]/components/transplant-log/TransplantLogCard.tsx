"use client";

import { Plus, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import type {
  TransplantLogPayload,
  TransplantMethod,
  SpeciesAttachmentStatus,
} from "../../../create/api/types";
import {
  transplantMethods,
  attachmentOptions,
  type SpeciesSection,
} from "./constants";

type Props = {
  section: SpeciesSection;
  isExpanded: boolean;
  onToggle: () => void;
  isAddingLog: boolean;
  onAddLogClick: () => void;
  onRemoveSpecies: () => void;
  form: TransplantLogPayload;
  onFieldChange: <K extends keyof TransplantLogPayload>(
    key: K,
    value: TransplantLogPayload[K],
  ) => void;
  onSaveLog: () => void;
  onCancelLog: () => void;
  onDeleteLog: (logId: number) => void;
};

export default function TransplantLogCard({
  section,
  isExpanded,
  onToggle,
  isAddingLog,
  onAddLogClick,
  onRemoveSpecies,
  form,
  onFieldChange,
  onSaveLog,
  onCancelLog,
  onDeleteLog,
}: Props) {
  const totalCount = section.logs.reduce((sum, r) => sum + r.count, 0);
  const totalArea = section.logs.reduce((sum, r) => sum + r.areaSize, 0);
  const unit = section.logs[0]?.unit ?? "";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
          <span className="font-medium text-gray-900">
            {section.speciesName}
          </span>
          <span className="text-xs text-gray-500">
            ({section.logs.length}회 기록 · 총 {totalCount}
            {unit} · {totalArea}m²)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddLogClick();
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-[#2C67BC]/10 text-[#2C67BC] hover:bg-[#2C67BC]/20"
          >
            <Plus className="h-3 w-3" />
            기록 추가
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveSpecies();
            }}
            className="px-2 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50"
          >
            종 제거
          </button>
        </div>
      </div>

      {/* 바디 */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          {/* 테이블 */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-gray-600">
                  날짜
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  방식
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  수량
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  면적
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  착생
                </th>
                <th className="w-10 py-2" />
              </tr>
            </thead>
            <tbody>
              {section.logs.map((r) => {
                const statusLabel = attachmentOptions.find(
                  (o) => o.value === r.attachmentStatus,
                );
                return (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-3 text-gray-500">{r.recordDate}</td>
                    <td className="py-3">{r.methodLabel}</td>
                    <td className="py-3">
                      {r.count}
                      {r.unit}
                    </td>
                    <td className="py-3">{r.areaSize}m²</td>
                    <td className="py-3">
                      {statusLabel && (
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            statusLabel.value === "GOOD"
                              ? "bg-emerald-100 text-emerald-700"
                              : statusLabel.value === "NORMAL"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {statusLabel.label}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteLog(r.id)}
                        className="p-1 rounded hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 인라인 기록 추가 폼 */}
          {isAddingLog && (
            <div className="p-3 rounded-lg border border-[#2C67BC]/30 bg-blue-50/30">
              <p className="text-xs font-medium text-gray-600 mb-2">
                {section.speciesName} 이식 기록 추가
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <input
                  type="date"
                  value={form.recordDate}
                  onChange={(e) => onFieldChange("recordDate", e.target.value)}
                  className="px-2 py-1.5 text-sm rounded border border-gray-200"
                />

                <select
                  value={form.method}
                  onChange={(e) =>
                    onFieldChange(
                      "method",
                      e.target.value as TransplantMethod | "",
                    )
                  }
                  className="px-2 py-1.5 text-sm rounded border border-gray-200 bg-white"
                >
                  <option value="">방식</option>
                  {transplantMethods.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label} ({m.unit})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="수량"
                  value={form.count || ""}
                  onChange={(e) =>
                    onFieldChange("count", Number(e.target.value))
                  }
                  className="px-2 py-1.5 text-sm rounded border border-gray-200"
                />

                <input
                  type="number"
                  placeholder="면적(m²)"
                  value={form.areaSize || ""}
                  onChange={(e) =>
                    onFieldChange("areaSize", Number(e.target.value))
                  }
                  className="px-2 py-1.5 text-sm rounded border border-gray-200"
                />

                <select
                  value={form.attachmentStatus}
                  onChange={(e) =>
                    onFieldChange(
                      "attachmentStatus",
                      e.target.value as SpeciesAttachmentStatus | "",
                    )
                  }
                  className="px-2 py-1.5 text-sm rounded border border-gray-200 bg-white"
                >
                  <option value="">착생</option>
                  {attachmentOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2 sm:justify-start">
                  <button
                    type="button"
                    onClick={onCancelLog}
                    className="px-2 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={onSaveLog}
                    className="px-2 py-1 text-xs rounded bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
