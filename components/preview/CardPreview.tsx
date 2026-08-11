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

  const formattedName = name.trim() ? name.toUpperCase() : "ALEX CHEN";
  const formattedRole = role.trim() ? role.toUpperCase() : "DEVELOPER";
  const formattedTeam = team.trim() ? team.toUpperCase() : "CODERUSH";

  // Prepend prefixes if not already present
  const displayRole = formattedRole.startsWith("ROLE -") ? formattedRole : `ROLE - ${formattedRole}`;
  const displayTeam = formattedTeam.startsWith("TEAM -") ? formattedTeam : `TEAM - ${formattedTeam}`;

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Outer card wrapper that enforces standard 2:3 aspect ratio */}
      <div 
        className="relative bg-[#0e0e0f] border border-white/10 rounded-lg overflow-hidden shadow-2xl aspect-[2/3] circuit-bg circuit-lines flex flex-col p-6 items-center justify-between w-full" 
        id="card-preview"
      >
        {/* Top Text */}
        <div className="w-full text-left z-10 mt-2">
          <span className="text-white font-bold text-xl tracking-widest block">HH GOA 2026</span>
          <div className="h-[1px] w-full bg-white/20 mt-2"></div>
        </div>

        {/* Photo Placeholder */}
        <div className="relative w-32 h-32 bg-[#202021] border-2 border-white/10 overflow-hidden z-10 mt-6 shrink-0">
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
            // Default reference image from mockup
            <img 
              alt="User Photo" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyjgujgm984Me0dmVhjAnqU3q7AnTEArkZpdDQHPYwFtiyf6yQ2EjnCfdc9A8PUQKQpvWmGeFwoTFzJtcwwkPSTuw1mwmIR7J2go3pvrkyzOvCm4oHh8TBfVTPT9DWO8Sm3fWwikCqk2AWM_vxq6I3zF2x0KOU24mVYWK1R2HL8l9yE_8lYKDhlmbnqu31w4-YeDQUD-SOseZrAw4oX3foKtbemP-TjDw6R2h1wmMe5G5u9lqGW-O1"
            />
          )}
        </div>

        {/* User Details */}
        <div className="text-center z-10 flex flex-col items-center mt-4 w-full space-y-1">
          <h3 className="text-white font-bold text-2xl uppercase tracking-wider truncate max-w-full" id="preview-name">
            {formattedName}
          </h3>
          <p className="text-white/80 text-sm tracking-widest" id="preview-participant">
            PARTICIPANT
          </p>
          <p className="text-white font-semibold text-sm tracking-wider truncate max-w-full" id="preview-role">
            {displayRole}
          </p>
        </div>

        {/* Team Tag */}
        <div className="w-full border border-white/20 bg-white/5 py-2 px-4 text-center mt-4 z-10 rounded shrink-0">
          <p className="text-[#ff4d4d] font-bold text-sm tracking-widest uppercase truncate" id="preview-team">
            {displayTeam}
          </p>
        </div>

        {/* Footer Text */}
        <div className="w-full text-left z-10 mt-8 mb-2">
          <div className="h-[1px] w-full bg-white/20 mb-2"></div>
          <p className="text-white/60 text-xs tracking-wider">BUILDER @ HH GOA</p>
          <p className="text-white/60 text-xs tracking-wider">GOA • OCT 28-31 • 2026</p>
          <p className="text-white/60 text-xs tracking-wider">#InGoa</p>
        </div>
      </div>
    </div>
  );
}
