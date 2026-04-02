import { useApp } from "@/contexts/AppContext";

interface AdBannerProps {
  size: "728x90" | "300x250";
  className?: string;
}

export function AdBanner({ size, className = "" }: AdBannerProps) {
  const { t } = useApp();
  const [w, h] = size.split("x").map(Number);

  return (
    // Replace with real AdSense values
    <div
      className={`flex items-center justify-center bg-muted/50 border border-border/50 rounded-lg text-muted-foreground text-xs font-mono w-full overflow-hidden ${className}`}
      style={{ minHeight: Math.min(h, 90) }}
      aria-label="Advertisement placeholder"
    >
      <div className="flex flex-col items-center gap-1 py-2 px-4">
        <span className="uppercase tracking-widest text-[10px] opacity-60">{t.ads.advertisement}</span>
        <span className="opacity-40 text-[10px]">{size}</span>
      </div>
      {/* Replace with real AdSense values — add your data-ad-client and data-ad-slot here */}
      {/* <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXXXXXX" data-ad-slot="XXXXXXXXX" data-ad-format="auto" /> */}
    </div>
  );
}
