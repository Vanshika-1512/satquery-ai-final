import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  Mic,
  ArrowRight,
  Layers,
  Search,
  Radar,
  GitCompare,
  Satellite,
} from "lucide-react";
import { SATELLITES, SatelliteInfo } from "./SatelliteData";
import { Starfield } from "./Starfield";
import { EarthGlobe } from "./EarthGlobe";
import { RealisticSatellite } from "./RealisticSatellites";

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

  // Left & right satellites for orbit carousel
  const prevIndex = (activeIndex - 1 + SATELLITES.length) % SATELLITES.length;
  const nextIndex = (activeIndex + 1) % SATELLITES.length;
  const prevSat = SATELLITES[prevIndex];
  const nextSat = SATELLITES[nextIndex];

  // Natural language query input state
  const [queryInput, setQueryInput] = useState("");

  const handleNextSat = () => {
    setActiveIndex((prev) => (prev + 1) % SATELLITES.length);
  };

  const handlePrevSat = () => {
    setActiveIndex((prev) => (prev - 1 + SATELLITES.length) % SATELLITES.length);
  };

  const handleSelectSat = (index: number) => {
    setActiveIndex(index);
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
    <section className="relative w-full min-h-screen bg-[#030712] text-slate-100 overflow-hidden flex flex-col justify-between select-none">
      {/* ── Layer 0: Cosmic Starfield ────────────────────────── */}
      <Starfield density={200} />

      {/* ── Layer 1: Ambient Space Glows & Vignettes ─────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(14, 165, 233, 0.12) 0%, rgba(2, 6, 23, 0.4) 60%, rgba(3, 7, 18, 0.95) 100%)",
        }}
      />

      {/* ── Layer 2: Planet Earth Curvature ──────────────────── */}
      <EarthGlobe
        viewMode={scene === 0 ? "bottom" : scene === 1 ? "side" : "macro"}
        showScanBeam={scene === 2}
      />

      {/* ── Layer 3: Top Navigation Bar (Identical to Video) ── */}
      <header className="relative z-30 w-full">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo with satellite orbit glyph */}
          <div
            onClick={() => { setScene(0); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-8 h-8 fill-none">
                <ellipse
                  cx="16"
                  cy="16"
                  rx="14"
                  ry="6"
                  stroke="#22d3ee"
                  strokeWidth="1.8"
                  transform="rotate(-26 16 16)"
                  className="group-hover:stroke-cyan-300 transition-colors"
                />
                <circle cx="16" cy="16" r="3.2" fill="#22d3ee" className="drop-shadow-[0_0_8px_#22d3ee]" />
                <circle cx="27" cy="10" r="1.8" fill="#bae6fd" />
              </svg>
            </div>
            <span
              className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              SatQuery<span className="text-cyan-400"> AI</span>
            </span>
          </div>

          {/* Navigation Links with Active Cyan Line Indicator */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-300">
            <button
              onClick={() => navigate("/dashboard")}
              className="relative py-2 hover:text-white transition-colors"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/analyze")}
              className="relative py-2 hover:text-white transition-colors"
            >
              Analysis
            </button>

            <button
              onClick={() => navigate("/change-detection")}
              className="relative py-2 hover:text-white transition-colors"
            >
              Change Detection
            </button>

            <button
              onClick={() => navigate("/optical-sar")}
              className="relative py-2 hover:text-white transition-colors"
            >
              Optical + SAR
            </button>

            <button
              onClick={() => navigate("/missions")}
              className="relative py-2 hover:text-white transition-colors"
            >
              Mission Mode
            </button>

            <button
              onClick={() => navigate("/history")}
              className="relative py-2 hover:text-white transition-colors"
            >
              History
            </button>
          </nav>


        </div>

        {/* Thin full-width horizontal divider line running across under header */}
        <div className="w-full h-px bg-slate-700/40 relative">
          {/* Active glow segment under current section */}
          <div
            className="absolute h-px bg-cyan-400 transition-all duration-700"
            style={{
              left: scene === 0 ? "46%" : scene === 1 ? "20%" : "70%",
              width: "80px",
              boxShadow: "0 0 10px #22d3ee",
            }}
          />
        </div>
      </header>

      {/* ── Layer 4: Interactive Main Content Stages ─────────── */}
      <main className="relative z-20 flex-1 flex flex-col justify-center items-center px-6 py-4">
        {/* ══════════════════════════════════════════════════════
            SCENE 0: HERO LANDING — Project Name, Tagline & Problem Statement
            ══════════════════════════════════════════════════════ */}
        {scene === 0 && (
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-between min-h-[calc(100vh-140px)]">
            {/* Center Content: Project Name, Tagline, Problem Statement, CTA */}
            <div className="flex flex-col items-center text-center mt-6 md:mt-10 max-w-3xl px-4">
              {/* Spaced Uppercase Tag */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[12px] md:text-[13px] font-semibold tracking-[0.3em] uppercase text-cyan-300/90 mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                AGENTIC REMOTE-SENSING INTELLIGENCE
              </motion.div>

              {/* Project Name: SatQuery AI */}
              <motion.h1
                initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-wide font-serif-hero drop-shadow-[0_4px_30px_rgba(255,255,255,0.2)]"
                style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
              >
                SatQuery <span className="text-cyan-400">AI</span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-xl md:text-2xl lg:text-3xl font-light text-cyan-200/90 tracking-wide mt-2 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Ask Questions. Understand Earth.
              </motion.p>

              {/* Cyan Accent Bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-1 rounded-full glow-cyan-line my-4"
              />

              {/* Problem Statement */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 }}
                className="text-[14px] md:text-[15px] lg:text-[16px] text-slate-300 font-light leading-relaxed max-w-2xl px-2 mb-6"
              >
                An interactive vision-language assistant for multimodal remote sensing image analysis through text queries.
              </motion.p>

              {/* Action Button: Get Started */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/dashboard")}
                className="glow-pill-btn px-9 py-3.5 rounded-full font-bold text-[13px] tracking-wider uppercase"
              >
                Get Started
              </motion.button>
            </div>


            {/* Center Main Satellite (Rising up from bottom) */}
            <div className="relative w-full max-w-4xl h-[260px] md:h-[340px] flex flex-col items-center justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSat.id + "-main"}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  onClick={() => setScene(1)}
                >
                  <RealisticSatellite type={currentSat.id} size="100%" isHero />
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            SCENE 1: DETAILED SPECIFICATIONS (Matches Video Frame 3, 180)
            Content left, Satellite right
            ══════════════════════════════════════════════════════ */}
        {scene === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-140px)] py-6"
          >
            {/* Left Column (Span 6): Tag, Big Title, Cyan Accent, In-Depth Specs, Buttons */}
            <div className="lg:col-span-6 flex flex-col items-start px-4 z-20">
              {/* Back to Hero Button */}
              <button
                onClick={() => setScene(0)}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono mb-4 transition-colors"
              >
                <ChevronUp size={14} />
                <span>RETURN TO ORBIT OVERVIEW</span>
              </button>

              {/* Tag: Agentic Multimodal Intelligence */}
              <div
                className="text-[12px] md:text-[13px] font-semibold tracking-[0.3em] uppercase text-cyan-300 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                AGENTIC MULTIMODAL INTELLIGENCE
              </div>

              {/* Big Serif Headline: SatQuery AI */}
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-normal text-white tracking-wide font-serif-hero drop-shadow-[0_4px_30px_rgba(255,255,255,0.15)] mb-3"
                style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
              >
                SatQuery <span className="text-cyan-400">AI</span>
              </h2>

              {/* Cyan Accent Bar */}
              <div className="w-16 h-1 rounded-full glow-cyan-line mb-5" />

              {/* Detailed Description */}
              <p className="text-[14px] md:text-[15px] text-slate-300 font-light leading-relaxed mb-6">
                SatQuery AI is an interactive vision-language assistant designed for autonomous remote-sensing intelligence. Formulate queries in natural language to analyze optical, SAR radar, multispectral, and bi-temporal imagery. The agent automatically detects sensor modalities, routes to specialist vision models, validates mathematical confidence, and synthesizes auditable, pixel-grounded answers.
              </p>

              {/* Key Specs Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full mb-8">
                {[
                  { label: "ARCHITECTURE", value: "Agentic Multi-Specialist" },
                  { label: "MODALITIES", value: "Optical, SAR & Multispectral" },
                  { label: "ANALYSIS", value: "VQA, Grounding & Change" },
                  { label: "FUSION", value: "Optical + SAR Cross-Modal" },
                  { label: "REASONING", value: "Auditable Execution Trace" },
                  { label: "CONFIDENCE", value: "Calibrated Decision Engine" },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/60 backdrop-blur-md"
                  >
                    <div className="text-[10px] font-mono text-cyan-400/90 uppercase tracking-wider mb-0.5">
                      {spec.label}
                    </div>
                    <div className="text-[12px] font-medium text-slate-200 truncate">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons: Explore Capabilities pill button + circular play button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setScene(2)}
                  className="glow-pill-btn px-8 py-3.5 rounded-full font-bold text-[13px] tracking-wider uppercase transition-all"
                >
                  Explore Capabilities
                </button>

                <button
                  onClick={() => navigate("/analyze")}
                  className="glow-circle-play w-12 h-12 rounded-full flex items-center justify-center text-[#030712] cursor-pointer"
                  title="Run Specialist Pipeline"
                >
                  <Play size={18} className="fill-current ml-0.5" />
                </button>

                <button
                  onClick={() => setScene(2)}
                  className="glow-down-arrow w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer ml-2"
                  title="Scroll to Macro Live Analysis"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Right Column (Span 6): Satellite positioned on right half (Matches Video) */}
            <div className="lg:col-span-6 relative w-full h-[360px] md:h-[520px] flex items-center justify-center z-10">
              <motion.div
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1.15 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full"
              >
                <RealisticSatellite type={currentSat.id} size="100%" isSideView />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════
            SCENE 2: MACRO SCAN & QUERY ANALYSIS (Matches Video Frame 6, 360)
            Satellite zoomed top-left with sensor scan, query box bottom-right
            ══════════════════════════════════════════════════════ */}
        {scene === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-140px)] py-6"
          >
            {/* Top-Left / Background Satellite Swath Visual Indicator */}
            <div className="lg:col-span-5 flex flex-col justify-center px-4 z-20">
              <button
                onClick={() => setScene(1)}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono mb-4 transition-colors"
              >
                <ChevronUp size={14} />
                <span>RETURN TO SPECIFICATIONS</span>
              </button>

              <div className="p-4 rounded-xl border border-cyan-500/20 bg-slate-950/70 backdrop-blur-md mb-4 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
                    ACTIVE SWATH ACQUISITION // {currentSat.name}
                  </span>
                </div>
                <div className="text-[13px] text-slate-300 leading-relaxed font-light">
                  {currentSat.macroDesc}
                </div>
              </div>

              {/* Satellite Miniature Telemetry */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/50 text-[11px] font-mono text-slate-400">
                <Satellite size={16} className="text-cyan-400 shrink-0" />
                <span>EPHEMERIS: SSO 98.6° INCLINATION • SWATH: {currentSat.specs.find(s=>s.label==="SWATH")?.value || "290 km"}</span>
              </div>
            </div>

            {/* Bottom-Right (Span 7): Query Input Box & Direct Action (Matches Video text positioning) */}
            <div className="lg:col-span-7 flex flex-col px-4 z-20">
              {/* Cyan Accent Bar on Right Side (Directly matches Video Frame 6!) */}
              <div className="w-20 h-1.5 rounded-full glow-cyan-line mb-4 self-start lg:self-end" />

              <h3
                className="text-2xl md:text-3xl font-normal text-white tracking-wide font-serif-hero mb-3 self-start lg:self-end text-left lg:text-right"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Natural-Language Remote-Sensing Intelligence
              </h3>

              <p className="text-[14px] text-slate-300 leading-relaxed font-light mb-6 self-start lg:self-end text-left lg:text-right max-w-xl">
                Ask anything about your satellite imagery in plain English. SatQuery’s agentic controller classifies your question, validates spectral bands, routes to specialist models, and returns pixel-level masks and cited evidence.
              </p>

              {/* ── THE QUERY INPUT BOX (Glassmorphic Deep Space Theme) ── */}
              <div className="w-full rounded-2xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-xl p-5 shadow-[0_0_40px_rgba(14,165,233,0.15)]">
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} />
                    <span>QUERY DISPATCH CONTROLLER</span>
                  </span>
                  <span className="text-slate-400">MODE: {currentSat.sensorType}</span>
                </div>

                <div className="relative mb-4">
                  <textarea
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey || e.key === "Enter") && queryInput.trim()) {
                        e.preventDefault();
                        handleRunQuery(queryInput);
                      }
                    }}
                    placeholder={`Ask SatQuery anything about your ${currentSat.name} imagery… e.g. '${currentSat.suggestedQueries[0]}'`}
                    rows={2}
                    className="w-full rounded-xl px-4 py-3.5 pr-12 text-[15px] bg-[#030712] text-white border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none resize-none transition-all placeholder:text-slate-500"
                  />
                  <Mic size={16} className="absolute right-4 top-4 text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors" />
                </div>

                {/* Suggested Natural Language Query Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentSat.suggestedQueries.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setQueryInput(chip);
                        handleRunQuery(chip);
                      }}
                      className="text-[12px] px-3 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-950/30 transition-all font-medium text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Enter</kbd> to analyze
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/analyze?mode=${currentSat.presetMode}`)}
                      className="text-[12px] text-slate-400 hover:text-white transition-colors"
                    >
                      Upload custom imagery →
                    </button>
                    <button
                      disabled={!queryInput.trim()}
                      onClick={() => handleRunQuery(queryInput)}
                      className="glow-pill-btn px-6 py-2.5 rounded-full font-bold text-[12px] tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      <span>Run Analysis</span>
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

