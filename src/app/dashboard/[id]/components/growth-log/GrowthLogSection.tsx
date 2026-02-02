"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { TrendingUp, Plus, ChevronUp } from "lucide-react";
import type { GrowthLogPayload } from "../../../create/api/types";
import { usePostGrowthLog } from "../../hooks/useGrowthLogMutations";
import { useSpecies } from "@/hooks/useSpecies";
import {
  EMPTY_FORM,
  type GrowthLogEntry,
  type GrowthSpeciesSection,
} from "./constants";
import GrowthLogList from "./GrowthLogList";

export type { GrowthSpeciesSection } from "./constants";

type Props = {
  growthPayload: GrowthSpeciesSection[];
  onGrowthChange: (_sections: GrowthSpeciesSection[]) => void;
};

export default function GrowthLogSection({
  growthPayload,
  onGrowthChange,
}: Props) {
  const { id } = useParams();
  const areaId = Number(id);
  const { mutate: postLog } = usePostGrowthLog(areaId);
  const { data: speciesList = [] } = useSpecies();
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<GrowthLogPayload>({ ...EMPTY_FORM });

  const setField = <K extends keyof GrowthLogPayload>(
    key: K,
    value: GrowthLogPayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── 종 추가 (첫 기록까지 한번에) ──

  const handleAddSpeciesWithFirstLog = () => {
    const sp = speciesList.find((s) => s.id === form.speciesId);
    if (!sp || !form.recordDate) return;
    if (growthPayload.some((s) => s.speciesName === sp.name)) return;

    const entry: GrowthLogEntry = {
      ...form,
      id: Date.now(),
    };

    onGrowthChange([
      ...growthPayload,
      { speciesId: sp.id, speciesName: sp.name, logs: [entry] },
    ]);
    postLog(form);

    setShowAddForm(false);
    setForm({ ...EMPTY_FORM });
  };

  // ── 종 제거 ──

  const removeSpecies = (speciesName: string) => {
    onGrowthChange(growthPayload.filter((s) => s.speciesName !== speciesName));
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#2C67BC]" />
          성장 현황 (종별 · 기록 누적)
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
          종 추가
        </button>
      </div>

      <GrowthLogList
        sections={growthPayload}
        showAddForm={showAddForm}
        onShowAddForm={() => {
          setShowAddForm(true);
          setForm({ ...EMPTY_FORM });
        }}
        form={form}
        onFieldChange={setField}
        onSaveNewSpecies={handleAddSpeciesWithFirstLog}
        onCancelAddForm={() => setShowAddForm(false)}
        onRemoveSpecies={removeSpecies}
      />
    </section>
  );
}
