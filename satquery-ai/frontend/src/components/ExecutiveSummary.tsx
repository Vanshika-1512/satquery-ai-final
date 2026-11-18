import type { Mission } from '../types';
import { Card } from '../components/ui/primitives';

export default function ExecutiveSummary({ mission }: { mission: Mission }) {
  const performedAnalyses = mission.tasks
    .filter((t) => t.status === 'completed')
    .map((t) => t.title)
    .join(', ');

  return (
    <Card className="space-y-4">
      <h2 className="text-[15px] font-medium text-[#E5EAF0]">Executive Investigation Summary</h2>
      <div className="text-[13px] text-[#9AA8B7] space-y-2">
        <p>
          <strong className="text-[#E5EAF0] font-medium">Mission Objective:</strong> {mission.objective}
        </p>
        <p>
          <strong className="text-[#E5EAF0] font-medium">Investigation Performed:</strong>{' '}
          {performedAnalyses || 'No analyses executed.'}
        </p>
        <p>
          <strong className="text-[#E5EAF0] font-medium">Main Finding:</strong> {mission.primary_finding}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
        <div className="p-2.5 rounded bg-[#101923] border border-[#273543] text-center">
          <span className="text-[10px] font-mono uppercase text-[#718096]">Changed Area (km²)</span>
          <div className="text-[18px] font-mono font-semibold text-[#48A9A6] tabular-nums">
            {mission.statistics.changed_area_km2.toFixed(2)}
          </div>
        </div>
        <div className="p-2.5 rounded bg-[#101923] border border-[#273543] text-center">
          <span className="text-[10px] font-mono uppercase text-[#718096]">Agricultural Impact (km²)</span>
          <div className="text-[18px] font-mono font-semibold text-[#CF7777] tabular-nums">
            {mission.statistics.agricultural_affected_km2.toFixed(2)}
          </div>
        </div>
        <div className="p-2.5 rounded bg-[#101923] border border-[#273543] text-center">
          <span className="text-[10px] font-mono uppercase text-[#718096]">Water Expansion (km²)</span>
          <div className="text-[18px] font-mono font-semibold text-[#648DB5] tabular-nums">
            {mission.statistics.water_expansion_km2.toFixed(2)}
          </div>
        </div>
        <div className="p-2.5 rounded bg-[#101923] border border-[#273543] text-center">
          <span className="text-[10px] font-mono uppercase text-[#718096]">Observation Period</span>
          <div className="text-[13px] font-mono text-[#9AA8B7] mt-1">Multi-Temporal</div>
        </div>
      </div>
    </Card>
  );
}
