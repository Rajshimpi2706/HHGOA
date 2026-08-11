"use client";

import type { FitMode, Orientation } from "@/types";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_CONFIG,
  COLORS,
} from "@/lib/renderer/cardConfig";

interface CardPreviewProps {
  imageUrl: string | null;
  name: string;
  role: string;
  team: string;
  fitMode: FitMode;
  orientation: Orientation | null;
}

// We design at a "virtual" 420px width, but render inside a 100%-width container
// that scales via CSS transform to fit any screen.
const DESIGN_WIDTH = 420;
const SCALE = DESIGN_WIDTH / CARD_WIDTH;
const DESIGN_HEIGHT = Math.round(CARD_HEIGHT * SCALE);

function px(val: number) {
  return `${Math.round(val * SCALE)}px`;
}

export function CardPreview({
  imageUrl,
  name,
  role,
  team,
  fitMode,
  orientation,
}: CardPreviewProps) {
  // Determine object-fit strategy
  const getObjectFit = () => {
    if (fitMode === "fill") return "cover" as const;
    if (orientation === "landscape") return "contain" as const;
    return "cover" as const;
  };

  const getObjectPosition = () => {
    if (fitMode === "fill") {
      return orientation === "portrait" ? "center top" : "center";
    }
    if (orientation === "portrait") return "center top";
    return "center";
  };

  // Font size auto-scaler for long names
  const getNameFontSize = (nameStr: string) => {
    const len = nameStr.length || 9; // "YOUR NAME" is 9 chars
    if (len > 24) return px(32);
    if (len > 16) return px(40);
    return px(50);
  };

  const formattedName = name.trim() ? name.toUpperCase() : "YOUR NAME";
  const formattedRole = `ROLE - ${role.trim() ? role.toUpperCase() : "DEVELOPER"}`;
  const formattedTeam = `TEAM - ${team.trim() ? team.toUpperCase() : "CODERUSH"}`;

  return (
    // Outer responsive container: takes full available width, max 420px
    <div className="w-full max-w-[420px] mx-auto" style={{ aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}` }}>
      {/* Inner card at fixed design dimensions, scaled via CSS to fill parent */}
      <div
        className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl shadow-black/60 origin-top-left"
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          background: COLORS.background,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          // Scale to fill the parent container with iOS Safari hardware acceleration
          transform: `scale(var(--card-scale, 1))`,
          WebkitTransform: `scale(var(--card-scale, 1))`,
          transformOrigin: "top left",
          WebkitTransformOrigin: "top left",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
        ref={(el) => {
          if (!el) return;
          const parent = el.parentElement;
          if (!parent) return;
          const updateScale = () => {
            const parentWidth = parent.getBoundingClientRect().width || parent.clientWidth;
            if (parentWidth <= 0) return;
            const scale = parentWidth / DESIGN_WIDTH;
            el.style.setProperty("--card-scale", String(scale));
            parent.style.height = `${DESIGN_HEIGHT * scale}px`;
          };
          updateScale();
          const ro = new ResizeObserver(updateScale);
          ro.observe(parent);
          window.addEventListener("resize", updateScale);
          window.addEventListener("orientationchange", updateScale);
        }}
      >
        {/* Fixed Visual Assets (SVGs) */}
        {/* Technical lines & outer borders */}
        <img
          src="/graphics/technical-lines.svg"
          alt="Technical Borders"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Top Right Circuit */}
        <img
          src="/graphics/circuit-top-right.svg"
          alt="Top Right Circuit"
          className="absolute pointer-events-none z-10"
          style={{
            right: px(25),
            top: px(25),
            width: px(350),
            height: px(300),
          }}
        />

        {/* Bottom Right Circuit */}
        <img
          src="/graphics/circuit-bottom-right.svg"
          alt="Bottom Right Circuit"
          className="absolute pointer-events-none z-10"
          style={{
            right: px(25),
            bottom: px(25),
            width: px(400),
            height: px(350),
          }}
        />

        {/* Header Text */}
        <div
          className="absolute font-bold uppercase text-white tracking-widest"
          style={{
            left: px(CARD_CONFIG.footer.x),
            top: px(78),
            fontSize: px(44),
            letterSpacing: "0.06em",
          }}
        >
          HH GOA 2026
        </div>

        {/* Photo area */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: px(CARD_CONFIG.photo.x),
            top: px(CARD_CONFIG.photo.y),
            width: px(CARD_CONFIG.photo.width),
            height: px(CARD_CONFIG.photo.height),
            border: `${px(4)} solid ${COLORS.white}`,
            background: "#12171E",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            zIndex: 20,
          }}
        >
          {imageUrl ? (
            <>
              {/* Blur background for landscape */}
              {orientation === "landscape" && fitMode === "smart-fit" && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(16px) brightness(0.35)",
                    transform: "scale(1.1)",
                    WebkitTransform: "scale(1.1)",
                  }}
                />
              )}
              <img
                src={imageUrl}
                alt="Builder photo"
                className="absolute inset-0 w-full h-full"
                style={{
                  objectFit: getObjectFit(),
                  objectPosition: getObjectPosition(),
                  WebkitTransform: "translateZ(0)",
                  transform: "translateZ(0)",
                }}
                draggable={false}
              />
            </>
          ) : (
            // Empty state placeholder
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: px(80),
                  height: px(80),
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <svg
                  style={{ width: px(32), height: px(32), color: COLORS.gray }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <span
                className="font-mono"
                style={{
                  color: COLORS.gray,
                  fontSize: px(16),
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Upload Photo
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Name */}
        <div
          className="absolute font-bold text-center truncate"
          style={{
            left: px(50),
            width: px(900),
            top: px(CARD_CONFIG.name.baselineY),
            fontSize: getNameFontSize(formattedName),
            color: COLORS.white,
            letterSpacing: "0.03em",
            lineHeight: 1,
            zIndex: 20,
          }}
        >
          {formattedName}
        </div>

        {/* PARTICIPANT Label */}
        <div
          className="absolute text-center uppercase tracking-widest"
          style={{
            left: px(50),
            width: px(900),
            top: px(CARD_CONFIG.participant.baselineY),
            fontSize: px(30),
            color: COLORS.gray,
            fontWeight: 500,
            letterSpacing: "0.15em",
            zIndex: 20,
          }}
        >
          PARTICIPANT
        </div>

        {/* Role / Stack Badge */}
        <div
          className="absolute text-center font-bold uppercase tracking-wider"
          style={{
            left: px(50),
            width: px(900),
            top: px(CARD_CONFIG.role.baselineY),
            fontSize: px(36),
            color: COLORS.white,
            letterSpacing: "0.04em",
            zIndex: 20,
          }}
        >
          {formattedRole}
        </div>

        {/* Team Box Container */}
        <div
          className="absolute flex items-center justify-center rounded-lg overflow-hidden border"
          style={{
            left: px(CARD_CONFIG.teamBox.x),
            top: px(CARD_CONFIG.teamBox.y),
            width: px(CARD_CONFIG.teamBox.width),
            height: px(CARD_CONFIG.teamBox.height),
            background: "rgba(10, 14, 20, 0.75)",
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "inset 0 0 15px rgba(239, 68, 68, 0.05)",
            zIndex: 20,
          }}
        >
          {/* Subtle Corner Brackets for Tech Aesthetic */}
          <div className="absolute left-1 top-1 w-2 h-2 border-l border-t border-red-500/40" />
          <div className="absolute right-1 top-1 w-2 h-2 border-r border-t border-red-500/40" />
          <div className="absolute left-1 bottom-1 w-2 h-2 border-l border-b border-red-500/40" />
          <div className="absolute right-1 bottom-1 w-2 h-2 border-r border-b border-red-500/40" />

          <span
            className="font-bold tracking-widest text-center px-4 truncate"
            style={{
              color: COLORS.red,
              fontSize: px(38),
              letterSpacing: "0.08em",
            }}
          >
            {formattedTeam}
          </span>
        </div>

        {/* Footer info (Bottom-Left) */}
        <div
          className="absolute flex flex-col"
          style={{
            left: px(CARD_CONFIG.footer.x),
            top: px(CARD_CONFIG.footer.baselineY),
            gap: px(6),
            zIndex: 20,
          }}
        >
          <span
            className="font-bold tracking-wider"
            style={{
              color: COLORS.white,
              fontSize: px(28),
              lineHeight: 1.2,
            }}
          >
            BUILDER @ HH GOA
          </span>
          <span
            style={{
              color: COLORS.gray,
              fontSize: px(24),
              lineHeight: 1.2,
            }}
          >
            GOA • OCT 28–31 • 2026
          </span>
          <span
            className="font-bold"
            style={{
              color: COLORS.gray,
              fontSize: px(24),
              lineHeight: 1.2,
            }}
          >
            #FrameInGoa
          </span>
        </div>
      </div>
    </div>
  );
}
