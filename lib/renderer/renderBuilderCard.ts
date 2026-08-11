import type { RenderBuilderCardInput } from "@/types";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_CONFIG,
  COLORS,
} from "./cardConfig";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith("http://") || src.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image: " + src));
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

// ─── Main render function ─────────────────────────────────────────────────────

export async function renderBuilderCard(
  input: RenderBuilderCardInput
): Promise<Blob> {
  // Ensure custom font system-ui is ready
  try {
    await document.fonts.ready;
  } catch {
    // Non-fatal
  }

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available.");

  // 1. Draw solid background
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 2. Load and Draw SVG assets (Borders, Circuit Board Patterns)
  try {
    const [technicalLines, circuitTopRight, circuitBottomRight] = await Promise.all([
      loadImage("/graphics/technical-lines.svg"),
      loadImage("/graphics/circuit-top-right.svg"),
      loadImage("/graphics/circuit-bottom-right.svg"),
    ]);

    ctx.drawImage(technicalLines, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    ctx.drawImage(circuitTopRight, CARD_WIDTH - 350 - 25, 25, 350, 300);
    ctx.drawImage(circuitBottomRight, CARD_WIDTH - 400 - 25, CARD_HEIGHT - 350 - 25, 400, 350);
  } catch (err) {
    console.warn("Could not load decoration SVGs for card render, using solid style:", err);
  }

  // 3. Draw Header Text
  ctx.fillStyle = COLORS.white;
  ctx.font = "bold 44px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("HH GOA 2026", CARD_CONFIG.footer.x, 122);

  // 4. Draw User Photo inside photo frame
  const { x, y, width, height, radius } = CARD_CONFIG.photo;

  // Frame Background
  ctx.fillStyle = "#12171E";
  ctx.fillRect(x, y, width, height);

  // Draw Photo
  if (input.imageUrl) {
    try {
      ctx.save();
      // Clip to photo container bounds
      ctx.rect(x, y, width, height);
      ctx.clip();

      const img = await loadImage(input.imageUrl);

      if (input.fitMode === "fill") {
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
          drawCover(ctx, img, x, y, width, height, "center");
        }
      }
      ctx.restore();
    } catch (err) {
      console.error("Failed to draw user image:", err);
    }
  }

  // Draw white border around photo frame
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 4;
  ctx.strokeRect(x, y, width, height);

  // 5. Draw Name (Centered, dynamic sizing)
  const formattedName = input.name.trim() ? input.name.toUpperCase() : "YOUR NAME";
  const nameLen = formattedName.length;
  let nameSize = 50;
  if (nameLen > 24) nameSize = 32;
  else if (nameLen > 16) nameSize = 40;

  ctx.fillStyle = COLORS.white;
  ctx.font = `bold ${nameSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(formattedName, CARD_CONFIG.name.centerX, CARD_CONFIG.name.baselineY);

  // 6. Draw PARTICIPANT Label (Centered)
  ctx.fillStyle = COLORS.gray;
  ctx.font = "500 30px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PARTICIPANT", CARD_CONFIG.participant.centerX, CARD_CONFIG.participant.baselineY);

  // 7. Draw Role (Centered)
  const formattedRole = `ROLE - ${input.role.trim() ? input.role.toUpperCase() : "DEVELOPER"}`;
  ctx.fillStyle = COLORS.white;
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(formattedRole, CARD_CONFIG.role.centerX, CARD_CONFIG.role.baselineY);

  // 8. Draw Team Box Container
  const tb = CARD_CONFIG.teamBox;
  // Fill Box
  ctx.fillStyle = "rgba(10, 14, 20, 0.75)";
  ctx.save();
  roundRect(ctx, tb.x, tb.y, tb.width, tb.height, 8);
  ctx.fill();
  
  // Box border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Draw Team Text (Centered)
  const formattedTeam = `TEAM - ${input.team.trim() ? input.team.toUpperCase() : "CODERUSH"}`;
  ctx.fillStyle = COLORS.red;
  ctx.font = "bold 38px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(formattedTeam, CARD_CONFIG.name.centerX, tb.y + 68);

  // 9. Draw Footer Info (Bottom-Left)
  ctx.textAlign = "left";
  
  ctx.fillStyle = COLORS.white;
  ctx.font = "bold 28px sans-serif";
  ctx.fillText("BUILDER @ HH GOA", CARD_CONFIG.footer.x, CARD_CONFIG.footer.baselineY);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = "400 24px sans-serif";
  ctx.fillText("GOA • OCT 28–31 • 2026", CARD_CONFIG.footer.x, CARD_CONFIG.footer.baselineY + 35);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("#FrameInGoa", CARD_CONFIG.footer.x, CARD_CONFIG.footer.baselineY + 70);

  // 10. Export as PNG Blob
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
