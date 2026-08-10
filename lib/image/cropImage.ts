import type { CropRect } from "@/types";

/**
 * Crops an image to the given pixel rectangle and returns a data URL.
 * The source image must already be normalized (correct orientation, max 2048px).
 */
export async function cropImage(
  imageSrc: string,
  croppedAreaPixels: CropRect
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas 2D context not available."));
        return;
      }

      // Output matches the crop region size (not scaled)
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };

    image.onerror = () => reject(new Error("Failed to load image for cropping."));
    image.src = imageSrc;
  });
}
