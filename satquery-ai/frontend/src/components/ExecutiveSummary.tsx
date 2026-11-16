import React from 'react';
import type { Mission } from '../types';
import { Card } from '../components/ui/primitives';

export default function ExecutiveSummary({ mission }: { mission: Mission }) {
  const performedAnalyses = mission.tasks
    .filter((t) => t.status === 'completed')
    .map((t) => t.title)
    .join(', ');

  return (
    <Card className="space-y-4 p-4 bg-[#040916] border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.06)]">
      <h2 className="text-lg font-bold text-white">Executive Summary</h2>
      <div className="text-[13px] text-slate-300 space-y-2">
        <p>
          <strong className="text-white">Mission Objective:</strong> {mission.objective}
        </p>
        <p>
          <strong className="text-white">Investigation Performed:</strong>{' '}
          {performedAnalyses || 'No analyses executed.'}
        </p>
        <p>
          <strong className="text-white">Main Finding:</strong> {mission.primary_finding}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
        <div className="p-2.5 rounded-lg bg-[#030712] border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400">Changed Area (km²)</span>
          <div className="text-[18px] font-black text-cyan-400">
            {mission.statistics.changed_area_km2.toFixed(2)}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#030712] border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400">Agricultural Impact (km²)</span>
          <div className="text-[18px] font-black text-cyan-400">
            {mission.statistics.agricultural_affected_km2.toFixed(2)}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#030712] border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400">Water Expansion (km²)</span>
          <div className="text-[18px] font-black text-cyan-400">
            {mission.statistics.water_expansion_km2.toFixed(2)}
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-[#030712] border border-slate-800 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400">Observation Period</span>
          <div className="text-[13px] font-medium text-slate-300">N/A</div>
        </div>
      </div>
    </Card>
  );
}
