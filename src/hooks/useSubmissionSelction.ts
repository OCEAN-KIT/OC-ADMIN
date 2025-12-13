// src/hooks/useSubmissionSelection.ts
"use client";
import { useMemo, useState } from "react";
import type { Submission } from "@/api/submissions";

export function useSubmissionSelection(items: Submission[]) {
  const selectableIds = useMemo(
    () =>
      items
        .filter((i) => i.status === "pending" || i.status === "approved")
        .map((i) => String(i.id)),
    [items]
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const total = selectableIds.length;
  const allSelected = selected.size > 0 && selected.size === total;

  const toggleOne = (id: string) => {
    if (!selectableIds.includes(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === total ? new Set() : new Set(selectableIds)
    );
  };
  const clear = () => setSelected(new Set());
  return {
    selected,
    toggleOne,
    toggleAll,
    clear,
    total,
    allSelected,
    count: selected.size,
  };
}
