import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import type { SubmissionDetailServer } from "@/api/submissions";

type DetailMeta = {
  siteName: string;
  authorName: string;
  status: SubmissionDetailServer["status"];
  activityType: SubmissionDetailServer["activityType"];
  taskDescription: string;
};

type SubmissionDetailResponse = {
  success: boolean;
  data: SubmissionDetailServer;
};

const DETAIL_META_BY_ID: Record<string, DetailMeta> = {
  "001": {
    siteName: "포항 생태공원",
    authorName: "김하늘",
    status: "PENDING",
    activityType: "TRANSPLANT",
    taskDescription: "로프 연승 방식으로 감태 이식 작업을 진행했습니다.",
  },
  "002": {
    siteName: "울진 해안 모니터링 지점",
    authorName: "이도현",
    status: "APPROVED",
    activityType: "MONITORING",
    taskDescription: "해조류 활착 상태와 암반 특성을 모니터링했습니다.",
  },
  "003": {
    siteName: "포항 연안 보호구역",
    authorName: "박서연",
    status: "PENDING",
    activityType: "GRAZER_REMOVAL",
    taskDescription: "성게 밀도가 높은 구간의 조식동물 제거를 수행했습니다.",
  },
  "004": {
    siteName: "울진 바다 정화 구간",
    authorName: "오세훈",
    status: "REJECTED",
    activityType: "MARINE_CLEANUP",
    taskDescription: "폐어구와 플라스틱 폐기물 수거 작업을 진행했습니다.",
  },
  "005": {
    siteName: "포항 암반 이식 구역",
    authorName: "최민수",
    status: "APPROVED",
    activityType: "SUBSTRATE_IMPROVEMENT",
    taskDescription: "암반 표면 정비와 부착기질 개선 작업을 수행했습니다.",
  },
  "006": {
    siteName: "울진 바다숲 탐사 1지점",
    authorName: "정유진",
    status: "PENDING",
    activityType: "TRANSPLANT",
    taskDescription: "모듈 이식 방식으로 다시마 증식 구역을 확장했습니다.",
  },
  "007": {
    siteName: "포항 다이빙 활동 구간",
    authorName: "윤재성",
    status: "APPROVED",
    activityType: "MONITORING",
    taskDescription: "해조류 생육 상태와 갯녹음 범위를 점검했습니다.",
  },
  "008": {
    siteName: "울진 연안 보전 지점",
    authorName: "김혜진",
    status: "PENDING",
    activityType: "GRAZER_REMOVAL",
    taskDescription: "작업 구역 전반의 조식동물 분포를 줄이는 작업을 했습니다.",
  },
  "009": {
    siteName: "포항 수심복원 현장",
    authorName: "유지우",
    status: "REJECTED",
    activityType: "OTHER",
    taskDescription: "현장 특이사항 점검 및 기타 보완작업 기록입니다.",
  },
  "010": {
    siteName: "울진 서식지 복원지",
    authorName: "한지민",
    status: "APPROVED",
    activityType: "MARINE_CLEANUP",
    taskDescription: "연안 폐기물 집중 수거와 미수거 구역 분류를 수행했습니다.",
  },
};

const normalizeMockId = (rawId: string) => {
  const n = Number(rawId);
  if (!Number.isFinite(n) || n < 1) return null;
  return String(Math.trunc(n)).padStart(3, "0");
};

const buildSubmissionDetail = (id: string): SubmissionDetailServer => {
  const meta = DETAIL_META_BY_ID[id];
  if (!meta) {
    throw new Error("Submission mock not found");
  }

  const n = Number(id);
  const submittedDay = Math.min(28, n + 1);

  const base: SubmissionDetailServer = {
    submissionId: id,
    siteName: meta.siteName,
    activityType: meta.activityType,
    recordDate: `2026-03-${String(submittedDay).padStart(2, "0")}`,
    divingRound: n,
    workDescription: meta.taskDescription,
    submittedAt: [2026, 3, submittedDay, 9 + (n % 4), 10 + n],
    status: meta.status,
    authorName: meta.authorName,
    authorEmail: `${id}@ocean.local`,
    attachmentCount: 0,
    basicEnv: {
      recordDate: `2026-03-${String(submittedDay).padStart(2, "0")}`,
      avgDepthM: 6 + n,
      maxDepthM: 9 + n,
      waterTempC: 11 + n * 0.3,
      visibilityStatus: n % 2 === 0 ? "GOOD" : "NORMAL",
      waveStatus: n % 3 === 0 ? "BAD" : "NORMAL",
      surgeStatus: "NORMAL",
      currentStatus: n % 2 === 0 ? "GOOD" : "NORMAL",
    },
    participants: {
      participantNames: `${meta.authorName}, 지원 다이버 ${n}`,
    },
    attachments: [],
    rejectReason:
      meta.status === "REJECTED" ? "현장 정보 기입이 일부 누락되었습니다." : undefined,
    createdAt: `2026-03-${String(submittedDay).padStart(2, "0")}T08:00:00`,
    modifiedAt: `2026-03-${String(submittedDay).padStart(2, "0")}T12:00:00`,
  };

  if (meta.activityType === "TRANSPLANT") {
    base.transplantActivity = {
      speciesType: "KAMTAE",
      locationType: "ROCK",
      methodType: "ROPE_LINE",
      scale: `${100 + n * 10}m`,
      healthStatus: n % 2 === 0 ? "A" : "B",
    };
  }

  if (meta.activityType === "GRAZER_REMOVAL") {
    base.grazerRemovalActivity = {
      targetSpecies: ["URCHIN", "SNAIL"],
      densityBeforeWork: n % 2 === 0 ? "MID" : "HIGH",
      workScope: n % 2 === 0 ? "ZONE" : "WIDE",
      collectionAmount: `${30 + n}kg`,
      note: "외곽 암반 구간은 추가 작업이 필요합니다.",
    };
  }

  if (meta.activityType === "SUBSTRATE_IMPROVEMENT") {
    base.substrateImprovementActivity = {
      targetType: "ROCK",
      workScope: "중심 구간 200m²",
      substrateState: "표면 이물질 제거 완료",
    };
  }

  if (meta.activityType === "MONITORING") {
    base.monitoringActivity = {
      entryCoordinate: "36.0200, 129.3400",
      exitCoordinate: "36.0215, 129.3450",
      direction: "NE",
      terrain: "MIXED",
      barrenExtent: n % 2 === 0 ? "ONGOING" : "NONE",
      grazerDistribution: n % 2 === 0 ? "MID" : "LOW",
      rockFeatures: ["CRACKED", "SEAWEED_VEGETATION"],
      suitability: "SUITABLE",
      seaweedIdNumber: `SW-${id}`,
      seaweedHealthStatus: n % 2 === 0 ? "GOOD" : "WEAK",
      leafLength: `${18 + n}cm`,
      maxLeafWidth: `${4 + (n % 3)}cm`,
    };
  }

  if (meta.activityType === "MARINE_CLEANUP") {
    base.marineCleanupActivity = {
      wasteTypes: ["NET", "PLASTIC"],
      method: n % 2 === 0 ? "HAND" : "BAG",
      collectionAmount: `${20 + n}kg`,
      uncollectedScale: n % 2 === 0 ? "SMALL" : "MEDIUM",
    };
  }

  return base;
};

export function useSubmissionDetail(diveId: string) {
  return useQuery({
    queryKey: queryKeys.submissionDetail(diveId),
    queryFn: async (): Promise<SubmissionDetailResponse> => {
      const normalized = normalizeMockId(diveId);
      if (!normalized) {
        throw new Error("Invalid submission id");
      }
      return {
        success: true,
        data: buildSubmissionDetail(normalized),
      };
    },
    staleTime: 30_000,
    retry: false,
    enabled: !!diveId,
  });
}
