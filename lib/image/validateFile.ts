// ─── Allowed MIME types ───────────────────────────────────────────────────────
const VALID_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
];

const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateFile(file: File): ValidationResult {
  const nameLC = file.name ? file.name.toLowerCase() : "";
  const isValidType =
    (file.type && file.type.startsWith("image/")) ||
    VALID_TYPES.includes(file.type) ||
    nameLC.endsWith(".heic") ||
    nameLC.endsWith(".heif") ||
    nameLC.endsWith(".jpg") ||
    nameLC.endsWith(".jpeg") ||
    nameLC.endsWith(".png") ||
    nameLC.endsWith(".webp") ||
    nameLC.endsWith(".bmp") ||
    nameLC.endsWith(".tiff");

  if (!isValidType) {
    return {
      ok: false,
      error: "Please choose a JPG, PNG, HEIC or WebP image.",
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      ok: false,
      error: `Image is too large. Please choose an image under ${MAX_SIZE_MB} MB.`,
    };
  }

  return { ok: true };
}


export function isHeicFile(file: File): boolean {
  const nameLC = file.name.toLowerCase();
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    nameLC.endsWith(".heic") ||
    nameLC.endsWith(".heif")
  );
}
