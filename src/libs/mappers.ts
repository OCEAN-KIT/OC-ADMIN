// ── 한국어 → enum 역매핑 ──

const regionMap: Record<string, string> = {
  포항: "POHANG",
  울진: "ULJIN",
};

const habitatMap: Record<string, string> = {
  암반: "ROCKY",
  혼합: "MIXED",
  기타: "OTHER",
};

const levelMap: Record<string, string> = {
  관측: "OBSERVATION",
  정착: "SETTLEMENT",
  성장: "GROWTH",
  관리: "MANAGEMENT",
};

const attachmentStatusMap: Record<string, string> = {
  안정: "STABLE",
  "일부 감소": "DECREASED",
  불안정: "UNSTABLE",
};

export function toRegionCode(v: string): string {
  return regionMap[v] ?? v;
}

export function toHabitatCode(v: string): string {
  return habitatMap[v] ?? v;
}

export function toLevelCode(v: string): string {
  return levelMap[v] ?? v;
}

export function toAttachmentStatusCode(v: string): string {
  return attachmentStatusMap[v] ?? v;
}

// ── 날짜 배열 → "YYYY-MM-DD" 문자열 ──

export function toDateString(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.length >= 3) {
    const [y, m, d] = v;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  return "";
}
