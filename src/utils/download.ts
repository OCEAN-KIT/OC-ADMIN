// Shared download helpers
export function extractFilename(header?: string | null) {
  if (!header) return undefined;
  const m =
    /filename\*?=(?:UTF-8''|")?([^";\n]+)/i.exec(header) ??
    /filename=(.+)$/.exec(header);
  return m ? decodeURIComponent(m[1].replace(/"/g, "")) : undefined;
}

export function saveBlobAsFile(blob: Blob, suggestedName = "download.bin") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
