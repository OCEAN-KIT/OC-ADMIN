// ── Enum 타입 ──

export type RestorationRegion = "POHANG" | "ULJIN" | "";
export type ProjectLevel =
  | "OBSERVATION"
  | "SETTLEMENT"
  | "GROWTH"
  | "MANAGEMENT"
  | "";
export type HabitatType = "ROCKY" | "MIXED" | "OTHER" | "";
export type AttachmentStatus = "STABLE" | "DECREASED" | "UNSTABLE";
export type AreaSort =
  | "ID_DESC"
  | "ID_ASC"
  | "START_DATE_DESC"
  | "START_DATE_ASC"
  | "NAME_ASC"
  | "NAME_DESC";

// ── UI 전용 타입 ──

export type AreaItem = {
  id: number;
  name: string;
  restorationRegion: "POHANG" | "ULJIN";
  startDate: string;
  endDate: string | null;
  habitat: "ROCKY" | "MIXED" | "OTHER";
  depth: number;
  areaSize: number;
  level: "OBSERVATION" | "SETTLEMENT" | "GROWTH" | "MANAGEMENT";
  attachmentStatus: AttachmentStatus;
  lat: number;
  lon: number;
};

// ── 라벨 매핑 ──

export const regionLabels: Record<string, string> = {
  POHANG: "포항",
  ULJIN: "울진",
};

export const levelLabels: Record<string, string> = {
  OBSERVATION: "관측",
  SETTLEMENT: "정착",
  GROWTH: "성장",
  MANAGEMENT: "관리",
};

export const habitatLabels: Record<string, string> = {
  ROCKY: "암반",
  MIXED: "혼합",
  OTHER: "기타",
};

export const statusLabels: Record<AttachmentStatus, string> = {
  STABLE: "안정",
  DECREASED: "일부 감소",
  UNSTABLE: "불안정",
};

export const statusColors: Record<AttachmentStatus, string> = {
  STABLE: "bg-emerald-100 text-emerald-700",
  DECREASED: "bg-yellow-100 text-yellow-700",
  UNSTABLE: "bg-rose-100 text-rose-700",
};

export const sortLabels: Record<AreaSort, string> = {
  ID_DESC: "최신순",
  ID_ASC: "오래된순",
  START_DATE_DESC: "시작일 최신순",
  START_DATE_ASC: "시작일 오래된순",
  NAME_ASC: "이름 오름차순",
  NAME_DESC: "이름 내림차순",
};

// ── 더미 데이터 ──

export const dummyAreas: AreaItem[] = [
  {
    id: 1,
    name: "포항 해조류 복원지 A구역",
    restorationRegion: "POHANG",
    startDate: "2024-03-15",
    endDate: null,
    habitat: "ROCKY",
    depth: 8.5,
    areaSize: 1200,
    level: "GROWTH",
    attachmentStatus: "STABLE",
    lat: 36.019,
    lon: 129.343,
  },
  {
    id: 2,
    name: "울진 해중림 조성지 B구역",
    restorationRegion: "ULJIN",
    startDate: "2024-01-10",
    endDate: "2024-12-31",
    habitat: "MIXED",
    depth: 12.0,
    areaSize: 2500,
    level: "SETTLEMENT",
    attachmentStatus: "DECREASED",
    lat: 36.993,
    lon: 129.4,
  },
  {
    id: 3,
    name: "포항 신규 이식지 C구역",
    restorationRegion: "POHANG",
    startDate: "2024-06-01",
    endDate: null,
    habitat: "ROCKY",
    depth: 6.0,
    areaSize: 800,
    level: "OBSERVATION",
    attachmentStatus: "UNSTABLE",
    lat: 36.032,
    lon: 129.365,
  },
];
