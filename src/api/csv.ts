// src/api/exports.ts
import axiosInstance from "@/utils/axiosInstance";

type ID = number | string;

function extractFilename(header?: string | null) {
  if (!header) return undefined;
  const m =
    /filename\*?=(?:UTF-8''|")?([^";\n]+)/i.exec(header) ??
    /filename=(.+)$/.exec(header);
  return m ? decodeURIComponent(m[1].replace(/"/g, "")) : undefined;
}

function saveBlobAsFile(blob: Blob, suggestedName = "export.csv") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * 선택한 submission ID들로 CSV 다운로드
 * POST /api/admin/exports/download/by-ids
 */
export async function csvExportByIds(ids: ID[], filename?: string) {
  if (!ids?.length) throw new Error("다운로드할 ID가 없습니다.");

  const body = { format: "CSV" as const, ids };

  const res = await axiosInstance.post(
    "/api/admin/exports/download/by-ids",
    body,
    {
      responseType: "blob",
      headers: { Accept: "text/csv,application/octet-stream" },
    }
  );

  const blob = new Blob([res.data], { type: "text/csv;charset=utf-8" });

  // 서버가 주는 파일명 우선
  const cd = (res.headers as Record<string, string | undefined>)[
    "content-disposition"
  ];
  const serverName = extractFilename(cd);

  // 기본 파일명 규칙
  const fallback =
    ids.length === 1
      ? `submission_${ids[0]}.csv`
      : `submissions_${ids.length}_items.csv`;

  saveBlobAsFile(blob, filename || serverName || fallback);
}
