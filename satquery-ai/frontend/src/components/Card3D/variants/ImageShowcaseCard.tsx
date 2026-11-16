import React from "react";
import { Card3D } from "../Card3D";
import styles from "../styles/card3d.module.css";
import { TiltConfig } from "../types/card.types";

interface ImageShowcaseCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  badge?: string;
  config?: TiltConfig;
  className?: string;
  onClick?: () => void;
}

export const ImageShowcaseCard: React.FC<ImageShowcaseCardProps> = ({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  badge,
  config,
  className = "",
  onClick,
}) => {
  return (
    <Card3D
      config={config}
      onClick={onClick}
      className={`overflow-hidden cursor-pointer group !p-0 ${className}`}
    >
      {/* Background Image Layer */}
      <div className={`relative w-full aspect-[4/3] overflow-hidden ${styles.layerBg}`}>
        <img
          src={imageSrc}
          alt={imageAlt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
      </div>

      {/* Floating Foreground Content Layer */}
      <div className={`p-5 absolute bottom-0 inset-x-0 ${styles.layerForeground}`}>
        {badge && (
          <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border bg-cyan-500/15 text-cyan-300 border-cyan-400/30 mb-2">
            {badge}
          </span>
        )}
        <h4 className="text-[16px] font-bold text-white mb-1">{title}</h4>
        <p className="text-[12px] text-slate-300 font-mono">{subtitle}</p>
      </div>
    </Card3D>
  );
};
