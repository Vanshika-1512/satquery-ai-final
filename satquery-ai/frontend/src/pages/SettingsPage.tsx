import { useState } from "react";
import { Cpu, Database, Shield, Zap, Globe } from "lucide-react";
import { Card, PanelTitle, Badge } from "../components/ui/primitives";

export default function SettingsPage() {
  const [mode, setMode] = useState<"cpu" | "gpu">("cpu");

  return (
    <div className="min-h-screen bg-[#0B1118]">
      {/* ── Page Header ── */}
      <div className="border-b border-[#273543] bg-[#101923] px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5 text-[#718096]">
            System Configuration // SatQuery AI v0.1.0
          </div>
          <h1 className="text-[20px] font-semibold text-[#E5EAF0]">
            System Settings
          </h1>
          <p className="text-[12px] font-mono text-[#9AA8B7] mt-1">
            Operational runtime parameters and local infrastructure telemetry.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* Compute */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={15} className="text-[#48A9A6]" />
            <PanelTitle>Model Compute Configuration</PanelTitle>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-[#273543]">
            <div>
              <div className="text-[13px] font-medium text-[#E5EAF0]">
                Compute Inference Mode
              </div>
              <div className="text-[11px] font-mono text-[#718096] mt-0.5">
                Toggle CPU or GPU execution target
              </div>
            </div>
            <div className="flex gap-2">
              {(["cpu", "gpu"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3.5 py-1.5 rounded text-[11px] font-mono font-medium border transition-colors ${
                    mode === m
                      ? "bg-[#48A9A6] text-[#0B1118] border-[#48A9A6]"
                      : "bg-[#101923] text-[#718096] border-[#273543] hover:text-[#9AA8B7]"
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#718096] mt-3">
            Inference executes via CPU-optimized fallback pipelines automatically when no discrete GPU is available.
          </div>
        </Card>

        {/* Storage */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Database size={15} className="text-[#48A9A6]" />
            <PanelTitle>Local Data Storage</PanelTitle>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="w-8 h-8 rounded flex items-center justify-center border border-[#273543] bg-[#101923]">
              <Database size={14} className="text-[#48A9A6]" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#E5EAF0]">
                SQLite Persistent Archive
              </div>
              <div className="text-[11px] font-mono text-[#718096] mt-0.5">
                Staged imagery, spatial crops, and mission logs are maintained locally under{" "}
                <code className="text-[#9AA8B7] bg-[#101923] px-1 py-0.5 rounded border border-[#273543]">backend/satquery.db</code>.
              </div>
            </div>
          </div>
        </Card>

        {/* API Security */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={15} className="text-[#48A9A6]" />
            <PanelTitle>Security &amp; API Enclave</PanelTitle>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center border border-[#273543] bg-[#101923] shrink-0">
              <Zap size={14} className="text-[#6BA88B]" />
            </div>
            <div className="text-[12px] font-mono text-[#9AA8B7] leading-relaxed">
              API credentials and downstream provider tokens are managed strictly on the backend layer. Client-facing components receive only authenticated, serialized inference streams.
            </div>
          </div>
        </Card>

        {/* About */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Globe size={15} className="text-[#48A9A6]" />
            <PanelTitle>About SatQuery AI</PanelTitle>
          </div>

          <p className="text-[13px] text-[#9AA8B7] leading-relaxed mb-4">
            SatQuery AI is an autonomous vision-language intelligence platform for multimodal Earth observation data. It decomposes natural-language queries across optical, SAR, and temporal satellite imagery to specialist pipelines, returning evidence-grounded spatial insights.
          </p>

          <div className="flex items-center gap-3 pt-3 border-t border-[#273543]">
            <Badge tone="primary">v0.1.0-PROD</Badge>
            <span className="text-[11px] font-mono text-[#718096]">
              Smart India Hackathon — Earth Observation AI Platform
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
