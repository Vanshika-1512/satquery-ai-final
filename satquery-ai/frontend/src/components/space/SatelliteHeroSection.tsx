import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Play,
  Sparkles,
  Mic,
  ArrowRight,
  Satellite,
} from "lucide-react";
import { SATELLITES, SatelliteInfo } from "./SatelliteData";
import { EarthGlobe } from "./EarthGlobe";
import { RealisticSatellite } from "./RealisticSatellites";
import { Wordmark } from "../ui/primitives";

interface SatelliteHeroSectionProps {
  onDirectQuery?: (query: string, mode: string) => void;
}

export const SatelliteHeroSection: React.FC<SatelliteHeroSectionProps> = ({ onDirectQuery }) => {
  const navigate = useNavigate();

  // Active satellite index (0: Sentinel-2, 1: Sentinel-1, 2: Landsat-9, 3: WorldView-3)
  const [activeIndex, setActiveIndex] = useState(0);

  // Active scene: 0 = Hero Overview, 1 = Detailed Specs, 2 = Macro Analysis & Query
  const [scene, setScene] = useState<0 | 1 | 2>(0);

  // Active satellite object
  const currentSat: SatelliteInfo = SATELLITES[activeIndex];

  // Natural language query input state
  const [queryInput, setQueryInput] = useState("");

  const handleNextSat = () => {
    setActiveIndex((prev) => (prev + 1) % SATELLITES.length);
  };

  const handlePrevSat = () => {
    setActiveIndex((prev) => (prev - 1 + SATELLITES.length) % SATELLITES.length);
  };

  const handleRunQuery = (q: string) => {
    if (!q.trim()) return;
    if (onDirectQuery) {
      onDirectQuery(q, currentSat.presetMode);
    } else {
      navigate(`/analyze?q=${encodeURIComponent(q)}&mode=${currentSat.presetMode}`);
    }
  };

  // Keyboard navigation (left/right for satellites, up/down for scenes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowRight") handleNextSat();
      if (e.key === "ArrowLeft") handlePrevSat();
      if (e.key === "ArrowDown") setScene((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : s));
      if (e.key === "ArrowUp") setScene((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : s));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#0B1118] text-[#E5EAF0] overflow-hidden flex flex-col justify-between select-none">
      {/* ── Background Subtle Vignette ───────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(20, 31, 42, 0.6) 0%, rgba(11, 17, 24, 0.98) 100%)",
        }}
      />

      {/* ── Planet Earth Curvature ──────────────────── */}
      <EarthGlobe
        viewMode={scene === 0 ? "bottom" : scene === 1 ? "side" : "macro"}
        showScanBeam={scene === 2}
      />

      {/* ── Top Navigation Bar ── */}
      <header className="relative z-30 w-full border-b border-[#273543] bg-[#101923]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo with satellite orbit glyph */}
          <div
            onClick={() => { setScene(0); }}
            className="flex items-center gap-2.5 cursor-pointer group focus-ring rounded"
          >
            <Wordmark size={20} />
            <div>
              <div className="font-semibold text-[14px] tracking-tight text-[#E5EAF0] leading-none">
                SatQuery <span className="text-[#48A9A6]">AI</span>
              </div>
              <div className="text-[9px] uppercase tracking-wider font-mono text-[#718096] leading-none mt-1">
                Earth Observation
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#9AA8B7]">
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Analysis", path: "/analyze" },
              { label: "Change Detection", path: "/change-detection" },
              { label: "Optical + SAR", path: "/optical-sar" },
              { label: "Mission Mode", path: "/missions" },
              { label: "History", path: "/history" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="px-3 py-1.5 rounded hover:text-[#E5EAF0] hover:bg-[#141F2A] transition-colors focus-ring"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Interactive Main Content Stages ─────────── */}
      <main className="relative z-20 flex-1 flex flex-col justify-center items-center px-6 py-6">
        {/* ══════════════════════════════════════════════════════
            SCENE 0: HERO LANDING — Project Name, Tagline & Overview
            ══════════════════════════════════════════════════════ */}
        {scene === 0 && (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-between min-h-[calc(100vh-140px)]">
            <div className="flex flex-col items-center text-center mt-6 md:mt-12 max-w-3xl px-4">
              {/* Technical Monospace Tag */}
              <div className="text-[11px] font-mono tracking-widest uppercase text-[#48A9A6] mb-3">
                GEOSPATIAL REMOTE-SENSING INTELLIGENCE
              </div>

              {/* Project Name: SatQuery AI */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#E5EAF0] tracking-tight mb-2">
                SatQuery <span className="text-[#48A9A6]">AI</span>
              </h1>

              {/* Tagline */}
              <p className="text-lg sm:text-xl md:text-2xl font-normal text-[#9AA8B7] tracking-normal mb-3">
                Ask Questions. Understand Earth.
              </p>

              {/* Restrained Accent Divider */}
              <div className="w-12 h-0.5 rounded-full bg-[#48A9A6] my-3" />

              {/* Problem Statement */}
              <p className="text-[14px] md:text-[15px] text-[#9AA8B7] font-normal leading-relaxed max-w-2xl px-2 mb-6">
                An interactive vision-language intelligence platform for multimodal Earth observation. Analyze optical, SAR radar, multispectral, and bi-temporal imagery through natural-language queries.
              </p>

              {/* Action Button: Get Started */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-primary focus-ring"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => setScene(1)}
                  className="btn-secondary focus-ring"
                >
                  <span>Sensor Specifications</span>
                </button>
              </div>
            </div>

            {/* Center Main Satellite Visual */}
            <div className="relative w-full max-w-4xl h-[260px] md:h-[320px] flex flex-col items-center justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSat.id + "-main"}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  onClick={() => setScene(1)}
                  title="Click to view sensor telemetry and specifications"
                >
                  <RealisticSatellite type={currentSat.id} size="95%" isHero />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            SCENE 1: DETAILED SPECIFICATIONS
            ══════════════════════════════════════════════════════ */}
        {scene === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-140px)] py-6"
          >
            {/* Left Column: Specs, Capabilities & Actions */}
            <div className="lg:col-span-6 flex flex-col items-start px-4 z-20">
              <button
                onClick={() => setScene(0)}
                className="flex items-center gap-1.5 text-xs text-[#48A9A6] hover:text-[#3D9491] font-mono mb-4 transition-colors focus-ring rounded"
              >
                <ChevronUp size={14} />
                <span>RETURN TO OVERVIEW</span>
              </button>

              <div className="text-[11px] font-mono tracking-wider uppercase text-[#48A9A6] mb-1">
                MULTIMODAL SENSOR FLEET
              </div>

              <h2 className="text-3xl sm:text-4xl font-semibold text-[#E5EAF0] tracking-tight mb-3">
                {currentSat.name}
              </h2>

              <p className="text-[14px] text-[#9AA8B7] leading-relaxed mb-6">
                SatQuery AI automatically identifies sensor modalities, validates ephemeris parameters, and routes natural language queries to calibrated specialist vision engines for grounded, pixel-accurate reasoning.
              </p>

              {/* Key Specs Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full mb-6">
                {[
                  { label: "ORBIT", value: currentSat.specs.find((s) => s.label === "ORBIT")?.value || "786 km SSO" },
                  { label: "SENSOR", value: currentSat.sensorType },
                  { label: "BANDS", value: currentSat.specs.find((s) => s.label === "PAYLOAD")?.value || "Multispectral" },
                  { label: "SWATH", value: currentSat.specs.find((s) => s.label === "SWATH")?.value || "290 km" },
                  { label: "REASONING", value: "Auditable Trace" },
                  { label: "CONFIDENCE", value: "Calibrated Score" },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="p-3 rounded border border-[#273543] bg-[#141F2A]"
                  >
                    <div className="text-[10px] font-mono text-[#718096] uppercase tracking-wider mb-1">
                      {spec.label}
                    </div>
                    <div className="data text-[12px] font-medium text-[#E5EAF0] truncate">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScene(2)}
                  className="btn-primary focus-ring"
                >
                  <span>Query Dispatch Interface</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => navigate("/analyze")}
                  className="btn-secondary focus-ring"
                >
                  <Play size={14} />
                  <span>Open Workspace</span>
                </button>
              </div>
            </div>

            {/* Right Column: Satellite Diagram */}
            <div className="lg:col-span-6 relative w-full h-[340px] md:h-[480px] flex items-center justify-center z-10">
              <RealisticSatellite type={currentSat.id} size="95%" isSideView />
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════
            SCENE 2: MACRO SCAN & QUERY ANALYSIS
            ══════════════════════════════════════════════════════ */}
        {scene === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-140px)] py-6"
          >
            {/* Left Column: Sensor Status & Ephemeris */}
            <div className="lg:col-span-5 flex flex-col justify-center px-4 z-20">
              <button
                onClick={() => setScene(1)}
                className="flex items-center gap-1.5 text-xs text-[#48A9A6] hover:text-[#3D9491] font-mono mb-4 transition-colors focus-ring rounded"
              >
                <ChevronUp size={14} />
                <span>RETURN TO SPECIFICATIONS</span>
              </button>

              <div className="p-4 rounded border border-[#273543] bg-[#141F2A] mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#6BA88B]" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#E5EAF0] font-medium">
                    ACTIVE SENSOR FEED // {currentSat.name}
                  </span>
                </div>
                <div className="text-[13px] text-[#9AA8B7] leading-relaxed">
                  {currentSat.macroDesc}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded border border-[#273543] bg-[#101923] text-[11px] font-mono text-[#9AA8B7]">
                <Satellite size={15} className="text-[#48A9A6] shrink-0" />
                <span>EPHEMERIS: SSO 98.6° INCLINATION · SWATH: {currentSat.specs.find((s) => s.label === "SWATH")?.value || "290 km"}</span>
              </div>
            </div>

            {/* Right Column: Query Input Box */}
            <div className="lg:col-span-7 flex flex-col px-4 z-20">
              <h3 className="text-2xl font-semibold text-[#E5EAF0] tracking-tight mb-2">
                Natural-Language Geospatial Reasoning
              </h3>
              <p className="text-[14px] text-[#9AA8B7] leading-relaxed mb-5 max-w-xl">
                Formulate a query in plain English. SatQuery’s agentic controller classifies the task, validates spectral bands, routes to specialist vision models, and computes calibrated confidence scores.
              </p>

              <div className="w-full rounded border border-[#273543] bg-[#141F2A] p-5">
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#48A9A6]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>QUERY DISPATCH CONTROLLER</span>
                  </span>
                  <span className="text-[#718096]">MODE: {currentSat.sensorType}</span>
                </div>

                <div className="relative mb-3">
                  <textarea
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey || e.key === "Enter") && queryInput.trim()) {
                        e.preventDefault();
                        handleRunQuery(queryInput);
                      }
                    }}
                    placeholder={`Ask SatQuery anything about your ${currentSat.name} scene… e.g. '${currentSat.suggestedQueries[0]}'`}
                    rows={2}
                    className="w-full rounded px-3.5 py-3 pr-10 text-[14px] bg-[#101923] text-[#E5EAF0] border border-[#273543] focus:border-[#48A9A6] outline-none resize-none transition-colors placeholder:text-[#718096]"
                  />
                  <Mic size={16} className="absolute right-3.5 top-3.5 text-[#718096] hover:text-[#48A9A6] cursor-pointer transition-colors" />
                </div>

                {/* Suggested Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {currentSat.suggestedQueries.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setQueryInput(chip);
                        handleRunQuery(chip);
                      }}
                      className="text-[12px] px-2.5 py-1 rounded border border-[#273543] bg-[#192633] text-[#9AA8B7] hover:text-[#E5EAF0] hover:border-[#48A9A6] transition-colors font-normal text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#273543]">
                  <div className="text-[11px] font-mono text-[#718096]">
                    Press <kbd className="px-1 py-0.5 rounded bg-[#101923] border border-[#273543] text-[#9AA8B7]">Enter</kbd> to execute
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/analyze?mode=${currentSat.presetMode}`)}
                      className="text-[12px] text-[#9AA8B7] hover:text-[#E5EAF0] transition-colors"
                    >
                      Upload custom imagery →
                    </button>
                    <button
                      disabled={!queryInput.trim()}
                      onClick={() => handleRunQuery(queryInput)}
                      className="btn-primary"
                    >
                      <span>Execute Query</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </section>
  );
};
