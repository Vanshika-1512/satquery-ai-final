import React from "react";
import { motion } from "framer-motion";

interface EarthGlobeProps {
  viewMode?: "bottom" | "side" | "macro";
  className?: string;
  showScanBeam?: boolean;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  viewMode = "bottom",
  className = "",
  showScanBeam = false,
}) => {
  return (
    <div
      className={`absolute pointer-events-none transition-all duration-1000 ease-out select-none ${className}`}
      style={{
        zIndex: 1,
        ...(viewMode === "bottom"
          ? {
              left: "50%",
              bottom: "-48vw",
              transform: "translateX(-50%)",
              width: "110vw",
              height: "110vw",
              maxWidth: "1400px",
              maxHeight: "1400px",
            }
          : viewMode === "side"
          ? {
              right: "-12vw",
              top: "50%",
              transform: "translateY(-45%)",
              width: "55vw",
              height: "55vw",
              maxWidth: "850px",
              maxHeight: "850px",
            }
          : {
              left: "-18vw",
              top: "-15vw",
              width: "95vw",
              height: "95vw",
              maxWidth: "1300px",
              maxHeight: "1300px",
            }),
      }}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden">
        {/* Outer Atmospheric Rayleigh Scattering Glow */}
        <div
          className="absolute -inset-6 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.45) 60%, rgba(59, 130, 246, 0.25) 75%, transparent 88%)",
            filter: "blur(22px)",
          }}
        />

        {/* Crisp Atmospheric Blue Rim Line */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "inset 0 0 45px 8px rgba(56, 189, 248, 0.9), inset 0 0 100px 30px rgba(14, 165, 233, 0.5), 0 0 35px 4px rgba(34, 211, 238, 0.8)",
          }}
        />

        {/* Planet Surface & Oceans Base */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 45% 40%, #1e40af 0%, #0c235c 40%, #051438 70%, #020817 95%)",
          }}
        />

        {/* Continents & Landmasses Texture Layers */}
        <svg
          viewBox="0 0 1000 1000"
          className="absolute inset-0 w-full h-full opacity-85"
          style={{
            animation: "earth-spin 120s linear infinite",
            transformOrigin: "50% 50%",
          }}
        >
          <defs>
            <radialGradient id="oceanGlow" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#082f49" stopOpacity="0.0" />
            </radialGradient>
            <filter id="landShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="-2" dy="2" stdDeviation="3" floodColor="#020617" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Continents vector forms */}
          <g filter="url(#landShadow)">
            {/* North America / Greenland */}
            <path
              d="M 280,260 Q 320,240 370,270 T 430,340 T 360,420 T 300,380 Z"
              fill="#164e63"
              stroke="#0e7490"
              strokeWidth="2"
              opacity="0.85"
            />
            {/* South America */}
            <path
              d="M 370,440 Q 430,470 410,560 T 380,660 T 340,540 Z"
              fill="#155e75"
              stroke="#0891b2"
              strokeWidth="2"
              opacity="0.8"
            />
            {/* Eurasia */}
            <path
              d="M 500,240 Q 640,210 750,260 T 820,380 T 680,420 T 540,320 Z"
              fill="#1e3a8a"
              stroke="#1d4ed8"
              strokeWidth="2"
              opacity="0.75"
            />
            {/* Africa */}
            <path
              d="M 520,360 Q 620,370 610,480 T 560,590 T 490,470 Z"
              fill="#164e63"
              stroke="#0891b2"
              strokeWidth="2"
              opacity="0.85"
            />
            {/* Indo-Pacific / Australia */}
            <path
              d="M 720,520 Q 800,530 810,610 T 730,640 T 690,560 Z"
              fill="#0e7490"
              stroke="#06b6d4"
              strokeWidth="2"
              opacity="0.8"
            />
          </g>

          {/* Cloud Band Layers */}
          <g opacity="0.65" style={{ mixBlendMode: "screen" }}>
            <path
              d="M 150,320 Q 350,290 550,330 T 900,310 Q 750,380 450,360 Z"
              fill="#e0f2fe"
              opacity="0.7"
              filter="blur(5px)"
            />
            <path
              d="M 200,450 Q 400,490 600,460 T 950,480 Q 700,520 300,500 Z"
              fill="#f0f9ff"
              opacity="0.6"
              filter="blur(7px)"
            />
            {/* Cyclone / Vortex swirl */}
            <circle cx="620" cy="380" r="45" fill="none" stroke="#f8fafc" strokeWidth="8" opacity="0.5" filter="blur(4px)" strokeDasharray="30 15" />
          </g>

          {/* City Night Lights on the Terminator Edge */}
          <g opacity="0.9" style={{ mixBlendMode: "color-dodge" }}>
            <circle cx="580" cy="400" r="2.5" fill="#fef08a" filter="blur(1px)" />
            <circle cx="610" cy="430" r="2" fill="#fed7aa" filter="blur(1px)" />
            <circle cx="550" cy="420" r="3" fill="#fde047" filter="blur(1px)" />
            <circle cx="640" cy="390" r="2" fill="#fef08a" />
            <circle cx="590" cy="460" r="2.5" fill="#fde047" />
            <circle cx="670" cy="430" r="3" fill="#fed7aa" filter="blur(1px)" />
            <circle cx="700" cy="380" r="2" fill="#fef08a" />
            <circle cx="720" cy="410" r="2.5" fill="#fde047" />
            <circle cx="530" cy="360" r="2" fill="#fed7aa" />
            <circle cx="750" cy="450" r="2" fill="#fef08a" />
          </g>
        </svg>

        {/* Day / Night Terminator Shadow Mask */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%, rgba(0, 0, 0, 0.75) 75%, rgba(2, 6, 23, 0.96) 100%)",
          }}
        />

        {/* Specular Sun Glint Reflection on Ocean Water */}
        <div
          className="absolute rounded-full"
          style={{
            top: "22%",
            left: "38%",
            width: "35%",
            height: "25%",
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.45) 0%, rgba(186, 230, 253, 0.2) 40%, transparent 75%)",
            filter: "blur(12px)",
            transform: "rotate(-15deg)",
          }}
        />

        {/* Dynamic Holographic Sensor Scanning Swath Beam (Scene 3 / Macro) */}
        {showScanBeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Scanning conical beam projecting from satellite to earth surface */}
            <svg viewBox="0 0 1000 1000" className="w-full h-full">
              <defs>
                <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="60%" y2="70%">
                  <stop offset="0%" stopColor="#48A9A6" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#648DB5" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#648DB5" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon points="350,150 200,600 550,550" fill="url(#scanBeamGrad)" />
              {/* Ground Track Swath Footprint */}
              <ellipse cx="375" cy="575" rx="180" ry="40" fill="rgba(72, 169, 166, 0.1)" stroke="#48A9A6" strokeWidth="1.2" strokeDasharray="6 4" />
            </svg>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes earth-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

