"use client";

import { useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  photos: string[];
  index: number;
  onClose: () => void;
  onChangeIndex: (i: number) => void;
};

export default function PhotoLightbox({
  photos,
  index,
  onClose,
  onChangeIndex,
}: Props) {
  const prev = useCallback(
    () => onChangeIndex((index - 1 + photos.length) % photos.length),
    [index, photos.length, onChangeIndex]
  );
  const next = useCallback(
    () => onChangeIndex((index + 1) % photos.length),
    [index, photos.length, onChangeIndex]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* 닫기 */}
      <button
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      {/* 카운터 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
        {index + 1} / {photos.length}
      </div>

      {/* 이전 */}
      {photos.length > 1 && (
        <button
          className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* 이미지 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[index]}
        alt={`photo-${index + 1}`}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* 다음 */}
      {photos.length > 1 && (
        <button
          className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
