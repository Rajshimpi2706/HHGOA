/**
 * Converts a HEIC/HEIF file to a JPEG Blob using heic2any.
 * Uses dynamic import so the heavy library is only loaded when needed.
 */
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  try {
    // Dynamic import — only loaded when needed
    const heic2anyModule = await import("heic2any");
    const heic2any = heic2anyModule.default;

    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    });

    // heic2any may return an array for multi-page HEICs; take first frame
    if (Array.isArray(result)) {
      return result[0];
    }

    return result;
  } catch (err) {
    console.warn("heic2any conversion failed, falling back to original file:", err);
    return file;
  }
}

