"use client";

import type { ActivityType } from "@/types/activity";
import { activityLabel } from "@/types/activity";

export default function ActivityLabel({
  activity,
}: {
  activity: ActivityType;
}) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {activityLabel(activity)}
    </span>
  );
}
