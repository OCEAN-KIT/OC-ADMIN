"use client";

import { useState } from "react";
import {
  useSubmissionsQuery,
  useApproveMutation,
  useRejectMutation,
  useBulkApproveMutation,
  useBulkRejectMutation,
  useDeleteMutation,
} from "@/hooks/submissions";
import { useSubmissionSelection } from "@/hooks/useSubmissionSelction"; // ✅ 오타 주의
import ReviewList from "@/components/review-list/review-list";
import ReviewBulkActions from "@/components/review-list/review-bulk-actions";
import RejectModal from "@/components/reject-reason-modal";
import FilterBar from "@/components/filter-bar/filter-bar";
import type { ListFilters } from "@/api/submissions";
import { ClipLoader } from "react-spinners";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function HomePage() {
  useAuthGuard({ mode: "gotoLogin" });

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [filters, setFilters] = useState<ListFilters>({
    status: "all",
    q: "",
    dateFrom: null,
    dateTo: null,
  });

  const { data, isFetching } = useSubmissionsQuery(page, pageSize, filters);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const {
    selected,
    toggleOne,
    toggleAll,
    clear,
    total: selectableTotal,
    allSelected,
    count,
  } = useSubmissionSelection(items);

  const approveOne = useApproveMutation();
  const rejectOne = useRejectMutation();
  const bulkApprove = useBulkApproveMutation();
  const bulkReject = useBulkRejectMutation();
  const deleteOne = useDeleteMutation();

  // 반려 모달
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectIds, setRejectIds] = useState<string[]>([]);
  const openReject = (ids: string[]) => {
    if (ids.length) {
      setRejectIds(ids);
      setRejectOpen(true);
    }
  };
  const closeReject = () => setRejectOpen(false);

  return (
    <div className="p-4">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-center gap-3">
          <FilterBar value={filters} onChange={setFilters} />
          <button
            className="ml-2 h-10 rounded-xl border border-gray-200 text-sm px-4"
            onClick={() => setPage(1)}
            disabled={isFetching}
          >
            검색
          </button>

          <ReviewBulkActions
            className="ml-auto"
            total={selectableTotal}
            selectedCount={count}
            allSelected={allSelected}
            onToggleAll={toggleAll}
            onBulkApprove={() =>
              bulkApprove.mutate(Array.from(selected), { onSuccess: clear })
            }
            onOpenReject={() => openReject(Array.from(selected))}
            disabled={
              isFetching ||
              bulkApprove.isPending ||
              bulkReject.isPending
            }
          />
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center h-screen -mt-50">
            <ClipLoader color="#3263F1" />
          </div>
        ) : (
          <div className="mt-4">
            <ReviewList
              items={items}
              selected={selected}
              onToggleOne={toggleOne}
              onRejectOne={(id) => openReject([id])}
              onApproveOne={(id) => approveOne.mutate(id)}
              onDeleteOne={(id) => deleteOne.mutate(id)}
              loading={isFetching}
            />
          </div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded border"
          >
            이전
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border"
          >
            다음
          </button>
        </div>
      </div>

      <RejectModal
        open={rejectOpen}
        ids={rejectIds}
        loading={rejectOne.isPending || bulkReject.isPending}
        onClose={closeReject}
        onSubmit={({ reason }) =>
          rejectIds.length === 1
            ? rejectOne.mutate(
                { id: rejectIds[0], reason },
                {
                  onSuccess: () => {
                    closeReject();
                    clear();
                  },
                }
              )
            : bulkReject.mutate(
                { ids: rejectIds, reason },
                {
                  onSuccess: () => {
                    closeReject();
                    clear();
                  },
                }
              )
        }
      />
    </div>
  );
}
