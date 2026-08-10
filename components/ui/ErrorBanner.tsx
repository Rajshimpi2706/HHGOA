"use client";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3"
    >
      <span className="text-red-400 mt-0.5 shrink-0 text-base">⚠</span>
      <p className="flex-1 font-mono text-sm text-red-300 tracking-wide">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="text-red-400 hover:text-red-200 transition-colors text-lg leading-none shrink-0"
        >
          ×
        </button>
      )}
    </div>
  );
}
