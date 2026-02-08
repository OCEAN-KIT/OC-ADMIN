"use client";

import type { SubmissionDetailServer } from "@/api/submissions";
import TransplantSection from "./transplant-section";
import GrazerRemovalSection from "./grazer-removal-section";
import SubstrateSection from "./substrate-section";
import MonitoringSection from "./monitoring-section";
import CleanupSection from "./cleanup-section";

type Props = { detail: SubmissionDetailServer };

export default function ActivitySection({ detail }: Props) {
  switch (detail.activityType) {
    case "TRANSPLANT":
      return <TransplantSection detail={detail} />;
    case "GRAZER_REMOVAL":
      return <GrazerRemovalSection detail={detail} />;
    case "SUBSTRATE_IMPROVEMENT":
      return <SubstrateSection detail={detail} />;
    case "MONITORING":
      return <MonitoringSection detail={detail} />;
    case "MARINE_CLEANUP":
      return <CleanupSection detail={detail} />;
    case "OTHER":
    default:
      return null;
  }
}
