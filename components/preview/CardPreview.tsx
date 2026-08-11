"use client";

import type { FitMode, Orientation } from "@/types";

interface CardPreviewProps {
  imageUrl: string | null;
  name: string;
  role: string;
  team: string;
  fitMode: FitMode;
  orientation: Orientation | null;
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

  const formattedName = name.trim() ? name.toUpperCase() : "OUR NAME";
  const formattedRole = role.trim() ? role.toUpperCase() : "ROLE";
  const formattedTeam = team.trim() ? team.toUpperCase() : "TEAM NAME";

  // Prepend prefixes if not already present
  const displayRole = formattedRole.startsWith("ROLE -") ? formattedRole : `ROLE - ${formattedRole}`;
  const displayTeam = formattedTeam.startsWith("TEAM -") ? formattedTeam : `TEAM - ${formattedTeam}`;

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Outer card wrapper that enforces standard 2:3 aspect ratio */}
      <div
        className="relative bg-[#090b0e] border border-[#1e293b] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] aspect-[2/3] circuit-bg flex flex-col p-6 items-center justify-between w-full transition-all duration-300 hover:shadow-[0_0_60px_rgba(183,255,0,0.15)] group"
        id="card-preview"
      >
        {/* Neon green top edge glow line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#B7FF00]/50 to-transparent" />

        {/* ── HIGH TECH SVG CIRCUIT PATTERNS IN ALL FOUR CORNERS ── */}


        {/* Top-Right Corner Circuit */}
        <svg className="absolute top-4 right-4 w-50 h-50 text-[#B7FF00]/25 pointer-events-none z-0" viewBox="0 0 100 100" fill="none">
          <path d="M 100 40 L 100 0 L 60 0" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 92 50 L 92 8 L 50 8" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="50" cy="8" r="2" fill="currentColor" />
          <path d="M 100 20 L 84 20 L 72 32 L 72 55" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="72" cy="55" r="2" fill="currentColor" />
        </svg>

        {/* Bottom-Left Corner Circuit
        <svg className="absolute bottom-4 left-4 w-40 h-40 text-[#B7FF00]/25 pointer-events-none z-0" viewBox="0 0 100 100" fill="none">
          <path d="M 0 60 L 0 100 L 40 100" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 8 50 L 8 92 L 50 92" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="50" cy="92" r="2" fill="currentColor" />
          <path d="M 0 80 L 16 80 L 28 68 L 28 45" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="28" cy="45" r="2" fill="currentColor" />
        </svg> */}

        {/* Bottom-Right Corner Circuit */}
        <svg className="absolute bottom-4 right-4 w-50 h-50 text-[#B7FF00]/25 pointer-events-none z-0" viewBox="0 0 100 100" fill="none">
          <path d="M 100 60 L 100 100 L 60 100" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 92 50 L 92 92 L 50 92" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="50" cy="92" r="2" fill="currentColor" />
          <path d="M 100 80 L 84 80 L 72 68 L 72 45" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="72" cy="45" r="2" fill="currentColor" />
        </svg>

        {/* Top Header */}
        <div className="w-full text-left z-10 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold text-xl tracking-[0.2em] font-sans block drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
              HH GOA 2026
            </span>
            {/* <span className="text-[9px] font-mono text-[#B7FF00] tracking-widest bg-[#B7FF00]/10 px-2 py-0.5 rounded border border-[#B7FF00]/20 uppercase">
              HACKER
            </span> */}
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-white/30 via-white/10 to-transparent mt-2"></div>
        </div>

        {/* High-Tech Photo Container */}
        <div className="relative w-45 h-45 bg-[#12161b] border border-white/10 p-1 overflow-hidden z-10 mt-4 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-[#B7FF00]/30 shrink-0">
          {/* Futuristic crosshairs on corners */}
          <div className="absolute top-1 left-1 w-2.5 h-2.5 border-l border-t border-[#B7FF00]" />
          <div className="absolute top-1 right-1 w-2.5 h-2.5 border-r border-t border-[#B7FF00]" />
          <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-l border-b border-[#B7FF00]" />
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-r border-b border-[#B7FF00]" />

          <div className="w-full h-full rounded-lg overflow-hidden relative bg-[#1c222a]">
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
                    }}
                  />
                )}
                <img
                  src={imageUrl}
                  alt="User Photo"
                  className="w-full h-full"
                  style={{
                    objectFit: getObjectFit(),
                    objectPosition: getObjectPosition(),
                  }}
                  draggable={false}
                />
              </>
            ) : (
              // High tech placeholder icon
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/30 bg-[#161a20]">
                <svg className="w-10 h-10 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span className="text-[9px] font-mono tracking-widest uppercase">SCAN PHOTO</span>
              </div>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="text-center z-10 flex flex-col items-center mt-3 w-full space-y-1">
          {/* Name with cool line decoration underneath */}
          <div className="space-y-1.5 w-full">
            <h3 className="text-white font-bold text-2xl uppercase tracking-widest truncate max-w-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              {formattedName}
            </h3>
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#B7FF00]/40 to-transparent mx-auto"></div>
          </div>

          <p className="text-white/80 text-[10px] font-bold tracking-[0.35em] mt-1.5">
            PARTICIPANT
          </p>
          <p className="text-[#B7FF00]/90 font-mono font-medium text-xs tracking-widest truncate max-w-full uppercase">
            {displayRole}
          </p>
        </div>

        {/* Team Tag with futuristic glow / holographic design */}
        <div className="w-full border border-red-500/20 bg-red-950/15 py-2.5 px-4 text-center mt-3 z-10 rounded-xl relative shadow-[0_0_15px_rgba(239,68,68,0.05)] transition-all duration-300 group-hover:border-red-500/45 group-hover:bg-red-950/25 shrink-0">
          {/* Double technical mini corner bracket borders */}
          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 border-l border-t border-red-500/40" />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-r border-t border-red-500/40" />
          <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 border-l border-b border-red-500/40" />
          <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 border-r border-b border-red-500/40" />

          <p className="text-[#ff4d4d] font-bold text-sm tracking-[0.15em] uppercase truncate drop-shadow-[0_0_8px_rgba(239,68,68,0.1)]">
            {displayTeam}
          </p>
        </div>

        {/* Footer Text */}
        <div className="w-full text-left z-10 mt-6 mb-1">
          <div className="h-[1px] w-full bg-gradient-to-r from-white/30 via-white/10 to-transparent mb-2.5"></div>
          <div className="space-y-0.5">
            <p className="text-white/60 text-[10px] tracking-widest uppercase font-mono">BUILDER @ HH GOA</p>
            <p className="text-white/40 text-[9px] tracking-widest uppercase font-mono">GOA • OCT 28-31 • 2026</p>
            <p className="text-[#B7FF00]/70 text-[10px] font-bold tracking-widest uppercase font-mono">#FrameInGoa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
