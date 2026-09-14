"use client";

import React, { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "0.75rem",
      background = "rgba(29, 78, 216, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(29,78,216,0.3)]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Spark container */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-visible [container-type:size]"
        >
          <div className="absolute inset-0 size-full animate-[spin_4s_linear_infinite] [mask:linear-gradient(white,transparent_50%)]">
            <div className="absolute -inset-[100%] size-[300%] opacity-20 [background:radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_0%,transparent_60%)]" />
          </div>
        </div>

        {/* Backdrop */}
        <div className="absolute [border-radius:var(--radius)] inset-[1px] -z-10 bg-inherit transition-colors duration-300 group-hover:bg-blue-700" />

        {children}
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
