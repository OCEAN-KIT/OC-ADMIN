"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { deleteArea } from "../api/areas";
import { AreaFilters } from "../api/types";
import type { AreasResponse, AreaItem } from "../api/types";

const MOCK_AREAS: AreaItem[] = [
  {
    id: 1,
    name: "포항 상층암반 복원구역 A",
    restorationRegion: "POHANG",
    startDate: "2024-01-10",
    endDate: "2025-01-09",
    habitat: "ROCKY",
    depth: 7.3,
    areaSize: 1230,
    level: "GROWTH",
    attachmentStatus: "STABLE",
    lat: 36.019,
    lon: 129.343,
  },
  {
    id: 2,
    name: "울진 갯벌 복원구역 B",
    restorationRegion: "ULJIN",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    habitat: "MIXED",
    depth: 9.1,
    areaSize: 980,
    level: "MANAGEMENT",
    attachmentStatus: "DECREASED",
    lat: 36.993,
    lon: 129.404,
  },
  {
    id: 3,
    name: "포항 인공어초 복원지 C",
    restorationRegion: "POHANG",
    startDate: "2024-03-15",
    endDate: "2025-03-14",
    habitat: "OTHER",
    depth: 12.5,
    areaSize: 1450,
    level: "SETTLEMENT",
    attachmentStatus: "UNSTABLE",
    lat: 36.052,
    lon: 129.371,
  },
  {
    id: 4,
    name: "울진 해조군락 보호지 D",
    restorationRegion: "ULJIN",
    startDate: "2024-04-02",
    endDate: "2025-04-01",
    habitat: "ROCKY",
    depth: 6.0,
    areaSize: 810,
    level: "OBSERVATION",
    attachmentStatus: "STABLE",
    lat: 36.901,
    lon: 129.345,
  },
  {
    id: 5,
    name: "포항 수심복원지 E",
    restorationRegion: "POHANG",
    startDate: "2024-05-10",
    endDate: "2025-05-09",
    habitat: "MIXED",
    depth: 14.2,
    areaSize: 1680,
    level: "GROWTH",
    attachmentStatus: "DECREASED",
    lat: 36.012,
    lon: 129.321,
  },
  {
    id: 6,
    name: "울진 수중산호 서식지 F",
    restorationRegion: "ULJIN",
    startDate: "2024-06-20",
    endDate: "2025-06-19",
    habitat: "OTHER",
    depth: 8.8,
    areaSize: 1350,
    level: "SETTLEMENT",
    attachmentStatus: "STABLE",
    lat: 36.942,
    lon: 129.487,
  },
  {
    id: 7,
    name: "포항 생태회복 해역 G",
    restorationRegion: "POHANG",
    startDate: "2024-07-05",
    endDate: "2025-07-04",
    habitat: "MIXED",
    depth: 10.0,
    areaSize: 1015,
    level: "MANAGEMENT",
    attachmentStatus: "DECREASED",
    lat: 36.038,
    lon: 129.332,
  },
  {
    id: 8,
    name: "울진 암반 정착지 H",
    restorationRegion: "ULJIN",
    startDate: "2024-08-12",
    endDate: "2025-08-11",
    habitat: "ROCKY",
    depth: 11.4,
    areaSize: 990,
    level: "GROWTH",
    attachmentStatus: "UNSTABLE",
    lat: 36.921,
    lon: 129.455,
  },
  {
    id: 9,
    name: "포항 다층부착 지점 I",
    restorationRegion: "POHANG",
    startDate: "2024-09-01",
    endDate: "2025-09-01",
    habitat: "ROCKY",
    depth: 9.9,
    areaSize: 1090,
    level: "OBSERVATION",
    attachmentStatus: "STABLE",
    lat: 36.028,
    lon: 129.366,
  },
  {
    id: 10,
    name: "울진 해안 회복지 J",
    restorationRegion: "ULJIN",
    startDate: "2024-10-07",
    endDate: "2025-10-06",
    habitat: "MIXED",
    depth: 5.7,
    areaSize: 720,
    level: "SETTLEMENT",
    attachmentStatus: "DECREASED",
    lat: 36.987,
    lon: 129.428,
  },
];

const mockGetAreas = (page: number, filters: AreaFilters): AreasResponse => {
  const filtered = MOCK_AREAS.filter((area) => {
    const matchRegion =
      !filters.region || area.restorationRegion === filters.region;
    const matchLevel = !filters.level || area.level === filters.level;
    const matchHabitat = !filters.habitat || area.habitat === filters.habitat;
    const matchKeyword =
      !filters.keyword ||
      area.name.toLowerCase().includes(filters.keyword.toLowerCase());

    return matchRegion && matchLevel && matchHabitat && matchKeyword;
  });

  const pageSize = 10;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;

  return {
    success: true,
    data: {
      content: filtered.slice(start, end),
      page: safePage,
      size: pageSize,
      totalPages,
      totalElements: total,
      first: safePage === 1,
      last: safePage >= totalPages,
      hasNext: safePage < totalPages,
      hasPrevious: safePage > 1,
    },
  };
};

export function useGetAreas(page: number, filters: AreaFilters) {
  return useQuery({
    queryKey: queryKeys.areas.list(page, filters),
    queryFn: () => Promise.resolve(mockGetAreas(page, filters)),
    staleTime: 1000 * 60,
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["areas", "post"],
    mutationFn: (areaId: number) => deleteArea(areaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.areas.all });
    },
  });
}
