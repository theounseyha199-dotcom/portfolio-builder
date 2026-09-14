"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(
    direction === "down" ? value : 0
  );
  const prefersReducedMotion = useReducedMotion();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const duration = 1000; // 1 second smooth animation
    let animationFrameId: number;

    const timeout = setTimeout(() => {
      const start = direction === "down" ? value : 0;
      const end = value;

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const progress = Math.min(
          (timestamp - startTimeRef.current) / duration,
          1
        );

        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const current = start + (end - start) * easeProgress;

        setDisplayValue(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setDisplayValue(end);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, direction, delay, prefersReducedMotion]);

  return (
    <span
      className={cn("inline-block tabular-nums tracking-tight", className)}
    >
      {displayValue.toFixed(decimalPlaces)}
    </span>
  );
}
