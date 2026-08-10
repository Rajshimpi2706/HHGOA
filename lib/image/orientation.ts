import type { Orientation } from "@/types";

/**
 * Determines image orientation using a 10% threshold to avoid
 * treating near-square images as landscape or portrait.
 */
export function getOrientation(width: number, height: number): Orientation {
  if (height > width * 1.1) return "portrait";
  if (width > height * 1.1) return "landscape";
  return "square";
}
