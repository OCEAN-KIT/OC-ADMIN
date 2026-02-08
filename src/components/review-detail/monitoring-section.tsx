"use client";

import type { SubmissionDetailServer } from "@/api/submissions";
import DetailField from "./detail-field";
import {
  toLabel,
  toLabels,
  TERRAIN_LABEL,
  BARREN_EXTENT_LABEL,
  GRAZER_DISTRIBUTION_LABEL,
  ROCK_FEATURES_LABEL,
  SUITABILITY_LABEL,
  SEAWEED_HEALTH_LABEL,
} from "@/types/enum-labels";

type Props = { detail: SubmissionDetailServer };

export default function MonitoringSection({ detail }: Props) {
  const d = detail.monitoringActivity;
  if (!d) return null;

  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        모니터링 상세
      </h2>

      {/* 적지조사 */}
      <h3 className="mt-3 mb-1 text-xs font-medium text-gray-500">적지조사</h3>
      <div className="grid md:grid-cols-2 gap-x-8">
        <DetailField label="입수 좌표" value={d.entryCoordinate} />
        <DetailField label="출수 좌표" value={d.exitCoordinate} />
        <DetailField label="진행 방위" value={d.direction} />
        <DetailField
          label="지형 구성"
          value={toLabel(TERRAIN_LABEL, d.terrain)}
        />
        <DetailField
          label="갯녹음 정도"
          value={toLabel(BARREN_EXTENT_LABEL, d.barrenExtent)}
        />
        <DetailField
          label="조식동물 분포"
          value={toLabel(GRAZER_DISTRIBUTION_LABEL, d.grazerDistribution)}
        />
        <DetailField
          label="암반 특성"
          value={toLabels(ROCK_FEATURES_LABEL, d.rockFeatures)}
        />
        <DetailField
          label="해조 이식 적합성"
          value={toLabel(SUITABILITY_LABEL, d.suitability)}
        />
      </div>

      {/* 해조류 상태 */}
      <h3 className="mt-4 mb-1 text-xs font-medium text-gray-500">
        해조류 상태
      </h3>
      <div className="grid md:grid-cols-2 gap-x-8">
        <DetailField label="측정 식별번호" value={d.seaweedIdNumber} />
        <DetailField
          label="생육 상태"
          value={toLabel(SEAWEED_HEALTH_LABEL, d.seaweedHealthStatus)}
        />
        <DetailField label="엽장" value={d.leafLength} />
        <DetailField label="최대엽폭" value={d.maxLeafWidth} />
      </div>
    </section>
  );
}
