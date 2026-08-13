import { Metadata } from "next";

type PageProps = {
  searchParams: Promise<{ img?: string; name?: string }> | { img?: string; name?: string };
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const imgUrl = resolvedParams.img || "";
  const displayName = resolvedParams.name ? decodeURIComponent(resolvedParams.name) : "Builder";

  return {
    title: `${displayName}'s HH Goa Builder Card`,
    description: `Ready to build at HH Goa 2026! 🚀`,
    openGraph: {
      title: `${displayName}'s HH Goa Builder Card`,
      description: `Ready to build at HH Goa 2026! 🚀`,
      images: imgUrl ? [imgUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName}'s HH Goa Builder Card`,
      description: `Ready to build at HH Goa 2026! 🚀`,
      images: imgUrl ? [imgUrl] : [],
    },
  };
}

export default async function SharePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const imgUrl = resolvedParams.img || "";
  const displayName = resolvedParams.name ? decodeURIComponent(resolvedParams.name) : "Builder";

  return (
    <div className="min-h-screen bg-[#080C10] flex flex-col items-center justify-center p-6 text-white font-mono">
      {/* Decorative top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#B7FF00]/50 to-transparent" />

      <div className="max-w-md w-full space-y-8 text-center animate-fade-up">
        <h1 className="text-2xl font-bold text-[#B7FF00] tracking-widest drop-shadow-[0_0_8px_rgba(183,255,0,0.2)]">
          HH GOA 2026
        </h1>
        <p className="text-white/60 text-xs uppercase tracking-[0.2em]">
          Builder Card for {displayName}
        </p>

        {imgUrl ? (
          <div className="relative border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] aspect-[2/3] max-w-[340px] mx-auto bg-[#0e0e0f]">
            {/* Visual preview */}
            <img 
              src={imgUrl} 
              alt="HH Goa Builder Card" 
              className="w-full h-full object-contain" 
            />
          </div>
        ) : (
          <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-8 text-center text-red-400 max-w-[340px] mx-auto">
            No builder card image URL was provided.
          </div>
        )}

        <div className="pt-6">
          <a
            href="/"
            className="inline-block bg-white/5 border border-white/10 hover:bg-[#B7FF00]/10 hover:border-[#B7FF00]/30 hover:text-[#B7FF00] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
          >
            ← Generate Your Card
          </a>
        </div>
      </div>
    </div>
  );
}
