"use client";

import { useState } from "react";
import { Cloud, Plus, ChevronUp } from "lucide-react";
import { type EnvironmentLogEntry } from "./constants";
import EnvironmentLogList from "./EnvironmentLogList";

export type { EnvironmentLogEntry } from "./constants";

type Props = {
  environmentPayload: EnvironmentLogEntry[];
  onEnvironmentChange: (_entries: EnvironmentLogEntry[]) => void;
};

export default function EnvironmentLogSection({
  environmentPayload,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Cloud className="h-5 w-5 text-[#2C67BC]" />
          환경 로그 (날짜별 기록 누적)
        </h2>

        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
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

      <EnvironmentLogList
        entries={environmentPayload}
        showAddForm={showAddForm}
        onShowAddForm={() => setShowAddForm(true)}
        onCloseAddForm={() => setShowAddForm(false)}
      />
    </section>
  );
}
