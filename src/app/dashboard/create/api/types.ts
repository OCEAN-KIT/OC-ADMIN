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
