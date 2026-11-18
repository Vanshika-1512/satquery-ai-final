import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles,
  Mic,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import type { AnalysisMode, ImageMetadata, AnalyzeResponse } from "../types";
import UploadZone from "../components/UploadZone";
import { PrimaryButton, SecondaryButton, Card } from "../components/ui/primitives";
import AgentExecutingPanel from "../components/AgentExecutingPanel";
import ResultsPanel from "../components/ResultsPanel";
import ClarificationCard from "../components/ClarificationCard";
import { api } from "../services/api";
import { getSessionId, resetSessionId } from "../utils/session";
import { RealisticSatellite } from "../components/space/RealisticSatellites";

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

/* ── Telemetry Strip ────────────────────────────────────── */
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
    <div className="flex flex-wrap gap-px rounded border border-[#273543] overflow-hidden bg-[#273543]">
      {items.map(({ k, v }) => (
        <div key={k} className="flex items-center gap-2 px-3 py-1.5 bg-[#101923] flex-1 min-w-[200px]">
          <span className="text-[10px] uppercase tracking-wider font-mono text-[#718096] font-medium">{k}</span>
          <span className="data text-[11px] text-[#E5EAF0]">{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Page Component ─────────────────────────────────────── */
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
    <div className="px-6 py-6 max-w-[1340px] mx-auto space-y-6 bg-[#0B1118]">

      {/* ── Page Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#E5EAF0] tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-[13px] text-[#9AA8B7] mt-1">
            Upload satellite imagery, formulate a query in plain English, and inspect verified spectral evidence.
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

      {/* ── Mode Selector Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODES.filter(m => m.key === mode).map((m) => {
          const isSelected = mode === m.key;
          return (
            <div
              key={m.key}
              onClick={() => handleModeChange(m.key)}
              className={`p-4 rounded border transition-colors cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "border-[#48A9A6] bg-[#192633]"
                  : "border-[#273543] bg-[#141F2A] hover:border-[#36485C] hover:bg-[#192633]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#101923] text-[#48A9A6] border border-[#273543]">
                    {m.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-mono text-[#6BA88B]">
                      <CheckCircle2 size={12} /> ACTIVE
                    </span>
                  )}
                </div>

                <div className="text-[15px] font-medium text-[#E5EAF0] mb-1">
                  {m.label}
                </div>
                <div className="text-[12px] text-[#9AA8B7] font-mono mb-2">
                  {m.constellation}
                </div>
                <p className="text-[12px] text-[#718096] leading-relaxed">
                  {m.desc}
                </p>
              </div>

              {/* Miniature Satellite Graphic */}
              <div className="h-14 w-full relative flex items-center justify-end mt-2 opacity-80">
                <RealisticSatellite type={m.satellite} size="80px" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Upload Zone Container ───────────────────────────── */}
      <Card className="!p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#48A9A6]" />
            <div className="text-[12px] font-mono uppercase tracking-wider font-medium text-[#E5EAF0]">
              {mode === "before_after"
                ? "Bi-Temporal Frame Pair Upload (T1 Before + T2 After)"
                : mode === "optical_sar"
                ? "Cross-Modal Dual-Sensor Feed (Optical MSI + SAR Backscatter)"
                : "Primary Satellite Imagery Ingest"}
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#718096]">MAX 250MB · GeoTIFF / PNG / JPEG</span>
        </div>

        <div className={`grid gap-4 ${requiredCount === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {mode === "before_after" ? (
            <>
              <div className="p-3.5 rounded border border-[#273543] bg-[#101923]">
                <div className="text-[11px] font-mono uppercase mb-2 flex items-center justify-between text-[#9AA8B7] font-medium">
                  <span>Before (T1 Prior State)</span>
                  <span className="text-[10px] text-[#718096]">HISTORICAL BASELINE</span>
                </div>
                <UploadZone label="Before (T1)" current={images[0]} onUploaded={(m) => setImages(([, b]) => [m, b])} />
              </div>
              <div className="p-3.5 rounded border border-[#273543] bg-[#101923]">
                <div className="text-[11px] font-mono uppercase mb-2 flex items-center justify-between text-[#6BA88B] font-medium">
                  <span>After (T2 Current State)</span>
                  <span className="text-[10px] text-[#718096]">RECENT OBSERVATION</span>
                </div>
                <UploadZone label="After (T2)" current={images[1]} onUploaded={(m) => setImages(([a]) => [a, m])} />
              </div>
            </>
          ) : mode === "optical_sar" ? (
            <>
              <div className="p-3.5 rounded border border-[#273543] bg-[#101923]">
                <div className="text-[11px] font-mono uppercase mb-2 font-medium text-[#9AA8B7]">
                  Optical Multispectral Sensor (MSI)
                </div>
                <UploadZone label="Optical Image" current={images[0]} onUploaded={(m) => setImages(([, b]) => [m, b])} />
              </div>
              <div className="p-3.5 rounded border border-[#273543] bg-[#101923]">
                <div className="text-[11px] font-mono uppercase mb-2 font-medium text-[#9AA8B7]">
                  SAR Radar (C-Band Backscatter)
                </div>
                <UploadZone label="SAR Image" current={images[1]} onUploaded={(m) => setImages(([a]) => [a, m])} />
              </div>
            </>
          ) : (
            <div className="p-3.5 rounded border border-[#273543] bg-[#101923]">
              <UploadZone label="Satellite Imagery Scene" current={images[0]} onUploaded={(m) => setImages(([, b]) => [m, b])} />
            </div>
          )}
        </div>
      </Card>

      {/* ── Natural Language Query Input Box ─────────────────── */}
      <Card className="!p-5">
        <div className="flex items-center justify-between mb-2.5 text-xs font-mono text-[#48A9A6]">
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} />
            <span className="font-medium">
              {turnCount > 0 ? `Follow-up Inquiry (Session Turn ${turnCount + 1})` : "Query — Natural-Language Remote-Sensing Reasoning"}
            </span>
          </span>
          <span className="text-[#718096]">
            {turnCount > 0 ? "Session maintains multi-turn conversation memory" : "SatQuery Dispatch Agent v2.4"}
          </span>
        </div>

        <div className="relative mb-3">
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
            className="w-full rounded px-3.5 py-3 pr-10 text-[14px] bg-[#101923] text-[#E5EAF0] border border-[#273543] focus:border-[#48A9A6] outline-none resize-none transition-colors placeholder:text-[#718096]"
          />
          <Mic size={16} className="absolute right-3.5 top-3.5 text-[#718096] hover:text-[#48A9A6] cursor-pointer transition-colors" />
        </div>

        {/* Suggested Task Prompt Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {CHIPS_BY_MODE[mode].map((c) => (
            <button
              key={c}
              onClick={() => setQuery(c)}
              className="text-[12px] px-2.5 py-1 rounded border border-[#273543] bg-[#192633] text-[#9AA8B7] hover:text-[#E5EAF0] hover:border-[#48A9A6] transition-colors font-normal text-left"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#273543]">
          <div className="text-[11px] font-mono text-[#718096]">
            Supports zero-shot masking, biophysical index calculation &amp; area estimation
          </div>
          <div className="flex items-center gap-2.5">
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs font-mono text-[#718096] hover:text-[#E5EAF0] px-2.5 py-1 rounded border border-[#273543] transition-colors"
              >
                Clear
              </button>
            )}
            <PrimaryButton onClick={() => runQuery(query)} disabled={!canRun}>
              <Sparkles size={13} />
              <span>
                {mode === "before_after" ? "Execute Change Detection" : mode === "optical_sar" ? "Execute Sensor Fusion" : "Run Analysis"}
              </span>
            </PrimaryButton>
          </div>
        </div>
        {error && <div className="text-[12px] font-mono text-[#CF7777] mt-3">{error}</div>}
      </Card>

      {/* ── Telemetry Strip ─────────────────────────────────── */}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
            <div key={title} className="p-4 rounded border border-[#273543] bg-[#141F2A] flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono font-medium text-[#48A9A6] uppercase tracking-wider mb-1">
                  {sub}
                </div>
                <div className="text-[15px] font-medium text-[#E5EAF0] mb-2">{title}</div>
                <div className="text-[13px] text-[#9AA8B7] leading-relaxed">{desc}</div>
              </div>
              <div className="h-14 w-full flex items-center justify-end opacity-70 mt-3">
                <RealisticSatellite type={satellite} size="70px" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
