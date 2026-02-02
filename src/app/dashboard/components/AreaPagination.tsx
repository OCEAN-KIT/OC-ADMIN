"use client";

type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function AreaPagination({
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  return (
    <div className="mt-6 flex justify-center">
      <div className="inline-flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
        <button
          className="px-3 py-1.5 text-sm rounded text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 text-sm rounded font-medium ${
              page === currentPage
                ? "bg-[#2C67BC] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          className="px-3 py-1.5 text-sm rounded text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
