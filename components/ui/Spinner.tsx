"use client";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

export function Spinner({ size = "md", label }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2 text-[#B7FF00]" role="status">
      <span
        className={[
          sizeMap[size],
          "border-[#B7FF00] border-t-transparent rounded-full animate-spin inline-block",
        ].join(" ")}
      />
      {label && (
        <span className="text-[#94A3B8] font-mono text-xs tracking-widest uppercase">
          {label}
        </span>
      )}
    </span>
  );
}
