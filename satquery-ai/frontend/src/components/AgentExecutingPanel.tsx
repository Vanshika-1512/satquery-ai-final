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

  const progressPct = Math.round(((active + 1) / STEPS.length) * 100);

  return (
    <div className="rounded-md p-5 mb-5 border border-[#273543] bg-[#141F2A] relative overflow-hidden">
      {/* Restrained progress line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#273543]">
        <div
          className="h-full bg-[#48A9A6] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Loader2 size={16} className="animate-spin text-[#48A9A6]" />
          <span className="font-medium text-[14px] text-[#E5EAF0]">
            Autonomous Geospatial Agent Executing…
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#718096]">
          Step {active + 1} of {STEPS.length}
        </span>
      </div>

      <div className="space-y-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 text-[13px]">
            {i < active ? (
              <CheckCircle2 size={15} className="shrink-0 text-[#6BA88B]" />
            ) : i === active ? (
              <Loader2 size={15} className="animate-spin shrink-0 text-[#48A9A6]" />
            ) : (
              <div className="w-[15px] h-[15px] rounded-full border border-[#273543] shrink-0" />
            )}
            <span
              className={i <= active ? "text-[#E5EAF0]" : "text-[#718096]"}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
