// 서버 ActivityType enum (ocean 프로젝트와 동기화)
export type ActivityType =
  | "TRANSPLANT"
  | "GRAZER_REMOVAL"
  | "SUBSTRATE_IMPROVEMENT"
  | "MONITORING"
  | "MARINE_CLEANUP"
  | "OTHER";

export type EnvStatus = "BAD" | "NORMAL" | "GOOD";

export type HealthGrade = "A" | "B" | "C" | "D";

/** ActivityType → 한글 라벨 */
export function activityLabel(type: ActivityType): string {
  switch (type) {
    case "TRANSPLANT":
      return "이식";
    case "GRAZER_REMOVAL":
      return "조식동물 작업";
    case "SUBSTRATE_IMPROVEMENT":
      return "부착기질 개선";
    case "MONITORING":
      return "모니터링";
    case "MARINE_CLEANUP":
      return "해양정화";
    case "OTHER":
    default:
      return "기타";
  }
}

/** EnvStatus → 한글 라벨 */
export function envStatusLabel(status: string): string {
  switch (status) {
    case "BAD":
      return "나쁨";
    case "NORMAL":
      return "보통";
    case "GOOD":
      return "좋음";
    default:
      return status;
  }
}
