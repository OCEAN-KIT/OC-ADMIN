"use client";

import type { SubmissionDetailServer } from "@/api/submissions";
import DetailField from "./detail-field";
import { toLabel, SUBSTRATE_TARGET_LABEL } from "@/types/enum-labels";

type Props = { detail: SubmissionDetailServer };

export default function SubstrateSection({ detail }: Props) {
  const d = detail.substrateImprovementActivity;
  if (!d) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        부착기질 개선 상세
      </h2>
      <div className="grid md:grid-cols-2 gap-x-8">
        <DetailField
          label="작업 대상"
          value={toLabel(SUBSTRATE_TARGET_LABEL, d.targetType)}
        />
        <DetailField label="작업 범위" value={d.workScope} />
        <DetailField label="작업 후 기질 상태" value={d.substrateState} />
      </div>
    </section>
  );
}
