"use client";

import { useMemo, useState } from "react";
import { TrendingUp, Plus, ChevronUp, ChevronDown, Star } from "lucide-react";
import type { GrowthLogPayload, GrowthStatus } from "../api/types";

// ── 더미 종 데이터 (실제로는 API) ──

const dummySpecies = [
  { id: 1, name: "감태" },
  { id: 2, name: "모자반" },
  { id: 3, name: "대황" },
  { id: 4, name: "미역" },
  { id: 5, name: "다시마" },
];

// ── 상태 옵션 ──

const statusOptions: { value: GrowthStatus; label: string }[] = [
  { value: "GOOD", label: "양호" },
  { value: "NORMAL", label: "보통" },
  { value: "POOR", label: "미흡" },
];

// ── UI 전용 타입 ──

type GrowthLogEntry = GrowthLogPayload & { id: number };

export type GrowthSpeciesSection = {
  speciesId: number;
  speciesName: string;
  logs: GrowthLogEntry[];
};

const EMPTY_FORM: GrowthLogPayload = {
  speciesId: 0,
  isRepresentative: false,
  recordDate: "",
  attachmentRate: 0,
  survivalRate: 0,
  growthLength: 0,
  status: "",
};

// ── Props ──

type Props = {
  growthPayload: GrowthSpeciesSection[];
  onGrowthChange: (_sections: GrowthSpeciesSection[]) => void;
};

export default function GrowthLogSection({
  growthPayload,
  onGrowthChange,
}: Props) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showAddSpecies, setShowAddSpecies] = useState(false);
  const [newSpeciesId, setNewSpeciesId] = useState<number>(0);
  const [activeFormSpecies, setActiveFormSpecies] = useState<string | null>(
    null,
  );
  const [form, setForm] = useState<GrowthLogPayload>({ ...EMPTY_FORM });

  const usedSpeciesIds = useMemo(
    () => new Set(growthPayload.map((s) => s.speciesId)),
    [growthPayload],
  );

  // ── 종 추가 (빈 로그로 시작) ──

  const handleAddSpecies = () => {
    const sp = dummySpecies.find((s) => s.id === newSpeciesId);
    if (!sp || usedSpeciesIds.has(sp.id)) return;

    onGrowthChange([
      ...growthPayload,
      { speciesId: sp.id, speciesName: sp.name, logs: [] },
    ]);

    setShowAddSpecies(false);
    setNewSpeciesId(0);
    setExpanded((prev) =>
      prev.includes(sp.name) ? prev : [...prev, sp.name],
    );
    setActiveFormSpecies(sp.name);
    setForm({ ...EMPTY_FORM });
  };

  // ── 종 제거 ──

  const handleRemoveSpecies = (speciesName: string) => {
    onGrowthChange(growthPayload.filter((s) => s.speciesName !== speciesName));
    setExpanded((prev) => prev.filter((x) => x !== speciesName));
    if (activeFormSpecies === speciesName) setActiveFormSpecies(null);
  };

  // ── 기록 추가 ──

  const handleAddLog = (speciesName: string) => {
    if (!form.recordDate) return;

    const entry: GrowthLogEntry = {
      ...form,
      id: Date.now(),
      status:
        (statusOptions.find((o) => o.value === form.status)?.value as
          | GrowthStatus
          | "") ?? "",
    };

    onGrowthChange(
      growthPayload.map((sec) =>
        sec.speciesName === speciesName
          ? { ...sec, logs: [...sec.logs, entry] }
          : sec,
      ),
    );

    setForm({ ...EMPTY_FORM });
    setActiveFormSpecies(null);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#2C67BC]" />
          성장 현황 입력 (종별 · 날짜별)
        </h2>

        <button
          type="button"
          onClick={() => setShowAddSpecies((v) => !v)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
        >
          {showAddSpecies ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          종 추가
        </button>
      </div>

      <div className="p-6 space-y-3">
        {/* 빈 상태 */}
        {growthPayload.length === 0 && !showAddSpecies && (
          <div className="p-5 rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <p className="text-sm text-gray-700 font-medium">
              아직 추가된 종이 없습니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              &quot;종 추가&quot;로 성장 로그를 관리할 종을 먼저 추가하세요.
            </p>
          </div>
        )}

        {/* 종 추가 UI */}
        {showAddSpecies && (
          <div className="p-4 rounded-lg border-2 border-dashed border-[#2C67BC]/30 bg-blue-50/30">
            <p className="text-sm font-medium text-gray-700 mb-3">
              추가할 종을 선택하세요
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={newSpeciesId}
                onChange={(e) => setNewSpeciesId(Number(e.target.value))}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
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

              <div className="sm:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSpecies(false)}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleAddSpecies}
                  className="px-3 py-2 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 종별 아코디언 */}
        {growthPayload.map((sec) => {
          const isExpanded = expanded.includes(sec.speciesName);
          const hasRepresentative = sec.logs.some((x) => x.isRepresentative);
          const latest = sec.logs[sec.logs.length - 1];

          return (
            <div
              key={sec.speciesName}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* 종 헤더 */}
              <div
                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setExpanded((prev) =>
                    prev.includes(sec.speciesName)
                      ? prev.filter((x) => x !== sec.speciesName)
                      : [...prev, sec.speciesName],
                  );
                }}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="font-medium text-gray-900">
                    {sec.speciesName}
                  </span>

                  {hasRepresentative && (
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  )}

                  <span className="text-xs text-gray-500">
                    {sec.logs.length === 0
                      ? "(아직 기록 없음)"
                      : `(${sec.logs.length}회 기록 · 최근 ${latest?.growthLength ?? ""}mm)`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFormSpecies(sec.speciesName);
                      if (!isExpanded) {
                        setExpanded((prev) => [...prev, sec.speciesName]);
                      }
                      setForm({ ...EMPTY_FORM });
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
                      handleRemoveSpecies(sec.speciesName);
                    }}
                    className="px-2 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50"
                  >
                    종 제거
                  </button>
                </div>
              </div>

              {/* 종 상세 */}
              {isExpanded && (
                <div className="p-4">
                  {/* 기록 없을 때 안내 */}
                  {sec.logs.length === 0 && (
                    <div className="mb-3 p-3 rounded-lg bg-gray-50 border border-dashed border-gray-300">
                      <p className="text-xs text-gray-600">
                        아직 {sec.speciesName} 성장 기록이 없습니다.
                        &quot;기록 추가&quot;로 첫 기록을 입력하세요.
                      </p>
                    </div>
                  )}

                  {/* 테이블 */}
                  {sec.logs.length > 0 && (
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
                        </tr>
                      </thead>
                      <tbody>
                        {sec.logs.map((g) => {
                          const statusLabel = statusOptions.find(
                            (o) => o.value === g.status,
                          );
                          return (
                            <tr key={g.id} className="border-b last:border-0">
                              <td className="py-3 text-gray-500">
                                {g.recordDate}
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
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {/* 인라인 기록 추가 폼 */}
                  {activeFormSpecies === sec.speciesName && (
                    <div className="mt-3 p-3 rounded-lg border border-[#2C67BC]/30 bg-blue-50/30">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        {sec.speciesName} 성장 기록 추가
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-2">
                        <input
                          type="date"
                          value={form.recordDate}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              recordDate: e.target.value,
                            }))
                          }
                          className="px-2 py-1.5 text-sm rounded border border-gray-200"
                        />
                        <input
                          type="number"
                          placeholder="착생률 %"
                          value={form.attachmentRate || ""}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              attachmentRate: Number(e.target.value),
                            }))
                          }
                          className="px-2 py-1.5 text-sm rounded border border-gray-200"
                        />
                        <input
                          type="number"
                          placeholder="생존률 %"
                          value={form.survivalRate || ""}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              survivalRate: Number(e.target.value),
                            }))
                          }
                          className="px-2 py-1.5 text-sm rounded border border-gray-200"
                        />
                        <input
                          type="number"
                          placeholder="현재 길이 mm"
                          value={form.growthLength || ""}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              growthLength: Number(e.target.value),
                            }))
                          }
                          className="px-2 py-1.5 text-sm rounded border border-gray-200"
                        />
                        <select
                          value={form.status}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              status: e.target.value as GrowthStatus | "",
                            }))
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
                              setForm((p) => ({
                                ...p,
                                isRepresentative: e.target.checked,
                              }))
                            }
                            className="w-3 h-3 text-[#2C67BC] border-gray-300 rounded"
                          />
                          대표
                        </label>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveFormSpecies(null)}
                          className="px-2 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddLog(sec.speciesName)}
                          className="px-2 py-1 text-xs rounded bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* 하단 CTA */}
        {growthPayload.length > 0 && !showAddSpecies && (
          <button
            type="button"
            onClick={() => setShowAddSpecies(true)}
            className="w-full mt-2 px-4 py-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            다른 종 추가
          </button>
        )}
      </div>
    </section>
  );
}
