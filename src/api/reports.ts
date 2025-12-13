import axiosInstance from "@/utils/axiosInstance";
import { debugAxiosError } from "./_debugAxios";
import { extractFilename, saveBlobAsFile } from "@/utils/download";

type ID = number | string;

type DraftPdfOptions = {
  reportType?: "INTERNAL_DRAFT" | string;
  prompt?: string;
  filename?: string;
};

/**
 * POST /api/admin/reports/drafts/by-ids/pdf
 * body: { ids, reportType: "INTERNAL_DRAFT", prompt }
 * 성공 시 응답 바디는 blob이므로 바로 다운로드 처리
 */
export async function downloadDraftReportPdfByIds(
  ids: ID[],
  options?: DraftPdfOptions
) {
  if (!ids?.length) throw new Error("PDF로 내보낼 ID가 없습니다.");

  const normalizedIds = ids.map((id) => {
    if (typeof id === "string" && /^\d+$/.test(id)) return Number(id);
    return id;
  });

  const body = {
    ids: normalizedIds,
    reportType: options?.reportType ?? "INTERNAL_DRAFT",
    prompt: options?.prompt ?? "",
  };

  try {
    const res = await axiosInstance.post(
      "/api/admin/reports/drafts/by-ids/pdf",
      body,
      {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
      }
    );

    const blob = new Blob([res.data], { type: "application/pdf" });
    const cd = (res.headers as Record<string, string | undefined>)[
      "content-disposition"
    ];
    const serverName = extractFilename(cd);
    const fallback =
      options?.filename ??
      (ids.length === 1
        ? `draft-report_${ids[0]}.pdf`
        : `draft-reports_${ids.length}_items.pdf`);

    saveBlobAsFile(blob, serverName || fallback);
    return { success: true };
  } catch (err) {
    return debugAxiosError(err, "downloadDraftReportPdfByIds()", { ids, body });
  }
}
