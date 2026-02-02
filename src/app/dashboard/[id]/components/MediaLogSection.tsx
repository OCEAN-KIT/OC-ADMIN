"use client";

import { useRef } from "react";
import { Camera, Upload, X, ImageIcon, Plus } from "lucide-react";
import type { MediaLogPayload, MediaCategory } from "../api/types";

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
}: {
  category: MediaCategory;
  label: string;
  entries: MediaLogEntry[];
  onAdd: (category: MediaCategory, file: File) => void;
  onRemove: (id: number) => void;
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
        <Upload className="h-6 w-6 text-gray-400" />
        <p className="text-sm text-gray-500">
          클릭하거나 파일을 드래그하여 업로드
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
                  src={entry.mediaUrl}
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
  onDateChange,
  onCaptionChange,
  onFileChange,
  onRemove,
}: {
  entry: MediaLogEntry;
  onDateChange: (id: number, date: string) => void;
  onCaptionChange: (id: number, caption: string) => void;
  onFileChange: (id: number, file: File) => void;
  onRemove: (id: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white">
      {/* 썸네일 */}
      <div
        onClick={() => inputRef.current?.click()}
        className="shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden cursor-pointer hover:border-[#2C67BC]/40 transition-colors"
      >
        {entry.mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.mediaUrl}
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
          <input
            type="date"
            value={entry.recordDate}
            onChange={(e) => onDateChange(entry.id, e.target.value)}
            className="px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 bg-white"
          />
          <input
            type="text"
            placeholder="캡션 입력..."
            value={entry.caption}
            onChange={(e) => onCaptionChange(entry.id, e.target.value)}
            className="flex-1 px-2.5 py-1.5 text-sm rounded-lg border border-gray-200"
          />
        </div>

        {!entry.mediaUrl && (
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
  const beforeEntries = mediaPayload.filter((e) => e.category === "BEFORE");
  const afterEntries = mediaPayload.filter((e) => e.category === "AFTER");
  const timelineEntries = mediaPayload.filter(
    (e) => e.category === "TIMELINE",
  );

  const today = new Date().toISOString().slice(0, 10);

  // ── 비포/애프터 파일 추가 ──
  const handleAdd = (category: MediaCategory, file: File) => {
    const url = URL.createObjectURL(file);
    const entry: MediaLogEntry = {
      id: Date.now() + Math.random(),
      recordDate: today,
      mediaUrl: url,
      caption: "",
      category,
    };
    onMediaChange([...mediaPayload, entry]);
  };

  // ── 삭제 ──
  const handleRemove = (id: number) => {
    const target = mediaPayload.find((e) => e.id === id);
    if (target?.mediaUrl) {
      URL.revokeObjectURL(target.mediaUrl);
    }
    onMediaChange(mediaPayload.filter((e) => e.id !== id));
  };

  // ── 타임라인 행 추가 (빈 행) ──
  const handleAddTimelineRow = () => {
    const entry: MediaLogEntry = {
      id: Date.now() + Math.random(),
      recordDate: "",
      mediaUrl: "",
      caption: "",
      category: "TIMELINE",
    };
    onMediaChange([...mediaPayload, entry]);
  };

  // ── 타임라인 날짜 변경 ──
  const handleTimelineDateChange = (id: number, date: string) => {
    onMediaChange(
      mediaPayload.map((e) => (e.id === id ? { ...e, recordDate: date } : e)),
    );
  };

  // ── 타임라인 캡션 변경 ──
  const handleTimelineCaptionChange = (id: number, caption: string) => {
    onMediaChange(
      mediaPayload.map((e) => (e.id === id ? { ...e, caption } : e)),
    );
  };

  // ── 타임라인 파일 변경 ──
  const handleTimelineFileChange = (id: number, file: File) => {
    const target = mediaPayload.find((e) => e.id === id);
    if (target?.mediaUrl) {
      URL.revokeObjectURL(target.mediaUrl);
    }
    const url = URL.createObjectURL(file);
    onMediaChange(
      mediaPayload.map((e) => (e.id === id ? { ...e, mediaUrl: url } : e)),
    );
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
            />
            <UploadZone
              category="AFTER"
              label="복원 후 (After)"
              entries={afterEntries}
              onAdd={handleAdd}
              onRemove={handleRemove}
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
                  onDateChange={handleTimelineDateChange}
                  onCaptionChange={handleTimelineCaptionChange}
                  onFileChange={handleTimelineFileChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
