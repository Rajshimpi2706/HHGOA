import type { Role } from "@/types";
import { hashString } from "./titles";

export function getSignalId(name: string, role: Role | null): string {
  const seed = `${name.trim() || "builder"}:${role ?? "OTHER"}:hhgoa2026`;
  const hash = hashString(seed);
  const hex = hash.toString(16).toUpperCase().padStart(8, "0");
  return hex.slice(0, 4);
}
