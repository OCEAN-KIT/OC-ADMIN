import type { ApiResponse } from "../../create/api/types";

// ── 페이지드 응답 공통 ──

export type PagedData<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

// ── 상세조회 ──

export type AreaOverview = {
  name: string;
  areaId: number;
  restorationRegion: string;
  startDate: string;
  endDate: string;
  currentStatus: { name: string; description: string };
  areaSize: number;
  avgDepth: number;
  habitatType: string;
};

export type AreaDetailData = {
  id: number;
  overview: AreaOverview;
};

export type AreaDetailResponse = ApiResponse<AreaDetailData>;

// ── 이식로그 ──

export type TransplantLogItem = {
  id: number;
  recordDate: string;
  method: string;
  methodName: string;
  methodDesc: string;
  unit: string;
  speciesId: number;
  speciesName: string;
  count: number;
  areaSize: number;
  attachmentStatus: string;
  attachmentStatusName: string;
};

export type TransplantLogsResponse = ApiResponse<PagedData<TransplantLogItem>>;

// ── 성장로그 ──

export type GrowthLogItem = {
  id: number;
  recordDate: string;
  speciesId: number;
  speciesName: string;
  isRepresentative: boolean;
  attachmentRate: number;
  survivalRate: number;
  growthLength: number;
  status: string;
  statusName: string;
};

export type GrowthLogsResponse = ApiResponse<PagedData<GrowthLogItem>>;

// ── 환경로그 ──

export type EnvironmentLogItem = {
  id: number;
  recordDate: string;
  temperature: number;
  dissolvedOxygen: number;
  nutrient: number;
  visibility: string;
  visibilityName: string;
  current: string;
  currentName: string;
  surge: string;
  surgeName: string;
  wave: string;
  waveName: string;
};

export type EnvironmentLogsResponse = ApiResponse<
  PagedData<EnvironmentLogItem>
>;

// ── 미디어로그 ──

export type MediaLogItem = {
  id: number;
  recordDate: string;
  mediaUrl: string;
  caption: string;
  category: string;
  categoryName: string;
};

export type MediaLogsResponse = ApiResponse<PagedData<MediaLogItem>>;
