"use client";

import React, { useCallback, useRef, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";

interface DropzoneProps {
  onFile: (file: File) => void;
  isProcessing?: boolean;
  hasImage?: boolean;
  currentUrl?: string | null;
}

export function Dropzone({ onFile, isProcessing = false, hasImage = false, currentUrl }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFile(files[0]);
    },
    [onFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <>
      {/* 
        The <label> wrapping pattern is the most reliable way to trigger
        file input on all mobile browsers (iOS Safari, Android Chrome).
        A div with onClick → input.click() can fail silently on mobile.
      */}
      <label
        htmlFor="photo-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "relative group flex flex-col items-center justify-center gap-4",
          "w-full rounded-2xl border-2 border-dashed transition-all duration-300",
          "cursor-pointer select-none",
          // touch-action prevents 300ms tap delay on mobile
          "touch-action-manipulation",
          isProcessing
            ? "pointer-events-none opacity-70 border-[#B7FF00]/40 bg-[#0F1519]"
            : isDragging
            ? "border-[#B7FF00] bg-[#B7FF00]/5 scale-[1.01]"
            : "border-[#1E2D3A] active:border-[#B7FF00] active:bg-[#B7FF00]/5 hover:border-[#B7FF00]/50 hover:bg-[#0F1519] bg-[#080C10]",
          hasImage ? "py-4 sm:py-5 px-4" : "py-12 sm:py-16",
        ].join(" ")}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
      >
        {/* File input — visible to label, hidden visually */}
        <input
          ref={inputRef}
          type="file"
          id="photo-upload"
          accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,image/webp,.heic,.heif"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ fontSize: "0", zIndex: 10 }}
          onChange={(e) => {
            handleFiles(e.target.files);
            // Reset value so the same file can be re-selected
            e.target.value = "";
          }}
        />

        {isProcessing ? (
          <Spinner size="md" label="Preparing image..." />
        ) : hasImage ? (
          <div className="flex items-center justify-between w-full pointer-events-none gap-3">
            <div className="flex items-center gap-3">
              {currentUrl && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#B7FF00]/40 shrink-0 bg-[#1E2D3A]">
                  <img
                    src={currentUrl}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                  Photo Loaded
                </span>
                <span className="font-mono text-[10px] text-[#B7FF00] tracking-widest uppercase">
                  ✓ Ready for signal
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8] group-hover:text-white transition-colors bg-[#1E2D3A]/60 px-3 py-1.5 rounded-lg border border-[#1E2D3A]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="font-mono text-xs tracking-widest uppercase font-bold">
                Change
              </span>
            </div>
          </div>
        ) : (
          <div className="pointer-events-none flex flex-col items-center gap-4">
            {/* Icon */}
            <div
              className={[
                "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center",
                "border-2 border-[#1E2D3A] group-hover:border-[#B7FF00]/50",
                "transition-all duration-300",
                isDragging ? "border-[#B7FF00] bg-[#B7FF00]/10" : "bg-[#0F1519]",
              ].join(" ")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isDragging ? "text-[#B7FF00]" : "text-[#475569] group-hover:text-[#B7FF00]/70 transition-colors"}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="text-center space-y-1.5">
              <p className="font-mono font-bold text-sm sm:text-base tracking-widest text-[#CBD5E1] uppercase">
                Tap to upload photo
              </p>
              <p className="font-mono text-[10px] sm:text-xs text-[#475569] tracking-widest uppercase">
                JPG · PNG · HEIC · max 15 MB
              </p>
            </div>
          </div>
        )}
      </label>
    </>
  );
}
