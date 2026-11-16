import { useState } from "react";
import { Cpu, Database, Info, Shield, Zap, Globe } from "lucide-react";
import { Card, PanelTitle, Badge } from "../components/ui/primitives";

const C = {
  bg:      "#030712",
  panel:   "#08142c",
  border:  "rgba(56, 189, 248, 0.18)",
  primary: "#22d3ee",
  second:  "#cbd5e1",
  third:   "#64748b",
  text:    "#f8fafc",
  pos:     "#34d399",
};

export default function SettingsPage() {
  const [mode, setMode] = useState<"cpu" | "gpu">("cpu");

  return (
    <div
      className="min-h-screen"
      style={{ background: C.bg }}
    >
      {/* Page header */}
      <div
        className="border-b px-8 py-6"
        style={{ borderColor: C.border, background: `${C.panel}80` }}
      >
        <div
          className="text-[9px] font-mono uppercase tracking-widest mb-2"
          style={{ color: C.third }}
        >
          System Configuration // SatQuery AI v0.1.0
        </div>
        <h1
          className="text-[28px] font-black pop-heading"
          style={{
            color: C.text,
            fontFamily: "'Playfair Display', serif",
          }}
        >
          Settings
        </h1>
        <p className="text-[13px] mt-1" style={{ color: C.third }}>
          Local configuration for this SatQuery AI instance.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-5">

        {/* Compute */}
        <div
          className="rounded-xl border p-5 backdrop-blur-sm"
          style={{ background: `${C.panel}90`, borderColor: C.border }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={15} style={{ color: C.primary }} />
            <PanelTitle>Model Configuration</PanelTitle>
          </div>

          <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: C.border }}>
            <div>
              <div className="text-[13px] font-medium" style={{ color: C.text }}>
                Compute mode
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: C.third }}>
                Select CPU or GPU inference backend
              </div>
            </div>
            <div className="flex gap-2">
              {(["cpu", "gpu"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="focus-ring px-4 py-1.5 rounded-lg text-[11px] font-mono font-bold border transition-all"
                  style={
                    mode === m
                      ? { borderColor: C.primary, color: "#0a0f1e", background: C.primary }
                      : { borderColor: C.border, color: C.third, background: "transparent" }
                  }
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] mt-3 font-mono" style={{ color: C.third }}>
            No GPU detected in this environment — inference runs via CPU fallback pipelines automatically.
          </div>
        </div>

        {/* Storage */}
        <div
          className="rounded-xl border p-5 backdrop-blur-sm"
          style={{ background: `${C.panel}90`, borderColor: C.border }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Database size={15} style={{ color: C.primary }} />
            <PanelTitle>Storage</PanelTitle>
          </div>

          <div className="flex items-center gap-3 py-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{ borderColor: C.border, background: `${C.primary}10` }}
            >
              <Database size={14} style={{ color: C.primary }} />
            </div>
            <div>
              <div className="text-[13px] font-medium" style={{ color: C.text }}>
                SQLite (local)
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: C.third }}>
                Uploaded imagery, previews, and history are stored locally under{" "}
                <code className="data">backend/uploads</code> and{" "}
                <code className="data">backend/satquery.db</code>.
              </div>
            </div>
          </div>
        </div>

        {/* API */}
        <div
          className="rounded-xl border p-5 backdrop-blur-sm"
          style={{ background: `${C.panel}90`, borderColor: C.border }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield size={15} style={{ color: C.primary }} />
            <PanelTitle>API Configuration</PanelTitle>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0"
              style={{ borderColor: `${C.pos}40`, background: `${C.pos}10` }}
            >
              <Zap size={14} style={{ color: C.pos }} />
            </div>
            <div className="text-[12px] font-mono leading-relaxed" style={{ color: C.third }}>
              API keys and secrets are never exposed to the frontend. All model configuration is controlled via
              backend environment variables (see{" "}
              <code className="data">.env.example</code>).
            </div>
          </div>
        </div>

        {/* About */}
        <div
          className="rounded-xl border p-5 backdrop-blur-sm"
          style={{ background: `${C.panel}90`, borderColor: C.border }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe size={15} style={{ color: C.primary }} />
            <PanelTitle>About SatQuery AI</PanelTitle>
          </div>

          <p className="text-[13px] leading-relaxed mb-4" style={{ color: C.second }}>
            SatQuery AI is an agentic vision-language assistant for multimodal remote-sensing image analysis,
            built for the Smart India Hackathon. It routes natural-language queries across single-image,
            cross-modal (optical+SAR), and bi-temporal imagery to the appropriate specialist workflow,
            returning evidence-grounded answers and full execution traces.
          </p>

          <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: C.border }}>
            <Badge tone="cyan">v0.1.0</Badge>
            <span className="text-[11px] font-mono" style={{ color: C.third }}>
              Smart India Hackathon — Earth Observation AI Platform
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
