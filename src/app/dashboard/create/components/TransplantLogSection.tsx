"use client";

import { useMemo, useState } from "react";
import { Leaf, Plus, ChevronUp, ChevronDown } from "lucide-react";
import type {
  TransplantLogPayload,
  TransplantMethod,
  SpeciesAttachmentStatus,
} from "../api/types";

// ── 더미 종 데이터 (실제로는 API) ──

const dummySpecies = [
  { id: 1, name: "감태" },
  { id: 2, name: "모자반" },
  { id: 3, name: "대황" },
  { id: 4, name: "미역" },
  { id: 5, name: "다시마" },
];

// ── 이식 방식 옵션 ──

const transplantMethods: {
  value: TransplantMethod;
  label: string;
  unit: string;
}[] = [
  { value: "SEEDLING_STRING", label: "종묘줄", unit: "줄" },
  { value: "ROPE", label: "로프", unit: "m" },
  { value: "ROCK_FIXATION", label: "암반 고정", unit: "지점" },
  { value: "TRANSPLANT_MODULE", label: "이식 모듈", unit: "기" },
  { value: "DIRECT_FIXATION", label: "직접 고정 지점", unit: "지점" },
];

// ── 착생 상태 옵션 ──

const attachmentOptions: {
  value: SpeciesAttachmentStatus;
  label: string;
  color: string;
}[] = [
  {
    value: "GOOD",
    label: "양호",
    color: "border-emerald-500 bg-emerald-50 text-emerald-700",
  },
  {
    value: "NORMAL",
    label: "보통",
    color: "border-yellow-500 bg-yellow-50 text-yellow-700",
  },
  {
    value: "POOR",
    label: "미흡",
    color: "border-rose-500 bg-rose-50 text-rose-700",
  },
];

// ── UI 전용 타입 ──

type TransplantLogEntry = TransplantLogPayload & {
  id: number;
  methodLabel: string;
  unit: string;
};

export type SpeciesSection = {
  speciesId: number;
  speciesName: string;
  logs: TransplantLogEntry[];
};

const EMPTY_FORM: TransplantLogPayload = {
  recordDate: "",
  method: "",
  speciesId: 0,
  count: 0,
  areaSize: 0,
  attachmentStatus: "",
};

// ── Props ──

type Props = {
  transplantPayload: SpeciesSection[];
  onTransplantChange: (sections: SpeciesSection[]) => void;
};

export default function TransplantLogSection({
  transplantPayload,
  onTransplantChange,
}: Props) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeSpeciesForLogAdd, setActiveSpeciesForLogAdd] = useState<
    string | null
  >(null);
  const [form, setForm] = useState<TransplantLogPayload>({ ...EMPTY_FORM });

  const usedSpeciesIds = useMemo(
    () => new Set(transplantPayload.map((s) => s.speciesId)),
    [transplantPayload],
  );

  const selectedMethod = useMemo(
    () => transplantMethods.find((m) => m.value === form.method),
    [form.method],
  );

  const setField = <K extends keyof TransplantLogPayload>(
    key: K,
    value: TransplantLogPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ── 종 추가 (첫 기록까지 한번에) ──

  const handleAddSpeciesWithFirstLog = () => {
    const sp = dummySpecies.find((s) => s.id === form.speciesId);
    const m = transplantMethods.find((x) => x.value === form.method);
    if (!sp || !m || !form.recordDate) return;
    if (usedSpeciesIds.has(sp.id)) return;

    const entry: TransplantLogEntry = {
      ...form,
      id: Date.now(),
      methodLabel: m.label,
      unit: m.unit,
    };

    onTransplantChange([
      ...transplantPayload,
      { speciesId: sp.id, speciesName: sp.name, logs: [entry] },
    ]);

    setExpanded((prev) => (prev.includes(sp.name) ? prev : [...prev, sp.name]));
    setShowAddForm(false);
    setActiveSpeciesForLogAdd(null);
    setForm({ ...EMPTY_FORM });
  };

  // ── 기존 종에 기록 추가 ──

  const handleAddLogToSpecies = (speciesName: string) => {
    const m = transplantMethods.find((x) => x.value === form.method);
    if (!m || !form.recordDate) return;

    const entry: TransplantLogEntry = {
      ...form,
      id: Date.now(),
      methodLabel: m.label,
      unit: m.unit,
    };

    onTransplantChange(
      transplantPayload.map((sec) =>
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
    onTransplantChange(
      transplantPayload.filter((s) => s.speciesName !== speciesName),
    );
    setExpanded((prev) => prev.filter((x) => x !== speciesName));
    if (activeSpeciesForLogAdd === speciesName) setActiveSpeciesForLogAdd(null);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-[#2C67BC]" />
          이식 로그 정보 (종별 · 기록 누적)
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
        {transplantPayload.length === 0 && !showAddForm && (
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

              {/* 방식 */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  이식 방식
                </label>
                <select
                  value={form.method}
                  onChange={(e) =>
                    setField("method", e.target.value as TransplantMethod | "")
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
                    onChange={(e) => setField("count", Number(e.target.value))}
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
                      setField("areaSize", Number(e.target.value))
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
                      onChange={() => setField("attachmentStatus", o.value)}
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
        )}

        {/* 종별 아코디언 */}
        {transplantPayload.map((sec) => {
          const isExpanded = expanded.includes(sec.speciesName);

          const totalCount = sec.logs.reduce((sum, r) => sum + r.count, 0);
          const totalArea = sec.logs.reduce((sum, r) => sum + r.areaSize, 0);
          const unit = sec.logs[0]?.unit ?? "";

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
                  <span className="text-xs text-gray-500">
                    ({sec.logs.length}회 기록 · 총 {totalCount}
                    {unit} · {totalArea}m²)
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
                      </tr>
                    </thead>
                    <tbody>
                      {sec.logs.map((r) => {
                        const statusLabel = attachmentOptions.find(
                          (o) => o.value === r.attachmentStatus,
                        );
                        return (
                          <tr key={r.id} className="border-b last:border-0">
                            <td className="py-3 text-gray-500">
                              {r.recordDate}
                            </td>
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
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* 인라인 기록 추가 폼 */}
                  {activeSpeciesForLogAdd === sec.speciesName && (
                    <div className="p-3 rounded-lg border border-[#2C67BC]/30 bg-blue-50/30">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        {sec.speciesName} 이식 기록 추가
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

                        <select
                          value={form.method}
                          onChange={(e) =>
                            setField(
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
                            setField("count", Number(e.target.value))
                          }
                          className="px-2 py-1.5 text-sm rounded border border-gray-200"
                        />

                        <input
                          type="number"
                          placeholder="면적(m²)"
                          value={form.areaSize || ""}
                          onChange={(e) =>
                            setField("areaSize", Number(e.target.value))
                          }
                          className="px-2 py-1.5 text-sm rounded border border-gray-200"
                        />

                        <select
                          value={form.attachmentStatus}
                          onChange={(e) =>
                            setField(
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
        {transplantPayload.length > 0 && !showAddForm && (
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
