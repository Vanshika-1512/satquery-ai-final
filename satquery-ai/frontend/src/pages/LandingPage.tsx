import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  GitCompareArrows,
  Radar,
  Search,
  Eye,
  Layers,
  Cpu,
  ShieldCheck,
  Activity,
  ExternalLink,
} from "lucide-react";
import { SatelliteHeroSection } from "../components/space/SatelliteHeroSection";

const HOW_IT_WORKS = [
  { label: "Upload", desc: "Provide single, cross-modal, or bi-temporal imagery." },
  { label: "Understand", desc: "Query interpreted; modality and configuration inspected." },
  { label: "Plan", desc: "Task classified and specialist model selected from the registry." },
  { label: "Analyze", desc: "Selected model executes on the imagery." },
  { label: "Validate", desc: "Outputs and evidence signals are validated." },
  { label: "Explain", desc: "Evidence-grounded answer with cited evidence and trace returned." },
];

const TASKS = [
  {
    icon: Search,
    title: "Visual Question Answering",
    desc: "Ask natural questions about land use, infrastructure, and environmental features.",
    link: "/analyze?mode=single",
    tag: "VQA",
  },
  {
    icon: Eye,
    title: "Captioning & Grounding",
    desc: "Scene descriptions and zero-shot text-guided bounding box region highlighting.",
    link: "/analyze?mode=single",
    tag: "Grounding",
  },
  {
    icon: GitCompareArrows,
    title: "Bi-Temporal Change Analysis",
    desc: "Detect, segment, and quantify land-cover divergence between two acquisition dates.",
    link: "/change-detection",
    tag: "Temporal",
  },
  {
    icon: Radar,
    title: "Optical + SAR Fusion",
    desc: "Combine multi-spectral optical imagery with cloud-penetrating synthetic aperture radar.",
    link: "/optical-sar",
    tag: "Fusion",
  },
];

const PIPELINE = [
  "Query Understanding",
  "Input Validator",
  "Task Router",
  "Model Registry",
];

const SPECIALISTS = ["VQA Specialist", "Grounding Engine", "Captioning Module", "Bi-Temporal Change", "Optical-SAR Fusion"];

function PipelineDiagram() {
  return (
    <div className="flex flex-col items-center py-4">
      {PIPELINE.map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div className="rounded-lg px-5 py-2.5 text-[13px] font-mono border border-cyan-500/30 bg-slate-900/80 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            {step}
          </div>
          <div className="w-px h-6 bg-cyan-500/30" />
        </div>
      ))}
      <div className="flex flex-wrap justify-center items-start gap-2.5 max-w-2xl my-1">
        {SPECIALISTS.map((s) => (
          <div key={s} className="flex flex-col items-center">
            <div className="w-px h-4 bg-cyan-500/30" />
            <div className="rounded-lg px-3.5 py-2 text-[12px] font-medium whitespace-nowrap border border-blue-500/30 bg-blue-950/40 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              {s}
            </div>
          </div>
        ))}
      </div>
      <div className="w-px h-6 bg-cyan-500/30" />
      {["Evidence Validator", "Response Synthesizer"].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div className="rounded-lg px-5 py-2.5 text-[13px] font-mono border border-cyan-500/30 bg-slate-900/80 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            {step}
          </div>
          <div className="w-px h-6 bg-cyan-500/30" />
        </div>
      ))}
      <div className="rounded-xl px-6 py-3 text-[13px] font-mono text-center border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
        ✨ Evidence-Grounded Answer + Pixel Heatmap + Full Execution Trace
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ── 1. The Interactive Animated Satellite Experience ── */}
      <SatelliteHeroSection
        onDirectQuery={(q, mode) => {
          navigate(`/analyze?q=${encodeURIComponent(q)}&mode=${mode}`);
        }}
      />

      {/* ── 2. Fragmentation vs Unified Agent ───────────────── */}
      <section className="relative z-20 border-t border-slate-800/80 bg-[#040916] py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3 font-semibold">
              The Current Challenge
            </div>
            <h2
              className="text-2xl sm:text-3xl font-normal text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Remote-sensing AI is fragmented
            </h2>
            <p className="text-[14px] text-slate-300 leading-relaxed font-light">
              Existing systems are isolated, single-task applications — land-cover classifiers,
              standalone VQA models, optical change detectors — each requiring disparate data preparation,
              custom CRS reprojections, and remote-sensing expertise to operate.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-cyan-500/30 bg-slate-900/60 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.08)]">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3 font-semibold">
              The SatQuery Solution
            </div>
            <h2
              className="text-2xl sm:text-3xl font-normal text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              One agent, every workflow
            </h2>
            <p className="text-[14px] text-slate-300 leading-relaxed font-light">
              SatQuery interprets a natural-language query and imagery configuration, then automatically
              selects, validates, and executes the correct specialist workflow — no manual model selection,
              spectral band matching, or complex tool orchestration required.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Multimodal Tasks ─────────────────────────────── */}
      <section className="relative z-20 border-t border-slate-800/80 bg-[#030712] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 font-semibold">
              Specialist Capabilities
            </div>
            <h2
              className="text-3xl sm:text-4xl font-normal text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Multimodal intelligence, unified interface
            </h2>
            <div className="w-12 h-1 rounded-full glow-cyan-line mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TASKS.map(({ icon: Icon, title, desc, link, tag }) => (
              <div
                key={title}
                onClick={() => navigate(link)}
                className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md cursor-pointer group hover:border-cyan-400/50 hover:bg-slate-900/70 transition-all hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-all">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[15px] text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed font-light">
                    {desc}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mt-6 group-hover:translate-x-1 transition-transform">
                  <span>Launch Task</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── 7. Footer ───────────────────────────────────────── */}
      <footer className="relative z-20 border-t border-slate-800 py-8 bg-[#02050e]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            SatQuery AI — Agentic Remote-Sensing Intelligence Platform
          </div>

        </div>
      </footer>
    </div>
  );
}
