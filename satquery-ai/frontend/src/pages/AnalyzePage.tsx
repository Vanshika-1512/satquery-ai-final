import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles,
  Mic,
  Image as ImageIcon,
  GitCompareArrows,
  Radar as RadarIcon,
  RotateCcw,
  ChevronRight,
  Satellite,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";
import type { AnalysisMode, ImageMetadata, AnalyzeResponse } from "../types";
import UploadZone from "../components/UploadZone";
import { PrimaryButton, SecondaryButton, Card3D } from "../components/ui/primitives";
import AgentExecutingPanel from "../components/AgentExecutingPanel";
import ResultsPanel from "../components/ResultsPanel";
import ClarificationCard from "../components/ClarificationCard";
import { api } from "../services/api";
import { getSessionId, resetSessionId } from "../utils/session";
import { RealisticSatellite } from "../components/space/RealisticSatellites";

/* ── Deep Space Theme Palette ────────────────────────────── */
const C = {
  bg:      "#030712",
  panel:   "#08142c",
  border:  "rgba(56, 189, 248, 0.18)",
  hover:   "#172b52",
  primary: "#22d3ee",
  second:  "#cbd5e1",
  third:   "#64748b",
  text:    "#f8fafc",
  pos:     "#34d399",
  neg:     "#f87171",
};

const MODES: {
  key: AnalysisMode;
  label: string;
  badge?: string;
  satellite: "sentinel-2" | "sentinel-1" | "landsat-9";
  constellation: string;
  desc: string;
}[] = [
  {
    key: "single",
    label: "Single Scene Analysis",
    badge: "SENTINEL-2 MSI",
    satellite: "sentinel-2",
    constellation: "10m Optical Multispectral",
    desc: "VQA, scene captioning, text-guided grounding & zero-shot feature detection.",
  },
  {
    key: "optical_sar",
    label: "Optical + SAR Fusion",
    badge: "SENTINEL-1 C-SAR",
    satellite: "sentinel-1",
    constellation: "All-Weather Radar Penetration",
    desc: "Cross-modal sensor fusion piercing through dense cloud occlusion and night darkness.",
  },
  {
    key: "before_after",
    label: "Bi-Temporal Change",
    badge: "LANDSAT-9 / S2",
    satellite: "landsat-9",
    constellation: "Multi-Year Calibrated Baseline",
    desc: "Temporal difference matrix, urbanization sprawl, and water body shrinkage.",
  },
];

const CHIPS_BY_MODE: Record<AnalysisMode, string[]> = {
  single: [
    "Describe the imagery and environmental features",
    "Find water bodies and segment reservoir boundaries",
    "Identify built-up urban structures and roads",
    "Calculate NDVI vegetation health index",
    "Highlight agricultural crop patterns",
  ],
  optical_sar: [
    "Filter cloud cover using SAR radar penetration",
    "Analyze optical and SAR jointly for flood extent",
    "Detect all-weather maritime vessels in bay",
    "Measure urban backscatter double-bounce",
  ],
  before_after: [
    "What changed between the two acquisition dates?",
    "Has the built-up infrastructure area increased?",
    "Segment newly constructed roads and developments",
    "Estimate forest canopy loss and vegetation decline percentage",
  ],
};

/* ── Telemetry strip ────────────────────────────────────── */
function TelemetryBar({ mode }: { mode: AnalysisMode }) {
  const items =
    mode === "optical_sar"
      ? [
          { k: "ACTIVE SENSORS",      v: "Sentinel-2 MSI + S1 C-Band SAR" },
          { k: "SPATIAL RESOLUTION",  v: "10m Optical / 5×20m SAR" },
          { k: "FUSION ENGINE",       v: "Cross-Modal Dual-Polarization" },
          { k: "ATMOSPHERIC PEN",     v: "100% Cloud & Night Piercing" },
        ]
      : mode === "before_after"
      ? [
          { k: "ACTIVE SENSORS",      v: "Landsat-9 OLI-2 + Sentinel-2" },
          { k: "CO-REGISTRATION",     v: "Auto-Affine RMS ≤ 0.28 px" },
          { k: "CHANGE DETECTOR",     v: "Bi-Temporal Siamese UNet" },
          { k: "OUTPUT FORMAT",       v: "GeoTIFF Divergence Mask + PDF" },
        ]
      : [
          { k: "ORCHESTRATOR",        v: "SatQuery-Controller v2.4" },
          { k: "CONSTELLATION",       v: "Sentinel-2 MultiSpectral (MSI)" },
          { k: "SPECTRAL BANDS",      v: "13 Bands (VNIR + SWIR)" },
          { k: "COORDINATE CRS",      v: "EPSG:4326 WGS84 Co-Registered" },
        ];
  return (
    <div className="flex flex-wrap gap-px rounded-xl overflow-hidden border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.06)]">
      {items.map(({ k, v }) => (
        <div key={k} className="flex items-center gap-2 px-3.5 py-2 bg-[#040a1c] flex-1 min-w-[200px]">
          <span className="text-[10px] uppercase tracking-wider font-mono text-cyan-400 font-bold">{k}</span>
          <span className="text-[11px] font-mono text-slate-300 font-medium">{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function AnalyzePage({ presetMode }: { presetMode?: AnalysisMode }) {
  const [searchParams] = useSearchParams();
  const urlParamQuery = searchParams.get("q") || "";
  const urlParamMode  = searchParams.get("mode") as AnalysisMode | null;

  const [mode, setMode]             = useState<AnalysisMode>(urlParamMode || presetMode || "single");
  const [images, setImages]         = useState<(ImageMetadata | null)[]>([null, null]);
  const [query, setQuery]           = useState(urlParamQuery);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<AnalyzeResponse | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [sessionId, setSessionId]   = useState(getSessionId());
  const [turnCount, setTurnCount]   = useState(0);

  useEffect(() => {
    if (urlParamQuery) setQuery(urlParamQuery);
    if (urlParamMode) setMode(urlParamMode);
  }, [urlParamQuery, urlParamMode]);

  const requiredCount = mode === "single" ? 1 : 2;
  const canRun = query.trim().length > 0 && images.slice(0, requiredCount).every((i) => i !== null) && !loading;

  const runQuery = async (q: string) => {
    setLoading(true); setError(null); setResult(null);
    try {
      const ids   = images.slice(0, requiredCount).map((i) => i!.file_id);
      const hints = mode === "optical_sar" ? { image_1: "optical", image_2: "sar" } : undefined;
      const res   = await api.analyze({ query: q, mode, image_ids: ids, modality_hints: hints, session_id: sessionId });
      setResult(res); setQuery(q); setTurnCount((c) => c + 1);
    } catch (e: any) {
      setError(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (key: AnalysisMode) => {
    setMode(key); setResult(null); setImages([null, null]); startNewConversation();
  };

  const startNewConversation = () => {
    setSessionId(resetSessionId()); setTurnCount(0); setResult(null); setQuery("");
  };

  const pageTitle =
    mode === "before_after" ? "Bi-Temporal Change Detection" :
    mode === "optical_sar"  ? "Optical + SAR Cross-Modal Fusion" :
    "Earth-Observation Imagery Analysis";

  return (
    <div className="px-6 py-8 max-w-[1340px] mx-auto space-y-6">

      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1
            className="text-3xl sm:text-4xl font-normal text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {pageTitle}
          </h1>
          <p className="text-[13px] text-slate-400 font-light mt-1">
            Upload your satellite imagery, formulate a query in plain English, and inspect verified spectral evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {turnCount > 0 && (
            <SecondaryButton onClick={startNewConversation}>
              <RotateCcw size={13} />
              <span>Reset Context ({turnCount} turns)</span>
            </SecondaryButton>
          )}
        </div>
      </div>

      {/* ── Mode Selector Cards (3 Interactive Modes with Realistic Satellite Emblems) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODES.filter(m => m.key === mode).map((m) => {
          const isSelected = mode === m.key;
          return (
            <div
              key={m.key}
              onClick={() => handleModeChange(m.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "border-cyan-400 bg-cyan-950/25 shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                  : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
                    {m.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                      <CheckCircle2 size={12} /> ACTIVE
                    </span>
                  )}
                </div>

                <div className="text-[16px] font-bold text-white mb-1">
                  {m.label}
                </div>
                <div className="text-[12px] text-cyan-400 font-mono mb-2">
                  {m.constellation}
                </div>
                <p className="text-[12px] text-slate-400 leading-relaxed font-light">
                  {m.desc}
                </p>
              </div>

              {/* Miniature Satellite Graphic */}
              <div className="h-16 w-full relative flex items-center justify-end mt-2 opacity-80">
                <RealisticSatellite type={m.satellite} size="90px" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Upload Zone ─────────────────────────────────────── */}
      <Card3D className="!p-6 border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <div className="text-[13px] font-mono uppercase tracking-wider font-bold text-white">
              {mode === "before_after"
                ? "Bi-Temporal Frame Pair Upload (T1 Before + T2 After)"
                : mode === "optical_sar"
                ? "Cross-Modal Dual-Sensor Feed (Optical MSI + SAR Backscatter)"
                : "Primary Satellite Imagery Ingest"}
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-medium">MAX 250MB // COG Cloud-Optimized</span>
        </div>

        <div className={`grid gap-5 ${requiredCount === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {mode === "before_after" ? (
            <>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="text-[12px] font-mono uppercase mb-2 flex items-center justify-between text-cyan-300 font-bold">
                  <span>Before (T1 Prior State)</span>
                  <span className="text-[10px] text-slate-400 font-normal">HISTORICAL BASELINE</span>
                </div>
                <UploadZone label="Before (T1)" current={images[0]} onUploaded={(m) => setImages(([, b]) => [m, b])} />
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="text-[12px] font-mono uppercase mb-2 flex items-center justify-between text-emerald-300 font-bold">
                  <span>After (T2 Current State)</span>
                  <span className="text-[10px] text-slate-400 font-normal">RECENT OBSERVATION</span>
                </div>
                <UploadZone label="After (T2)" current={images[1]} onUploaded={(m) => setImages(([a]) => [a, m])} />
              </div>
            </>
          ) : mode === "optical_sar" ? (
            <>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="text-[12px] font-mono uppercase mb-2 font-bold text-cyan-300">
                  Optical Multispectral Sensor (MSI)
                </div>
                <UploadZone label="Optical Image" current={images[0]} onUploaded={(m) => setImages(([, b]) => [m, b])} />
              </div>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="text-[12px] font-mono uppercase mb-2 font-bold text-cyan-300">
                  SAR Radar (C-Band Backscatter)
                </div>
                <UploadZone label="SAR Image" current={images[1]} onUploaded={(m) => setImages(([a]) => [a, m])} />
              </div>
            </>
          ) : (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
              <UploadZone label="Satellite Imagery Scene" current={images[0]} onUploaded={(m) => setImages(([, b]) => [m, b])} />
            </div>
          )}
        </div>
      </Card3D>

      {/* ── Natural Language Query Input Box ─────────────────── */}
      <Card3D
        config={{ maxTilt: 2, scale: 1.002, parallax: false }}
        className="!p-6 border border-cyan-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(14,165,233,0.12)]"
      >
        <div className="flex items-center justify-between mb-3 text-xs font-mono text-cyan-400">
          <span className="flex items-center gap-2">
            <Sparkles size={14} />
            <span className="font-bold">
              {turnCount > 0 ? `Follow-up Inquiry (Session Turn ${turnCount + 1})` : "Query — Natural-Language Remote-Sensing Reasoning"}
            </span>
          </span>
          <span className="text-slate-400">
            {turnCount > 0 ? "Session maintains multi-turn conversation memory" : "SatQuery Dispatch Agent v2.4"}
          </span>
        </div>

        <div className="relative mb-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey || e.key === "Enter") && canRun) {
                e.preventDefault();
                runQuery(query);
              }
            }}
            placeholder="Ask SatQuery anything about your satellite scene… e.g. 'Segment newly constructed roads and estimate vegetation loss'"
            rows={2}
            className="w-full rounded-xl px-4 py-3.5 pr-12 text-[15px] bg-[#030712] text-white border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none resize-none transition-all placeholder:text-slate-500"
          />
          <Mic size={18} className="absolute right-4 top-4 text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors" />
        </div>

        {/* Suggested Task Prompt Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CHIPS_BY_MODE[mode].map((c) => (
            <button
              key={c}
              onClick={() => setQuery(c)}
              className="text-[12px] px-3.5 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-950/30 transition-all font-medium text-left"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-[12px] font-mono text-slate-400">
            ⊞ Supports zero-shot masking, biophysical index calculation &amp; area estimation
          </div>
          <div className="flex items-center gap-3">
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
              >
                Clear
              </button>
            )}
            <PrimaryButton onClick={() => runQuery(query)} disabled={!canRun}>
              <Sparkles size={14} />
              <span>
                {mode === "before_after" ? "Execute Change Detection" : mode === "optical_sar" ? "Execute Sensor Fusion" : "Run Analysis"}
              </span>
            </PrimaryButton>
          </div>
        </div>
        {error && <div className="text-[12px] font-mono text-rose-400 mt-3">{error}</div>}
      </Card3D>

      {/* ── Monospace Telemetry Strip ───────────────────────── */}
      <TelemetryBar mode={mode} />

      {/* ── Active Execution & Results ──────────────────────── */}
      {loading && <AgentExecutingPanel />}

      {result && !loading && result.clarification_needed && (
        <ClarificationCard
          answer={result.answer}
          options={result.clarification_options}
          inputImage={result.visual_outputs.input_image}
          onPick={(q) => runQuery(q)}
        />
      )}

      {result && !loading && !result.clarification_needed && (
        <ResultsPanel result={result} onFollowupClick={(q) => runQuery(q)} />
      )}

      {/* Optical + SAR Information Cards */}
      {mode === "optical_sar" && !loading && !result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            {
              title: "C-Band SAR Infiltration",
              sub: "100% ALL-WEATHER PENETRATION",
              desc: "Penetrates atmospheric cloud cover and rain layers. Unlocks land-cover monitoring when optical sensors are blinded.",
              satellite: "sentinel-1" as const,
            },
            {
              title: "Urban Double-Bounce",
              sub: "BACKSCATTER POLARIMETRY",
              desc: "Computational radar backscatter isolates sharp vertical man-made structures from natural soil terrain.",
              satellite: "sentinel-1" as const,
            },
            {
              title: "Optical + SAR Co-variance",
              sub: "SPECTRAL FUSION EQUATION",
              desc: "Optical near-infrared chlorophyll absorption coupled with radar volumetric biomass moisture estimations.",
              satellite: "sentinel-2" as const,
            },
          ].map(({ title, sub, desc, satellite }) => (
            <Card3D key={title} className="!p-5 border border-cyan-500/20 bg-slate-900/60 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
                  {sub}
                </div>
                <div className="text-[16px] font-bold text-white mb-2">{title}</div>
                <div className="text-[13px] text-slate-300 leading-relaxed font-light">{desc}</div>
              </div>
              <div className="h-16 w-full flex items-center justify-end opacity-70 mt-3">
                <RealisticSatellite type={satellite} size="80px" />
              </div>
            </Card3D>
          ))}
        </div>
      )}
    </div>
  );
}
