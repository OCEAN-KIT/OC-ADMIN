"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  Camera,
  Upload,
  X,
  ImageIcon,
  Plus,
  Loader2,
  RefreshCw,
  Check,
} from "lucide-react";
import { keyToPublicUrl } from "@/utils/s3";
import {
  usePostMediaLog,
  usePatchMediaLog,
  useDeleteMediaLog,
} from "../hooks/useMediaLogMutations";
import type { MediaLogPayload } from "../../create/api/types";

// ── UI 전용 타입 ──
export type MediaLogEntry = MediaLogPayload & { id: number };

// ── Props ──
type Props = {
  mediaPayload: MediaLogEntry[];
  onMediaChange: (_entries: MediaLogEntry[]) => void;
};

// ── 비포/애프터 단일 사진 구역 ──
function PhotoZone({
  label,
  entry,
  onChangePhoto,
  onRemove,
  uploading,
}: {
  label: string;
  entry: MediaLogEntry | undefined;
  onChangePhoto: (file: File) => void;
  onRemove: () => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      {/* 라벨 + 버튼 같은 라인 */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <div className="flex items-center gap-2">
          {entry && (
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors"
            >
              <X className="h-3 w-3" />
              삭제
            </button>
          )}
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90 disabled:opacity-50 transition-colors"
          >
            {uploading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : entry ? (
              <RefreshCw className="h-3 w-3" />
            ) : (
              <Upload className="h-3 w-3" />
            )}
            {uploading ? "업로드 중..." : entry ? "사진 변경" : "사진 등록"}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.type.startsWith("image/")) {
              onChangePhoto(file);
            }
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      </div>

      {/* 큰 사진 영역 */}
      {entry?.mediaUrl ? (
        <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={keyToPublicUrl(entry.mediaUrl)}
            alt={label}
            className="w-full h-64 object-cover"
          />
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#2C67BC]/40 hover:bg-blue-50/30 cursor-pointer transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 text-[#2C67BC] animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-400">
                클릭하여 사진을 등록하세요
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── 타임라인: 저장된 항목 표시 ──
function TimelineSavedRow({
  entry,
  onRemove,
}: {
  entry: MediaLogEntry;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white">
      {/* 썸네일 */}
      <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
        {entry.mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={keyToPublicUrl(entry.mediaUrl)}
            alt={entry.caption || "타임라인"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-gray-300" />
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">
          {entry.recordDate[0]}.{entry.recordDate[1]}.{entry.recordDate[2]}
        </p>
        <p className="text-sm text-gray-800 mt-0.5 break-words">
          {entry.caption || "(캡션 없음)"}
        </p>
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

// ── 타임라인: 새 항목 입력 폼 ──
function TimelineAddForm({
  onSubmit,
  onCancel,
  uploading,
}: {
  onSubmit: (file: File, caption: string, recordDate: string) => void;
  onCancel: () => void;
  uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [recordDate, setRecordDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleRemoveFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = () => {
    if (!file || !recordDate) return;
    onSubmit(file, caption, recordDate);
  };

  return (
    <div className="p-4 rounded-lg border-2 border-[#2C67BC]/30 bg-blue-50/20 space-y-3">
      {/* 사진 선택 + 입력 필드 */}
      <div className="flex items-start gap-3">
        <div
          onClick={() => inputRef.current?.click()}
          className="shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 bg-white overflow-hidden cursor-pointer hover:border-[#2C67BC]/40 transition-colors"
        >
          {uploading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-[#2C67BC] animate-spin" />
            </div>
          ) : preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="미리보기"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
              <Upload className="h-5 w-5 text-gray-400" />
              <span className="text-[10px] text-gray-400">사진 선택</span>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && f.type.startsWith("image/")) handleFileSelect(f);
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
        </div>

        <div className="flex-1 space-y-2">
          <input
            type="date"
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2C67BC]/40"
          />
          <input
            type="text"
            placeholder="캡션을 입력하세요..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2C67BC]/40"
          />

          {file && !uploading && (
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              선택한 사진 제거
            </button>
          )}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={uploading}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || !recordDate || uploading}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90 disabled:opacity-50 transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          {uploading ? "업로드 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}

export default function MediaLogSection({ mediaPayload }: Props) {
  const { id } = useParams();
  const areaId = Number(id);

  const { mutateAsync: postMedia } = usePostMediaLog(areaId);
  const { mutateAsync: patchMedia } = usePatchMediaLog(areaId);
  const { mutate: deleteMedia } = useDeleteMediaLog(areaId);

  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [uploadingTimeline, setUploadingTimeline] = useState(false);

  const beforeEntry = mediaPayload.find((e) => e.category === "BEFORE");
  const afterEntry = mediaPayload.find((e) => e.category === "AFTER");
  const timelineEntries = mediaPayload.filter((e) => e.category === "TIMELINE");

  const today = new Date().toISOString().slice(0, 10);

  // ── 비포/애프터 사진 등록·변경 ──
  const handleChangePhoto = async (
    category: "BEFORE" | "AFTER",
    file: File,
  ) => {
    const setUploading =
      category === "BEFORE" ? setUploadingBefore : setUploadingAfter;
    setUploading(true);

    const existing = mediaPayload.find((e) => e.category === category);

    try {
      if (existing) {
        // 기존 항목이 있으면 PATCH
        await patchMedia({
          logId: existing.id,
          file,
          recordDate: existing.recordDate || today,
          caption: existing.caption,
          category,
        });
      } else {
        // 신규 등록
        await postMedia({ file, recordDate: today, caption: "", category });
      }
    } catch (e) {
      console.error(e);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // ── 삭제 ──
  const handleRemove = (entryId: number) => {
    deleteMedia(entryId);
  };

  // ── 타임라인 저장 (날짜 + 캡션 + 이미지 함께 POST) ──
  const handleTimelineSubmit = async (
    file: File,
    caption: string,
    recordDate: string,
  ) => {
    setUploadingTimeline(true);
    try {
      await postMedia({
        file,
        recordDate,
        caption,
        category: "TIMELINE",
      });
      setShowTimelineForm(false);
    } catch (e) {
      console.error(e);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploadingTimeline(false);
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
            <PhotoZone
              label="복원 전 (Before)"
              entry={beforeEntry}
              onChangePhoto={(file) => handleChangePhoto("BEFORE", file)}
              onRemove={() => beforeEntry && handleRemove(beforeEntry.id)}
              uploading={uploadingBefore}
            />
            <PhotoZone
              label="복원 후 (After)"
              entry={afterEntry}
              onChangePhoto={(file) => handleChangePhoto("AFTER", file)}
              onRemove={() => afterEntry && handleRemove(afterEntry.id)}
              uploading={uploadingAfter}
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
            {!showTimelineForm && (
              <button
                type="button"
                onClick={() => setShowTimelineForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#2C67BC] text-white hover:bg-[#2C67BC]/90"
              >
                <Plus className="h-4 w-4" />
                기록 추가
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* 새 항목 입력 폼 */}
            {showTimelineForm && (
              <TimelineAddForm
                onSubmit={handleTimelineSubmit}
                onCancel={() => setShowTimelineForm(false)}
                uploading={uploadingTimeline}
              />
            )}

            {/* 저장된 항목들 */}
            {timelineEntries.length === 0 && !showTimelineForm ? (
              <div className="p-5 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                <p className="text-sm text-gray-700 font-medium">
                  아직 타임라인 기록이 없습니다.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  &quot;기록 추가&quot;를 눌러 날짜별 사진을 등록하세요.
                </p>
              </div>
            ) : (
              timelineEntries.map((entry) => (
                <TimelineSavedRow
                  key={entry.id}
                  entry={entry}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
