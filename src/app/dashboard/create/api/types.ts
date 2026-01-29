// ── 기본정보 enum 타입 ──

export type RestorationRegion = "POHANG" | "ULJIN";

export type HabitatType = "ROCKY" | "MIXED" | "OTHER";

export type ProjectLevel =
  | "OBSERVATION"
  | "SETTLEMENT"
  | "GROWTH"
  | "MANAGEMENT";

export type AreaAttachmentStatus = "STABLE" | "DECREASED" | "UNSTABLE";

// ── 기본정보 페이로드 ──

export type BasicPayload = {
  name: string;
  restorationRegion: RestorationRegion | "";
  startDate: string;
  endDate?: string;
  habitat: HabitatType | "";
  depth: number;
  areaSize: number;
  level: ProjectLevel | "";
  attachmentStatus: AreaAttachmentStatus | "";
  lat: number;
  lon: number;
};

// ── 이식 로그 enum 타입 ──

export type TransplantMethod =
  | "SEEDLING_STRING"
  | "ROPE"
  | "ROCK_FIXATION"
  | "TRANSPLANT_MODULE"
  | "DIRECT_FIXATION";

export type SpeciesAttachmentStatus = "GOOD" | "NORMAL" | "POOR";

// ── 이식 로그 페이로드 ──

export type TransplantLogPayload = {
  recordDate: string;
  method: TransplantMethod | "";
  speciesId: number;
  count: number;
  areaSize: number;
  attachmentStatus: SpeciesAttachmentStatus | "";
};

// ── 성장 로그 enum 타입 ──

export type GrowthStatus = "GOOD" | "NORMAL" | "POOR";

// ── 성장 로그 페이로드 ──

export type GrowthLogPayload = {
  speciesId: number;
  isRepresentative: boolean;
  recordDate: string;
  attachmentRate: number;
  survivalRate: number;
  growthLength: number;
  status: GrowthStatus | "";
};

// ── 초기값 ──

export const BASIC_PAYLOAD_INIT: BasicPayload = {
  name: "",
  restorationRegion: "",
  startDate: "",
  habitat: "",
  depth: 0,
  areaSize: 0,
  level: "",
  attachmentStatus: "",
  lat: 0,
  lon: 0,
};
