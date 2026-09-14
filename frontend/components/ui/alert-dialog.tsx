"use client";

import { createContext, useContext, useState, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const DialogContext = createContext<{
  open: boolean;
  setOpen: (value: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function AlertDialog({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  return (
    <DialogContext.Provider
      value={{ open, setOpen: onOpenChange ?? setUncontrolledOpen }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function AlertDialogTrigger({ children }: { children: ReactNode }) {
  const { setOpen } = useContext(DialogContext);
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      }}
    >
      {children}
    </span>
  );
}

export function AlertDialogContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open } = useContext(DialogContext);
  if (!open) return null;
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in-50"
    >
      <div
        role="dialog"
        className={cn(
          "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5", className)}>{children}</div>;
}

export function AlertDialogTitle({
  children,
  className,
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-slate-900", className)}>
      {children}
    </h3>
  );
}

export function AlertDialogDescription({
  children,
  className,
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-600 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function AlertDialogFooter({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AlertDialogCancel({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { setOpen } = useContext(DialogContext);
  return (
    <Button
      variant="secondary"
      className={className}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </Button>
  );
}

export function AlertDialogAction({
  children,
  className,
  variant = "primary",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "destructive";
  onClick?: () => void;
}) {
  const { setOpen } = useContext(DialogContext);
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </Button>
  );
}
