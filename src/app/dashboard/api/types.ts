import type {
  ApiResponse,
  RestorationRegion,
  HabitatType,
  ProjectLevel,
  AreaAttachmentStatus,
} from "@/app/dashboard/create/api/types";

// ── 대시보드 구역 목록 응답 ──

export type AreaItem = {
  id: number;
  name: string;
  restorationRegion: RestorationRegion;
  startDate: string;
  endDate: string;
  habitat: HabitatType;
  depth: number;
  areaSize: number;
  level: ProjectLevel;
  attachmentStatus: AreaAttachmentStatus;
  lat: number;
  lon: number;
};

export type PagedAreaData = {
  content: AreaItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type AreasResponse = ApiResponse<PagedAreaData>;
