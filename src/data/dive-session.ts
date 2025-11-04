// src/mocks/dive-session.ts
export type DiverRole = "시민다이버" | "연구자" | "관리자";

export type DiveParticipant = {
  diverId: string; // 다이버 식별자
  name: string; // 다이버 이름
  role: DiverRole; // 역할
};

export type DiveParticipantsById = {
  diveId: string; // REVIEW_ITEMS의 id (예: "001")
  participants: DiveParticipant[];
};

export const DIVE_PARTICIPANTS: Record<string, DiveParticipantsById> = {
  "001": {
    diveId: "001",
    participants: [
      { diverId: "dv-kim", name: "김바다", role: "시민다이버" },
      { diverId: "dv-moon", name: "문수심", role: "연구자" },
      { diverId: "dv-jang", name: "장해파", role: "관리자" },
    ],
  },
  "002": {
    diveId: "002",
    participants: [
      { diverId: "dv-lee", name: "이해양", role: "연구자" },
      { diverId: "dv-jung", name: "정파도", role: "시민다이버" },
      { diverId: "dv-han", name: "한청해", role: "관리자" },
    ],
  },
};
