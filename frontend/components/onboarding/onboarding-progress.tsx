"use client";

import { Check } from "lucide-react";
import { motion, useReducedMotion } from "@/lib/motion";

const STEPS = [
  { id: 1, label: "Start" },
  { id: 2, label: "Template" },
  { id: 3, label: "Details" },
] as const;

export function OnboardingProgress({
  currentStep,
  onStepClick,
}: {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <nav
      aria-label="Creation progress"
      className="mx-auto w-full max-w-lg px-4"
    >
      <ol className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isNavigable = isCompleted && onStepClick;

          return (
            <li
              key={step.id}
              className="flex flex-1 items-center last:flex-initial"
              aria-current={isActive ? "step" : undefined}
            >
              <button
                type="button"
                disabled={!isNavigable}
                onClick={() => isNavigable && onStepClick(step.id)}
                className={`group flex items-center gap-2.5 rounded-lg py-1 text-left text-xs font-semibold transition-all ${
                  isNavigable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-xs"
                        : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "border border-slate-300 bg-white text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={14} className="stroke-[2.5]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  {isActive && !prefersReducedMotion && (
                    <motion.div
                      layoutId="activeStepGlow"
                      className="absolute -inset-1 rounded-full border border-primary/30"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>

                <span
                  className={`hidden sm:inline transition-colors ${
                    isActive
                      ? "font-bold text-slate-900"
                      : isCompleted
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="mx-3 h-0.5 flex-1 rounded-full bg-slate-200 transition-colors"
                >
                  <div
                    className={`h-full rounded-full bg-primary transition-all duration-300 ${
                      currentStep > step.id ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
