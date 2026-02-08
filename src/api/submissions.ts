// src/api/submissions.ts
import axiosInstance from "@/utils/axiosInstance";
import type { FilterState } from "@/components/filter-bar/types";
import { debugAxiosError } from "./_debugAxios";
import { isAxiosError } from "axios";

/** 서버 스펙: PENDING, APPROVED, REJECTED, DELETED */
export type ReviewStatus = "pending" | "approved" | "rejected" | "deleted";

export type Submission = {
  id: string;
  site: string;
  datetime: string; // submittedAt
  task: string; // activityType
  author: string; // authorName
  fileCount: number; // attachmentCount
  status: ReviewStatus;
};

// FilterBar 그대로 사용
export type ListFilters = FilterState;

type Reason = { templateCode?: string; message: string };

const compact = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== "",
    ),
  );

// 스웨거 스펙에 맞추어 필터 정규화
function normalizeFilters(filters: ListFilters) {
  const {
    status, // "all" | "pending" | ...
    q, // 검색어
    dateFrom, // 날짜 문자열/Date 가능성
    dateTo,
    activityType, // 선택 시 넘길 값
    sortBy,
    sortDir,
  } = (filters ?? {}) as Record<string, unknown>;

  const params: Record<string, unknown> = {};

  // keyword
  if (typeof q === "string" && q.trim()) params.keyword = q.trim();

  // status: "all"이면 omit, 아니면 대문자로
  if (typeof status === "string" && status && status !== "all") {
    params.status = status.toUpperCase(); // PENDING, APPROVED, ...
  }

  // activityType: 그대로 대문자 enum 사용 (선택된 경우에만)
  if (typeof activityType === "string" && activityType) {
    params.activityType = activityType; // URCHIN_REMOVAL 등
  }

  // 날짜는 ISO(YYYY-MM-DD 또는 ISO8601)로 잘라서
  if (dateFrom) params.startDate = String(dateFrom).slice(0, 10);
  if (dateTo) params.endDate = String(dateTo).slice(0, 10);

  // 정렬 (기본값은 서버가 채움)
  if (typeof sortBy === "string" && sortBy) params.sortBy = sortBy;
  if (typeof sortDir === "string" && sortDir) params.sortDir = sortDir;

  return params;
}

/** 서버 → 프론트 모델 매핑 (목록) */
function mapServerToClient(data: unknown): {
  items: Submission[];
  total: number;
} {
  const root = (data ?? {}) as Record<string, unknown>;
  const paged = (root.data ?? {}) as Record<string, unknown>;
  const content = (paged.content ?? []) as unknown[];

  const items: Submission[] = content.map((row) => {
    const r = (row ?? {}) as Record<string, unknown>;
    const statusRaw = String(r.status ?? "").toLowerCase() as ReviewStatus | "";
    const status: ReviewStatus =
      statusRaw === "pending" ||
      statusRaw === "approved" ||
      statusRaw === "rejected" ||
      statusRaw === "deleted"
        ? statusRaw
        : "pending";

    return {
      id: String(r.submissionId ?? ""),
      site: String(r.siteName ?? ""),
      datetime: String(r.submittedAt ?? ""),
      task: String(r.activityType ?? ""),
      author: String(r.authorName ?? ""),
      fileCount: Number(r.attachmentCount ?? 0),
      status,
    };
  });

  const total =
    typeof (paged.totalElements as number | undefined) === "number"
      ? (paged.totalElements as number)
      : items.length;

  return { items, total };
}

/** 목록 조회 */
export async function fetchSubmissions(params: {
  page: number; // 1-based from UI
  pageSize: number;
  filters: ListFilters;
}) {
  const { page, pageSize, filters } = params;

  // 0-based로 변환 (스웨거: page 기본값 0, size 기본 20)
  const pageZero = Math.max(0, page - 1);
  const baseFilters = normalizeFilters(filters);

  // 실제 송신 파라미터(콘솔 확인용)
  const queryParams = compact({
    page: pageZero,
    size: pageSize,
    ...baseFilters,
  });

  try {
    const { data } = await axiosInstance.get("/api/admin/submissions", {
      params: queryParams,
    });

    const mapped = mapServerToClient(data);
    return mapped;
  } catch (err) {
    // 500/C001일 때 status 없이 1회 재시도
    if (isAxiosError(err)) {
      const codeVal = (() => {
        const raw = (err.response?.data ?? {}) as Record<string, unknown>;
        const code = raw.code;
        return typeof code === "string" ? code : undefined;
      })();

      if (
        err.response?.status === 500 &&
        codeVal === "C001" &&
        "status" in queryParams
      ) {
        const retryParams = { ...queryParams };
        delete (retryParams as Record<string, unknown>).status;

        try {
          const { data } = await axiosInstance.get("/api/admin/submissions", {
            params: retryParams,
          });
          return mapServerToClient(data);
        } catch (e2) {
          return debugAxiosError(e2, "fetchSubmissions(retry)", {
            retryParams,
          });
        }
      }
    }
    return debugAxiosError(err, "fetchSubmissions()", { queryParams });
  }
}

/** 단건 승인/반려/삭제/벌크 APIs */
export async function approveSubmission(id: string) {
  try {
    const { data } = await axiosInstance.post(
      `/api/admin/submissions/${id}/approve`,
    );
    return data;
  } catch (err) {
    return debugAxiosError(err, "approveSubmission()", { id });
  }
}

export async function rejectSubmission(id: string, reason: Reason) {
  try {
    const { data } = await axiosInstance.post(
      `/api/admin/submissions/${id}/reject`,
      { reason },
    );
    return data;
  } catch (err) {
    return debugAxiosError(err, "rejectSubmission()", { id, reason });
  }
}

export async function bulkApprove(ids: string[]) {
  try {
    const { data } = await axiosInstance.post(
      `/api/admin/submissions/bulk/approve`,
      { ids },
    );
    return data;
  } catch (err) {
    return debugAxiosError(err, "bulkApprove()", { ids });
  }
}

export async function bulkReject(ids: string[], reason: Reason) {
  try {
    const { data } = await axiosInstance.post(
      `/api/admin/submissions/bulk/reject`,
      { ids, reason },
    );
    return data;
  } catch (err) {
    return debugAxiosError(err, "bulkReject()", { ids, reason });
  }
}

export async function deleteSubmission(id: string) {
  try {
    const { data } = await axiosInstance.delete(`/api/admin/submissions/${id}`);
    return data;
  } catch (err) {
    return debugAxiosError(err, "deleteSubmission()", { id });
  }
}

export async function bulkDelete(ids: string[]) {
  try {
    const { data } = await axiosInstance.delete(`/api/admin/submissions/bulk`, {
      data: { ids },
    });
    return data;
  } catch (err) {
    return debugAxiosError(err, "bulkDelete()", { ids });
  }
}

import type { ActivityType, EnvStatus, HealthGrade } from "@/types/activity";

export type SubmissionDetailServer = {
  submissionId: number;
  siteName: string;
  activityType: ActivityType;
  recordDate?: string;
  divingRound?: number;
  workDescription?: string;
  submittedAt: number[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELETED";
  authorName: string;
  authorEmail: string;
  attachmentCount: number;
  feedbackText?: string;

  // 공통 환경 정보
  basicEnv?: {
    recordDate?: string;
    avgDepthM?: number;
    maxDepthM?: number;
    waterTempC?: number;
    visibilityStatus?: EnvStatus;
    waveStatus?: EnvStatus;
    surgeStatus?: EnvStatus;
    currentStatus?: EnvStatus;
  };

  // 참여자 정보
  participants?: {
    participantNames?: string;
  };

  // 작업유형별 상세 정보
  transplantActivity?: {
    speciesType?: string;
    locationType?: string;
    methodType?: string;
    scale?: string;
    healthStatus?: HealthGrade;
  };

  grazerRemovalActivity?: {
    targetSpecies?: string[];
    densityBeforeWork?: string;
    workScope?: string;
    note?: string;
    collectionAmount?: string;
  };

  substrateImprovementActivity?: {
    targetType?: string;
    workScope?: string;
    substrateState?: string;
  };

  monitoringActivity?: {
    entryCoordinate?: string;
    exitCoordinate?: string;
    direction?: string;
    terrain?: string;
    barrenExtent?: string;
    grazerDistribution?: string;
    rockFeatures?: string[];
    suitability?: string;
    seaweedIdNumber?: string;
    seaweedHealthStatus?: string;
    leafLength?: string;
    maxLeafWidth?: string;
  };

  marineCleanupActivity?: {
    wasteTypes?: string[];
    method?: string;
    collectionAmount?: string;
    uncollectedScale?: string;
  };

  attachments?: Array<{
    attachmentId: number;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
    uploadedAt: string;
  }>;
  rejectReason?: string;
  auditLogs?: Array<{
    logId: number;
    action: string;
    performedBy: string;
    comment?: string;
    createdAt: string;
  }>;
  createdAt: string;
  modifiedAt: string;
};

type SubmissionDetailResponse = {
  success: boolean;
  data: SubmissionDetailServer;
  errors?: Record<string, unknown>;
  code?: string;
  message?: unknown;
};

export async function getSubmissionDetails(id: number) {
  try {
    const { data } = await axiosInstance.get<SubmissionDetailResponse>(
      `/api/admin/submissions/${id}`,
    );
    return data;
  } catch (err) {
    return debugAxiosError(err, "getSubmissionDetails()", { id });
  }
}
