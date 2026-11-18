import React, { forwardRef, useRef } from "react";
import { Card3DProps } from "./types/card.types";

export const Card3D = forwardRef<HTMLDivElement, Card3DProps>(
  (
    {
      children,
      className = "",
      style,
      as: Component = "div",
      role = "region",
      ...rest
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const targetRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

    return (
      <Component
        ref={targetRef}
        role={role}
        className={`bg-[#141F2A] border border-[#273543] rounded-md transition-colors duration-150 hover:bg-[#192633] hover:border-[#36485C] ${className}`}
        style={style}
        {...rest}
      >
        <div className="relative w-full h-full">{children}</div>
      </Component>
    );
  }
);

Card3D.displayName = "Card3D";
