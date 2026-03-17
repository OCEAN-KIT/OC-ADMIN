// src/queries/submissions.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveSubmission,
  rejectSubmission,
  bulkApprove,
  bulkReject,
  deleteSubmission,
  bulkDelete,
  type ListFilters,
} from "@/api/submissions";
import { queryKeys } from "@/hooks/queryKeys";
import type { Submission } from "@/api/submissions";

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "001",
    site: "포항 생태공원",
    datetime: "2026,03,01,09,20",
    task: "TRANSPLANT",
    author: "김하늘",
    fileCount: 4,
    status: "pending",
  },
  {
    id: "002",
    site: "울진 해안 모니터링 지점",
    datetime: "2026,03,01,10,40",
    task: "MONITORING",
    author: "이도현",
    fileCount: 2,
    status: "approved",
  },
  {
    id: "003",
    site: "포항 연안 보호구역",
    datetime: "2026,03,02,08,15",
    task: "GRAZER_REMOVAL",
    author: "박서연",
    fileCount: 6,
    status: "pending",
  },
  {
    id: "004",
    site: "울진 바다 정화 구간",
    datetime: "2026,03,02,13,50",
    task: "MARINE_CLEANUP",
    author: "오세훈",
    fileCount: 3,
    status: "rejected",
  },
  {
    id: "005",
    site: "포항 암반 이식 구역",
    datetime: "2026,03,03,11,10",
    task: "SUBSTRATE_IMPROVEMENT",
    author: "최민수",
    fileCount: 5,
    status: "approved",
  },
  {
    id: "006",
    site: "울진 바다숲 탐사 1지점",
    datetime: "2026,03,03,14,40",
    task: "TRANSPLANT",
    author: "정유진",
    fileCount: 7,
    status: "pending",
  },
  {
    id: "007",
    site: "포항 다이빙 활동 구간",
    datetime: "2026,03,04,09,05",
    task: "MONITORING",
    author: "윤재성",
    fileCount: 2,
    status: "approved",
  },
  {
    id: "008",
    site: "울진 연안 보전 지점",
    datetime: "2026,03,04,15,30",
    task: "GRAZER_REMOVAL",
    author: "김혜진",
    fileCount: 8,
    status: "pending",
  },
  {
    id: "009",
    site: "포항 수심복원 현장",
    datetime: "2026,03,05,07,55",
    task: "OTHER",
    author: "유지우",
    fileCount: 1,
    status: "rejected",
  },
  {
    id: "010",
    site: "울진 서식지 복원지",
    datetime: "2026,03,05,12,25",
    task: "MARINE_CLEANUP",
    author: "한지민",
    fileCount: 9,
    status: "approved",
  },
];

const mockFetchSubmissions = ({
  page,
  pageSize,
  filters,
}: {
  page: number;
  pageSize: number;
  filters: ListFilters;
}) => {
  const filtered = MOCK_SUBMISSIONS.filter((submission) => {
    const matchesStatus =
      filters.status === "all" || submission.status === filters.status;

    const q = filters.q?.trim().toLowerCase() ?? "";
    const matchesQuery =
      !q ||
      submission.site.toLowerCase().includes(q) ||
      submission.author.toLowerCase().includes(q) ||
      submission.task.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  const total = filtered.length;
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    items: filtered.slice(start, end),
    total,
  };
};

export const qk = {
  list: queryKeys.submissions.list,
};

export function useSubmissionsQuery(
  page: number,
  pageSize: number,
  filters: ListFilters
) {
  return useQuery({
    queryKey: queryKeys.submissions.list(page, pageSize, filters),
    queryFn: () =>
      Promise.resolve(mockFetchSubmissions({ page, pageSize, filters })),
    staleTime: 30_000,
  });
}

export function useApproveMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveSubmission(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useRejectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: string;
      reason: { templateCode?: string; message: string };
    }) => rejectSubmission(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useBulkApproveMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkApprove(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useBulkRejectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      ids: string[];
      reason: { templateCode?: string; message: string };
    }) => bulkReject(payload.ids, payload.reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useDeleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubmission(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export function useBulkDeleteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDelete(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}
