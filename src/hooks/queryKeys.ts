export const queryKeys = {
  myInfo: ["myInfo"] as const,
  species: ["species"] as const,
  submissions: {
    all: ["submissions"] as const,
    list: (page: number, pageSize: number, filters: unknown) =>
      ["submissions", { page, pageSize, filters }] as const,
  },
  submissionDetail: (submissionId: number | string) =>
    ["submissionDetail", submissionId] as const,
  areas: {
    all: ["areas"] as const,
    list: (page: number, filters: unknown) => ["areas", page, filters] as const,
    detail: (areaId: number) => ["areas", areaId, "detail"] as const,
    transplantLogs: (areaId: number) =>
      ["areas", areaId, "transplant-logs"] as const,
    growthLogs: (areaId: number) => ["areas", areaId, "growth-logs"] as const,
    representativeSpecies: (areaId: number) =>
      ["areas", areaId, "representative-species"] as const,
    environmentLogs: (areaId: number) =>
      ["areas", areaId, "environment-logs"] as const,
    mediaLogs: (areaId: number) => ["areas", areaId, "media-logs"] as const,
  },
};
