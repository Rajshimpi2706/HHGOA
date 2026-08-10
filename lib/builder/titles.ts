import type { Role } from "@/types";

// ─── Deterministic hash ───────────────────────────────────────────────────────
export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // convert to 32-bit int
  }
  return Math.abs(hash);
}

// ─── Title bank ──────────────────────────────────────────────────────────────
const ROLE_TITLES: Record<Role, string[]> = {
  CODE: ["STACK SURFER", "SHIP ENGINEER", "SYSTEM BUILDER", "RUNTIME ALCHEMIST"],
  AI: ["NEURAL CARTOGRAPHER", "MODEL WRANGLER", "SIGNAL SMITH", "INFERENCE ARCHITECT"],
  DESIGN: ["PIXEL ENGINEER", "INTERFACE ARCHITECT", "FORM SCULPTOR", "UX ALCHEMIST"],
  PRODUCT: ["PRODUCT ALCHEMIST", "SCOPE SURGEON", "ROADMAP ORACLE", "LOOP ENGINEER"],
  GROWTH: ["SIGNAL AMPLIFIER", "LOOP ENGINEER", "FUNNEL WIZARD", "MOMENTUM BUILDER"],
  WEB3: ["CHAIN ARCHITECT", "PROTOCOL BUILDER", "ONCHAIN OPERATOR", "CONSENSUS FORGER"],
  FOUNDER: ["ZERO → ONE BUILDER", "CHAOS CAPTAIN", "INFINITE GAMER", "VISION EXECUTOR"],
  OTHER: ["BUILDER", "MAKER", "CREATOR", "SYSTEM THINKER"],
};

export function getBuilderTitle(name: string, role: Role | null): string {
  if (!role) return "BUILDER";
  const titles = ROLE_TITLES[role] ?? ROLE_TITLES.OTHER;
  const seed = name.trim() || "builder";
  const index = hashString(`${seed}:${role}`) % titles.length;
  return titles[index];
}
