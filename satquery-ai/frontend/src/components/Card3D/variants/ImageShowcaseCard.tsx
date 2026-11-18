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
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1118] via-[#0B1118]/60 to-transparent" />
      </div>

      {/* Floating Foreground Content Layer */}
      <div className={`p-4 absolute bottom-0 inset-x-0 ${styles.layerForeground}`}>
        {badge && (
          <span className="inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded border bg-[#192633] text-[#48A9A6] border-[#273543] mb-1.5">
            {badge}
          </span>
        )}
        <h4 className="text-[14px] font-medium text-[#E5EAF0] mb-0.5">{title}</h4>
        <p className="text-[11px] text-[#9AA8B7] font-mono">{subtitle}</p>
      </div>
    </Card3D>
  );
};
