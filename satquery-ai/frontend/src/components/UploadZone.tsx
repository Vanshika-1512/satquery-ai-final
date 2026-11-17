import { useCallback, useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import type { ImageMetadata } from "../types";
import { api } from "../services/api";

export default function UploadZone({
  label,
  onUploaded,
  current,
}: {
  label: string;
  onUploaded: (meta: ImageMetadata | null) => void;
  current: ImageMetadata | null;
}) {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const meta = await api.uploadImage(file);
      onUploaded(meta);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }, [onUploaded]);

  return (
    <div className="w-full">
      <div className="text-[14px] font-semibold text-white mb-2">{label}</div>
      {current ? (
        <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 group shadow-[0_0_20px_rgba(34,211,238,0.1)] bg-slate-950">
          <img
            src={current.preview_url}
            alt={current.filename}
            className="w-full h-80 sm:h-96 object-cover"
          />
          <button
            onClick={() => onUploaded(null)}
            className="focus-ring absolute top-2 right-2 bg-slate-950/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-cyan-400"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-[#030712]/90 backdrop-blur-md px-3.5 py-2.5 text-[12px] data border-t border-slate-800">
            <div className="flex justify-between text-white font-medium">
              <span className="truncate max-w-[60%]">{current.filename}</span>
              <span className="text-cyan-300">{current.width}×{current.height}px</span>
            </div>
            <div className="flex justify-between text-slate-400 mt-0.5">
              <span>bands: {current.bands}</span>
              <span>modality: {current.modality_guess}</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className={`focus-ring cursor-pointer h-52 sm:h-60 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all
          ${dragging ? "border-cyan-400 bg-cyan-950/30 shadow-[0_0_25px_rgba(34,211,238,0.2)]" : "border-slate-700/80 hover:border-cyan-400/60 hover:bg-slate-900/50"}`}
        >
          <input
            ref={inputRef} type="file" className="hidden" accept=".tif,.tiff,.png,.jpg,.jpeg"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {busy ? (
            <span className="text-sm text-cyan-300 animate-pulse">Uploading and extracting spectral metadata…</span>
          ) : (
            <>
              <UploadCloud size={32} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              <span className="text-[14px] font-medium text-white">Drag &amp; drop or click to upload satellite imagery</span>
              <span className="text-[12px] text-slate-400">GeoTIFF, Multispectral TIFF, PNG, JPEG</span>
            </>
          )}
        </div>
      )}
      {error && <div className="text-[11px] text-rose-400 mt-1 font-mono">{error}</div>}
    </div>
  );
}
