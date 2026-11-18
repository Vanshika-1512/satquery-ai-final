import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SATELLITES, SatelliteInfo } from "./SatelliteData";
import { EarthGlobe } from "./EarthGlobe";
import { RealisticSatellite } from "./RealisticSatellites";
import { Wordmark } from "../ui/primitives";

interface SatelliteHeroSectionProps {
  onDirectQuery?: (query: string, mode: string) => void;
}

export const SatelliteHeroSection: React.FC<SatelliteHeroSectionProps> = () => {
  const navigate = useNavigate();

  // Active satellite index (0: Sentinel-2, 1: Sentinel-1, 2: Landsat-9, 3: WorldView-3)
  const [activeIndex, setActiveIndex] = useState(0);

  // Active satellite object
  const currentSat: SatelliteInfo = SATELLITES[activeIndex];

  const handleNextSat = () => {
    setActiveIndex((prev) => (prev + 1) % SATELLITES.length);
  };

  const handlePrevSat = () => {
    setActiveIndex((prev) => (prev - 1 + SATELLITES.length) % SATELLITES.length);
  };

  // Keyboard navigation (left/right for satellites)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowRight") handleNextSat();
      if (e.key === "ArrowLeft") handlePrevSat();
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
      <EarthGlobe viewMode="bottom" showScanBeam={false} />

      {/* ── Top Navigation Bar ── */}
      <header className="relative z-30 w-full border-b border-[#273543] bg-[#101923]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo with satellite orbit glyph */}
          <div
            onClick={() => navigate("/")}
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

      {/* ── Hero Main Content ─────────── */}
      <main className="relative z-20 flex-1 flex flex-col justify-between items-center px-6 py-8 max-w-6xl mx-auto w-full min-h-[calc(100vh-140px)]">
        <div className="flex flex-col items-center text-center mt-6 md:mt-12 max-w-3xl px-4">
          {/* Technical Monospace Tag */}
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#48A9A6] mb-3">
            GEOSPATIAL REMOTE-SENSING INTELLIGENCE
          </div>

          {/* Project Name */}
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

          {/* Single Action Button: Launch Dashboard */}
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary focus-ring"
            >
              <span>Launch Dashboard</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Center Main Satellite Visual with Satellite Switcher */}
        <div className="relative w-full max-w-4xl flex flex-col items-center justify-end pb-4">
          <div className="h-[240px] md:h-[300px] w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSat.id + "-main"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full flex items-center justify-center"
              >
                <RealisticSatellite type={currentSat.id} size="95%" isHero />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtle Satellite Fleet Switcher */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handlePrevSat}
              className="p-1 rounded text-[#718096] hover:text-[#E5EAF0] transition-colors"
              title="Previous satellite"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              {SATELLITES.map((sat, i) => (
                <button
                  key={sat.id}
                  onClick={() => setActiveIndex(i)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors border ${
                    activeIndex === i
                      ? "bg-[#141F2A] border-[#48A9A6] text-[#48A9A6]"
                      : "bg-[#101923] border-[#273543] text-[#718096] hover:text-[#9AA8B7]"
                  }`}
                >
                  {sat.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextSat}
              className="p-1 rounded text-[#718096] hover:text-[#E5EAF0] transition-colors"
              title="Next satellite"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </section>
  );
};
