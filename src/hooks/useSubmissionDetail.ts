import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { getSubmissionDetails } from "@/api/submissions";

export function useSubmissionDetail(diveId: number) {
  return useQuery({
    queryKey: queryKeys.submissionDetail(diveId),
    queryFn: () => getSubmissionDetails(diveId),
    staleTime: 30_000,
    retry: false,
    enabled: Number.isFinite(diveId),
  });
}
