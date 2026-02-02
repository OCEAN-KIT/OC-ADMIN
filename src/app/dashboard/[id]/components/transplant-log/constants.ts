import type {
  TransplantLogPayload,
  TransplantMethod,
  SpeciesAttachmentStatus,
} from "../../../create/api/types";

// ── 이식 방식 옵션 ──

export const transplantMethods: {
  value: TransplantMethod;
  label: string;
  unit: string;
}[] = [
  { value: "SEEDLING_STRING", label: "종묘줄", unit: "줄" },
  { value: "ROPE", label: "로프", unit: "m" },
  { value: "ROCK_FIXATION", label: "암반 고정", unit: "지점" },
  { value: "TRANSPLANT_MODULE", label: "이식 모듈", unit: "기" },
  { value: "DIRECT_FIXATION", label: "직접 고정 지점", unit: "지점" },
];

// ── 착생 상태 옵션 ──

export const attachmentOptions: {
  value: SpeciesAttachmentStatus;
  label: string;
  color: string;
}[] = [
  {
    value: "GOOD",
    label: "양호",
    color: "border-emerald-500 bg-emerald-50 text-emerald-700",
  },
  {
    value: "NORMAL",
    label: "보통",
    color: "border-yellow-500 bg-yellow-50 text-yellow-700",
  },
  {
    value: "POOR",
    label: "미흡",
    color: "border-rose-500 bg-rose-50 text-rose-700",
  },
];

// ── UI 전용 타입 ──

export type TransplantLogEntry = TransplantLogPayload & {
  id: number;
  methodLabel: string;
  unit: string;
};

export type SpeciesSection = {
  speciesId: number;
  speciesName: string;
  logs: TransplantLogEntry[];
};

// ── 폼 초기값 ──

export const EMPTY_FORM: TransplantLogPayload = {
  recordDate: "",
  method: "",
  speciesId: 0,
  count: 0,
  areaSize: 0,
  attachmentStatus: "",
};
