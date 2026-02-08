"use client";

import type { SubmissionDetailServer } from "@/api/submissions";
import DetailField from "./detail-field";
import {
  toLabel,
  SPECIES_TYPE_LABEL,
  LOCATION_TYPE_LABEL,
  METHOD_TYPE_LABEL,
} from "@/types/enum-labels";

type Props = { detail: SubmissionDetailServer };

export default function TransplantSection({ detail }: Props) {
  const d = detail.transplantActivity;
  if (!d) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        이식 상세
      </h2>
      <div className="grid md:grid-cols-2 gap-x-8">
        <DetailField
          label="이식 대상 종류"
          value={toLabel(SPECIES_TYPE_LABEL, d.speciesType)}
        />
        <DetailField
          label="이식 장소"
          value={toLabel(LOCATION_TYPE_LABEL, d.locationType)}
        />
        <DetailField
          label="이식 방식"
          value={toLabel(METHOD_TYPE_LABEL, d.methodType)}
        />
        <DetailField label="이식 규모" value={d.scale} />
        <DetailField label="건강 상태 등급" value={d.healthStatus} />
      </div>
    </section>
  );
}
