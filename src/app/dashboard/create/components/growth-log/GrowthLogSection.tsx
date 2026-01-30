"use client";

import { useState } from "react";
import { TrendingUp, Plus, ChevronUp } from "lucide-react";
import type { GrowthLogPayload } from "../../api/types";
import {
  dummySpecies,
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
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeSpeciesForLogAdd, setActiveSpeciesForLogAdd] = useState<
    string | null
  >(null);
  const [form, setForm] = useState<GrowthLogPayload>({ ...EMPTY_FORM });

  const setField = <K extends keyof GrowthLogPayload>(
    key: K,
    value: GrowthLogPayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ── 종 추가 (첫 기록까지 한번에) ──

  const handleAddSpeciesWithFirstLog = () => {
    const sp = dummySpecies.find((s) => s.id === form.speciesId);
    if (!sp || !form.recordDate) return;
    if (growthPayload.some((s) => s.speciesId === sp.id)) return;

    const entry: GrowthLogEntry = {
      ...form,
      id: Date.now(),
    };

    onGrowthChange([
      ...growthPayload,
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
    onGrowthChange(
      growthPayload.filter((s) => s.speciesName !== speciesName),
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

      <GrowthLogList
        sections={growthPayload}
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
