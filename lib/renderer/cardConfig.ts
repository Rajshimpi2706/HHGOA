/**
 * CardConfig — single source of truth for all layout values.
 * Used by BOTH the HTML preview (scaled down) and the Canvas renderer (actual px).
 *
 * Final output: 1080 × 1350 (4:5 ratio, good for X / Instagram / LinkedIn)
 */

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1350;

// ─── Color palette ────────────────────────────────────────────────────────────
export const COLORS = {
  background: "#080C10",        // near-black with slight blue tint
  surface: "#0F1519",           // card surface
  imageFrameBorder: "#1A2530",  // subtle border around photo
  accent: "#B7FF00",            // electric lime — primary accent
  accentDim: "#8BBF00",         // dimmed lime
  white: "#FFFFFF",
  nameText: "#FFFFFF",
  roleText: "#B7FF00",
  titleText: "#94A3B8",
  footerText: "#475569",
  dnaBar: "#B7FF00",
  dnaBarBg: "#1A2530",
  dnaLabel: "#64748B",
  dnaValue: "#94A3B8",
  headerText: "#B7FF00",
  signalLabel: "#475569",
  signalValue: "#B7FF00",
  divider: "#1E2D3A",
};

// ─── Layout areas (at full 1080×1350) ─────────────────────────────────────────

// Photo frame — occupies top portion of card
export const IMAGE_AREA = {
  x: 60,
  y: 120,
  width: 960,
  height: 740,
  radius: 20,
};

// Text content zone below photo
export const TEXT_ZONE = {
  x: 60,
  paddingRight: 60,
};

// Name
export const NAME_CONFIG = {
  x: 60,
  y: 930,
  font: "bold 68px 'Space Mono', 'Courier New', monospace",
  maxWidth: 960,
};

// Role badge
export const ROLE_CONFIG = {
  x: 60,
  y: 1010,
  font: "700 30px 'Space Mono', 'Courier New', monospace",
};

// Builder title
export const TITLE_CONFIG = {
  x: 60,
  y: 1055,
  font: "400 26px 'Space Mono', 'Courier New', monospace",
};

// DNA bars
export const DNA_CONFIG = {
  startX: 60,
  startY: 1110,
  barHeight: 6,
  barRadius: 3,
  rowSpacing: 28,
  labelFont: "400 18px 'Space Mono', 'Courier New', monospace",
  valueFont: "700 18px 'Space Mono', 'Courier New', monospace",
  barWidth: 340,
  labelWidth: 110,
  valueWidth: 50,
};

// Signal ID  
export const SIGNAL_CONFIG = {
  x: 60,
  y: 1265,
  font: "400 22px 'Space Mono', 'Courier New', monospace",
};

// Footer hashtag + slogan
export const FOOTER_CONFIG = {
  x: 60,
  y: 1310,
  font: "400 20px 'Space Mono', 'Courier New', monospace",
};

// Header: "HH GOA // 2026"
export const HEADER_CONFIG = {
  x: 60,
  y: 75,
  font: "700 32px 'Space Mono', 'Courier New', monospace",
};
