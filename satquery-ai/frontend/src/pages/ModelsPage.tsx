import { useEffect, useState } from "react";
import { Boxes, ArrowRight, Cpu, Layers, Zap, AlertTriangle } from "lucide-react";
import { Badge } from "../components/ui/primitives";
import { humanizeIdentifier, taskLabel } from "../utils/format";
import { api } from "../services/api";
import type { ModelCard } from "../types";

const C = {
  bg:      "#030712",
  panel:   "#08142c",
  border:  "rgba(56, 189, 248, 0.18)",
  primary: "#22d3ee",
  second:  "#cbd5e1",
  third:   "#64748b",
  text:    "#f8fafc",
  pos:     "#34d399",
  amber:   "#fbbf24",
};

export default function ModelsPage() {
  const [models, setModels] = useState<ModelCard[]>([]);

  useEffect(() => {
    api.getModels().then(setModels);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Page header */}
      <div
        className="border-b px-8 py-6"
        style={{ borderColor: C.border, background: `${C.panel}80` }}
      >
        <div
          className="text-[9px] font-mono uppercase tracking-widest mb-2"
          style={{ color: C.third }}
        >
          Specialist Pipeline Registry // SatQuery AI
        </div>
        <h1
          className="text-[28px] font-black pop-heading"
          style={{ color: C.text, fontFamily: "'Playfair Display', serif" }}
        >
          Model Registry
        </h1>
        <p className="text-[13px] mt-1" style={{ color: C.third }}>
          Structured specialist tools the agent routes between. Fallback inference is clearly labeled and
          the architecture is ready for real trained checkpoints to be dropped in.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Stats bar */}
        <div
          className="flex items-center gap-6 p-4 rounded-xl border mb-6 text-[11px] font-mono"
          style={{ background: `${C.panel}80`, borderColor: C.border }}
        >
          {[
            { icon: Boxes,  label: "Total Models",    val: `${models.length}` },
            { icon: Zap,    label: "Ready",            val: `${models.filter(m => m.status === "ready").length}` },
            { icon: Cpu,    label: "Inference Mode",   val: "CPU Fallback" },
            { icon: Layers, label: "Pipeline Routes",  val: "3 Specialists" },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={12} style={{ color: C.primary }} />
              <span style={{ color: C.third }}>{label}:</span>
              <span className="font-bold" style={{ color: C.primary }}>{val}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {models.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border p-5 backdrop-blur-sm transition-all hover:border-cyan-400/40 group"
              style={{ background: `${C.panel}90`, borderColor: C.border }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{ borderColor: C.border, background: `${C.primary}10` }}
                  >
                    <Boxes size={16} style={{ color: C.primary }} />
                  </div>
                  <div>
                    <div
                      className="font-semibold text-[14px]"
                      style={{ color: C.text }}
                    >
                      {humanizeIdentifier(m.name)}
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: C.third }}>
                      {m.name}
                    </div>
                  </div>
                </div>
                <Badge tone={m.status === "ready" ? "teal" : "amber"}>
                  {m.status.toUpperCase()}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: C.second }}>
                {m.description}
              </p>

              {/* Specs grid */}
              <div
                className="grid grid-cols-2 gap-2 p-3 rounded-lg border text-[11px] mb-3"
                style={{ borderColor: C.border, background: `${C.bg}80` }}
              >
                {[
                  { label: "Task",        val: taskLabel(m.task) },
                  { label: "Input",       val: m.input_type },
                  { label: "Model Type",  val: m.model_type },
                  { label: "Version",     val: m.version },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div className="font-mono" style={{ color: C.third }}>{label}</div>
                    <div className="font-medium data mt-0.5" style={{ color: C.second }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Output types */}
              <div className="flex flex-wrap gap-1.5">
                {m.output_type.map((o) => (
                  <span
                    key={o}
                    className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border"
                    style={{ borderColor: C.border, color: C.third }}
                  >
                    <ArrowRight size={9} /> {o}
                  </span>
                ))}
              </div>

              {/* Not adapted warning */}
              {!m.adapted && (
                <div
                  className="mt-3 pt-3 border-t flex items-center gap-1.5 text-[11px] font-mono"
                  style={{ borderColor: C.border, color: C.amber }}
                >
                  <AlertTriangle size={12} />
                  Not yet fine-tuned on remote-sensing data — running fallback heuristic inference.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
