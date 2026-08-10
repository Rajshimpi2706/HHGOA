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

export type Role =
  | "CODE"
  | "AI"
  | "DESIGN"
  | "PRODUCT"
  | "GROWTH"
  | "WEB3"
  | "FOUNDER"
  | "OTHER";

export type BuilderDnaItem = {
  label: string;
  value: number; // 60–99
};

export type BuilderState = {
  name: string;
  role: Role | null;
  stack: string;
  builderTitle: string;
  dna: BuilderDnaItem[];
  signalId: string;
};

// ─── Renderer Input ───────────────────────────────────────────────────────────

export type RenderBuilderCardInput = {
  imageUrl: string;
  name: string;
  role: string;
  builderTitle: string;
  signalId: string;
  dna: BuilderDnaItem[];
  fitMode: FitMode;
  orientation: Orientation;
};
