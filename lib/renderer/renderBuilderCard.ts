import type { RenderBuilderCardInput } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const CARD_WIDTH = 1000;
export const CARD_HEIGHT = 1500;

// Helper: load image using HTMLImageElement
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

// Helper to draw a circuit path on canvas
function drawCircuitPath(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  points: { x: number; y: number }[],
  dash: number[] | null = null,
  lineWidth = 1.5
) {
  ctx.save();
  ctx.strokeStyle = "rgba(183, 255, 0, 0.25)";
  ctx.lineWidth = lineWidth;
  if (dash) ctx.setLineDash(dash);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.stroke();
  ctx.restore();
}

function drawCircuitDot(ctx: CanvasRenderingContext2D, cx: number, cy: number, r = 3) {
  ctx.save();
  ctx.fillStyle = "rgba(183, 255, 0, 0.35)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ─── Main render function ─────────────────────────────────────────────────────

export async function renderBuilderCard(
  input: RenderBuilderCardInput
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available.");

  // 1. Draw solid dark background
  ctx.fillStyle = "#090b0e";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 2. Draw Circuit Dot Grid (circuit-bg)
  ctx.fillStyle = "rgba(183, 255, 0, 0.05)";
  const gridSpacing = 56; 
  const dotRadius = 2.5;
  for (let gx = gridSpacing / 2; gx < CARD_WIDTH; gx += gridSpacing) {
    for (let gy = gridSpacing / 2; gy < CARD_HEIGHT; gy += gridSpacing) {
      ctx.beginPath();
      ctx.arc(gx, gy, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Draw circuit board corners (representing SVGs on all 4 corners)
  
  // Top-Left Corner
  drawCircuitPath(ctx, 40, 140, [{ x: 40, y: 40 }, { x: 140, y: 40 }], null, 2);
  drawCircuitPath(ctx, 60, 160, [{ x: 60, y: 60 }, { x: 160, y: 60 }], [4, 4], 1.2);
  drawCircuitDot(ctx, 160, 60, 4);
  drawCircuitPath(ctx, 40, 90, [{ x: 80, y: 90 }, { x: 110, y: 120 }, { x: 110, y: 175 }], null, 2);
  drawCircuitDot(ctx, 110, 175, 4);

  // Top-Right Corner
  drawCircuitPath(ctx, CARD_WIDTH - 40, 140, [{ x: CARD_WIDTH - 40, y: 40 }, { x: CARD_WIDTH - 140, y: 40 }], null, 2);
  drawCircuitPath(ctx, CARD_WIDTH - 60, 160, [{ x: CARD_WIDTH - 60, y: 60 }, { x: CARD_WIDTH - 160, y: 60 }], [4, 4], 1.2);
  drawCircuitDot(ctx, CARD_WIDTH - 160, 60, 4);
  drawCircuitPath(ctx, CARD_WIDTH - 40, 90, [{ x: CARD_WIDTH - 80, y: 90 }, { x: CARD_WIDTH - 110, y: 120 }, { x: CARD_WIDTH - 110, y: 175 }], null, 2);
  drawCircuitDot(ctx, CARD_WIDTH - 110, 175, 4);

  // Bottom-Left Corner
  drawCircuitPath(ctx, 40, CARD_HEIGHT - 140, [{ x: 40, y: CARD_HEIGHT - 40 }, { x: 140, y: CARD_HEIGHT - 40 }], null, 2);
  drawCircuitPath(ctx, 60, CARD_HEIGHT - 160, [{ x: 60, y: CARD_HEIGHT - 60 }, { x: 160, y: CARD_HEIGHT - 60 }], [4, 4], 1.2);
  drawCircuitDot(ctx, 160, CARD_HEIGHT - 60, 4);
  drawCircuitPath(ctx, 40, CARD_HEIGHT - 90, [{ x: 80, y: CARD_HEIGHT - 90 }, { x: 110, y: CARD_HEIGHT - 120 }, { x: 110, y: CARD_HEIGHT - 175 }], null, 2);
  drawCircuitDot(ctx, 110, CARD_HEIGHT - 175, 4);

  // Bottom-Right Corner
  drawCircuitPath(ctx, CARD_WIDTH - 40, CARD_HEIGHT - 140, [{ x: CARD_WIDTH - 40, y: CARD_HEIGHT - 40 }, { x: CARD_WIDTH - 140, y: CARD_HEIGHT - 40 }], null, 2);
  drawCircuitPath(ctx, CARD_WIDTH - 60, CARD_HEIGHT - 160, [{ x: CARD_WIDTH - 60, y: CARD_HEIGHT - 60 }, { x: CARD_WIDTH - 160, y: CARD_HEIGHT - 60 }], [4, 4], 1.2);
  drawCircuitDot(ctx, CARD_WIDTH - 160, CARD_HEIGHT - 60, 4);
  drawCircuitPath(ctx, CARD_WIDTH - 40, CARD_HEIGHT - 90, [{ x: CARD_WIDTH - 80, y: CARD_HEIGHT - 90 }, { x: CARD_WIDTH - 110, y: CARD_HEIGHT - 120 }, { x: CARD_WIDTH - 110, y: CARD_HEIGHT - 175 }], null, 2);
  drawCircuitDot(ctx, CARD_WIDTH - 110, CARD_HEIGHT - 175, 4);

  // 4. Draw Header Text "HH GOA 2026"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("HH GOA 2026", 60, 110);

  // Draw HACKER Badge
  ctx.fillStyle = "rgba(183, 255, 0, 0.1)";
  ctx.beginPath();
  roundRect(ctx, 770, 70, 170, 48, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(183, 255, 0, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#B7FF00";
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("HACKER", 855, 101);

  // Divider Line
  const grad = ctx.createLinearGradient(60, 0, 940, 0);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.3)");
  grad.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 145);
  ctx.lineTo(940, 145);
  ctx.stroke();

  // 5. Draw User Photo inside High-Tech Frame
  const photoW = 340;
  const photoH = 340;
  const photoX = (CARD_WIDTH - photoW) / 2;
  const photoY = 240;

  // Background for frame
  ctx.fillStyle = "#12161b";
  ctx.beginPath();
  roundRect(ctx, photoX - 10, photoY - 10, photoW + 20, photoH + 20, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Crosshair corners
  ctx.strokeStyle = "#B7FF00";
  ctx.lineWidth = 3;
  // Top-Left bracket
  ctx.beginPath(); ctx.moveTo(photoX - 4, photoY + 12); ctx.lineTo(photoX - 4, photoY - 4); ctx.lineTo(photoX + 12, photoY - 4); ctx.stroke();
  // Top-Right bracket
  ctx.beginPath(); ctx.moveTo(photoX + photoW + 4, photoY + 12); ctx.lineTo(photoX + photoW + 4, photoY - 4); ctx.lineTo(photoX + photoW - 12, photoY - 4); ctx.stroke();
  // Bottom-Left bracket
  ctx.beginPath(); ctx.moveTo(photoX - 4, photoY + photoH - 12); ctx.lineTo(photoX - 4, photoY + photoH + 4); ctx.lineTo(photoX + 12, photoY + photoH + 4); ctx.stroke();
  // Bottom-Right bracket
  ctx.beginPath(); ctx.moveTo(photoX + photoW + 4, photoY + photoH - 12); ctx.lineTo(photoX + photoW + 4, photoY + photoH + 4); ctx.lineTo(photoX + photoW - 12, photoY + photoH + 4); ctx.stroke();

  // Crop / Paint image bounds
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, photoX, photoY, photoW, photoH, 8);
  ctx.clip();
  ctx.fillStyle = "#1c222a";
  ctx.fill();

  if (input.imageUrl) {
    try {
      const img = await loadImage(input.imageUrl);
      if (input.fitMode === "fill") {
        drawCover(ctx, img, photoX, photoY, photoW, photoH,
          input.orientation === "portrait" ? "top" : "center");
      } else {
        if (input.orientation === "landscape") {
          await drawBlurBackground(ctx, img, photoX, photoY, photoW, photoH);
          drawContain(ctx, img, photoX, photoY, photoW, photoH);
        } else if (input.orientation === "portrait") {
          drawCover(ctx, img, photoX, photoY, photoW, photoH, "top");
        } else {
          drawCover(ctx, img, photoX, photoY, photoW, photoH, "center");
        }
      }
    } catch (err) {
      console.error("Failed to paint image:", err);
    }
  } else {
    // Default placeholder
    try {
      const placeholderImg = await loadImage("https://lh3.googleusercontent.com/aida-public/AB6AXuCyjgujgm984Me0dmVhjAnqU3q7AnTEArkZpdDQHPYwFtiyf6yQ2EjnCfdc9A8PUQKQpvWmGeFwoTFzJtcwwkPSTuw1mwmIR7J2go3pvrkyzOvCm4oHh8TBfVTPT9DWO8Sm3fWwikCqk2AWM_vxq6I3zF2x0KOU24mVYWK1R2HL8l9yE_8lYKDhlmbnqu31w4-YeDQUD-SOseZrAw4oX3foKtbemP-TjDw6R2h1wmMe5G5u9lqGW-O1");
      drawCover(ctx, placeholderImg, photoX, photoY, photoW, photoH, "center");
    } catch (err) {
      console.warn("Failed to load default placeholder:", err);
    }
  }
  ctx.restore();

  // 6. Draw User Name (Centered)
  const formattedName = input.name.trim() ? input.name.toUpperCase() : "OUR NAME";
  const nameLen = formattedName.length;
  let nameSize = 56;
  if (nameLen > 24) nameSize = 36;
  else if (nameLen > 16) nameSize = 46;

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${nameSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(formattedName, CARD_WIDTH / 2, 700);

  // Small centered bar under name
  const nameBarWidth = 150;
  const nameBarGrad = ctx.createLinearGradient(CARD_WIDTH / 2 - nameBarWidth / 2, 0, CARD_WIDTH / 2 + nameBarWidth / 2, 0);
  nameBarGrad.addColorStop(0, "rgba(183, 255, 0, 0)");
  nameBarGrad.addColorStop(0.5, "rgba(183, 255, 0, 0.4)");
  nameBarGrad.addColorStop(1, "rgba(183, 255, 0, 0)");
  ctx.fillStyle = nameBarGrad;
  ctx.fillRect(CARD_WIDTH / 2 - nameBarWidth / 2, 725, nameBarWidth, 4);

  // 7. Draw PARTICIPANT Label (Centered)
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PARTICIPANT", CARD_WIDTH / 2, 775);

  // 8. Draw Role
  const formattedRole = input.role.trim() ? input.role.toUpperCase() : "ROLE";
  const displayRole = formattedRole.startsWith("ROLE -") ? formattedRole : `ROLE - ${formattedRole}`;
  ctx.fillStyle = "#B7FF00";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(displayRole, CARD_WIDTH / 2, 825);

  // 9. Draw Holographic Team Tag Box
  const boxX = 60;
  const boxY = 890;
  const boxW = 880;
  const boxH = 110;

  ctx.fillStyle = "rgba(239, 68, 68, 0.05)";
  ctx.beginPath();
  roundRect(ctx, boxX, boxY, boxW, boxH, 12);
  ctx.fill();

  ctx.strokeStyle = "rgba(239, 68, 68, 0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tech red brackets inside team box
  ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
  ctx.lineWidth = 1.5;
  // Top-Left bracket
  ctx.beginPath(); ctx.moveTo(boxX + 6, boxY + 16); ctx.lineTo(boxX + 6, boxY + 6); ctx.lineTo(boxX + 16, boxY + 6); ctx.stroke();
  // Top-Right bracket
  ctx.beginPath(); ctx.moveTo(boxX + boxW - 6, boxY + 16); ctx.lineTo(boxX + boxW - 6, boxY + 6); ctx.lineTo(boxX + boxW - 16, boxY + 6); ctx.stroke();
  // Bottom-Left bracket
  ctx.beginPath(); ctx.moveTo(boxX + 6, boxY + boxH - 16); ctx.lineTo(boxX + 6, boxY + boxH - 6); ctx.lineTo(boxX + 16, boxY + boxH - 6); ctx.stroke();
  // Bottom-Right bracket
  ctx.beginPath(); ctx.moveTo(boxX + boxW - 6, boxY + boxH - 16); ctx.lineTo(boxX + boxW - 6, boxY + boxH - 6); ctx.lineTo(boxX + boxW - 16, boxY + boxH - 6); ctx.stroke();

  // Draw Team Text (Centered)
  const formattedTeam = input.team.trim() ? input.team.toUpperCase() : "TEAM NAME";
  const displayTeam = formattedTeam.startsWith("TEAM -") ? formattedTeam : `TEAM - ${formattedTeam}`;
  ctx.fillStyle = "#ff4d4d";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(displayTeam, CARD_WIDTH / 2, boxY + 66);

  // 10. Draw Footer Text
  // Divider line
  const footerGrad = ctx.createLinearGradient(60, 0, 940, 0);
  footerGrad.addColorStop(0, "rgba(255, 255, 255, 0.3)");
  footerGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
  footerGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.strokeStyle = footerGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 1170);
  ctx.lineTo(940, 1170);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("BUILDER @ HH GOA", 60, 1225);
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "400 22px sans-serif";
  ctx.fillText("GOA • OCT 28-31 • 2026", 60, 1275);
  
  ctx.fillStyle = "rgba(183, 255, 0, 0.7)";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("#FrameInGoa", 60, 1325);

  // 11. Export as PNG Blob
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
