import React, { useEffect, useRef } from "react";

interface StarfieldProps {
  density?: number;
  className?: string;
}

export const Starfield: React.FC<StarfieldProps> = ({ density = 180, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener("resize", handleResize);

    interface Star {
      x: number;
      y: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      speed: number;
      phase: number;
      color: string;
    }

    const starColors = ["#ffffff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#fed7aa"];
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 8000) * (density / 100);
      for (let i = 0; i < count; i++) {
        const baseAlpha = 0.2 + Math.random() * 0.7;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() < 0.85 ? 0.7 + Math.random() * 1.2 : 2.0 + Math.random() * 1.2,
          alpha: baseAlpha,
          baseAlpha,
          speed: 0.005 + Math.random() * 0.015,
          phase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, "rgba(8, 22, 50, 0.45)");
      bgGrad.addColorStop(0.55, "rgba(4, 9, 22, 0.75)");
      bgGrad.addColorStop(1, "rgba(2, 5, 14, 0.95)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const flicker = Math.sin(time * s.speed * 60 + s.phase) * 0.35;
        const currentAlpha = Math.max(0.1, Math.min(1, s.baseAlpha + flicker));

        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow for larger stars
        if (s.size > 1.8) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.95 }}
    />
  );
};

