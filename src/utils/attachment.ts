import { keyToPublicUrl } from "./s3";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

type Attachment = {
  fileUrl: string;
  mimeType: string;
};

/** 첨부파일 목록에서 이미지만 필터링하여 public URL 배열로 반환 */
export function extractImageUrls(attachments?: Attachment[]): string[] {
  if (!attachments?.length) return [];

  return attachments
    .filter((a) => {
      const mt = (a.mimeType || "").toLowerCase();
      if (mt.startsWith("image/")) return true;
      const p = (a.fileUrl || "").toLowerCase();
      return IMAGE_EXTENSIONS.some((ext) => p.endsWith(ext));
    })
    .map((a) => keyToPublicUrl(a.fileUrl));
}
