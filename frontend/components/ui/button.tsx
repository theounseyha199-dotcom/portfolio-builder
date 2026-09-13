import { forwardRef, type ButtonHTMLAttributes } from "react"; import { cn } from "@/lib/utils";
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => <button ref={ref} className={cn("rounded bg-primary px-4 py-2 text-white disabled:opacity-50", className)} {...props} />); Button.displayName="Button";
