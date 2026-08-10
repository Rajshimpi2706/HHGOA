import type { RenderBuilderCardInput, BuilderDnaItem } from "@/types";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  COLORS,
  IMAGE_AREA,
  NAME_CONFIG,
  ROLE_CONFIG,
  TITLE_CONFIG,
  DNA_CONFIG,
  SIGNAL_CONFIG,
  FOOTER_CONFIG,
  HEADER_CONFIG,
} from "./cardConfig";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith("http://") || src.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image for canvas render."));
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/** Draw image scaled to cover the area, anchored to top-center */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  anchor: "top" | "center" = "center"
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = x + (w - sw) / 2;
  const sy = anchor === "top" ? y : y + (h - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}

/** Draw image scaled to contain within the area, centered */
function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.min(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}

/** Draw blurred version of image as background fill */
async function drawBlurBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Draw scaled-up blurred version
  ctx.save();
  ctx.filter = "blur(20px) brightness(0.4)";
  const scale = Math.max(w / img.width, h / img.height) * 1.2;
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
  ctx.filter = "none";
  ctx.restore();
}

// ─── Draw sections ────────────────────────────────────────────────────────────

function drawBackground(ctx: CanvasRenderingContext2D) {
  // Base fill
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Subtle top vignette glow
  const grad = ctx.createRadialGradient(
    CARD_WIDTH / 2, 0, 0,
    CARD_WIDTH / 2, 0, CARD_WIDTH * 0.8
  );
  grad.addColorStop(0, "rgba(183,255,0,0.04)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
}

function drawHeader(ctx: CanvasRenderingContext2D) {
  ctx.font = HEADER_CONFIG.font;
  ctx.fillStyle = COLORS.accent;
  ctx.fillText("HH GOA", HEADER_CONFIG.x, HEADER_CONFIG.y);

  // Draw // separator
  ctx.fillStyle = COLORS.footerText;
  const hhWidth = ctx.measureText("HH GOA").width;
  ctx.fillText(" //", HEADER_CONFIG.x + hhWidth, HEADER_CONFIG.y);

  const sepWidth = ctx.measureText(" //").width;
  ctx.fillStyle = COLORS.white;
  ctx.fillText(" 2026", HEADER_CONFIG.x + hhWidth + sepWidth, HEADER_CONFIG.y);
}

async function drawImageArea(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  input: RenderBuilderCardInput
) {
  const { x, y, width, height, radius } = IMAGE_AREA;

  // Frame border
  ctx.save();
  roundRect(ctx, x - 1, y - 1, width + 2, height + 2, radius + 1);
  ctx.strokeStyle = COLORS.imageFrameBorder;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Clip to rounded rect
  roundRect(ctx, x, y, width, height, radius);
  ctx.clip();

  if (input.fitMode === "fill") {
    // Fill: cover from top for portrait, center for others
    drawCover(ctx, img, x, y, width, height,
      input.orientation === "portrait" ? "top" : "center");
  } else {
    // Smart Fit
    if (input.orientation === "landscape") {
      await drawBlurBackground(ctx, img, x, y, width, height);
      drawContain(ctx, img, x, y, width, height);
    } else if (input.orientation === "portrait") {
      drawCover(ctx, img, x, y, width, height, "top");
    } else {
      // square
      drawCover(ctx, img, x, y, width, height, "center");
    }
  }

  ctx.restore();
}

function drawName(ctx: CanvasRenderingContext2D, name: string) {
  ctx.font = NAME_CONFIG.font;
  ctx.fillStyle = COLORS.nameText;
  // Truncate if too long
  const displayName = name.trim() || "YOUR NAME";
  ctx.fillText(displayName.toUpperCase(), NAME_CONFIG.x, NAME_CONFIG.y, NAME_CONFIG.maxWidth);
}

function drawRole(ctx: CanvasRenderingContext2D, role: string) {
  ctx.font = ROLE_CONFIG.font;
  ctx.fillStyle = COLORS.roleText;
  ctx.fillText(`[ ${role || "BUILDER"} ]`, ROLE_CONFIG.x, ROLE_CONFIG.y);
}

function drawTitle(ctx: CanvasRenderingContext2D, title: string) {
  ctx.font = TITLE_CONFIG.font;
  ctx.fillStyle = COLORS.titleText;
  ctx.fillText(title, TITLE_CONFIG.x, TITLE_CONFIG.y);
}

function drawDna(ctx: CanvasRenderingContext2D, dna: BuilderDnaItem[]) {
  const { startX, startY, barHeight, barRadius, rowSpacing, labelFont, valueFont, barWidth, labelWidth, valueWidth } = DNA_CONFIG;

  dna.forEach((item, i) => {
    const y = startY + i * rowSpacing;

    // Label
    ctx.font = labelFont;
    ctx.fillStyle = COLORS.dnaLabel;
    ctx.fillText(item.label, startX, y);

    // Bar background
    const barX = startX + labelWidth;
    const barY = y - barHeight + 2;

    ctx.fillStyle = COLORS.dnaBarBg;
    roundRect(ctx, barX, barY, barWidth, barHeight, barRadius);
    ctx.fill();

    // Bar fill
    const fillWidth = Math.round((item.value / 99) * barWidth);
    const accentGrad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    accentGrad.addColorStop(0, COLORS.accent);
    accentGrad.addColorStop(1, COLORS.accentDim);
    ctx.fillStyle = accentGrad;
    roundRect(ctx, barX, barY, fillWidth, barHeight, barRadius);
    ctx.fill();

    // Value
    ctx.font = valueFont;
    ctx.fillStyle = COLORS.dnaValue;
    ctx.fillText(
      String(item.value),
      barX + barWidth + 16,
      y
    );
  });
}

function drawSignal(ctx: CanvasRenderingContext2D, signalId: string) {
  ctx.font = SIGNAL_CONFIG.font;
  ctx.fillStyle = COLORS.signalLabel;
  ctx.fillText("SIGNAL // ", SIGNAL_CONFIG.x, SIGNAL_CONFIG.y);
  const labelWidth = ctx.measureText("SIGNAL // ").width;
  ctx.fillStyle = COLORS.signalValue;
  ctx.fillText(signalId, SIGNAL_CONFIG.x + labelWidth, SIGNAL_CONFIG.y);
}

function drawFooter(ctx: CanvasRenderingContext2D) {
  ctx.font = FOOTER_CONFIG.font;
  ctx.fillStyle = COLORS.footerText;
  ctx.fillText("#FrameInGoa", FOOTER_CONFIG.x, FOOTER_CONFIG.y);

  const tagWidth = ctx.measureText("#FrameInGoa").width;
  ctx.fillStyle = COLORS.divider;
  ctx.fillText("  ·  ", FOOTER_CONFIG.x + tagWidth, FOOTER_CONFIG.y);
  const dotWidth = ctx.measureText("  ·  ").width;

  ctx.fillStyle = COLORS.accent;
  ctx.fillText("SHIP > TALK", FOOTER_CONFIG.x + tagWidth + dotWidth, FOOTER_CONFIG.y);
}

// ─── Main render function ─────────────────────────────────────────────────────

export async function renderBuilderCard(
  input: RenderBuilderCardInput
): Promise<Blob> {
  // Ensure fonts are loaded before rendering text on canvas
  try {
    await document.fonts.ready;
    await document.fonts.load("700 68px 'Space Mono'");
    await document.fonts.load("400 26px 'Space Mono'");
  } catch {
    // Non-fatal: canvas will fall back to monospace
  }

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available.");

  // 1. Background
  drawBackground(ctx);

  // 2. Header
  drawHeader(ctx);

  // 3. Load and draw photo
  const img = await loadImage(input.imageUrl);
  await drawImageArea(ctx, img, input);

  // 4. Text
  drawName(ctx, input.name);
  drawRole(ctx, input.role);
  drawTitle(ctx, input.builderTitle);

  // 5. DNA bars
  drawDna(ctx, input.dna);

  // 6. Signal ID + footer
  drawSignal(ctx, input.signalId);
  drawFooter(ctx);

  // 7. Export as PNG blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Canvas export failed."));
        else resolve(blob);
      },
      "image/png"
    );
  });
}
