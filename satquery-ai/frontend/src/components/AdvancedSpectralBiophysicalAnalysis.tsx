import { useState, useEffect } from "react";
import {
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import type { AdvancedChangeAnalysis, RegionSpectralData } from "../types";

interface Props {
  data?: AdvancedChangeAnalysis;
  selectedRegionIndex?: number | null;
  onSelectRegion?: (index: number | null) => void;
}

export default function AdvancedSpectralBiophysicalAnalysis({
  data,
  selectedRegionIndex = null,
  onSelectRegion,
}: Props) {
  const [activeRegion, setActiveRegion] = useState<number | null>(selectedRegionIndex);

  useEffect(() => {
    setActiveRegion(selectedRegionIndex);
  }, [selectedRegionIndex]);

  if (!data) return null;

  const currentRegionData: RegionSpectralData | undefined =
    activeRegion !== null
      ? data.regions?.find((r) => r.region_index === activeRegion)
      : undefined;

  const cards = currentRegionData ? currentRegionData.cards : data.global_cards;
  const spectralBands = currentRegionData ? currentRegionData.spectral_bands : data.spectral_bands;
  const radarData = currentRegionData ? currentRegionData.biophysical_radar : data.biophysical_radar;
  const aiInterpretation = currentRegionData
    ? currentRegionData.ai_interpretation
    : data.ai_interpretation;
  const spectralDistance = currentRegionData
    ? currentRegionData.spectral_distance
    : data.spectral_distance;

  const handleScopeChange = (idx: number | null) => {
    setActiveRegion(idx);
    if (onSelectRegion) {
      onSelectRegion(idx);
    }
  };

  return (
    <div className="mt-5 pt-5 border-t border-[#273543] space-y-4">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#48A9A6]" />
            <h3 className="text-[12px] font-mono font-semibold uppercase tracking-wider text-[#48A9A6]">
              {data.title || "Spectral & Biophysical Multi-Temporal Analysis"}
            </h3>
          </div>
          <p className="text-[11px] font-mono text-[#718096] mt-0.5">
            {data.subtitle || "Differential reflectance and radar characteristics across acquisition dates."}
          </p>
        </div>

        {/* Region Scope Selector */}
        {data.regions && data.regions.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleScopeChange(null)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
                activeRegion === null
                  ? "bg-[#48A9A6] text-[#0B1118] font-medium"
                  : "bg-[#101923] border border-[#273543] text-[#9AA8B7] hover:border-[#36485C]"
              }`}
            >
              Scene Aggregate
            </button>
            {data.regions.map((reg) => (
              <button
                key={reg.region_index}
                onClick={() => handleScopeChange(reg.region_index)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded transition-colors ${
                  activeRegion === reg.region_index
                    ? "bg-[#48A9A6] text-[#0B1118] font-medium"
                    : "bg-[#101923] border border-[#273543] text-[#9AA8B7] hover:border-[#36485C]"
                }`}
                title={`Inspect ${reg.region_id} (${reg.area_pct.toFixed(1)}% of scene)`}
              >
                {reg.region_id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Active Scope Indicator Banner ── */}
      {currentRegionData && (
        <div className="flex items-center justify-between text-[11px] font-mono text-[#E5EAF0] bg-[#101923] border border-[#273543] rounded px-3 py-1.5">
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={13} className="text-[#48A9A6]" />
            Displaying localized metrics for <strong>{currentRegionData.region_id}</strong> (covers{" "}
            {currentRegionData.area_pct.toFixed(1)}% of scene)
          </span>
          <button
            onClick={() => handleScopeChange(null)}
            className="text-[11px] text-[#48A9A6] hover:underline ml-2"
          >
            Reset to Scene
          </button>
        </div>
      )}

      {/* ── Top Metric Cards (Row of 4) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Card 1: Built-up Expansion */}
        <div className="p-3 rounded bg-[#101923] border border-[#273543] flex flex-col justify-between hover:border-[#36485C] transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#718096]">
            {cards.built_up?.title || "BUILT-UP EXPANSION"}
          </span>
          <div className="my-1.5">
            <span
              className="text-[20px] font-mono font-semibold tabular-nums leading-none"
              style={{ color: cards.built_up?.color || "#48A9A6" }}
            >
              {cards.built_up?.value || "+0.0%"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#718096]">
              {cards.built_up?.label || "Surface Shift"}
            </span>
            {cards.built_up?.t1_val && cards.built_up?.t2_val && (
              <span className="text-[10px] font-mono text-[#9AA8B7]">
                {cards.built_up.t1_val} → {cards.built_up.t2_val}
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Vegetation Change */}
        <div className="p-3 rounded bg-[#101923] border border-[#273543] flex flex-col justify-between hover:border-[#36485C] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#718096]">
              {cards.vegetation?.title || "VEGETATION CHANGE"}
            </span>
            {cards.vegetation?.ndvi_available === false && (
              <span
                className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#141F2A] text-[#CF7777] border border-[#273543]"
                title="Input is standard RGB without dedicated NIR channel"
              >
                No NIR
              </span>
            )}
          </div>
          <div className="my-1.5">
            <span
              className="text-[20px] font-mono font-semibold tabular-nums leading-none"
              style={{ color: cards.vegetation?.color || "#6BA88B" }}
            >
              {cards.vegetation?.value || "0.0%"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#718096]">
              {cards.vegetation?.label || "Vegetation Delta"}
            </span>
            {cards.vegetation?.t1_val && cards.vegetation?.t2_val && (
              <span className="text-[10px] font-mono text-[#9AA8B7]">
                {cards.vegetation.t1_val} → {cards.vegetation.t2_val}
              </span>
            )}
          </div>
        </div>

        {/* Card 3: SAR Backscatter */}
        <div className="p-3 rounded bg-[#101923] border border-[#273543] flex flex-col justify-between hover:border-[#36485C] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#718096]">
              {cards.sar?.title || "SAR BACKSCATTER"}
            </span>
            {cards.sar?.available ? (
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#141F2A] text-[#6BA88B] border border-[#273543]">
                Radar
              </span>
            ) : (
              <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-[#141F2A] text-[#718096] border border-[#273543]">
                N/A
              </span>
            )}
          </div>
          <div className="my-1.5">
            <span
              className="text-[20px] font-mono font-semibold tabular-nums leading-none"
              style={{ color: cards.sar?.color || "#648DB5" }}
            >
              {cards.sar?.value || "N/A"}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#718096]">
            {cards.sar?.label || (cards.sar?.available ? "VV / VH Dual-Pol" : "SAR input required")}
          </span>
        </div>

        {/* Card 4: Spectral Distance */}
        <div className="p-3 rounded bg-[#101923] border border-[#273543] flex flex-col justify-between hover:border-[#36485C] transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#718096]">
            {cards.spectral_distance?.title || "SPECTRAL DISTANCE"}
          </span>
          <div className="my-1.5">
            <span
              className="text-[20px] font-mono font-semibold tabular-nums leading-none text-[#E5EAF0]"
            >
              {cards.spectral_distance?.value || `${spectralDistance.toFixed(2)} RMS`}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#718096]">
            {cards.spectral_distance?.label || "T1 vs T2 Divergence"}
          </span>
        </div>
      </div>

      {/* ── Charts Grid (Left: Spectral Shift Bar, Right: Biophysical Radar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left Chart: Spectral Reflectance Shift */}
        <div className="p-4 rounded-md bg-[#101923] border border-[#273543]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#48A9A6]">
              Spectral Reflectance Shift (T1 vs T2)
            </span>
            <span className="text-[10px] font-mono text-[#718096]">DN Scale</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={spectralBands}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="band"
                  tick={{ fill: "#718096", fontSize: 10, fontFamily: "IBM Plex Mono, monospace" }}
                  axisLine={{ stroke: "#273543" }}
                  tickLine={{ stroke: "#273543" }}
                />
                <YAxis
                  tick={{ fill: "#718096", fontSize: 10, fontFamily: "IBM Plex Mono, monospace" }}
                  axisLine={{ stroke: "#273543" }}
                  tickLine={{ stroke: "#273543" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141F2A",
                    borderColor: "#273543",
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: "IBM Plex Mono, monospace",
                    color: "#E5EAF0",
                  }}
                  itemStyle={{ color: "#E5EAF0" }}
                  labelStyle={{ color: "#48A9A6", fontWeight: 600 }}
                  formatter={(value: any, name: any) => [
                    `${value} DN`,
                    name === "T1_Before" ? "Baseline (T1)" : "Current (T2)",
                  ]}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: 11,
                    fontFamily: "IBM Plex Mono, monospace",
                    color: "#9AA8B7",
                    paddingTop: 6,
                  }}
                />
                <Bar
                  dataKey="T1_Before"
                  name="Baseline (T1)"
                  fill="#648DB5"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="T2_After"
                  name="Current (T2)"
                  fill="#48A9A6"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Biophysical Indices / Radar */}
        <div className="p-4 rounded-md bg-[#101923] border border-[#273543]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#48A9A6]">
              Biophysical Indices Radar
            </span>
            <span className="text-[10px] font-mono text-[#718096]">Normalized (0–100)</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={radarData}
                margin={{ top: 8, right: 20, left: 20, bottom: 8 }}
              >
                <PolarGrid stroke="#273543" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#9AA8B7", fontSize: 10, fontFamily: "IBM Plex Mono, monospace" }}
                />
                <PolarRadiusAxis
                  stroke="#273543"
                  tick={{ fill: "#718096", fontSize: 9, fontFamily: "IBM Plex Mono, monospace" }}
                  domain={[0, 100]}
                />
                <Radar
                  name="Baseline (T1)"
                  dataKey="Before"
                  stroke="#648DB5"
                  fill="#648DB5"
                  fillOpacity={0.25}
                />
                <Radar
                  name="Current (T2)"
                  dataKey="After"
                  stroke="#48A9A6"
                  fill="#48A9A6"
                  fillOpacity={0.35}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: 11,
                    fontFamily: "IBM Plex Mono, monospace",
                    color: "#9AA8B7",
                    paddingTop: 6,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141F2A",
                    borderColor: "#273543",
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                  itemStyle={{ color: "#E5EAF0" }}
                  formatter={(value: any, name: any) => [
                    `${value} / 100`,
                    name,
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── AI-Generated Interpretation & Sensor Status ── */}
      <div className="p-4 rounded-md bg-[#101923] border border-[#273543] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#48A9A6]" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#48A9A6]">
              Evidence-Grounded Biophysical Synthesis
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#718096]">
            Automated Synthesis
          </span>
        </div>

        <p className="text-[12px] font-mono text-[#E5EAF0] leading-relaxed bg-[#141F2A] p-3 rounded border border-[#273543]">
          "{aiInterpretation}"
        </p>

        {/* Modality Status Badges */}
        {data.sensor_status && (
          <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] font-mono">
            <span className="text-[#718096]">Sensor Telemetry:</span>
            {Object.entries(data.sensor_status).map(([sensor, status]) => {
              const active = status.toLowerCase().includes("active");
              return (
                <span
                  key={sensor}
                  className={`px-2 py-0.5 rounded border flex items-center gap-1.5 ${
                    active
                      ? "bg-[#141F2A] border-[#273543] text-[#6BA88B]"
                      : "bg-[#101923] border-[#273543] text-[#718096]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      active ? "bg-[#6BA88B]" : "bg-[#718096]"
                    }`}
                  />
                  <strong className="capitalize">{sensor.replace("_", " ")}:</strong>{" "}
                  {status}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
