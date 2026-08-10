"use client";

import type { Role } from "@/types";
import { ROLES } from "@/lib/builder/roles";

interface BuilderFormProps {
  name: string;
  role: Role | null;
  onNameChange: (name: string) => void;
  onRoleChange: (role: Role) => void;
}

export function BuilderForm({
  name,
  role,
  onNameChange,
  onRoleChange,
}: BuilderFormProps) {
  return (
    <div className="space-y-6">
      {/* Name input */}
      <div className="space-y-2">
        <label
          htmlFor="builder-name"
          className="block font-mono text-xs tracking-widest text-[#475569] uppercase"
        >
          Your Name
        </label>
        <input
          id="builder-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          maxLength={30}
          placeholder="Your name"
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          className={[
            "w-full bg-[#0F1519] border rounded-xl px-4 py-3.5",
            "font-mono text-base sm:text-lg font-bold tracking-wider uppercase",
            "text-white placeholder:text-[#1E2D3A] placeholder:normal-case placeholder:font-normal",
            "outline-none transition-all duration-200",
            "border-[#1E2D3A] focus:border-[#B7FF00] focus:shadow-[0_0_0_3px_rgba(183,255,0,0.08)]",
            // Prevent iOS zoom on input focus (font-size must be ≥ 16px)
          ].join(" ")}
          style={{ fontSize: "16px", touchAction: "manipulation" }}
        />
        <div className="flex justify-end">
          <span className="font-mono text-xs text-[#1E2D3A] tabular-nums">
            {name.length}/30
          </span>
        </div>
      </div>

      {/* Role selector */}
      <div className="space-y-3">
        <p className="font-mono text-xs tracking-widest text-[#475569] uppercase">
          Your Role
        </p>
        {/* 2 columns on mobile, 4 on sm+ for thumb-friendly tap targets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ROLES.map((r) => (
            <button
              key={r}
              id={`role-${r.toLowerCase()}`}
              type="button"
              onClick={() => onRoleChange(r)}
              className={[
                "py-3.5 rounded-xl font-mono text-xs font-bold tracking-widest uppercase",
                "border transition-all duration-150",
                // Minimum 44px height for mobile touch targets
                "min-h-[48px]",
                role === r
                  ? "bg-[#B7FF00] text-[#080C10] border-[#B7FF00] shadow-[0_0_16px_rgba(183,255,0,0.3)]"
                  : "bg-transparent text-[#64748B] border-[#1E2D3A] active:border-[#B7FF00] active:text-[#B7FF00] hover:border-[#B7FF00]/40 hover:text-[#94A3B8]",
              ].join(" ")}
              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
