import { HelpCircle } from "lucide-react";
import { Card, PanelTitle } from "./ui/primitives";

export default function ClarificationCard({
  answer,
  options,
  inputImage,
  onPick,
}: {
  answer: string;
  options: string[];
  inputImage?: string;
  onPick: (query: string) => void;
}) {
  return (
    <Card>
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded bg-[#192633] border border-[#273543] flex items-center justify-center shrink-0">
          <HelpCircle size={16} className="text-[#D3A35C]" />
        </div>
        <div className="flex-1">
          <PanelTitle>Clarification Needed</PanelTitle>
          <p className="text-[13px] text-[#9AA8B7] leading-relaxed">{answer}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => onPick(opt)}
                className="focus-ring text-[12px] font-mono px-3 py-1.5 rounded border border-[#273543] bg-[#101923] text-[#D3A35C] hover:border-[#D3A35C]/60 hover:bg-[#192633] transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {inputImage && (
          <img
            src={inputImage}
            alt="Reference thumbnail"
            className="w-20 h-20 object-cover rounded border border-[#273543] shrink-0"
          />
        )}
      </div>
    </Card>
  );
}
