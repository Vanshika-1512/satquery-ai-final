import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../services/api";

import type { RegionFollowupResponse } from "../types";

/** A targeting reticle for precision satellite imagery inspection. */
function Reticle() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#48A9A6" strokeWidth="1.4" />
      <circle cx="11" cy="11" r="1.6" fill="#48A9A6" />
      <line x1="11" y1="0" x2="11" y2="4" stroke="#48A9A6" strokeWidth="1.4" />
      <line x1="11" y1="18" x2="11" y2="22" stroke="#48A9A6" strokeWidth="1.4" />
      <line x1="0" y1="11" x2="4" y2="11" stroke="#48A9A6" strokeWidth="1.4" />
      <line x1="18" y1="11" x2="22" y2="11" stroke="#48A9A6" strokeWidth="1.4" />
    </svg>
  );
}

export default function ClickableRegionImage({
  src,
  analysisId,
  className = "",
  onRegionFollowup,
}: {
  src: string;
  analysisId: string;
  className?: string;
  onRegionFollowup?: (res: RegionFollowupResponse) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [marker, setMarker] = useState<{ left: number; top: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const clickXFrac = (e.clientX - rect.left) / rect.width;
    const clickYFrac = (e.clientY - rect.top) / rect.height;
    setMarker({ left: clickXFrac * 100, top: clickYFrac * 100 });
    setSummary(null);
    setLoading(true);

    const naturalX = Math.round(clickXFrac * img.naturalWidth);
    const naturalY = Math.round(clickYFrac * img.naturalHeight);

    try {
      const res = await api.regionFollowup(analysisId, naturalX, naturalY);
      setSummary(res.summary);
      if (onRegionFollowup) {
        onRegionFollowup(res);
      }
    } catch {
      setSummary("Could not fetch region details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <img
        ref={imgRef}
        src={src}
        onClick={handleClick}
        className={`cursor-crosshair ${className}`}
        title="Click a point on this image for a localized explanation"
      />
      {marker && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: `${marker.left}%`, top: `${marker.top}%` }}
        >
          <Reticle />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 min-w-[200px] max-w-[260px] rounded-md px-3 py-2 text-[11px] font-mono text-[#E5EAF0] bg-[#101923] border border-[#273543] shadow-lg">
            {loading ? (
              <span className="flex items-center gap-1.5 text-[#9AA8B7]">
                <Loader2 size={12} className="animate-spin text-[#48A9A6]" /> Inspecting spatial coordinates…
              </span>
            ) : (
              summary
            )}
          </div>
        </div>
      )}
    </div>
  );
}
