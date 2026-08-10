"use client";

import React from "react";

type Variant = "primary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[#B7FF00] text-[#080C10] font-bold hover:bg-[#CCFF33] active:bg-[#9EE000] shadow-[0_0_20px_rgba(183,255,0,0.25)]",
  ghost:
    "bg-transparent border border-[#1E2D3A] text-[#94A3B8] hover:border-[#B7FF00] hover:text-[#B7FF00]",
  accent:
    "bg-transparent border border-[#B7FF00] text-[#B7FF00] hover:bg-[#B7FF00] hover:text-[#080C10]",
  danger:
    "bg-transparent border border-red-500 text-red-400 hover:bg-red-500 hover:text-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-mono",
        "tracking-wider uppercase transition-all duration-200",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
