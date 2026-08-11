// ─── Core Types ──────────────────────────────────────────────────────────────

export type Orientation = "portrait" | "landscape" | "square";

export type FitMode = "smart-fit" | "fill";

export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageState = {
  sourceFile: File | null;
  sourceUrl: string | null;
  normalizedUrl: string | null;
  normalizedWidth: number;
  normalizedHeight: number;
  currentUrl: string | null;
  crop: CropRect | null;
  orientation: Orientation | null;
  fitMode: FitMode;
  isProcessing: boolean;
  error: string | null;
};

// ─── Builder State ────────────────────────────────────────────────────────────

export type BuilderState = {
  name: string;
  role: string;
  team: string;
};

// ─── Renderer Input ───────────────────────────────────────────────────────────

export type RenderBuilderCardInput = {
  imageUrl: string;
  name: string;
  role: string;
  team: string;
  fitMode: FitMode;
  orientation: Orientation;
};
