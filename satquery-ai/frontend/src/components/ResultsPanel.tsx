import { useState } from "react";
import { Download, CheckCircle2, AlertCircle, Sparkles, RefreshCw, Workflow, MessageSquarePlus } from "lucide-react";
import type { AnalyzeResponse, RegionFollowupResponse } from "../types";
import { Card, PanelTitle, Badge, SecondaryButton } from "./ui/primitives";
import ClickableRegionImage from "./ClickableRegionImage";
import AdvancedSpectralBiophysicalAnalysis from "./AdvancedSpectralBiophysicalAnalysis";
import { api } from "../services/api";
import { humanizeIdentifier } from "../utils/format";

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const safePos = Math.max(1, pos); // avoid divide-by-zero when fully at 0%
  return (
    <div className="relative w-full aspect-video min-h-[380px] sm:min-h-[460px] rounded-md overflow-hidden border border-[#273543] select-none bg-[#101923]">
      <img src={after} alt="After observation" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before}
          alt="Before observation"
          className="h-full object-cover max-w-none"
          style={{ width: `${(100 / safePos) * 100}%` }}
        />
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-[#48A9A6] pointer-events-none" style={{ left: `${pos}%` }} />
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-3 w-[92%] mx-[4%] accent-[#48A9A6] cursor-ew-resize"
      />
      <div className="absolute top-3 left-3"><Badge tone="secondary">Baseline (T1)</Badge></div>
      <div className="absolute top-3 right-3"><Badge tone="primary">Current (T2)</Badge></div>
    </div>
  );
}

export default function ResultsPanel({
  result,
  onFollowupClick,
}: {
  result: AnalyzeResponse;
  onFollowupClick?: (query: string) => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number | null>(null);
  const v = result.visual_outputs;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await api.downloadReport(result.analysis_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SatQueryAI_Report_${result.analysis_id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Could not generate report.");
    } finally {
      setDownloading(false);
    }
  };

  const isChange = Boolean(v.before && v.after);

  return (
    <div className="space-y-4">
      {result.followup_context_used && (
        <div className="flex items-center gap-2 text-[12px] font-mono text-[#48A9A6] bg-[#141F2A] border border-[#273543] rounded-md px-3.5 py-2.5">
          <MessageSquarePlus size={14} className="shrink-0" />
          <span>Context carried forward from prior session turn.</span>
        </div>
      )}

      {result.retries.length > 0 && (
        <div className="flex items-center gap-2 text-[12px] font-mono text-[#D3A35C] bg-[#141F2A] border border-[#273543] rounded-md px-3.5 py-2.5">
          <RefreshCw size={14} className="shrink-0" />
          <span>Agent self-corrected and retried with calibrated parameters.</span>
        </div>
      )}

      {/* Primary Interpretation */}
      <Card>
        <div>
          <PanelTitle>Analytical Interpretation</PanelTitle>
          <p className="text-[15px] leading-relaxed text-[#E5EAF0] whitespace-pre-line">{result.answer}</p>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Badge tone="primary">{result.task_display}</Badge>
            <Badge tone="blue">{humanizeIdentifier(result.selected_model)}</Badge>
            {result.metadata_used?.model_type && (
              <Badge tone={result.metadata_used?.adapted ? "teal" : "amber"}>
                {result.metadata_used?.model_type === "fallback-heuristic" ? "Fallback Inference" : String(result.metadata_used?.model_type)}
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Multi-step reasoning chain */}
      {result.chain_steps.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Workflow size={15} className="text-[#48A9A6]" />
            <PanelTitle>Execution Reasoning Chain</PanelTitle>
          </div>
          <div className="space-y-3">
            {result.chain_steps.map((cs) => (
              <div key={cs.step_index} className="relative pl-7">
                <div className="absolute left-0 top-0.5 w-5 h-5 rounded bg-[#192633] border border-[#273543] text-[#48A9A6] text-[10px] font-mono flex items-center justify-center">
                  {cs.step_index}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone="blue">{cs.task_display}</Badge>
                </div>
                <p className="text-[12px] font-mono text-[#9AA8B7] mt-1 italic">"{cs.query}"</p>
                <p className="text-[13px] text-[#E5EAF0] mt-1">{cs.answer}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Temporal Comparison */}
      {isChange && (
        <Card>
          <PanelTitle>Temporal Change Detection</PanelTitle>
          <BeforeAfterSlider before={v.before} after={v.after} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {v.change_heatmap && (
              <div>
                <div className="text-[12px] text-[#9AA8B7] mb-1.5 font-mono">Differential Heatmap</div>
                <img
                  src={v.change_heatmap}
                  className="rounded-md border border-[#273543] w-full min-h-[300px] sm:min-h-[360px] object-cover bg-[#101923]"
                  alt="Change heatmap"
                />
              </div>
            )}
            {v.change_overlay && (
              <div>
                <div className="text-[12px] text-[#9AA8B7] mb-1.5 font-mono flex items-center gap-1.5">
                  Spatial Change Overlay <span className="text-[#48A9A6] text-[11px]">(click region for localized telemetry)</span>
                </div>
                <ClickableRegionImage
                  src={v.change_overlay}
                  analysisId={result.analysis_id}
                  className="rounded-md border border-[#273543] w-full min-h-[300px] sm:min-h-[360px] object-cover bg-[#101923]"
                  onRegionFollowup={(res: RegionFollowupResponse) => {
                    if (res.local_stats?.region_index) {
                      setSelectedRegionIndex(res.local_stats.region_index);
                    }
                  }}
                />
              </div>
            )}
          </div>
          <p className="text-[11px] text-[#718096] font-mono mt-2.5">
            Region boundaries delineate verified ground displacement zones.
          </p>

          {/* Spectral & Biophysical Analysis */}
          {result.advanced_change_analysis && (
            <AdvancedSpectralBiophysicalAnalysis
              data={result.advanced_change_analysis}
              selectedRegionIndex={selectedRegionIndex}
              onSelectRegion={setSelectedRegionIndex}
            />
          )}
        </Card>
      )}

      {/* Optical + SAR */}
      {(v.optical || v.sar_backscatter || v.fused_overlay) && (
        <Card>
          <PanelTitle>Multi-Sensor Observation (MSI + SAR)</PanelTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {v.optical && (
              <div>
                <div className="text-[12px] text-[#9AA8B7] mb-1.5 font-mono">Optical (MSI Surface Reflectance)</div>
                <img
                  src={v.optical}
                  className="rounded-md border border-[#273543] w-full min-h-[280px] sm:min-h-[340px] object-cover bg-[#101923]"
                  alt="Optical MSI"
                />
              </div>
            )}
            {v.sar_backscatter && (
              <div>
                <div className="text-[12px] text-[#9AA8B7] mb-1.5 font-mono">SAR (Backscatter Coefficient σ°)</div>
                <img
                  src={v.sar_backscatter}
                  className="rounded-md border border-[#273543] w-full min-h-[280px] sm:min-h-[340px] object-cover bg-[#101923]"
                  alt="SAR Backscatter"
                />
              </div>
            )}
            {v.fused_overlay && (
              <div>
                <div className="text-[12px] text-[#9AA8B7] mb-1.5 font-mono">Fused Multi-Modal Composite</div>
                <img
                  src={v.fused_overlay}
                  className="rounded-md border border-[#273543] w-full min-h-[280px] sm:min-h-[340px] object-cover bg-[#101923]"
                  alt="Fused Multi-Modal"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Visual Evidence Grounding */}
      {(v.input_image || v.grounding_overlay) && (
        <Card>
          <PanelTitle>Visual Grounding &amp; Identification</PanelTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {v.input_image && (
              <div>
                <div className="text-[12px] text-[#9AA8B7] mb-1.5 font-mono">Raw Input Imagery</div>
                <img
                  src={v.input_image}
                  className="rounded-md border border-[#273543] w-full min-h-[320px] sm:min-h-[420px] object-cover bg-[#101923]"
                  alt="Input imagery"
                />
              </div>
            )}
            {v.grounding_overlay && (
              <div>
                <div className="text-[12px] text-[#9AA8B7] mb-1.5 font-mono">
                  Spatial Grounding <span className="text-[#48A9A6] text-[11px]">(click bounding box for attribution)</span>
                </div>
                <ClickableRegionImage
                  src={v.grounding_overlay}
                  analysisId={result.analysis_id}
                  className="rounded-md border border-[#273543] w-full min-h-[320px] sm:min-h-[420px] object-cover bg-[#101923]"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Ground Truth & Verifications */}
      <Card>
        <PanelTitle>Analytical Evidence &amp; Attributions</PanelTitle>
        <ul className="space-y-2">
          {result.evidence.map((e, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-[#E5EAF0]">
              <CheckCircle2 size={15} className="text-[#6BA88B] mt-0.5 shrink-0" />
              <span>{e.detail}</span>
            </li>
          ))}
        </ul>
        {result.warnings.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#273543] space-y-1.5">
            {result.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-[12px] font-mono text-[#D3A35C]">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Suggested Inquiries */}
      {result.suggested_followups.length > 0 && onFollowupClick && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#48A9A6]" />
            <PanelTitle>Suggested Inquiries</PanelTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.suggested_followups.map((q) => (
              <button
                key={q}
                onClick={() => onFollowupClick(q)}
                className="focus-ring text-[12px] font-mono px-3 py-1.5 rounded border border-[#273543] bg-[#101923] text-[#9AA8B7] hover:text-[#E5EAF0] hover:border-[#48A9A6]/60 hover:bg-[#192633] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </Card>
      )}

      <SecondaryButton onClick={handleDownload} disabled={downloading}>
        <Download size={14} className="text-[#48A9A6]" />
        <span>{downloading ? "Compiling PDF Report…" : "Export Analysis Report (PDF)"}</span>
      </SecondaryButton>
    </div>
  );
}
