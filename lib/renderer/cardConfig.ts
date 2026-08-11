/**
 * Shared configuration for Card Preview and Canvas Export.
 * Standardizes 1000 × 1500 px design bounds (2:3 aspect ratio).
 */

export const CARD_WIDTH = 1000;
export const CARD_HEIGHT = 1500;

export const COLORS = {
  background: "#0B0D12",
  white: "#FFFFFF",
  gray: "#94A3B8",
  red: "#EF4444",
};

export const CARD_CONFIG = {
  width: 1000,
  height: 1500,

  photo: {
    x: 320,
    y: 325,
    width: 360,
    height: 410,
    radius: 8,
  },

  name: {
    centerX: 500,
    baselineY: 850,
  },

  participant: {
    centerX: 500,
    baselineY: 905,
  },

  role: {
    centerX: 500,
    baselineY: 965,
  },

  teamBox: {
    x: 60,
    y: 1040,
    width: 880,
    height: 110,
  },

  footer: {
    x: 55,
    baselineY: 1325,
  },
};
