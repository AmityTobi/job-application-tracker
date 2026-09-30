export const MAX_CV_SIZE = 5 * 1024 * 1024;

export const CV_ACCEPT = "application/pdf";

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateCvFile(file: File): string | null {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return "CV must be a PDF file.";
  }

  if (file.type && file.type !== CV_ACCEPT) {
    return "CV must be a PDF file.";
  }

  if (file.size === 0) {
    return "The selected PDF is empty.";
  }

  if (file.size > MAX_CV_SIZE) {
    return "CV must be 5 MB or smaller.";
  }

  return null;
}

export async function hasPdfSignature(file: File) {
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());

  const pdfSignature = [0x25, 0x50, 0x44, 0x46, 0x2d];

  return pdfSignature.every((byte, index) => header[index] === byte);
}

export function createCvPathname({
  userId,
  applicationId,
}: {
  userId: string;
  applicationId: string;
}) {
  return [
    "applications",
    userId,
    applicationId,
    `${crypto.randomUUID()}.pdf`,
  ].join("/");
}

export function createContentDisposition(fileName: string, download: boolean) {
  const disposition = download ? "attachment" : "inline";

  const safeFallback =
    fileName
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/["\\]/g, "_")
      .trim() || "cv.pdf";

  const encodedFileName = encodeURIComponent(fileName).replace(
    /['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );

  return `${disposition}; filename="${safeFallback}"; filename*=UTF-8''${encodedFileName}`;
}
