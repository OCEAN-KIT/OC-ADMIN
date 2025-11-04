"use client";

import { CalendarClock, Users, MapPin } from "lucide-react";

export default function SessionSummary({
  date,
  participantCount,
  site,
}: {
  date: string;
  participantCount: number;
  site: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CalendarClock className="h-4 w-4 text-gray-400" />
          <span className="font-medium">작업일자</span>
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium">참여 인원</span>
          <span>{participantCount}명</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="truncate">{site}</span>
        </div>
      </div>
    </div>
  );
}
