"use client";

import { ArrowRight, Check, FileText, User } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Button, Card } from "@/components/ui";
import { motion, useReducedMotion } from "@/lib/motion";
import type { PortfolioStartMethod } from "./types";

interface StartMethodOption {
  id: PortfolioStartMethod;
  title: string;
  description: string;
  badge?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const OPTIONS: StartMethodOption[] = [
  {
    id: "RESUME",
    title: "Upload Resume",
    description: "Build your portfolio quickly from your existing resume.",
    badge: "Fastest",
    icon: FileText,
  },
  {
    id: "GITHUB",
    title: "Import from GitHub",
    description: "Turn your repositories into portfolio projects.",
    badge: "For Developers",
    icon: FaGithub,
  },
  {
    id: "MANUAL",
    title: "Start Manually",
    description: "Add your profile, experience, skills, and projects yourself.",
    badge: "Full Control",
    icon: User,
  },
];

export function StartMethodStep({
  selected,
  onSelect,
  onContinue,
}: {
  selected: PortfolioStartMethod;
  onSelect: (method: PortfolioStartMethod) => void;
  onContinue: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          How would you like to start?
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base max-w-md mx-auto">
          Choose the starting point that fits your background best. You can always
          import more content later.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Portfolio starting method"
        className="grid gap-4 sm:grid-cols-3"
      >
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          const Icon = opt.icon;

          return (
            <motion.div
              key={opt.id}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <Card
                role="radio"
                aria-label={opt.title}
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => onSelect(opt.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(opt.id);
                  }
                }}
                className={`relative flex h-full cursor-pointer flex-col justify-between rounded-2xl p-6 transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-primary bg-blue-50/40 shadow-xs ring-1 ring-primary/20"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex size-11 items-center justify-center rounded-xl border transition-colors ${
                        isSelected
                          ? "border-primary/20 bg-primary text-white shadow-xs"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }`}
                    >
                      <Icon size={20} />
                    </span>

                    <div
                      className={`flex size-5 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={12} className="stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {opt.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                {opt.badge && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                      {opt.badge}
                    </span>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          size="lg"
          onClick={onContinue}
          className="w-full sm:w-auto px-8 gap-2 shadow-xs"
        >
          <span>Continue</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
