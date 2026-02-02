import type { GrowthLogPayload, GrowthStatus } from "../../../create/api/types";

// ── 상태 옵션 ──

export const statusOptions: { value: GrowthStatus; label: string }[] = [
  { value: "GOOD", label: "양호" },
  { value: "NORMAL", label: "보통" },
  { value: "POOR", label: "미흡" },
];

// ── UI 전용 타입 ──

export type GrowthLogEntry = GrowthLogPayload & { id: number };

export type GrowthSpeciesSection = {
  speciesId: number;
  speciesName: string;
  logs: GrowthLogEntry[];
};

// ── 폼 초기값 ──

export const EMPTY_FORM: GrowthLogPayload = {
  speciesId: 0,
  isRepresentative: false,
  recordDate: "",
  attachmentRate: 0,
  survivalRate: 0,
  growthLength: 0,
  status: "",
};
