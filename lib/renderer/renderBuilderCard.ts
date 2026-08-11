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
  ctx.fillStyle = "#0e0e0f";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 2. Draw Circuit Dot Grid (circuit-bg)
  ctx.fillStyle = "#2b2a2b";
  const gridSpacing = 48; // Scaled 20px spacing
  const dotRadius = 3;
  for (let gx = gridSpacing / 2; gx < CARD_WIDTH; gx += gridSpacing) {
    for (let gy = gridSpacing / 2; gy < CARD_HEIGHT; gy += gridSpacing) {
      ctx.beginPath();
      ctx.arc(gx, gy, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Draw Circuit Lines (circuit-lines corner lines)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 4;

  // circuit-lines::before (Top-Right: top: 8%, right: 8%, w/h: 45px)
  // Maps to top: 120px, right: 80px, width/height: 107px on 1000x1500 canvas.
  // Style: border-top: transparent, border-left: transparent -> Draws bottom and right borders.
  const trX = CARD_WIDTH - 80;
  const trY = 120;
  const trW = 107;
  const trH = 107;
  ctx.beginPath();
  ctx.moveTo(trX - trW, trY + trH);
  ctx.lineTo(trX, trY + trH);
  ctx.lineTo(trX, trY);
  ctx.stroke();

  // circuit-lines::after (Bottom-Right: bottom: 8%, right: 8%, w/h: 65px)
  // Maps to bottom: 120px, right: 80px, width/height: 155px.
  // Style: border-bottom: transparent, border-right: transparent -> Draws top and left borders.
  const brX = CARD_WIDTH - 80;
  const brY = CARD_HEIGHT - 120;
  const brW = 155;
  const brH = 155;
  ctx.beginPath();
  ctx.moveTo(brX - brW, brY - brH);
  ctx.lineTo(brX - brW, brY);
  ctx.lineTo(brX, brY);
  ctx.stroke();

  // 4. Draw Top Header Text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("HH GOA 2026", 60, 110);

  // Horizontal divider line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 140);
  ctx.lineTo(940, 140);
  ctx.stroke();

  // 5. Draw User Photo Inside Frame
  const photoW = 320;
  const photoH = 320;
  const photoX = (CARD_WIDTH - photoW) / 2;
  const photoY = 260;

  // Photo Container Background
  ctx.fillStyle = "#202021";
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Draw Photo
  if (input.imageUrl) {
    try {
      ctx.save();
      // Clip to container bounds
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();

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
      ctx.restore();
    } catch (err) {
      console.error("Failed to load/draw user image on canvas:", err);
    }
  } else {
    // Draw default placeholder image from user's URL
    try {
      const placeholderImg = await loadImage("https://lh3.googleusercontent.com/aida-public/AB6AXuCyjgujgm984Me0dmVhjAnqU3q7AnTEArkZpdDQHPYwFtiyf6yQ2EjnCfdc9A8PUQKQpvWmGeFwoTFzJtcwwkPSTuw1mwmIR7J2go3pvrkyzOvCm4oHh8TBfVTPT9DWO8Sm3fWwikCqk2AWM_vxq6I3zF2x0KOU24mVYWK1R2HL8l9yE_8lYKDhlmbnqu31w4-YeDQUD-SOseZrAw4oX3foKtbemP-TjDw6R2h1wmMe5G5u9lqGW-O1");
      drawCover(ctx, placeholderImg, photoX, photoY, photoW, photoH, "center");
    } catch (err) {
      console.warn("Failed to load default placeholder:", err);
    }
  }

  // Draw photo border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 5;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  // 6. Draw User Name (Centered)
  const formattedName = input.name.trim() ? input.name.toUpperCase() : "ALEX CHEN";
  const nameLen = formattedName.length;
  let nameSize = 56;
  if (nameLen > 24) nameSize = 36;
  else if (nameLen > 16) nameSize = 46;

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${nameSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(formattedName, CARD_WIDTH / 2, 700);

  // 7. Draw PARTICIPANT Label (Centered)
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.font = "500 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PARTICIPANT", CARD_WIDTH / 2, 760);

  // 8. Draw Role (Centered)
  const formattedRole = input.role.trim() ? input.role.toUpperCase() : "ROLE - DEVELOPER";
  const displayRole = formattedRole.startsWith("ROLE -") ? formattedRole : `ROLE - ${formattedRole}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(displayRole, CARD_WIDTH / 2, 820);

  // 9. Draw Team Tag Box
  const boxX = 60;
  const boxY = 890;
  const boxW = 880;
  const boxH = 95;

  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.beginPath();
  roundRect(ctx, boxX, boxY, boxW, boxH, 6);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw Team Text
  const formattedTeam = input.team.trim() ? input.team.toUpperCase() : "TEAM - CODERUSH";
  const displayTeam = formattedTeam.startsWith("TEAM -") ? formattedTeam : `TEAM - ${formattedTeam}`;
  ctx.fillStyle = "#ff4d4d";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(displayTeam, CARD_WIDTH / 2, boxY + 58);

  // 10. Draw Footer Text
  // Divider line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 1180);
  ctx.lineTo(940, 1180);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "300 28px sans-serif";
  ctx.fillText("BUILDER @ HH GOA", 60, 1240);
  ctx.fillText("GOA • OCT 28-31 • 2026", 60, 1295);
  ctx.fillText("#InGoa", 60, 1350);

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
