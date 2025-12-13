// React Query hooks for report exports
import { useMutation } from "@tanstack/react-query";
import { downloadDraftReportPdfByIds } from "@/api/reports";

type ExportPayload = {
  ids: Array<string | number>;
  prompt?: string;
  reportType?: string;
  filename?: string;
};

export function useDraftReportPdfExportMutation() {
  return useMutation({
    mutationFn: ({ ids, prompt, reportType, filename }: ExportPayload) =>
      downloadDraftReportPdfByIds(ids, { prompt, reportType, filename }),
  });
}
