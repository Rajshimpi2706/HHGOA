"use client";

import type { BuilderDnaItem, FitMode, Orientation } from "@/types";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  IMAGE_AREA,
  COLORS,
} from "@/lib/renderer/cardConfig";

interface CardPreviewProps {
  imageUrl: string | null;
  name: string;
  role: string | null;
  builderTitle: string;
  dna: BuilderDnaItem[];
  signalId: string;
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
  builderTitle,
  dna,
  signalId,
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
          fontFamily: "'Space Mono', 'Courier New', monospace",
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
        {/* Subtle top glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 30% at 50% 0%, rgba(183,255,0,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Header */}
        <div
          className="absolute flex items-baseline gap-1"
          style={{
            left: px(60),
            top: px(47),
            fontSize: px(32),
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          <span style={{ color: COLORS.accent }}>HH GOA</span>
          <span style={{ color: COLORS.footerText, margin: `0 ${px(6)}` }}>//</span>
          <span style={{ color: COLORS.white }}>2026</span>
        </div>

        {/* Photo area */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: px(IMAGE_AREA.x),
            top: px(IMAGE_AREA.y),
            width: px(IMAGE_AREA.width),
            height: px(IMAGE_AREA.height),
            borderRadius: px(IMAGE_AREA.radius),
            border: `1px solid ${COLORS.imageFrameBorder}`,
            background: COLORS.surface,
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
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
                  background: COLORS.imageFrameBorder,
                }}
              >
                <svg
                  style={{ width: px(32), height: px(32), color: COLORS.dnaLabel }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <span
                style={{
                  color: COLORS.footerText,
                  fontSize: px(18),
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Upload Photo
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <div
          className="absolute font-bold truncate"
          style={{
            left: px(60),
            top: px(900),
            right: px(60),
            fontSize: px(56),
            color: COLORS.nameText,
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          {name.trim() ? name.toUpperCase() : (
            <span style={{ color: COLORS.footerText }}>YOUR NAME</span>
          )}
        </div>

        {/* Role badge */}
        <div
          className="absolute"
          style={{
            left: px(60),
            top: px(975),
            fontSize: px(24),
            color: COLORS.roleText,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          {role ? `[ ${role} ]` : <span style={{ color: COLORS.footerText }}>[ SELECT ROLE ]</span>}
        </div>

        {/* Builder title */}
        <div
          className="absolute"
          style={{
            left: px(60),
            top: px(1015),
            fontSize: px(21),
            color: COLORS.titleText,
            letterSpacing: "0.06em",
          }}
        >
          {builderTitle}
        </div>

        {/* DNA bars */}
        <div
          className="absolute flex flex-col"
          style={{
            left: px(60),
            top: px(1068),
            gap: px(22),
            width: px(960),
          }}
        >
          {dna.map((item) => (
            <div key={item.label} className="flex items-center" style={{ gap: px(10) }}>
              <span
                style={{
                  fontSize: px(15),
                  color: COLORS.dnaLabel,
                  width: px(90),
                  letterSpacing: "0.1em",
                }}
              >
                {item.label}
              </span>
              <div
                className="relative rounded-full overflow-hidden"
                style={{
                  flex: 1,
                  maxWidth: px(280),
                  height: px(5),
                  background: COLORS.dnaBarBg,
                }}
              >
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${(item.value / 99) * 100}%`,
                    background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentDim})`,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: px(15),
                  color: COLORS.dnaValue,
                  fontWeight: 700,
                  width: px(32),
                  textAlign: "right",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Signal ID */}
        <div
          className="absolute flex items-baseline"
          style={{
            left: px(60),
            bottom: px(68),
            fontSize: px(18),
            letterSpacing: "0.08em",
          }}
        >
          <span style={{ color: COLORS.signalLabel }}>SIGNAL // </span>
          <span style={{ color: COLORS.accent, marginLeft: px(4) }}>{signalId}</span>
        </div>

        {/* Footer */}
        <div
          className="absolute flex items-center"
          style={{
            left: px(60),
            bottom: px(34),
            fontSize: px(16),
            letterSpacing: "0.06em",
            gap: px(8),
          }}
        >
          <span style={{ color: COLORS.footerText }}>#FrameInGoa</span>
          <span style={{ color: COLORS.divider }}>·</span>
          <span style={{ color: COLORS.accent }}>SHIP &gt; TALK</span>
        </div>
      </div>
    </div>
  );
}
