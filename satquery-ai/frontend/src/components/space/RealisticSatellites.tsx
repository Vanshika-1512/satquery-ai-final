import React from "react";
import { motion } from "framer-motion";

interface SatelliteProps {
  type: "sentinel-2" | "sentinel-1" | "landsat-9" | "worldview-3";
  className?: string;
  size?: number | string;
  isHero?: boolean;
  isSideView?: boolean;
}

/* ─────────────────────────────────────────────────────────
   SENTINEL-2 (Multispectral Optical Earth Observation)
   Asymmetrical single solar wing, gold MLI bus, MSI payload
   ───────────────────────────────────────────────────────── */
export const Sentinel2Model: React.FC<{ isHero?: boolean; isSideView?: boolean }> = ({
  isHero = false,
  isSideView = false,
}) => {
  return (
    <motion.div
      animate={{
        y: [-6, 6, -6],
        rotateZ: [-1, 1, -1],
        rotateX: [0, 2, 0],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative w-full h-full flex items-center justify-center select-none"
    >
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold MLI Blanket Gradients */}
          <linearGradient id="goldMLI" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd875" />
            <stop offset="35%" stopColor="#e5a93c" />
            <stop offset="70%" stopColor="#9e6e18" />
            <stop offset="100%" stopColor="#452e05" />
          </linearGradient>
          <linearGradient id="goldMLIShine" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Solar Panel Deep Photovoltaic Blue */}
          <linearGradient id="solarCell" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="30%" stopColor="#172554" />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Solar Array Specular Glint */}
          <linearGradient id="solarGlint" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Satellite Bus Chassis Metal */}
          <linearGradient id="busChassis" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Optical Lens Sapphire Reflection */}
          <radialGradient id="msiLens" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="70%" stopColor="#082f49" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
        </defs>

        {/* ── Solar Array Wing (Left/Port side - 3 large hinged panels) ── */}
        <g id="solar-wing" className="origin-center">
          {/* Main Boom / Yoke from bus */}
          <path d="M 380,290 L 250,285 L 250,295 L 380,300 Z" fill="#64748b" stroke="#334155" strokeWidth="1" />
          <circle cx="250" cy="290" r="5" fill="#f59e0b" />

          {/* Panel 1 (closest to body) */}
          <polygon points="110,210 240,215 240,365 110,360" fill="url(#solarCell)" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Solar gridlines */}
          <line x1="175" y1="212" x2="175" y2="362" stroke="#60a5fa" strokeWidth="0.8" opacity="0.6" />
          <line x1="110" y1="260" x2="240" y2="265" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4" />
          <line x1="110" y1="310" x2="240" y2="315" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4" />

          {/* Panel 2 (middle) */}
          <polygon points="-20,205 105,210 105,360 -20,355" fill="url(#solarCell)" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="42" y1="207" x2="42" y2="357" stroke="#60a5fa" strokeWidth="0.8" opacity="0.6" />
          <line x1="-20" y1="255" x2="105" y2="260" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4" />
          <line x1="-20" y1="305" x2="105" y2="310" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4" />

          {/* Panel 3 (outer edge) */}
          <polygon points="-150,200 -25,205 -25,355 -150,350" fill="url(#solarCell)" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="-88" y1="202" x2="-88" y2="352" stroke="#60a5fa" strokeWidth="0.8" opacity="0.6" />

          {/* Gold hinges between panels */}
          <rect x="103" y="240" width="4" height="15" fill="#f59e0b" rx="1" />
          <rect x="103" y="315" width="4" height="15" fill="#f59e0b" rx="1" />
          <rect x="-27" y="235" width="4" height="15" fill="#f59e0b" rx="1" />
          <rect x="-27" y="310" width="4" height="15" fill="#f59e0b" rx="1" />

          {/* Shimmer / Specular Glint Beam moving across solar cells */}
          <motion.rect
            x="-160"
            y="200"
            width="50"
            height="170"
            fill="url(#solarGlint)"
            transform="skewX(-15)"
            opacity={0.7}
            animate={{ x: [-160, 260] }}
            transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          />
        </g>

        {/* ── Main Bus Structure (Cuboid wrapped in Gold MLI thermal foil) ── */}
        <g id="satellite-bus">
          {/* Top Panel (canted perspective) */}
          <polygon points="380,240 490,195 590,205 480,250" fill="url(#goldMLIShine)" stroke="#f59e0b" strokeWidth="1" />
          {/* Quilt seams on top */}
          <line x1="435" y1="217" x2="535" y2="227" stroke="#b45309" strokeWidth="0.75" />
          <line x1="435" y1="245" x2="540" y2="200" stroke="#b45309" strokeWidth="0.75" />

          {/* Star Tracker Pods on top bus */}
          <circle cx="460" cy="215" r="7" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="460" cy="215" r="3" fill="#38bdf8" />
          <circle cx="485" cy="220" r="7" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="485" cy="220" r="3" fill="#38bdf8" />

          {/* Front / Earth-Facing Nadir Face */}
          <polygon points="380,250 480,250 480,410 380,390" fill="url(#goldMLI)" stroke="#d97706" strokeWidth="1.5" />
          {/* Seam Grid on MLI Foil */}
          <line x1="380" y1="295" x2="480" y2="295" stroke="#92400e" strokeWidth="0.8" opacity="0.7" />
          <line x1="380" y1="345" x2="480" y2="345" stroke="#92400e" strokeWidth="0.8" opacity="0.7" />
          <line x1="430" y1="250" x2="430" y2="400" stroke="#92400e" strokeWidth="0.8" opacity="0.7" />

          {/* Side Radiator Panel */}
          <polygon points="480,250 590,205 590,360 480,410" fill="url(#busChassis)" stroke="#475569" strokeWidth="1.5" />
          {/* Thermal Radiator Louver slats */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="495"
              y1={240 + i * 20}
              x2="575"
              y2={205 + i * 20}
              stroke="#64748b"
              strokeWidth="1.2"
              opacity="0.8"
            />
          ))}

          {/* ── Multi-Spectral Instrument (MSI) Payload Aperture ── */}
          <g transform="translate(420, 315)">
            {/* Dark cylindrical aperture barrel */}
            <rect x="-24" y="-24" width="48" height="48" rx="24" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="0" cy="0" r="20" fill="url(#msiLens)" />
            {/* Muted teal focal ring */}
            <circle cx="0" cy="0" r="14" stroke="#48A9A6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
            {/* Center optical reflex glint */}
            <circle cx="-5" cy="-5" r="4" fill="#ffffff" opacity="0.85" filter="blur(0.5px)" />
            <circle cx="6" cy="6" r="2" fill="#648DB5" opacity="0.9" />
          </g>

          {/* High-Gain Steerable X-band Downlink Parabolic Dish Antenna */}
          <g transform="translate(540, 310)">
            {/* Antenna Articulated Mast */}
            <line x1="0" y1="0" x2="45" y2="-20" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="45" cy="-20" r="4" fill="#f59e0b" />
            {/* Parabolic Dish */}
            <ellipse cx="65" cy="-30" rx="26" ry="14" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" transform="rotate(-25 65 -30)" />
            <ellipse cx="63" cy="-31" rx="22" ry="11" fill="#cbd5e1" transform="rotate(-25 65 -30)" />
            {/* Feed horn */}
            <line x1="65" y1="-30" x2="80" y2="-37" stroke="#648DB5" strokeWidth="2" />
            <circle cx="80" cy="-37" r="2.5" fill="#48A9A6" />
          </g>

          {/* Cold Gas Hydrazine Micro-Thruster Nozzles */}
          <g transform="translate(378, 385)">
            <polygon points="0,0 -8,5 -8,-5" fill="#f59e0b" />
            {/* Subtle thruster cold-gas particle pulse */}
            <motion.circle
              cx="-12"
              cy="0"
              r="2"
              fill="#648DB5"
              animate={{ opacity: [0, 0.9, 0], scale: [1, 2.5] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
            />
          </g>
          <g transform="translate(592, 355)">
            <polygon points="0,0 8,5 8,-5" fill="#f59e0b" />
          </g>

          {/* S-Band Omni Antenna Rods */}
          <line x1="400" y1="245" x2="390" y2="185" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="390" cy="185" r="3" fill="#48A9A6" />
        </g>
      </svg>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   SENTINEL-1 (C-Band Synthetic Aperture Radar - SAR)
   Huge 12.3m deployable planar radar antenna, dual solar wings
   ───────────────────────────────────────────────────────── */
export const Sentinel1Model: React.FC<{ isHero?: boolean; isSideView?: boolean }> = ({
  isHero = false,
  isSideView = false,
}) => {
  return (
    <motion.div
      animate={{
        y: [-7, 7, -7],
        rotateZ: [-1.5, 1.5, -1.5],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative w-full h-full flex items-center justify-center select-none"
    >
      <svg
        viewBox="0 0 850 600"
        className="w-full h-full filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="s1Gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>
          <linearGradient id="radarAntenna" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="solarS1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
        </defs>

        {/* ── Left Solar Wing (Dual symmetrical arrays) ── */}
        <g id="s1-left-wing">
          <polygon points="120,240 280,245 280,315 120,310" fill="url(#solarS1)" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="200" y1="242" x2="200" y2="312" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
          <line x1="120" y1="275" x2="280" y2="280" stroke="#60a5fa" strokeWidth="0.6" opacity="0.4" />
        </g>

        {/* ── Right Solar Wing ── */}
        <g id="s1-right-wing">
          <polygon points="570,245 730,240 730,310 570,315" fill="url(#solarS1)" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="650" y1="242" x2="650" y2="312" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
          <line x1="570" y1="280" x2="730" y2="275" stroke="#60a5fa" strokeWidth="0.6" opacity="0.4" />
        </g>

        {/* ── Central Satellite Bus ── */}
        <polygon points="340,220 510,220 520,340 330,340" fill="url(#s1Gold)" stroke="#d97706" strokeWidth="1.5" />
        {/* MLI seams */}
        <line x1="425" y1="220" x2="425" y2="340" stroke="#92400e" strokeWidth="1" />
        <line x1="335" y1="280" x2="515" y2="280" stroke="#92400e" strokeWidth="1" />

        {/* ── 12.3m Long C-band SAR Radar Planar Antenna Array ── */}
        {/* Truss Support Beams */}
        <line x1="350" y1="340" x2="310" y2="400" stroke="#cbd5e1" strokeWidth="2.5" />
        <line x1="500" y1="340" x2="540" y2="400" stroke="#cbd5e1" strokeWidth="2.5" />
        <line x1="425" y1="340" x2="425" y2="400" stroke="#cbd5e1" strokeWidth="2.5" />

        {/* Main 5-segment Phased Array Radar Plate */}
        <polygon points="100,400 750,400 740,445 110,445" fill="url(#radarAntenna)" stroke="#0ea5e9" strokeWidth="2" />

        {/* 5 Deployable Panel Divisions */}
        {[230, 360, 490, 620].map((x) => (
          <g key={x}>
            <line x1={x} y1="400" x2={x - 2} y2="445" stroke="#f59e0b" strokeWidth="2" />
            <circle cx={x} cy="422" r="3" fill="#ffd875" />
          </g>
        ))}

        {/* Radar Waveguide Grid Array Radiating Elements */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1={120 + i * 26}
            y1="405"
            x2={120 + i * 26}
            y2="440"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity="0.75"
          />
        ))}

        {/* Holographic Radar Pulse Scanning Waves Projecting Down */}
        <motion.path
          d="M 100,450 L 50,560 L 800,560 L 750,450 Z"
          fill="url(#s1RadarBeam)"
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="s1RadarBeam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   LANDSAT-9 (NASA / USGS Earth Observation Flagship)
   Octagonal gold bus, canted solar array, OLI-2 & TIRS-2 dual payloads
   ───────────────────────────────────────────────────────── */
export const Landsat9Model: React.FC<{ isHero?: boolean; isSideView?: boolean }> = ({
  isHero = false,
  isSideView = false,
}) => {
  return (
    <motion.div
      animate={{
        y: [-6, 6, -6],
        rotateZ: [1, -1, 1],
      }}
      transition={{
        duration: 7.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative w-full h-full flex items-center justify-center select-none"
    >
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="l9Gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="80%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="l9Solar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* ── Canted Solar Wing (4 articulated panels) ── */}
        <g id="l9-solar-wing">
          <line x1="400" y1="280" x2="220" y2="230" stroke="#64748b" strokeWidth="4" />
          <polygon points="60,160 220,200 210,340 50,300" fill="url(#l9Solar)" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Panel separations */}
          <line x1="100" y1="170" x2="90" y2="310" stroke="#60a5fa" strokeWidth="1" />
          <line x1="140" y1="180" x2="130" y2="320" stroke="#60a5fa" strokeWidth="1" />
          <line x1="180" y1="190" x2="170" y2="330" stroke="#60a5fa" strokeWidth="1" />
        </g>

        {/* ── Octagonal Bus Structure ── */}
        <polygon points="370,220 480,200 540,250 540,360 480,410 370,390 330,340 330,250" fill="url(#l9Gold)" stroke="#d97706" strokeWidth="2" />

        {/* ── OLI-2 (Operational Land Imager) Sensor Aperture ── */}
        <g transform="translate(420, 350)">
          <rect x="-20" y="-20" width="40" height="40" rx="8" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="0" cy="0" r="15" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="-3" cy="-3" r="3" fill="#ffffff" opacity="0.8" />
        </g>

        {/* ── TIRS-2 (Thermal Infrared Sensor) Cryo-radiator & Dual Apertures ── */}
        <g transform="translate(485, 330)">
          <rect x="-18" y="-18" width="36" height="36" rx="6" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="-6" cy="0" r="6" fill="#ef4444" stroke="#f87171" strokeWidth="1" />
          <circle cx="6" cy="0" r="6" fill="#ef4444" stroke="#f87171" strokeWidth="1" />
        </g>

        {/* Steerable High-Gain Parabolic Communications Antenna ── */}
        <g transform="translate(530, 240)">
          <line x1="0" y1="0" x2="40" y2="-30" stroke="#94a3b8" strokeWidth="3" />
          <ellipse cx="60" cy="-45" rx="28" ry="15" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" transform="rotate(-30 60 -45)" />
          <line x1="60" y1="-45" x2="75" y2="-55" stroke="#648DB5" strokeWidth="2" />
          <circle cx="75" cy="-55" r="3" fill="#48A9A6" />
        </g>
      </svg>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   WORLDVIEW-3 (Commercial High-Resolution Optical Satellite)
   1.1m Cassegrain telescope barrel, symmetrical dual solar wings
   ───────────────────────────────────────────────────────── */
export const WorldView3Model: React.FC<{ isHero?: boolean; isSideView?: boolean }> = ({
  isHero = false,
  isSideView = false,
}) => {
  return (
    <motion.div
      animate={{
        y: [-6, 6, -6],
        rotateZ: [-1, 1, -1],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative w-full h-full flex items-center justify-center select-none"
    >
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wvCarbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="wvGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="wvSolar" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* ── Left Solar Wing ── */}
        <polygon points="110,230 270,240 270,330 110,320" fill="url(#wvSolar)" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="190" y1="235" x2="190" y2="325" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />

        {/* ── Right Solar Wing ── */}
        <polygon points="530,240 690,230 690,320 530,330" fill="url(#wvSolar)" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="610" y1="235" x2="610" y2="325" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />

        {/* ── Large Cylindrical 1.1m Optical Telescope Assembly ── */}
        {/* Telescope Barrel */}
        <rect x="340" y="190" width="120" height="200" rx="15" fill="url(#wvCarbon)" stroke="#475569" strokeWidth="2" />
        {/* Gold thermal insulation collar */}
        <rect x="336" y="270" width="128" height="35" rx="4" fill="url(#wvGold)" stroke="#d97706" strokeWidth="1.5" />

        {/* Primary Optical Aperture (Earth-facing nadir barrel) */}
        <ellipse cx="400" cy="385" rx="55" ry="24" fill="#020617" stroke="#e2e8f0" strokeWidth="2.5" />
        {/* 1.1m Mirror Reflective Surface */}
        <ellipse cx="400" cy="385" rx="44" ry="18" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Cassegrain Secondary Mirror Spider Support */}
        <line x1="365" y1="385" x2="435" y2="385" stroke="#94a3b8" strokeWidth="2" />
        <line x1="400" y1="370" x2="400" y2="400" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="400" cy="385" r="9" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="400" cy="385" r="4" fill="#67e8f9" />

        {/* Dual Steerable Gimballed High-Speed Downlink Antennas */}
        <circle cx="340" cy="230" r="14" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="460" cy="230" r="14" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   Unified Satellite Dispatcher
   ───────────────────────────────────────────────────────── */
export const RealisticSatellite: React.FC<SatelliteProps> = ({
  type,
  className = "",
  size,
  isHero = false,
  isSideView = false,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`relative ${className}`} style={style}>
      {type === "sentinel-2" && <Sentinel2Model isHero={isHero} isSideView={isSideView} />}
      {type === "sentinel-1" && <Sentinel1Model isHero={isHero} isSideView={isSideView} />}
      {type === "landsat-9" && <Landsat9Model isHero={isHero} isSideView={isSideView} />}
      {type === "worldview-3" && <WorldView3Model isHero={isHero} isSideView={isSideView} />}
    </div>
  );
};

