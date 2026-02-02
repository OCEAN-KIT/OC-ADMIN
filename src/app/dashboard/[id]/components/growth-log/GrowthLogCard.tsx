"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, ChevronUp, ChevronDown, Star, Trash2 } from "lucide-react";
import type { GrowthLogPayload, GrowthStatus } from "../../../create/api/types";
import {
  usePostGrowthLog,
  useDeleteGrowthLog,
} from "../../hooks/useGrowthLogMutations";
import {
  statusOptions,
  EMPTY_FORM,
  type GrowthSpeciesSection,
} from "./constants";

type Props = {
  section: GrowthSpeciesSection;
  onRemoveSpecies: () => void;
};

export default function GrowthLogCard({ section, onRemoveSpecies }: Props) {
  const { id } = useParams();
  const areaId = Number(id);
  const { mutate: postLog } = usePostGrowthLog(areaId);
  const { mutate: deleteLog } = useDeleteGrowthLog(areaId);

  const [expanded, setExpanded] = useState(false);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [form, setForm] = useState<GrowthLogPayload>({
    ...EMPTY_FORM,
    speciesId: section.speciesId,
  });

  const setField = <K extends keyof GrowthLogPayload>(
    key: K,
    value: GrowthLogPayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSaveLog = () => {
    if (!form.recordDate) return;
    postLog(form);
    setIsAddingLog(false);
    setForm({ ...EMPTY_FORM, speciesId: section.speciesId });
  };

  const handleCancelLog = () => {
    setIsAddingLog(false);
    setForm({ ...EMPTY_FORM, speciesId: section.speciesId });
  };

  const handleAddLogClick = () => {
    setIsAddingLog(true);
    setExpanded(true);
    setForm({ ...EMPTY_FORM, speciesId: section.speciesId });
  };

  const hasRepresentative = section.logs.some((x) => x.isRepresentative);
  const latest = section.logs[section.logs.length - 1];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
          <span className="font-medium text-gray-900">
            {section.speciesName}
          </span>

          {hasRepresentative && (
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
          )}

          <span className="text-xs text-gray-500">
            {section.logs.length === 0
              ? "(아직 기록 없음)"
              : `(${section.logs.length}회 기록 · 최근 ${
                  latest?.growthLength ?? ""
                }mm)`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddLogClick();
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
      {expanded && (
        <div className="p-4 space-y-3">
          {/* 테이블 */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-gray-600">
                  날짜
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  착생률
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  생존률
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  현재 길이
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  상태
                </th>
                <th className="text-left py-2 font-medium text-gray-600">
                  대표
                </th>
                <th className="w-10 py-2" />
              </tr>
            </thead>
            <tbody>
              {section.logs.map((g) => {
                const statusLabel = statusOptions.find(
                  (o) => o.value === g.status,
                );
                return (
                  <tr key={g.id} className="border-b last:border-0">
                    <td className="py-3 text-gray-500">
                      {g.recordDate[0]}.{g.recordDate[1]}.{g.recordDate[2]}
                    </td>
                    <td className="py-3">{g.attachmentRate}%</td>
                    <td className="py-3">{g.survivalRate}%</td>
                    <td className="py-3">{g.growthLength}mm</td>
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
                    <td className="py-3">
                      {g.isRepresentative && (
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteLog(g.id)}
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
                {section.speciesName} 성장 기록 추가
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <input
                  type="date"
                  value={form.recordDate}
                  onChange={(e) => setField("recordDate", e.target.value)}
                  className="px-2 py-1.5 text-sm rounded border border-gray-200"
                />

                <input
                  type="number"
                  placeholder="착생률 %"
                  value={form.attachmentRate || ""}
                  onChange={(e) =>
                    setField(
                      "attachmentRate",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  className="px-2 py-1.5 text-sm rounded border border-gray-200"
                />

                <input
                  type="number"
                  placeholder="생존률 %"
                  value={form.survivalRate || ""}
                  onChange={(e) =>
                    setField(
                      "survivalRate",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  className="px-2 py-1.5 text-sm rounded border border-gray-200"
                />

                <input
                  type="number"
                  placeholder="현재 길이 mm"
                  value={form.growthLength || ""}
                  onChange={(e) =>
                    setField(
                      "growthLength",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  className="px-2 py-1.5 text-sm rounded border border-gray-200"
                />

                <select
                  value={form.status}
                  onChange={(e) =>
                    setField("status", e.target.value as GrowthStatus | "")
                  }
                  className="px-2 py-1.5 text-sm rounded border border-gray-200 bg-white"
                >
                  <option value="">상태</option>
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 text-xs px-2 py-1.5 rounded border border-gray-200 bg-white">
                  <input
                    type="checkbox"
                    checked={form.isRepresentative}
                    onChange={(e) =>
                      setField("isRepresentative", e.target.checked)
                    }
                    className="w-3 h-3 text-[#2C67BC] border-gray-300 rounded"
                  />
                  대표
                </label>

                <div className="flex justify-end gap-2 sm:justify-start sm:col-span-6">
                  <button
                    type="button"
                    onClick={handleCancelLog}
                    className="px-2 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveLog}
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
