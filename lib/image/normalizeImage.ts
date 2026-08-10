/**
 * Normalizes an image file or blob into a safe, predictable format:
 * - Fixes EXIF orientation where supported
 * - Resizes to max 2048px on longest dimension
 * - Outputs as JPEG blob URL
 *
 * Uses multi-tier fallback for mobile browser compatibility (iOS Safari, Android WebViews).
 */

const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.92;

export type NormalizeResult = {
  url: string;
  width: number;
  height: number;
};

// Helper: load image using HTMLImageElement as fail-safe for mobile browsers
function loadImageFallback(
  source: File | Blob
): Promise<{ draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void; width: number; height: number; close: () => void }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(source);
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
          ctx.drawImage(img, 0, 0, w, h);
        },
        close: () => {
          URL.revokeObjectURL(objectUrl);
        },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      
      // Fallback to FileReader Data URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Failed to read file as data URL."));
          return;
        }
        
        const dataImg = new Image();
        dataImg.onload = () => {
          resolve({
            width: dataImg.naturalWidth || dataImg.width,
            height: dataImg.naturalHeight || dataImg.height,
            draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
              ctx.drawImage(dataImg, 0, 0, w, h);
            },
            close: () => {},
          });
        };
        dataImg.onerror = () => {
          reject(new Error("Failed to load image from data URL."));
        };
        dataImg.src = reader.result;
      };
      
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(source);
    };

    img.src = objectUrl;
  });
}

export async function normalizeImage(
  source: File | Blob
): Promise<NormalizeResult> {
  let drawable: { draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void; width: number; height: number; close: () => void } | null = null;

  // Tier 1: createImageBitmap with orientation options
  try {
    const bitmap = await createImageBitmap(source, {
      imageOrientation: "from-image",
    });
    drawable = {
      width: bitmap.width,
      height: bitmap.height,
      draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
      close: () => bitmap.close(),
    };
  } catch (e1) {
    // Tier 2: createImageBitmap without options
    try {
      const bitmap = await createImageBitmap(source);
      drawable = {
        width: bitmap.width,
        height: bitmap.height,
        draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
        close: () => bitmap.close(),
      };
    } catch (e2) {
      // Tier 3: HTMLImageElement fallback (works on ALL mobile browsers)
      drawable = await loadImageFallback(source);
    }
  }

  let { width, height } = drawable;

  // Scale down if needed while preserving aspect ratio
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width >= height) {
      height = Math.round(height * (MAX_DIMENSION / width));
      width = MAX_DIMENSION;
    } else {
      width = Math.round(width * (MAX_DIMENSION / height));
      height = MAX_DIMENSION;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    drawable.close();
    throw new Error("Canvas 2D context not available.");
  }

  drawable.draw(ctx, width, height);
  drawable.close();

  // Export as Data URL for 100% reliable rendering on mobile Safari / WebViews
  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

  return {
    url: dataUrl,
    width,
    height,
  };
}

