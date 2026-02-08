"use client";

import type { SubmissionDetailServer } from "@/api/submissions";
import DetailField from "./detail-field";
import {
  toLabel,
  toLabels,
  TARGET_SPECIES_LABEL,
  DENSITY_LABEL,
  GRAZING_SCOPE_LABEL,
} from "@/types/enum-labels";

type Props = { detail: SubmissionDetailServer };

export default function GrazerRemovalSection({ detail }: Props) {
  const d = detail.grazerRemovalActivity;
  if (!d) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        조식동물 작업 상세
      </h2>
      <div className="grid md:grid-cols-2 gap-x-8">
        <DetailField
          label="대상 생물"
          value={toLabels(TARGET_SPECIES_LABEL, d.targetSpecies)}
        />
        <DetailField
          label="작업 전 체감 밀도"
          value={toLabel(DENSITY_LABEL, d.densityBeforeWork)}
        />
        <DetailField
          label="작업 범위"
          value={toLabel(GRAZING_SCOPE_LABEL, d.workScope)}
        />
        <DetailField label="수거량" value={d.collectionAmount} />
        {d.note && <DetailField label="보충 설명" value={d.note} />}
      </div>
    </section>
  );
}
