"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import type { FitMode } from "@/types";
import { Button } from "@/components/ui/Button";

interface CropModalProps {
  imageUrl: string;
  fitMode: FitMode;
  onFitModeChange: (mode: FitMode) => void;
  onApply: (croppedAreaPixels: Area) => void;
  onReset: () => void;
  onClose: () => void;
  hasCrop: boolean;
}

export function CropModal({
  imageUrl,
  fitMode,
  onFitModeChange,
  onApply,
  onReset,
  onClose,
  hasCrop,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = () => {
    if (croppedAreaPixels) {
      onApply(croppedAreaPixels);
    }
  };

  return (
    // Backdrop — covers viewport, prevents scroll
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(4px)",
        // Prevent background scroll on mobile
        touchAction: "none",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "#0F1519",
          border: "1px solid #1E2D3A",
          borderBottom: "none",
          maxHeight: "95vh",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#1E2D3A]">
          <h2 className="font-mono font-bold text-xs sm:text-sm tracking-widest text-[#CBD5E1] uppercase">
            Adjust Photo
          </h2>
          <button
            onClick={onClose}
            aria-label="Close crop modal"
            className="text-[#475569] hover:text-white transition-colors text-2xl leading-none p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ touchAction: "manipulation" }}
          >
            ×
          </button>
        </div>

        {/* Fit mode toggle */}
        <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border-b border-[#1E2D3A]">
          <span className="font-mono text-[10px] text-[#475569] uppercase tracking-widest mr-1">
            Fit:
          </span>
          {(["smart-fit", "fill"] as FitMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onFitModeChange(mode)}
              className={[
                "px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-widest",
                "border transition-all duration-150 min-h-[36px]",
                fitMode === mode
                  ? "bg-[#B7FF00] text-[#080C10] border-[#B7FF00] font-bold"
                  : "text-[#64748B] border-[#1E2D3A] active:border-[#B7FF00]",
              ].join(" ")}
              style={{ touchAction: "manipulation" }}
            >
              {mode === "smart-fit" ? "Smart Fit" : "Fill"}
            </button>
          ))}
        </div>

        {/* Crop area — fills available space, minimum 280px on small phones */}
        <div className="relative flex-1" style={{ minHeight: 280, maxHeight: 400 }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={360 / 410}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { background: "#080C10" },
              cropAreaStyle: {
                border: "2px solid #B7FF00",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
              },
            }}
          />
        </div>

        {/* Zoom control */}
        <div className="px-4 sm:px-5 py-3 border-t border-[#1E2D3A]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[#475569] uppercase tracking-widest w-10">
              Zoom
            </span>
            <input
              type="range"
              id="crop-zoom"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-[#B7FF00] cursor-pointer h-6"
              style={{ touchAction: "none" }}
            />
            <span className="font-mono text-xs text-[#64748B] w-10 text-right tabular-nums">
              {zoom.toFixed(1)}×
            </span>
          </div>
        </div>

        {/* Action buttons — stacked on very small screens */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-t border-[#1E2D3A]">
          <div className="flex gap-2">
            {hasCrop && (
              <Button variant="ghost" size="md" onClick={onReset}>
                ↺ Reset
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleApply}
              disabled={!croppedAreaPixels}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Safe area bottom padding for phones with gesture bar */}
        <div className="h-safe-area-bottom sm:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} />
      </div>
    </div>
  );
}
