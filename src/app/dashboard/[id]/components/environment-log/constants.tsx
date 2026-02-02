import type {
  EnvironmentLogPayload,
  EnvironmentCondition,
} from "../../../create/api/types";

// ── 상태 옵션 ──

export const conditionOptions: {
  value: EnvironmentCondition;
  label: string;
}[] = [
  { value: "GOOD", label: "양호" },
  { value: "NORMAL", label: "보통" },
  { value: "POOR", label: "미흡" },
];

export const conditionBadge = (value: EnvironmentCondition) => {
  const opt = conditionOptions.find((o) => o.value === value);
  if (!opt) return null;
  const cls =
    value === "GOOD"
      ? "bg-emerald-100 text-emerald-700"
      : value === "NORMAL"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-rose-100 text-rose-700";
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${cls}`}>{opt.label}</span>
  );
};

// ── UI 전용 타입 ──

export type EnvironmentLogEntry = EnvironmentLogPayload & { id: number };

// ── 폼 초기값 ──

export const EMPTY_FORM: EnvironmentLogPayload = {
  recordDate: "",
  temperature: 0,
  dissolvedOxygen: 0,
  nutrient: 0,
  visibility: "",
  current: "",
  surge: "",
  wave: "",
};
