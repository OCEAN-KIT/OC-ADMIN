"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Leaf, Plus, ChevronUp } from "lucide-react";
import type { TransplantLogPayload } from "../../../create/api/types";
import { usePostTransplantLog } from "../../hooks/useTransplantLogMutations";
import { useSpecies } from "@/hooks/useSpecies";
import {
  transplantMethods,
  EMPTY_FORM,
  type TransplantLogEntry,
  type SpeciesSection,
} from "./constants";
import TransplantLogList from "./TransplantLogList";

export type { SpeciesSection } from "./constants";

type Props = {
  transplantPayload: SpeciesSection[];
  onTransplantChange: (sections: SpeciesSection[]) => void;
};

export default function TransplantLogSection({
  transplantPayload,
  onTransplantChange,
}: Props) {
  const { id } = useParams();
  const areaId = Number(id);
  const { mutate: postLog } = usePostTransplantLog(areaId);
  const { data: speciesList = [] } = useSpecies();
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<TransplantLogPayload>({ ...EMPTY_FORM });

  const setField = <K extends keyof TransplantLogPayload>(
    key: K,
    value: TransplantLogPayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── 종 추가 (첫 기록까지 한번에) ──

  const handleAddSpeciesWithFirstLog = () => {
    const sp = speciesList.find((s) => s.id === form.speciesId);
    const m = transplantMethods.find((x) => x.value === form.method);
    if (!sp || !m || !form.recordDate) return;
    if (transplantPayload.some((s) => s.speciesName === sp.name)) return;

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
    postLog(form);

    setShowAddForm(false);
    setForm({ ...EMPTY_FORM });
  };

  // ── 종 제거 ──

  const removeSpecies = (speciesName: string) => {
    onTransplantChange(
      transplantPayload.filter((s) => s.speciesName !== speciesName),
    );
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-[#2C67BC]" />
          이식 현황 (종별 · 기록 누적)
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

      <TransplantLogList
        sections={transplantPayload}
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
