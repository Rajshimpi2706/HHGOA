import type { Metadata, Viewport } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "HH GOA // 2026 — Builder Signal Generator",
  description:
    "Generate your Builder Signal for HH Goa 2026. Upload a photo, choose your role, and download a 1080×1350 branded builder identity card. No login. No upload. Client-side only.",
  keywords: ["HH Goa", "builder", "hackathon", "signal", "identity", "2026"],
  openGraph: {
    title: "HH GOA // 2026 — Builder Signal Generator",
    description: "Generate your Builder Signal for HH Goa 2026.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH GOA // 2026 — Builder Signal",
    description: "Generate your Builder Signal for HH Goa 2026.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceMono.variable} h-full`}>
      <body
        className={`${spaceMono.className} min-h-full antialiased bg-[#080C10]`}
        style={{ overscrollBehavior: "none" }}
      >
        {children}
      </body>
    </html>
  );
}
