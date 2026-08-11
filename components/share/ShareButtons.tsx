"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { RenderBuilderCardInput } from "@/types";
import { renderBuilderCard } from "@/lib/renderer/renderBuilderCard";

interface ShareButtonsProps {
  renderInput: RenderBuilderCardInput;
  name: string;
}

type ShareState = "idle" | "rendering" | "success" | "error";

function buildXCaption(name: string): string {
  const displayName = name.trim() || "A builder";
  return `${displayName} is ready for Hacker House Goa 2026! 🚀\n\n#FrameInGoa #HHGoa2026`;
}

// Helper: upload card blob anonymously to Imgur to get a shareable URL
async function uploadToImgur(blob: Blob): Promise<string | null> {
  const formData = new FormData();
  formData.append("image", blob);
  try {
    // Public anonymous client ID for card sharing
    const clientID = "546c25a59c58ad7"; 
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${clientID}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error("Imgur upload failed");
    const json = await response.json();
    return json.data.link;
  } catch (err) {
    console.error("Imgur upload error:", err);
    return null;
  }
}

export function ShareButtons({ renderInput, name }: ShareButtonsProps) {
  const [shareState, setShareState] = useState<ShareState>("idle");
  const [statusMsg, setStatusMsg] = useState<string>("");

  async function getBlob(): Promise<Blob | null> {
    setShareState("rendering");
    setStatusMsg("Generating card...");
    try {
      const blob = await renderBuilderCard(renderInput);
      return blob;
    } catch (err) {
      console.error("Render error:", err);
      setShareState("error");
      setStatusMsg("Failed to generate card. Please try again.");
      return null;
    }
  }

  function triggerDownload(blob: Blob) {
    const safeName = name.trim().toLowerCase().replace(/\s+/g, "-");
    const fileName = safeName ? `HHG-${safeName}.png` : "HHG-Builder-Signal.png";
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    // Revoke after short delay to let browser initiate download
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function handleDownload() {
    const blob = await getBlob();
    if (!blob) return;
    triggerDownload(blob);
    setShareState("success");
    setStatusMsg("Card downloaded!");
    setTimeout(() => {
      setShareState("idle");
      setStatusMsg("");
    }, 3000);
  }

  async function handleShare() {
    const blob = await getBlob();
    if (!blob) return;

    const caption = buildXCaption(name);
    const file = new File([blob], "hhg-builder-signal.png", {
      type: "image/png",
    });

    // Level 1: Native Web Share (mobile)
    if (
      typeof navigator !== "undefined" &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: "HH Goa Builder Card",
          text: caption,
        });
        setShareState("success");
        setStatusMsg("Shared!");
        setTimeout(() => { setShareState("idle"); setStatusMsg(""); }, 3000);
        return;
      } catch {
        // User cancelled or share failed — fall through to desktop fallback
      }
    }

    // Level 2: Desktop fallback — upload image to Imgur to enable image preview on X
    setStatusMsg("Uploading card preview link...");
    const imgurUrl = await uploadToImgur(blob);

    if (imgurUrl) {
      const xUrl =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(caption) +
        "&url=" +
        encodeURIComponent(imgurUrl);
      window.open(xUrl, "_blank", "noopener,noreferrer");
      setShareState("success");
      setStatusMsg("X share window opened!");
    } else {
      // Fallback if Imgur fails — download file and open normal tweet window
      triggerDownload(blob);
      const xUrl =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(caption);
      window.open(xUrl, "_blank", "noopener,noreferrer");
      setShareState("success");
      setStatusMsg("Card downloaded — attach it in the X window that opened.");
    }
    
    setTimeout(() => {
      setShareState("idle");
      setStatusMsg("");
    }, 5000);
  }

  const isRendering = shareState === "rendering";

  return (
    <div className="space-y-3">
      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          id="download-card"
          variant="primary"
          size="lg"
          onClick={handleDownload}
          loading={isRendering}
          disabled={isRendering}
          className="flex-1"
        >
          ↓ Download PNG
        </Button>
        <Button
          id="share-to-x"
          variant="accent"
          size="lg"
          onClick={handleShare}
          loading={isRendering}
          disabled={isRendering}
          className="flex-1"
        >
          Share to X
        </Button>
      </div>

      {/* Status message */}
      {statusMsg && (
        <p
          className={[
            "font-mono text-xs text-center tracking-wide py-2 px-3 rounded-lg",
            shareState === "error"
              ? "text-red-400 bg-red-500/10 border border-red-500/20"
              : "text-[#B7FF00] bg-[#B7FF00]/5 border border-[#B7FF00]/20",
          ].join(" ")}
        >
          {statusMsg}
        </p>
      )}

      {/* Privacy note */}
      <p className="font-mono text-xs text-center text-[#1E2D3A] tracking-wide">
        Your photo is processed locally. Sharing to X uploads the card to generate a preview link.
      </p>
    </div>
  );
}
