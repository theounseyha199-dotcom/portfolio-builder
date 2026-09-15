"use client";

import type { ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "@/lib/motion";

export function BuilderSettingsPanel({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <aside className="flex min-h-0 flex-1 flex-col overflow-hidden border-l border-slate-200/80 bg-white">
        <div className="shrink-0 border-b border-slate-100 px-5 py-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {subtitle ?? (title === "Profile" ? "Basic information shown at the top of your portfolio." : "Configure your portfolio presentation and content.")}
          </p>
        </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={title}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
      {footer && <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3">{footer}</div>}
    </aside>
  );
}
