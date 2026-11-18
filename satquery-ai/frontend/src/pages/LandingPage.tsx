import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  GitCompareArrows,
  Radar,
  Search,
  Eye,
} from "lucide-react";
import { SatelliteHeroSection } from "../components/space/SatelliteHeroSection";

const TASKS = [
  {
    icon: Search,
    title: "Visual Question Answering",
    desc: "Natural-language inquiry over multispectral optical and radar scenes for environmental and infrastructural features.",
    link: "/analyze?mode=single",
    tag: "VQA",
  },
  {
    icon: Eye,
    title: "Captioning & Grounding",
    desc: "Automated scene description generation and text-guided bounding box localization for target surface features.",
    link: "/analyze?mode=single",
    tag: "GROUNDING",
  },
  {
    icon: GitCompareArrows,
    title: "Bi-Temporal Change Analysis",
    desc: "Pixel-level divergence calculation, urban expansion tracking, and deforestation quantification between two epochs.",
    link: "/change-detection",
    tag: "TEMPORAL",
  },
  {
    icon: Radar,
    title: "Optical + SAR Cross-Fusion",
    desc: "Co-registered synthesis of optical multispectral reflectance with weather-penetrating C-band synthetic aperture radar.",
    link: "/optical-sar",
    tag: "FUSION",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1118] text-[#E5EAF0] font-sans selection:bg-[#48A9A6]/25 selection:text-[#E5EAF0]">
      {/* ── 1. Interactive Satellite Overview Section ── */}
      <SatelliteHeroSection />

      {/* ── 2. Fragmentation vs Unified Agent ───────────────── */}
      <section className="relative z-20 border-t border-[#273543] bg-[#101923] py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="p-6 rounded border border-[#273543] bg-[#141F2A]">
            <div className="text-[11px] font-mono text-[#D3A35C] uppercase tracking-wider mb-2 font-medium">
              The Operational Problem
            </div>
            <h2 className="text-xl font-semibold text-[#E5EAF0] mb-3">
              Fragmented Remote-Sensing Pipelines
            </h2>
            <p className="text-[14px] text-[#9AA8B7] leading-relaxed">
              Conventional Earth observation workflows rely on isolated software for radiometric correction, band math, change detection, and classification. Each step demands GIS domain expertise, manual reprojections, and disjointed toolchains.
            </p>
          </div>

          <div className="p-6 rounded border border-[#273543] bg-[#141F2A]">
            <div className="text-[11px] font-mono text-[#48A9A6] uppercase tracking-wider mb-2 font-medium">
              The SatQuery Solution
            </div>
            <h2 className="text-xl font-semibold text-[#E5EAF0] mb-3">
              Agentic Orchestration &amp; Verification
            </h2>
            <p className="text-[14px] text-[#9AA8B7] leading-relaxed">
              SatQuery interprets natural-language intent alongside sensor metadata. It autonomously configures specialist vision pipelines, computes calibrated confidence metrics, and outputs grounded answers backed by auditable evidence.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Multimodal Specialist Capabilities ───────────── */}
      <section className="relative z-20 border-t border-[#273543] bg-[#0B1118] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-[11px] font-mono text-[#48A9A6] uppercase tracking-wider mb-2 font-medium">
              Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#E5EAF0] tracking-tight">
              Specialized Multimodal Intelligence
            </h2>
            <p className="text-[14px] text-[#9AA8B7] mt-2">
              Autonomous execution engines calibrated for optical, synthetic aperture radar, and bi-temporal remote sensing datasets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TASKS.map(({ icon: Icon, title, desc, link, tag }) => (
              <div
                key={title}
                onClick={() => navigate(link)}
                className="p-5 rounded border border-[#273543] bg-[#141F2A] cursor-pointer group hover:bg-[#192633] hover:border-[#36485C] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded bg-[#101923] border border-[#273543] flex items-center justify-center text-[#48A9A6]">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#101923] text-[#718096] border border-[#273543]">
                      {tag}
                    </span>
                  </div>
                  <h3 className="font-medium text-[15px] text-[#E5EAF0] mb-2 group-hover:text-[#48A9A6] transition-colors">
                    {title}
                  </h3>
                  <p className="text-[13px] text-[#9AA8B7] leading-relaxed">
                    {desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#48A9A6] mt-6">
                  <span>Launch Module</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Footer ───────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-[#273543] py-6 bg-[#101923]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#718096]">
          <div>
            SatQuery AI · Geospatial Remote-Sensing Intelligence Platform
          </div>
          <div className="flex items-center gap-4 text-[#9AA8B7]">
            <button onClick={() => navigate("/dashboard")} className="hover:text-[#E5EAF0] transition-colors">Dashboard</button>
            <span>·</span>
            <button onClick={() => navigate("/analyze")} className="hover:text-[#E5EAF0] transition-colors">Analyze</button>
            <span>·</span>
            <button onClick={() => navigate("/missions")} className="hover:text-[#E5EAF0] transition-colors">Mission Mode</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
