import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Rocket,
  Layers,
  Sparkles,
  Download,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Check,
  FileText,
  MapPin,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { api } from "../services/api";
import type { Mission, MissionAffectedRegion, ImageMetadata } from "../types";
import { Card, PanelTitle, SecondaryButton } from "../components/ui/primitives";
import UploadZone from "../components/UploadZone";

const EXAMPLE_MISSIONS = [
  {
    icon: "🌊",
    title: "Investigate flood damage",
    prompt: "Investigate whether flooding has affected agricultural land.",
    category: "Flood Impact",
  },
  {
    icon: "🌾",
    title: "Assess agricultural changes",
    prompt: "Assess crop health and agricultural surface changes between dates.",
    category: "Agriculture",
  },
  {
    icon: "🏙️",
    title: "Analyze urban expansion",
    prompt: "Analyze urban expansion and new construction footprint.",
    category: "Urban",
  },
  {
    icon: "🌲",
    title: "Investigate vegetation loss",
    prompt: "Investigate tree canopy clearance and vegetation loss.",
    category: "Forestry",
  },
  {
    icon: "💧",
    title: "Analyze water-body dynamics",
    prompt: "Analyze surface water expansion and reservoir shoreline variation.",
    category: "Hydrology",
  },
  {
    icon: "🏗️",
    title: "Detect infrastructure development",
    prompt: "Detect new industrial structures and road infrastructure development.",
    category: "Infrastructure",
  },
];

function InteractiveSlider({ before, after, overlay }: { before: string; after: string; overlay?: string }) {
  const [pos, setPos] = useState(50);
  const [showOverlay, setShowOverlay] = useState(true);
  const safePos = Math.max(1, pos);

  return (
    <div className="space-y-2">
      <div className="relative w-full aspect-video rounded-md overflow-hidden border border-[#273543] select-none bg-[#101923]">
        {/* Under layer (After) */}
        <img
          src={showOverlay && overlay ? overlay : after}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Current / Overlay"
        />

        {/* Top layer (Before) clipped */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img
            src={before}
            className="h-full object-cover max-w-none"
            style={{ width: `${(100 / safePos) * 100}%` }}
            alt="Baseline observation"
          />
        </div>

        {/* Slider divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#48A9A6] pointer-events-none"
          style={{ left: `${pos}%` }}
        />

        {/* Range slider input */}
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-x-0 bottom-3 w-[92%] mx-[4%] accent-[#48A9A6] cursor-ew-resize opacity-90 hover:opacity-100 transition-opacity"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101923]/90 text-[#9AA8B7] border border-[#273543]">
            BASELINE (T1)
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101923]/90 text-[#48A9A6] border border-[#273543]">
            {showOverlay && overlay ? "CURRENT + AFFECTED OVERLAY" : "CURRENT (T2)"}
          </span>
        </div>
      </div>

      {overlay && (
        <div className="flex items-center justify-between text-[11px] font-mono px-1">
          <span className="text-[#718096]">Drag slider to compare baseline with post-event analysis</span>
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors border ${
              showOverlay
                ? "bg-[#141F2A] border-[#273543] text-[#48A9A6]"
                : "bg-[#101923] border-[#273543] text-[#718096] hover:text-[#9AA8B7]"
            }`}
          >
            {showOverlay ? "☑ Affected Parcels Active" : "☐ Show Affected Parcels"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MissionPage() {
  const [searchParams] = useSearchParams();
  const initialMissionId = searchParams.get("id");

  const [objective, setObjective] = useState("");
  const [uploadedImages, setUploadedImages] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<MissionAffectedRegion | null>(null);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialMissionId) {
      loadSavedMission(initialMissionId);
    }
  }, [initialMissionId]);

  const loadSavedMission = async (id: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const m = await api.getMission(id);
      setCurrentMission(m);
      setObjective(m.objective);
      if (m.affected_regions.length > 0) {
        setSelectedRegion(m.affected_regions[0]);
      }
    } catch (err: any) {
      setErrorMessage("Could not load mission: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleStartInvestigation = async () => {
    if (!objective.trim()) {
      setErrorMessage("Please specify an investigation objective.");
      return;
    }
    if (uploadedImages.length === 0) {
      setErrorMessage("Please upload baseline and observation imagery.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSelectedRegion(null);

    try {
      const imageIds = uploadedImages.map((img) => img.file_id);
      const mission = await api.runMission({
        objective: objective.trim(),
        image_ids: imageIds,
      });
      setCurrentMission(mission);
      if (mission.affected_regions.length > 0) {
        setSelectedRegion(mission.affected_regions[0]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to execute investigation mission.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!currentMission) return;
    setDownloadingReport(true);
    try {
      const blob = await api.downloadMissionReport(currentMission.mission_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SatQueryAI_MissionReport_${currentMission.mission_id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Could not generate mission report.");
    } finally {
      setDownloadingReport(false);
    }
  };

  const resetInvestigation = () => {
    setCurrentMission(null);
    setSelectedRegion(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0B1118]">
      {/* ── Page Header ── */}
      <div className="border-b border-[#273543] bg-[#101923] px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 max-w-7xl mx-auto">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5 text-[#718096]">
              Autonomous Investigation // Earth Observation AI
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#48A9A6]" />
              <h1 className="text-[20px] font-semibold text-[#E5EAF0]">
                Mission Mode — Autonomous Investigation
              </h1>
            </div>
            <p className="text-[12px] font-mono text-[#9AA8B7] mt-1">
              Decompose Earth-observation objectives into orchestrated multi-sensor analyses.
            </p>
          </div>

          {currentMission && (
            <div className="flex items-center gap-2">
              <SecondaryButton onClick={resetInvestigation}>
                <RotateCcw size={14} /> New Investigation
              </SecondaryButton>
              <SecondaryButton onClick={handleDownloadReport} disabled={downloadingReport}>
                <Download size={14} className="text-[#48A9A6]" />
                <span>{downloadingReport ? "Compiling PDF…" : "Export Mission Report"}</span>
              </SecondaryButton>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-md bg-[#141F2A] border border-[#CF7777]/50 text-[#CF7777] text-[12px] font-mono flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {!currentMission && (
          <div className="space-y-6">
            {/* Example Mission Cards Grid */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#718096] mb-2.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#48A9A6]" />
                Preset Investigation Scenarios
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {EXAMPLE_MISSIONS.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setObjective(ex.prompt)}
                    className="p-3.5 rounded-md bg-[#141F2A] border border-[#273543] hover:border-[#48A9A6]/50 hover:bg-[#192633] text-left transition-colors group flex items-start gap-3"
                  >
                    <span className="text-xl p-1.5 rounded bg-[#101923] border border-[#273543]">
                      {ex.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#E5EAF0] group-hover:text-[#48A9A6] transition-colors">
                        {ex.title}
                      </div>
                      <div className="text-[11px] font-mono text-[#718096] mt-0.5 line-clamp-2">
                        "{ex.prompt}"
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Objective Input Area */}
            <Card>
              <div className="space-y-4">
                <div>
                  <PanelTitle>What would you like to investigate?</PanelTitle>
                  <p className="text-[12px] font-mono text-[#9AA8B7] mt-0.5">
                    State the high-level objective. SatQuery automatically selects the relevant sensor pipelines and change models.
                  </p>
                </div>

                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="e.g. Investigate whether flooding has affected agricultural land."
                  rows={3}
                  className="w-full bg-[#101923] border border-[#273543] rounded-md px-3.5 py-2.5 text-[13px] font-mono text-[#E5EAF0] placeholder-[#718096] focus:outline-none focus:border-[#48A9A6] transition-colors"
                />

                {/* Imagery Selection */}
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#718096] mb-2 flex items-center justify-between">
                    <span>Input Observations (Baseline &amp; Current Imagery)</span>
                    <span className="text-[10px] text-[#9AA8B7]">
                      {uploadedImages.length} image{uploadedImages.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <UploadZone
                      label="Baseline Image (T1)"
                      current={uploadedImages[0] || null}
                      onUploaded={(meta) => {
                        const newArr = [...uploadedImages];
                        if (meta) newArr[0] = meta;
                        else newArr.splice(0, 1);
                        setUploadedImages(newArr);
                      }}
                    />
                    <UploadZone
                      label="Current Image (T2)"
                      current={uploadedImages[1] || null}
                      onUploaded={(meta) => {
                        const newArr = [...uploadedImages];
                        if (meta) newArr[1] = meta;
                        else newArr.splice(1, 1);
                        setUploadedImages(newArr);
                      }}
                    />
                  </div>
                </div>

                {/* Primary Start CTA */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-[#718096] hidden sm:block">
                    Automated Task Decomposition &bull; Deterministic Spatial Attribution
                  </div>
                  <button
                    type="button"
                    onClick={handleStartInvestigation}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-md font-mono text-[12px] font-medium tracking-wide uppercase transition-colors flex items-center gap-2 bg-[#48A9A6] text-[#0B1118] hover:bg-[#3D9491] disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Planning &amp; Investigating…
                      </>
                    ) : (
                      <>
                        <Rocket size={15} /> Execute Mission
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentMission && (
          <div className="space-y-5">
            {/* Mission Top Metadata Bar */}
            <div className="p-4 rounded-md bg-[#141F2A] border border-[#273543] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#192633] border border-[#273543] text-[#48A9A6]">
                    MISSION #{currentMission.mission_id.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-[#718096]">
                    {currentMission.mission_title}
                  </span>
                </div>
                <div className="text-[14px] font-mono text-[#E5EAF0]">
                  "{currentMission.objective}"
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#6BA88B]" />
                <span className="text-[#6BA88B] uppercase">
                  {currentMission.status === "completed" ? "Investigation Complete" : currentMission.status}
                </span>
              </div>
            </div>

            {/* Analysis & Visual Evidence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 1. Comparison Slider */}
              {currentMission.visual_outputs.baseline && currentMission.visual_outputs.current && (
                <Card>
                  <div className="flex items-center justify-between mb-3 border-b border-[#273543] pb-2">
                    <div className="flex items-center gap-1.5">
                      <Layers size={14} className="text-[#48A9A6]" />
                      <PanelTitle>Comparison Slider</PanelTitle>
                    </div>
                    <span className="text-[10px] font-mono text-[#718096]">
                      Baseline vs Current
                    </span>
                  </div>
                  <InteractiveSlider
                    before={currentMission.visual_outputs.baseline}
                    after={currentMission.visual_outputs.current}
                  />
                  <div className="text-[10px] font-mono text-[#718096] pt-1 text-center">
                    Drag slider to compare baseline with post-event
                  </div>
                </Card>
              )}

              {/* 2. Change Heatmap */}
              {currentMission.visual_outputs.change_heatmap && (
                <Card>
                  <div className="flex items-center justify-between mb-3 border-b border-[#273543] pb-2">
                    <div className="flex items-center gap-1.5">
                      <Activity size={14} className="text-[#48A9A6]" />
                      <PanelTitle>Change Heatmap</PanelTitle>
                    </div>
                    <span className="text-[10px] font-mono text-[#718096]">
                      Spectral Delta
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <img
                      src={currentMission.visual_outputs.change_heatmap}
                      alt="Change Heatmap"
                      className="w-full aspect-video object-cover rounded border border-[#273543] bg-[#101923]"
                    />
                    <div className="text-[10px] font-mono text-[#718096] text-right pt-0.5">
                      Normalized intensity divergence
                    </div>
                  </div>
                </Card>
              )}

              {/* 3. Affected Parcels */}
              <Card>
                <div className="flex items-center justify-between mb-3 border-b border-[#273543] pb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#48A9A6]" />
                    <PanelTitle>Affected Parcels</PanelTitle>
                  </div>
                  <span className="text-[10px] font-mono text-[#718096]">
                    {currentMission.affected_regions.length} Parcels Mapped
                  </span>
                </div>
                <div className="space-y-1.5">
                  <img
                    src={currentMission.visual_outputs.affected_overlay || currentMission.visual_outputs.current}
                    alt="Affected Parcels Overlay"
                    className="w-full aspect-video object-cover rounded border border-[#273543] bg-[#101923]"
                  />
                  <div className="text-[10px] font-mono text-[#718096] text-right pt-0.5">
                    Delineated impact parcels
                  </div>
                </div>
              </Card>
            </div>

            {/* Highlighted Affected Regions Inspector */}
            {currentMission.affected_regions.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#48A9A6]" />
                    <PanelTitle>Delineated Impact Parcels</PanelTitle>
                  </div>
                  <span className="text-[10px] font-mono text-[#718096]">
                    {currentMission.affected_regions.length} Parcels Mapped
                  </span>
                </div>

                {/* Parcel Selection Chips */}
                <div className="flex items-center gap-1.5 flex-wrap mb-3">
                  {currentMission.affected_regions.map((reg) => (
                    <button
                      key={reg.region_id}
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors border ${
                        selectedRegion?.region_id === reg.region_id
                          ? "bg-[#48A9A6] text-[#0B1118] font-medium border-[#48A9A6]"
                          : "bg-[#101923] text-[#9AA8B7] border-[#273543] hover:border-[#36485C]"
                      }`}
                    >
                      {reg.region_id} ({reg.area_km2.toFixed(2)} km²)
                    </button>
                  ))}
                </div>

                {/* Selected Region Detailed Card */}
                {selectedRegion && (
                  <div className="p-3 rounded bg-[#101923] border border-[#273543] space-y-2 text-[11px] font-mono">
                    <div className="flex items-center justify-between border-b border-[#273543] pb-1.5">
                      <span className="font-semibold text-[#48A9A6] uppercase">
                        {selectedRegion.region_id} Telemetry
                      </span>
                      <span className="text-[#9AA8B7]">
                        {selectedRegion.area_km2.toFixed(2)} km² ({selectedRegion.area_pct.toFixed(1)}% of scene)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      <div>
                        <span className="text-[#718096] block">Detected Change</span>
                        <span className="text-[#E5EAF0]">{selectedRegion.change_type}</span>
                      </div>
                      <div>
                        <span className="text-[#718096] block">Land Classification</span>
                        <span className="text-[#E5EAF0]">{selectedRegion.land_type}</span>
                      </div>
                      <div>
                        <span className="text-[#718096] block">Temporal Status</span>
                        <span className="text-[#E5EAF0]">{selectedRegion.temporal_status}</span>
                      </div>
                      <div>
                        <span className="text-[#718096] block">Evidence Basis</span>
                        <span className="text-[#E5EAF0]">{selectedRegion.evidence_summary}</span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Primary Finding Banner */}
            <div className="p-4 rounded-md bg-[#141F2A] border border-[#273543] space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#48A9A6]" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#48A9A6] font-medium">
                  Primary Investigation Finding
                </span>
              </div>
              <p className="text-[14px] font-mono text-[#E5EAF0] leading-relaxed">
                "{currentMission.primary_finding}"
              </p>
            </div>

            {/* Quantitative Area Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded bg-[#101923] border border-[#273543] flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#718096]">
                  Total Changed Area
                </span>
                <div className="my-1.5">
                  <span className="text-[20px] font-mono font-semibold text-[#48A9A6] tabular-nums">
                    {currentMission.statistics.changed_area_km2.toFixed(2)} km²
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#718096]">
                  {currentMission.statistics.changed_area_pct.toFixed(1)}% of scene footprint
                </span>
              </div>

              <div className="p-3.5 rounded bg-[#101923] border border-[#273543] flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#718096]">
                  Agricultural Impact
                </span>
                <div className="my-1.5">
                  <span className="text-[20px] font-mono font-semibold text-[#CF7777] tabular-nums">
                    {currentMission.statistics.agricultural_affected_km2.toFixed(2)} km²
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#718096]">
                  {currentMission.statistics.agricultural_affected_pct.toFixed(1)}% of total scene
                </span>
              </div>

              <div className="p-3.5 rounded bg-[#101923] border border-[#273543] flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#718096]">
                  Water Inundation Expansion
                </span>
                <div className="my-1.5">
                  <span className="text-[20px] font-mono font-semibold text-[#648DB5] tabular-nums">
                    {currentMission.statistics.water_expansion_km2.toFixed(2)} km²
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#718096]">
                  Surface moisture delta
                </span>
              </div>

              <div className="p-3.5 rounded bg-[#101923] border border-[#273543] flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#718096]">
                  Total Investigated Area
                </span>
                <div className="my-1.5">
                  <span className="text-[20px] font-mono font-semibold text-[#E5EAF0] tabular-nums">
                    {currentMission.statistics.total_scene_area_km2.toFixed(2)} km²
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#718096]">
                  Sentinel-2 10m spatial frame
                </span>
              </div>
            </div>

            {/* Executive Summary Card */}
            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#273543] pb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-[#48A9A6]" />
                    <PanelTitle>Executive Investigation Summary</PanelTitle>
                  </div>
                  <span className="text-[10px] font-mono text-[#718096]">
                    Deterministic Remote Sensing Synthesis
                  </span>
                </div>

                <p className="text-[12px] font-mono text-[#E5EAF0] leading-relaxed bg-[#101923] p-3 rounded border border-[#273543]">
                  {currentMission.executive_summary}
                </p>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#718096] block mb-1.5">
                    Key Findings:
                  </span>
                  <ul className="space-y-1">
                    {currentMission.key_findings.map((kf, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] font-mono text-[#9AA8B7]">
                        <Check size={14} className="text-[#6BA88B] shrink-0 mt-0.5" />
                        <span>{kf}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <SecondaryButton onClick={handleDownloadReport} disabled={downloadingReport}>
                    <Download size={14} className="text-[#48A9A6]" />
                    <span>{downloadingReport ? "Compiling PDF Report…" : "Export Full Mission Report (PDF)"}</span>
                  </SecondaryButton>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
