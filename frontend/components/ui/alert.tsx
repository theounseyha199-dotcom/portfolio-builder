import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warning" | "destructive" | "success";
}

const variantStyles: Record<NonNullable<AlertProps["variant"]>, string> = {
  default: "border-slate-200 bg-slate-50 text-slate-900",
  warning: "border-amber-200 bg-amber-50/80 text-amber-900",
  destructive: "border-red-200 bg-red-50/80 text-red-900",
  success: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
};

export function Alert({
  className,
  variant = "default",
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border p-4 text-sm leading-relaxed",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
