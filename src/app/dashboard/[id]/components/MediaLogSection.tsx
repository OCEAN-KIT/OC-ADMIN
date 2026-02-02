"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Camera, Upload, X, ImageIcon, Plus, Loader2 } from "lucide-react";
import { keyToPublicUrl } from "@/utils/s3";
import {
  usePostMediaLog,
  useDeleteMediaLog,
} from "../hooks/useMediaLogMutations";
import type { MediaLogPayload, MediaCategory } from "../../create/api/types";

// ── UI 전용 타입 ──
export type MediaLogEntry = MediaLogPayload & { id: number };

const categoryLabel: Record<MediaCategory, string> = {
  BEFORE: "복원 전",
  AFTER: "복원 후",
  TIMELINE: "타임라인",
};

// ── Props ──
type Props = {
  mediaPayload: MediaLogEntry[];
  onMediaChange: (_entries: MediaLogEntry[]) => void;
};

// ── 비포/애프터 업로드 구역 ──
function UploadZone({
  category,
  label,
  entries,
  onAdd,
  onRemove,
  uploading,
}: {
  category: MediaCategory;
  label: string;
  entries: MediaLogEntry[];
  onAdd: (category: MediaCategory, file: File) => void;
  onRemove: (id: number) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        onAdd(category, file);
      }
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">{label}</p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#2C67BC]/40 hover:bg-blue-50/30 cursor-pointer transition-colors"
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 text-[#2C67BC] animate-spin" />
        ) : (
          <Upload className="h-6 w-6 text-gray-400" />
        )}
        <p className="text-sm text-gray-500">
          {uploading ? "업로드 중..." : "클릭하거나 파일을 드래그하여 업로드"}
        </p>
        <p className="text-xs text-gray-400">JPG, PNG (최대 10MB)</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {entries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="relative group rounded-lg border border-gray-200 overflow-hidden bg-white"
            >
              {entry.mediaUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={keyToPublicUrl(entry.mediaUrl)}
                  alt={entry.caption || categoryLabel[category]}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                  <ImageIcon className="h-8 w-8 text-gray-300" />
                </div>
              )}

              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 타임라인 행 서브 컴포넌트 ──
function TimelineRow({
  entry,
  onCaptionChange,
  onFileChange,
  onRemove,
  uploading,
}: {
  entry: MediaLogEntry;
  onCaptionChange: (id: number, caption: string) => void;
  onFileChange: (id: number, file: File) => void;
  onRemove: (id: number) => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white">
      {/* 썸네일 */}
      <div
        onClick={() => inputRef.current?.click()}
        className="shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden cursor-pointer hover:border-[#2C67BC]/40 transition-colors"
      >
        {uploading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-[#2C67BC] animate-spin" />
          </div>
        ) : entry.mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={keyToPublicUrl(entry.mediaUrl)}
            alt={entry.caption || "타임라인"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <Upload className="h-4 w-4 text-gray-400" />
            <span className="text-[10px] text-gray-400">사진</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.type.startsWith("image/")) {
              onFileChange(entry.id, file);
            }
          }}
        />
      </div>

      {/* 입력 필드 */}
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <span className="px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
            {entry.recordDate || "날짜 없음"}
          </span>
          <input
            type="text"
            placeholder="캡션 입력..."
            value={entry.caption}
            onChange={(e) => onCaptionChange(entry.id, e.target.value)}
            className="flex-1 px-2.5 py-1.5 text-sm rounded-lg border border-gray-200"
          />
        </div>

        {!entry.mediaUrl && !uploading && (
          <p className="text-xs text-gray-400">
            좌측 영역을 클릭하여 사진을 선택하세요.
          </p>
        )}
      </div>

      {/* 삭제 */}
      <button
        type="button"
        onClick={() => onRemove(entry.id)}
        className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function MediaLogSection({
  mediaPayload,
  onMediaChange,
}: Props) {
  const { id } = useParams();
  const areaId = Number(id);

  const { mutateAsync: postMedia, isPending: isPosting } =
    usePostMediaLog(areaId);
  const { mutate: deleteMedia } = useDeleteMediaLog(areaId);

  // 카테고리별 업로드 중 상태 추적
  const [uploadingCategories, setUploadingCategories] = useState<
    Set<MediaCategory>
  >(new Set());
  // 타임라인 행별 업로드 상태
  const [uploadingTimelineIds, setUploadingTimelineIds] = useState<Set<number>>(
    new Set(),
  );

  const beforeEntries = mediaPayload.filter((e) => e.category === "BEFORE");
  const afterEntries = mediaPayload.filter((e) => e.category === "AFTER");
  const timelineEntries = mediaPayload.filter(
    (e) => e.category === "TIMELINE",
  );

  const today = new Date().toISOString().slice(0, 10);

  // ── 비포/애프터 파일 추가 (S3 업로드 → API POST) ──
  const handleAdd = async (category: MediaCategory, file: File) => {
    setUploadingCategories((prev) => new Set(prev).add(category));
    try {
      await postMedia({
        file,
        recordDate: today,
        caption: "",
        category,
      });
    } catch (e) {
      console.error(e);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingCategories((prev) => {
        const next = new Set(prev);
        next.delete(category);
        return next;
      });
    }
  };

  // ── 삭제 (API DELETE) ──
  const handleRemove = (entryId: number) => {
    deleteMedia(entryId);
  };

  // ── 타임라인: 빈 행 추가 후 파일 선택 시 업로드 ──
  const handleAddTimelineRow = () => {
    const entry: MediaLogEntry = {
      id: Date.now() + Math.random(),
      recordDate: today,
      mediaUrl: "",
      caption: "",
      category: "TIMELINE",
    };
    onMediaChange([...mediaPayload, entry]);
  };

  // ── 타임라인 캡션 변경 (로컬 상태만) ──
  const handleTimelineCaptionChange = (entryId: number, caption: string) => {
    onMediaChange(
      mediaPayload.map((e) => (e.id === entryId ? { ...e, caption } : e)),
    );
  };

  // ── 타임라인 파일 선택 → S3 업로드 → API POST ──
  const handleTimelineFileChange = async (entryId: number, file: File) => {
    const entry = mediaPayload.find((e) => e.id === entryId);
    if (!entry) return;

    setUploadingTimelineIds((prev) => new Set(prev).add(entryId));
    try {
      await postMedia({
        file,
        recordDate: entry.recordDate || today,
        caption: entry.caption,
        category: "TIMELINE",
      });
      // 업로드 성공 → 임시 행 제거 (쿼리 리패치로 서버 데이터 반영됨)
      onMediaChange(mediaPayload.filter((e) => e.id !== entryId));
    } catch (e) {
      console.error(e);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingTimelineIds((prev) => {
        const next = new Set(prev);
        next.delete(entryId);
        return next;
      });
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Camera className="h-5 w-5 text-[#2C67BC]" />
          미디어 등록
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* 비포 / 애프터 구역 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2C67BC] rounded-full" />
            비포 · 애프터 사진
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <UploadZone
              category="BEFORE"
              label="복원 전 (Before)"
              entries={beforeEntries}
              onAdd={handleAdd}
              onRemove={handleRemove}
              uploading={uploadingCategories.has("BEFORE")}
            />
            <UploadZone
              category="AFTER"
              label="복원 후 (After)"
              entries={afterEntries}
              onAdd={handleAdd}
              onRemove={handleRemove}
              uploading={uploadingCategories.has("AFTER")}
            />
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-100" />

        {/* 타임라인 구역 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#2C67BC] rounded-full" />
              타임라인 사진
            </h3>
            <button
              type="button"
              onClick={handleAddTimelineRow}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
            >
              <Plus className="h-4 w-4" />
              기록 추가
            </button>
          </div>

          {timelineEntries.length === 0 ? (
            <div className="p-5 rounded-lg border border-dashed border-gray-300 bg-gray-50">
              <p className="text-sm text-gray-700 font-medium">
                아직 타임라인 기록이 없습니다.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                &quot;기록 추가&quot;를 눌러 날짜별 사진을 등록하세요.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {timelineEntries.map((entry) => (
                <TimelineRow
                  key={entry.id}
                  entry={entry}
                  onCaptionChange={handleTimelineCaptionChange}
                  onFileChange={handleTimelineFileChange}
                  onRemove={handleRemove}
                  uploading={uploadingTimelineIds.has(entry.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
