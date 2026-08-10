import type { BuilderDnaItem, Role } from "@/types";
import { hashString } from "./titles";

// ─── DNA labels ───────────────────────────────────────────────────────────────
const DNA_LABELS = ["SHIP", "SYSTEMS", "AI", "CHAOS", "COFFEE"];

function seededScore(seed: string, label: string): number {
  const value = hashString(`${seed}:${label}`);
  return 60 + (value % 40); // 60 to 99
}

export function getBuilderDna(name: string, role: Role | null): BuilderDnaItem[] {
  const seed = `${name.trim() || "builder"}:${role ?? "OTHER"}`;
  return DNA_LABELS.map((label) => ({
    label,
    value: seededScore(seed, label),
  }));
}
