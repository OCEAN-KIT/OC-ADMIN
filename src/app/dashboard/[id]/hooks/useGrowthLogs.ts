import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import type { GrowthSpeciesSection } from "../components/growth-log";
import type { GrowthStatus } from "../../create/api/types";

type RepresentativeSpeciesData = {
  speciesId: number | null;
  speciesName: string | null;
};

const makeRecordDate = (month: number, day: number) =>
  [2026, month, day] as unknown as string;

const buildGrowthSections = (areaId: number): GrowthSpeciesSection[] => {
  const safeId = Math.trunc(areaId);
  if (!Number.isFinite(safeId) || safeId < 1 || safeId > 10) {
    throw new Error("Growth mock not found");
  }

  const statusSeq: GrowthStatus[] = ["GOOD", "NORMAL", "POOR"];
  const month = ((safeId + 2) % 12) + 1;

  return [
    {
      speciesId: 101,
      speciesName: "감태",
      logs: [
        {
          id: safeId * 2000 + 1,
          speciesId: 101,
          recordDate: makeRecordDate(month, 6),
          growthLength: 30 + safeId * 2,
          status: statusSeq[(safeId - 1) % statusSeq.length] ?? "NORMAL",
        },
        {
          id: safeId * 2000 + 2,
          speciesId: 101,
          recordDate: makeRecordDate(month, 20),
          growthLength: 34 + safeId * 2,
          status: statusSeq[safeId % statusSeq.length] ?? "NORMAL",
        },
      ],
    },
    {
      speciesId: 102,
      speciesName: "다시마",
      logs: [
        {
          id: safeId * 2000 + 3,
          speciesId: 102,
          recordDate: makeRecordDate(month, 27),
          growthLength: 28 + safeId,
          status: statusSeq[(safeId + 1) % statusSeq.length] ?? "NORMAL",
        },
      ],
    },
  ];
};

const buildRepresentativeSpecies = (areaId: number): RepresentativeSpeciesData => {
  const safeId = Math.trunc(areaId);
  if (!Number.isFinite(safeId) || safeId < 1 || safeId > 10) {
    throw new Error("Representative species mock not found");
  }

  if (safeId % 2 === 0) {
    return { speciesId: 102, speciesName: "다시마" };
  }
  return { speciesId: 101, speciesName: "감태" };
};

export default function useGrowthLogs(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.growthLogs(areaId),
    queryFn: () => Promise.resolve(buildGrowthSections(areaId)),
    retry: false,
    enabled: Number.isFinite(areaId),
  });
}

export function useRepresentativeSpecies(areaId: number) {
  return useQuery({
    queryKey: queryKeys.areas.representativeSpecies(areaId),
    queryFn: () => Promise.resolve(buildRepresentativeSpecies(areaId)),
    enabled: Number.isFinite(areaId),
  });
}
