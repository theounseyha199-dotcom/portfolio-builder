import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "destructive-outline"
    | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white hover:bg-blue-700 active:bg-blue-800 shadow-xs border border-transparent",
  secondary:
    "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-xs",
  outline:
    "bg-transparent text-primary border border-primary/30 hover:bg-blue-50/50 hover:border-primary active:bg-blue-50",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 border border-transparent",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-xs border border-transparent",
  "destructive-outline":
    "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 active:bg-red-100",
  link:
    "bg-transparent text-primary underline-offset-4 hover:underline border-0 p-0 h-auto font-medium",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 py-2 text-sm rounded-lg gap-2",
  lg: "h-11 px-5 text-base rounded-lg gap-2.5",
  icon: "size-9 p-0 rounded-lg justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
