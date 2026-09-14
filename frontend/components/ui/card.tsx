import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs",
        hover && "transition-all duration-200 hover:border-slate-300 hover:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
