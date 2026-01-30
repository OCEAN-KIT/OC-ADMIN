"use client";

import { useState } from "react";
import { Cloud, Plus, ChevronUp, X } from "lucide-react";
import type { EnvironmentLogPayload, EnvironmentCondition } from "../api/types";

// ── 상태 옵션 ──
const conditionOptions: { value: EnvironmentCondition; label: string }[] = [
  { value: "GOOD", label: "양호" },
  { value: "NORMAL", label: "보통" },
  { value: "POOR", label: "미흡" },
];

const conditionBadge = (value: EnvironmentCondition) => {
  const opt = conditionOptions.find((o) => o.value === value);
  if (!opt) return null;
  const cls =
    value === "GOOD"
      ? "bg-emerald-100 text-emerald-700"
      : value === "NORMAL"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-rose-100 text-rose-700";
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${cls}`}>{opt.label}</span>
  );
};

// ── UI 전용 타입 ──
export type EnvironmentLogEntry = EnvironmentLogPayload & { id: number };

const EMPTY_FORM: EnvironmentLogPayload = {
  recordDate: "",
  temperature: 0,
  dissolvedOxygen: 0,
  nutrient: 0,
  visibility: "",
  current: "",
  surge: "",
  wave: "",
};

// ── Props ──
type Props = {
  environmentPayload: EnvironmentLogEntry[];
  onEnvironmentChange: (_entries: EnvironmentLogEntry[]) => void;
};

export default function EnvironmentLogSection({
  environmentPayload,
  onEnvironmentChange,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<EnvironmentLogPayload>({ ...EMPTY_FORM });

  const setField = <K extends keyof EnvironmentLogPayload>(
    key: K,
    value: EnvironmentLogPayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── 기록 추가 ──
  const handleAdd = () => {
    if (!form.recordDate) return;

    const entry: EnvironmentLogEntry = {
      ...form,
      id: Date.now(),
    };

    onEnvironmentChange([...environmentPayload, entry]);
    setShowAddForm(false);
    setForm({ ...EMPTY_FORM });
  };

  // ── 기록 삭제 ──
  const handleRemove = (id: number) => {
    onEnvironmentChange(environmentPayload.filter((e) => e.id !== id));
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Cloud className="h-5 w-5 text-[#2C67BC]" />
          환경 로그 입력 (날짜별 기록 누적)
        </h2>

        <button
          type="button"
          onClick={() => {
            setShowAddForm((v) => !v);
            setForm({ ...EMPTY_FORM });
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
        >
          {showAddForm ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          기록 추가
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* 빈 상태 안내 */}
        {environmentPayload.length === 0 && !showAddForm && (
          <div className="p-5 rounded-lg border border-dashed border-gray-300 bg-gray-50">
            <p className="text-sm text-gray-700 font-medium">
              아직 환경 기록이 없습니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              &quot;기록 추가&quot;를 눌러 해양 환경 데이터를 입력하세요.
            </p>
          </div>
        )}

        {/* 기록 추가 폼 */}
        {showAddForm && (
          <div className="p-4 rounded-lg border-2 border-dashed border-[#2C67BC]/30 bg-blue-50/30">
            <p className="text-sm font-medium text-gray-700 mb-3">
              새 환경 기록 추가
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

              {/* 수온 */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  수온 (&deg;C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.temperature || ""}
                  onChange={(e) =>
                    setField(
                      "temperature",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                />
              </div>

              {/* 용존산소 */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  용존산소 (mg/L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.dissolvedOxygen || ""}
                  onChange={(e) =>
                    setField(
                      "dissolvedOxygen",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                />
              </div>

              {/* 영양염 */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  영양염
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.nutrient || ""}
                  onChange={(e) =>
                    setField(
                      "nutrient",
                      e.target.value === "" ? 0 : Number(e.target.value),
                    )
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200"
                />
              </div>

              {/* 투명도 */}
              <div className="sm:col-span-1">
                <label className="block text-xs text-gray-600 mb-1">
                  투명도
                </label>
                <select
                  value={form.visibility}
                  onChange={(e) =>
                    setField(
                      "visibility",
                      e.target.value as EnvironmentCondition | "",
                    )
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
                >
                  <option value="">선택</option>
                  {conditionOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 조류 */}
              <div className="sm:col-span-1">
                <label className="block text-xs text-gray-600 mb-1">
                  조류
                </label>
                <select
                  value={form.current}
                  onChange={(e) =>
                    setField(
                      "current",
                      e.target.value as EnvironmentCondition | "",
                    )
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
                >
                  <option value="">선택</option>
                  {conditionOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 너울 */}
              <div className="sm:col-span-1">
                <label className="block text-xs text-gray-600 mb-1">
                  너울
                </label>
                <select
                  value={form.surge}
                  onChange={(e) =>
                    setField(
                      "surge",
                      e.target.value as EnvironmentCondition | "",
                    )
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
                >
                  <option value="">선택</option>
                  {conditionOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 파도 */}
              <div className="sm:col-span-1">
                <label className="block text-xs text-gray-600 mb-1">
                  파도
                </label>
                <select
                  value={form.wave}
                  onChange={(e) =>
                    setField(
                      "wave",
                      e.target.value as EnvironmentCondition | "",
                    )
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
                >
                  <option value="">선택</option>
                  {conditionOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 버튼 */}
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
                onClick={handleAdd}
                className="px-3 py-2 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
              >
                저장
              </button>
            </div>
          </div>
        )}

        {/* 기록 테이블 */}
        {environmentPayload.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    날짜
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    수온
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    용존산소
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    영양염
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    투명도
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    조류
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    너울
                  </th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">
                    파도
                  </th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {environmentPayload.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-gray-500">
                      {entry.recordDate}
                    </td>
                    <td className="px-4 py-3">{entry.temperature}&deg;C</td>
                    <td className="px-4 py-3">
                      {entry.dissolvedOxygen}mg/L
                    </td>
                    <td className="px-4 py-3">{entry.nutrient}</td>
                    <td className="px-4 py-3">
                      {entry.visibility &&
                        conditionBadge(entry.visibility as EnvironmentCondition)}
                    </td>
                    <td className="px-4 py-3">
                      {entry.current &&
                        conditionBadge(entry.current as EnvironmentCondition)}
                    </td>
                    <td className="px-4 py-3">
                      {entry.surge &&
                        conditionBadge(entry.surge as EnvironmentCondition)}
                    </td>
                    <td className="px-4 py-3">
                      {entry.wave &&
                        conditionBadge(entry.wave as EnvironmentCondition)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleRemove(entry.id)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 하단 CTA */}
        {environmentPayload.length > 0 && !showAddForm && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true);
              setForm({ ...EMPTY_FORM });
            }}
            className="w-full px-4 py-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            기록 추가
          </button>
        )}
      </div>
    </section>
  );
}
