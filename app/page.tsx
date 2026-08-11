"use client";

import { useCallback, useState } from "react";
import type { Area } from "react-easy-crop";

import type { ImageState, BuilderState, FitMode } from "@/types";
import { validateFile, isHeicFile } from "@/lib/image/validateFile";
import { convertHeicToJpeg } from "@/lib/image/convertHeic";
import { normalizeImage } from "@/lib/image/normalizeImage";
import { getOrientation } from "@/lib/image/orientation";
import { cropImage } from "@/lib/image/cropImage";

import { Dropzone } from "@/components/upload/Dropzone";
import { CardPreview } from "@/components/preview/CardPreview";
import { BuilderForm } from "@/components/form/BuilderForm";
import { CropModal } from "@/components/crop/CropModal";
import { ShareButtons } from "@/components/share/ShareButtons";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Button } from "@/components/ui/Button";

// ─── Initial state ─────────────────────────────────────────────────────────────

const INITIAL_IMAGE_STATE: ImageState = {
  sourceFile: null,
  sourceUrl: null,
  normalizedUrl: null,
  normalizedWidth: 0,
  normalizedHeight: 0,
  currentUrl: null,
  crop: null,
  orientation: null,
  fitMode: "smart-fit",
  isProcessing: false,
  error: null,
};

const INITIAL_BUILDER_STATE: BuilderState = {
  name: "",
  role: "",
  team: "",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [imageState, setImageState] = useState<ImageState>(INITIAL_IMAGE_STATE);
  const [builderState, setBuilderState] = useState<BuilderState>(INITIAL_BUILDER_STATE);
  const [showCropModal, setShowCropModal] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"edit" | "preview">("edit");

  // ── Image upload pipeline ──────────────────────────────────────────────────

  const handleFile = useCallback(async (file: File) => {
    // 1. Validate
    const validation = validateFile(file);
    if (!validation.ok) {
      setImageState((prev) => ({ ...prev, error: validation.error }));
      return;
    }

    // 2. Start processing
    setImageState((prev) => ({
      ...prev,
      isProcessing: true,
      error: null,
    }));

    try {
      // 3. Convert HEIC if needed
      let processable: File | Blob = file;
      if (isHeicFile(file)) {
        processable = await convertHeicToJpeg(file);
      }

      // 4. Normalize (fix EXIF, resize to max 2048px)
      const { url, width, height } = await normalizeImage(processable);

      // 5. Detect orientation
      const orientation = getOrientation(width, height);

      // 6. Set state — currentUrl = normalizedUrl (no crop yet)
      const sourceUrl = URL.createObjectURL(file);
      setImageState({
        sourceFile: file,
        sourceUrl,
        normalizedUrl: url,
        normalizedWidth: width,
        normalizedHeight: height,
        currentUrl: url,
        crop: null,
        orientation,
        fitMode: "smart-fit",
        isProcessing: false,
        error: null,
      });
    } catch (err) {
      console.error("Image processing error:", err);
      setImageState((prev) => ({
        ...prev,
        isProcessing: false,
        error: "Failed to process image. Please try a different file.",
      }));
    }
  }, []);

  // ── Crop handlers ──────────────────────────────────────────────────────────

  const handleCropApply = useCallback(
    async (croppedAreaPixels: Area) => {
      if (!imageState.normalizedUrl) return;
      try {
        const croppedUrl = await cropImage(imageState.normalizedUrl, {
          x: croppedAreaPixels.x,
          y: croppedAreaPixels.y,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height,
        });
        setImageState((prev) => ({
          ...prev,
          currentUrl: croppedUrl,
          crop: {
            x: croppedAreaPixels.x,
            y: croppedAreaPixels.y,
            width: croppedAreaPixels.width,
            height: croppedAreaPixels.height,
          },
        }));
        setShowCropModal(false);
      } catch (err) {
        console.error("Crop error:", err);
      }
    },
    [imageState.normalizedUrl]
  );

  const handleCropReset = useCallback(() => {
    setImageState((prev) => ({
      ...prev,
      currentUrl: prev.normalizedUrl,
      crop: null,
    }));
    setShowCropModal(false);
  }, []);

  const handleFitModeChange = useCallback((mode: FitMode) => {
    setImageState((prev) => ({ ...prev, fitMode: mode }));
  }, []);

  // ── Builder form handlers ──────────────────────────────────────────────────

  const handleNameChange = useCallback((name: string) => {
    setBuilderState((prev) => ({ ...prev, name }));
  }, []);

  const handleRoleChange = useCallback((role: string) => {
    setBuilderState((prev) => ({ ...prev, role }));
  }, []);

  const handleTeamChange = useCallback((team: string) => {
    setBuilderState((prev) => ({ ...prev, team }));
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────

  const hasImage = !!imageState.currentUrl;
  const isReady = hasImage && !!builderState.name.trim() && !!builderState.role.trim() && !!builderState.team.trim();

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#080C10]">
      {/* ── Header bar ───────────────────────────────────────────────────── */}
      <header className="border-b border-[#1E2D3A] sticky top-0 z-40 bg-[#080C10]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-[#B7FF00] font-bold text-base sm:text-lg tracking-widest">
              HH GOA
            </span>
            <span className="text-[#1E2D3A] text-sm">//</span>
            <span className="text-white font-bold text-base sm:text-lg tracking-widest">
              2026
            </span>
          </div>
          <span className="font-mono text-[10px] sm:text-xs text-[#475569] tracking-widest uppercase">
            Builder Signal
          </span>
        </div>
      </header>

      {/* ── Hero — compact on mobile ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pt-6 sm:pt-10 pb-4 sm:pb-6 text-center">
        <p className="font-mono text-[10px] sm:text-xs tracking-widest text-[#B7FF00] uppercase mb-2">
          // Builder Identity
        </p>
        <h1 className="font-mono font-bold text-2xl sm:text-4xl text-white tracking-tight mb-2">
          Build Your Signal
        </h1>
        <p className="font-mono text-xs sm:text-sm text-[#475569] max-w-sm mx-auto">
          Upload a photo. Fill in details. Download your Builder Signal.
        </p>
      </section>

      {/* ── Mobile View Switcher (Visible only on mobile screens < lg) ───── */}
      <div className="max-w-5xl mx-auto px-4 mb-6 lg:hidden">
        <div className="flex items-center bg-[#0F1519] p-1 rounded-xl border border-[#1E2D3A]">
          <button
            type="button"
            onClick={() => setActiveMobileTab("edit")}
            className={[
              "flex-1 py-2 px-3 rounded-lg font-mono text-xs uppercase tracking-widest transition-all",
              activeMobileTab === "edit"
                ? "bg-[#B7FF00] text-[#080C10] font-bold shadow-md"
                : "text-[#64748B] hover:text-white",
            ].join(" ")}
          >
            ✏ Edit Details
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab("preview")}
            className={[
              "flex-1 py-2 px-3 rounded-lg font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-1.5",
              activeMobileTab === "preview"
                ? "bg-[#B7FF00] text-[#080C10] font-bold shadow-md"
                : "text-[#64748B] hover:text-white",
            ].join(" ")}
          >
            🎴 Card Preview
            {hasImage && (
              <span className="w-2 h-2 rounded-full bg-[#B7FF00] animate-ping inline-block" />
            )}
          </button>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pb-24 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">

          {/* ── Left column: controls ────────────────── */}
          <div
            className={[
              "space-y-5 sm:space-y-6",
              activeMobileTab === "edit" ? "block" : "hidden lg:block",
            ].join(" ")}
          >

            {/* Error banner */}
            {imageState.error && (
              <ErrorBanner
                message={imageState.error}
                onDismiss={() =>
                  setImageState((prev) => ({ ...prev, error: null }))
                }
              />
            )}

            {/* Upload zone */}
            <section aria-label="Upload photo">
              <Dropzone
                onFile={handleFile}
                isProcessing={imageState.isProcessing}
                hasImage={hasImage}
                currentUrl={imageState.currentUrl}
              />
            </section>

            {/* Builder form */}
            <section aria-label="Builder details">
              <BuilderForm
                name={builderState.name}
                role={builderState.role}
                team={builderState.team}
                onNameChange={handleNameChange}
                onRoleChange={handleRoleChange}
                onTeamChange={handleTeamChange}
              />
            </section>

            {/* Photo adjustment (only when image is ready) */}
            {hasImage && (
              <section aria-label="Photo adjustments">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    id="adjust-photo"
                    variant="ghost"
                    size="md"
                    onClick={() => setShowCropModal(true)}
                  >
                    ✂ Adjust Photo
                  </Button>
                  {imageState.crop && (
                    <Button
                      id="reset-crop"
                      variant="ghost"
                      size="md"
                      onClick={handleCropReset}
                    >
                      ↺ Reset Crop
                    </Button>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    {(["smart-fit", "fill"] as FitMode[]).map((mode) => (
                      <button
                        key={mode}
                        id={`fit-${mode}`}
                        type="button"
                        onClick={() => handleFitModeChange(mode)}
                        className={[
                          "px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-widest",
                          "border transition-all duration-150 min-h-[40px]",
                          imageState.fitMode === mode
                            ? "bg-[#B7FF00] text-[#080C10] border-[#B7FF00] font-bold"
                            : "text-[#475569] border-[#1E2D3A] active:border-[#B7FF00] hover:border-[#B7FF00]/40 hover:text-[#94A3B8]",
                        ].join(" ")}
                        style={{ touchAction: "manipulation" }}
                      >
                        {mode === "smart-fit" ? "Smart" : "Fill"}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Share & Download buttons (only when ready) */}
            {isReady && (
              <section aria-label="Download and share">
                <div className="border-t border-[#1E2D3A] pt-5">
                  <p className="font-mono text-xs text-[#475569] uppercase tracking-widest mb-4">
                    // Your signal is ready
                  </p>
                  <ShareButtons
                    renderInput={{
                      imageUrl: imageState.currentUrl!,
                      name: builderState.name,
                      role: builderState.role,
                      team: builderState.team,
                      fitMode: imageState.fitMode,
                      orientation: imageState.orientation ?? "portrait",
                    }}
                    name={builderState.name}
                  />
                </div>
              </section>
            )}

            {/* CTA hint */}
            {hasImage && (!builderState.name.trim() || !builderState.role.trim() || !builderState.team.trim()) && (
              <p className="font-mono text-xs text-[#B7FF00]/60 tracking-widest text-center animate-pulse">
                ↑ Complete all fields to unlock download
              </p>
            )}

            {/* Quick button to view preview on mobile when image is uploaded */}
            {hasImage && (
              <div className="pt-2 lg:hidden">
                <button
                  type="button"
                  onClick={() => setActiveMobileTab("preview")}
                  className="w-full py-3 px-4 rounded-xl bg-[#1E2D3A] hover:bg-[#2A3F52] text-[#B7FF00] font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 border border-[#B7FF00]/30"
                >
                  <span>🎴 View Generated Signal Card</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Right column: live card preview ────── */}
          <div
            className={[
              "flex flex-col items-center gap-3",
              activeMobileTab === "preview" ? "block" : "hidden lg:flex",
            ].join(" ")}
          >
            <p className="font-mono text-[10px] sm:text-xs text-[#475569] uppercase tracking-widest">
              // Live Preview
            </p>
            <CardPreview
              imageUrl={imageState.currentUrl}
              name={builderState.name}
              role={builderState.role}
              team={builderState.team}
              fitMode={imageState.fitMode}
              orientation={imageState.orientation}
            />
            <p className="font-mono text-[10px] text-[#1E2D3A] tracking-wide text-center">
              Final export: 1000 × 1500 PNG
            </p>
          </div>
        </div>
      </div>

      {/* ── Crop modal ────────────────────────────────────────────────────── */}
      {showCropModal && imageState.normalizedUrl && (
        <CropModal
          imageUrl={imageState.normalizedUrl}
          fitMode={imageState.fitMode}
          onFitModeChange={handleFitModeChange}
          onApply={handleCropApply}
          onReset={handleCropReset}
          onClose={() => setShowCropModal(false)}
          hasCrop={!!imageState.crop}
        />
      )}
    </main>
  );
}
