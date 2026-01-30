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
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeSpeciesForLogAdd, setActiveSpeciesForLogAdd] = useState<
    string | null
  >(null);

  const [form, setForm] = useState<GrowthLogPayload>({ ...EMPTY_FORM });

  const usedSpeciesIds = useMemo(
    () => new Set(growthPayload.map((s) => s.speciesId)),
    [growthPayload],
  );

  const setField = <K extends keyof GrowthLogPayload>(
    key: K,
    value: GrowthLogPayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── 종 추가 (첫 기록까지 한번에) ──
  const handleAddSpeciesWithFirstLog = () => {
    const sp = dummySpecies.find((s) => s.id === form.speciesId);
    if (!sp || !form.recordDate) return;
    if (usedSpeciesIds.has(sp.id)) return;

    const entry: GrowthLogEntry = {
      ...form,
      id: Date.now(),
    };

    onGrowthChange([
      ...growthPayload,
      { speciesId: sp.id, speciesName: sp.name, logs: [entry] },
    ]);

    setExpanded((prev) => (prev.includes(sp.name) ? prev : [...prev, sp.name]));
    setShowAddForm(false);
    setActiveSpeciesForLogAdd(null);
    setForm({ ...EMPTY_FORM });
  };

  // ── 기존 종에 기록 추가 ──
  const handleAddLogToSpecies = (speciesName: string) => {
    if (!form.recordDate) return;

    const entry: GrowthLogEntry = {
      ...form,
      id: Date.now(),
    };

    onGrowthChange(
      growthPayload.map((sec) =>
        sec.speciesName === speciesName
          ? { ...sec, logs: [...sec.logs, entry] }
          : sec,
      ),
    );

    setActiveSpeciesForLogAdd(null);
    setForm({ ...EMPTY_FORM });
  };

  // ── 종 제거 ──
  const removeSpecies = (speciesName: string) => {
    onGrowthChange(growthPayload.filter((s) => s.speciesName !== speciesName));
    setExpanded((prev) => prev.filter((x) => x !== speciesName));
    if (activeSpeciesForLogAdd === speciesName) setActiveSpeciesForLogAdd(null);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#2C67BC]" />
          성장 현황 입력 (종별 · 기록 누적)
        </h2>

        <button
          type="button"
          onClick={() => {
            setShowAddForm((v) => !v);
            setActiveSpeciesForLogAdd(null);
            setForm({ ...EMPTY_FORM });
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
        >
          {showAddForm ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          종 추가
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* 빈 상태 안내 */}
        {growthPayload.length === 0 && !showAddForm && (
          <div className="p-5 rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <p className="text-sm text-gray-700 font-medium">
              아직 추가된 종이 없습니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              &quot;종 추가&quot;를 눌러 첫 성장 기록까지 함께 입력하세요.
            </p>
          </div>
        )}

        {/* 종 추가 폼 (이식로그와 동일: 종 선택 + 첫 기록 한번에) */}
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
                  onChange={(e) => setField("recordDate", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                />
              </div>

              {/* 종 */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">종</label>
                <select
                  value={form.speciesId}
                  onChange={(e) =>
                    setField("speciesId", Number(e.target.value))
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
                    setField("status", e.target.value as GrowthStatus | "")
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
                    setField(
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
                    setField(
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
                    setField(
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
                    setField("isRepresentative", e.target.checked)
                  }
                  className="w-4 h-4 text-[#2C67BC] border-gray-300 rounded"
                />
                대표 개체로 지정
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleAddSpeciesWithFirstLog}
                  className="px-3 py-2 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
                >
                  저장
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
              {/* 헤더 */}
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
                      : `(${sec.logs.length}회 기록 · 최근 ${
                          latest?.growthLength ?? ""
                        }mm)`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSpeciesForLogAdd(sec.speciesName);
                      setShowAddForm(false);
                      setForm({ ...EMPTY_FORM, speciesId: sec.speciesId });
                      if (!isExpanded) {
                        setExpanded((prev) => [...prev, sec.speciesName]);
                      }
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
                      removeSpecies(sec.speciesName);
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

                  {/* 인라인 기록 추가 폼 */}
                  {activeSpeciesForLogAdd === sec.speciesName && (
                    <div className="p-3 rounded-lg border border-[#2C67BC]/30 bg-blue-50/30">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        {sec.speciesName} 성장 기록 추가
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                        <input
                          type="date"
                          value={form.recordDate}
                          onChange={(e) =>
                            setField("recordDate", e.target.value)
                          }
                          className="px-2 py-1.5 text-sm rounded border border-gray-200"
                        />

                        <input
                          type="number"
                          placeholder="착생률 %"
                          value={form.attachmentRate || ""}
                          onChange={(e) =>
                            setField(
                              "attachmentRate",
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
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
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
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
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
                            )
                          }
                          className="px-2 py-1.5 text-sm rounded border border-gray-200"
                        />

                        <select
                          value={form.status}
                          onChange={(e) =>
                            setField(
                              "status",
                              e.target.value as GrowthStatus | "",
                            )
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
                            onClick={() => setActiveSpeciesForLogAdd(null)}
                            className="px-2 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAddLogToSpecies(sec.speciesName)
                            }
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
        })}

        {/* 하단 CTA */}
        {growthPayload.length > 0 && !showAddForm && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setActiveSpeciesForLogAdd(null);
              setForm({ ...EMPTY_FORM });
            }}
            className="w-full px-4 py-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            다른 종 추가
          </button>
        )}
      </div>
    </section>
  );
}
