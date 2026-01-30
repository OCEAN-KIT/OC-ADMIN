"use client";

import { useState } from "react";
import { Leaf, Plus, ChevronUp } from "lucide-react";
import type { TransplantLogPayload } from "../../api/types";
import {
  dummySpecies,
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
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeSpeciesForLogAdd, setActiveSpeciesForLogAdd] = useState<
    string | null
  >(null);
  const [form, setForm] = useState<TransplantLogPayload>({ ...EMPTY_FORM });

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
    if (transplantPayload.some((s) => s.speciesId === sp.id)) return;

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

    setExpanded((prev) =>
      prev.includes(sp.name) ? prev : [...prev, sp.name],
    );
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

  // ── 카드 "기록 추가" 클릭 ──

  const handleCardAddLogClick = (speciesName: string, speciesId: number) => {
    setActiveSpeciesForLogAdd(speciesName);
    setShowAddForm(false);
    setForm({ ...EMPTY_FORM, speciesId });
    if (!expanded.includes(speciesName)) {
      setExpanded((prev) => [...prev, speciesName]);
    }
  };

  // ── 아코디언 토글 ──

  const toggleExpand = (speciesName: string) => {
    setExpanded((prev) =>
      prev.includes(speciesName)
        ? prev.filter((x) => x !== speciesName)
        : [...prev, speciesName],
    );
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

      <TransplantLogList
        sections={transplantPayload}
        showAddForm={showAddForm}
        onShowAddForm={() => {
          setShowAddForm(true);
          setActiveSpeciesForLogAdd(null);
          setForm({ ...EMPTY_FORM });
        }}
        form={form}
        onFieldChange={setField}
        onSaveNewSpecies={handleAddSpeciesWithFirstLog}
        onCancelAddForm={() => setShowAddForm(false)}
        expanded={expanded}
        onToggleExpand={toggleExpand}
        activeSpeciesForLogAdd={activeSpeciesForLogAdd}
        onAddLogClick={handleCardAddLogClick}
        onRemoveSpecies={removeSpecies}
        onSaveLogToSpecies={handleAddLogToSpecies}
        onCancelLogAdd={() => setActiveSpeciesForLogAdd(null)}
      />
    </section>
  );
}
