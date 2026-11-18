import { useEffect, useState } from "react";
import { Boxes, ArrowRight, Cpu, Layers, Zap, AlertTriangle } from "lucide-react";
import { Badge } from "../components/ui/primitives";
import { humanizeIdentifier, taskLabel } from "../utils/format";
import { api } from "../services/api";
import type { ModelCard } from "../types";

export default function ModelsPage() {
  const [models, setModels] = useState<ModelCard[]>([]);

  useEffect(() => {
    api.getModels().then(setModels);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1118]">
      {/* ── Page Header ── */}
      <div className="border-b border-[#273543] bg-[#101923] px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-[10px] font-mono uppercase tracking-widest mb-1.5 text-[#718096]">
            Specialist Pipeline Registry // SatQuery AI
          </div>
          <h1 className="text-[20px] font-semibold text-[#E5EAF0]">
            Model Registry &amp; Specialist Pipelines
          </h1>
          <p className="text-[12px] font-mono text-[#9AA8B7] mt-1">
            Deterministic routing registry connecting user tasks with specialist vision-language checkpoints.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        {/* Stats bar */}
        <div className="flex items-center gap-6 p-3.5 rounded-md border border-[#273543] bg-[#141F2A] text-[11px] font-mono flex-wrap">
          {[
            { icon: Boxes,  label: "Total Models",    val: `${models.length}` },
            { icon: Zap,    label: "Ready",            val: `${models.filter(m => m.status === "ready").length}` },
            { icon: Cpu,    label: "Inference Mode",   val: "Hybrid Fallback" },
            { icon: Layers, label: "Pipeline Routes",  val: "3 Specialists" },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={13} className="text-[#48A9A6]" />
              <span className="text-[#718096]">{label}:</span>
              <span className="text-[#E5EAF0] font-medium">{val}</span>
            </div>
          ))}
        </div>

        {/* Model cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((m) => (
            <div
              key={m.name}
              className="rounded-md border border-[#273543] bg-[#141F2A] p-5 transition-colors hover:border-[#36485C]"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded flex items-center justify-center border border-[#273543] bg-[#101923]">
                    <Boxes size={15} className="text-[#48A9A6]" />
                  </div>
                  <div>
                    <div className="font-medium text-[14px] text-[#E5EAF0]">
                      {humanizeIdentifier(m.name)}
                    </div>
                    <div className="text-[10px] font-mono text-[#718096]">
                      {m.name}
                    </div>
                  </div>
                </div>
                <Badge tone={m.status === "ready" ? "teal" : "amber"}>
                  {m.status.toUpperCase()}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-[12px] leading-relaxed mb-4 text-[#9AA8B7]">
                {m.description}
              </p>

              {/* Specs grid */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded border border-[#273543] bg-[#101923] text-[11px] mb-3">
                {[
                  { label: "Task",        val: taskLabel(m.task) },
                  { label: "Input",       val: m.input_type },
                  { label: "Model Type",  val: m.model_type },
                  { label: "Version",     val: m.version },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div className="font-mono text-[#718096] text-[10px]">{label}</div>
                    <div className="font-mono text-[#E5EAF0] mt-0.5">{val}</div>
                  </div>
                ))}
              </div>

              {/* Output types */}
              <div className="flex flex-wrap gap-1.5">
                {m.output_type.map((o) => (
                  <span
                    key={o}
                    className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border border-[#273543] bg-[#101923] text-[#718096]"
                  >
                    <ArrowRight size={9} /> {o}
                  </span>
                ))}
              </div>

              {/* Not adapted warning */}
              {!m.adapted && (
                <div className="mt-3 pt-3 border-t border-[#273543] flex items-center gap-1.5 text-[11px] font-mono text-[#D3A35C]">
                  <AlertTriangle size={13} className="shrink-0" />
                  <span>Calibrated with fallback heuristic weights until domain fine-tuning.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
