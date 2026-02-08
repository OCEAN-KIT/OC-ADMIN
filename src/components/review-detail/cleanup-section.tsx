"use client";

import type { SubmissionDetailServer } from "@/api/submissions";
import DetailField from "./detail-field";
import {
  toLabel,
  toLabels,
  WASTE_TYPE_LABEL,
  CLEANUP_METHOD_LABEL,
  UNCOLLECTED_SCALE_LABEL,
} from "@/types/enum-labels";

type Props = { detail: SubmissionDetailServer };

export default function CleanupSection({ detail }: Props) {
  const d = detail.marineCleanupActivity;
  if (!d) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        해양정화 상세
      </h2>
      <div className="grid md:grid-cols-2 gap-x-8">
        <DetailField
          label="폐기물 유형"
          value={toLabels(WASTE_TYPE_LABEL, d.wasteTypes)}
        />
        <DetailField
          label="인양 방식"
          value={toLabel(CLEANUP_METHOD_LABEL, d.method)}
        />
        <DetailField label="수거량" value={d.collectionAmount} />
        <DetailField
          label="미수거 폐기물 규모"
          value={toLabel(UNCOLLECTED_SCALE_LABEL, d.uncollectedScale)}
        />
      </div>
    </section>
  );
}
