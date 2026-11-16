import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const STEPS = [
  "Query interpreted",
  "Input validated",
  "Modality detected",
  "Task identified",
  "Specialist model selected",
  "Inference executing",
  "Evidence validated",
  "Response generated",
];

export default function AgentExecutingPanel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a < STEPS.length - 1 ? a + 1 : a));
    }, 260);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="panel rounded-xl p-6 relative overflow-hidden mb-5 border border-cyan-500/30 bg-slate-900/80 backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.1)]">
      {/* sweep bar — glowing cyan */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div className="w-1/3 h-full sweep-bar bg-cyan-400 shadow-[0_0_10px_#22d3ee]" style={{ opacity: 0.9 }} />
      </div>
      <div className="flex items-center gap-2.5 mb-4">
        <Loader2 size={16} className="animate-spin text-cyan-400" />
        <span className="font-semibold text-[14px] text-white">
          Satellite Imagery AI Agent is executing…
        </span>
      </div>
      <div className="space-y-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 text-[13px]">
            {i < active ? (
              <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            ) : i === active ? (
              <Loader2 size={15} className="animate-spin shrink-0 text-cyan-400" />
            ) : (
              <div className="w-[15px] h-[15px] rounded-full border border-slate-700 shrink-0" />
            )}
            <span style={{ color: i <= active ? "#f8fafc" : "#64748b" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
