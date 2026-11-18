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
      <div className="text-[13px] font-medium text-[#E5EAF0] mb-2">{label}</div>
      {current ? (
        <div className="relative rounded-md overflow-hidden border border-[#273543] group bg-[#101923]">
          <img
            src={current.preview_url}
            alt={current.filename}
            className="w-full h-80 sm:h-96 object-cover"
          />
          <button
            onClick={() => onUploaded(null)}
            className="focus-ring absolute top-2 right-2 bg-[#101923]/90 rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#9AA8B7] hover:text-[#E5EAF0]"
            title="Remove image"
          >
            <X size={15} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-[#141F2A]/95 px-3.5 py-2.5 text-[12px] font-mono border-t border-[#273543]">
            <div className="flex justify-between text-[#E5EAF0] font-medium">
              <span className="truncate max-w-[60%]">{current.filename}</span>
              <span className="text-[#48A9A6]">{current.width}×{current.height}px</span>
            </div>
            <div className="flex justify-between text-[#9AA8B7] mt-0.5 text-[11px]">
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
          className={`focus-ring cursor-pointer h-52 sm:h-60 rounded-md border border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
            dragging
              ? "border-[#48A9A6] bg-[#141F2A]"
              : "border-[#273543] hover:border-[#48A9A6]/60 bg-[#101923]/40 hover:bg-[#101923]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".tif,.tiff,.png,.jpg,.jpeg"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {busy ? (
            <span className="text-[13px] text-[#48A9A6] font-mono animate-pulse">
              Uploading and extracting spectral metadata…
            </span>
          ) : (
            <>
              <UploadCloud size={28} className="text-[#48A9A6]" />
              <span className="text-[13px] font-medium text-[#E5EAF0]">
                Drag &amp; drop or click to upload satellite imagery
              </span>
              <span className="text-[11px] text-[#718096] font-mono">
                GeoTIFF, Multispectral TIFF, PNG, JPEG
              </span>
            </>
          )}
        </div>
      )}
      {error && <div className="text-[11px] text-[#CF7777] mt-1.5 font-mono">{error}</div>}
    </div>
  );
}
