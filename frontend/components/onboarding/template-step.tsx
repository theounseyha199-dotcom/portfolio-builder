"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import { PortfolioRenderer } from "@/components/portfolio/renderer/portfolio-renderer";
import {
  PORTFOLIO_TEMPLATES,
  portfolioTemplateRegistry,
  type PortfolioRenderData,
  type TemplateId,
} from "@/components/portfolio/templates";
import { Badge, Button, Card } from "@/components/ui";
import { motion, useReducedMotion } from "@/lib/motion";

const demoData: PortfolioRenderData = {
  fullName: "Alex Morgan",
  headline: "Product designer & full-stack software engineer",
  bio: "I build fast, accessible web applications and clear user experiences. Over the past 6 years, I've shipped design systems and developer tools used by thousands of teams.",
  location: "San Francisco, CA",
  projects: [
    {
      id: "demo-p1",
      title: "Design System 2.0",
      slug: "design-system-2",
      shortDescription:
        "A modular component library of 40+ accessible UI components adopted by 12 engineering teams.",
      featured: true,
      sortOrder: 1,
      technologies: ["Design Systems", "Figma", "TypeScript", "React"],
      demoUrl: "https://example.com",
      githubUrl: "https://github.com/theounseyha199-dotcom",
    },
    {
      id: "demo-p2",
      title: "Cloud Workflow Engine",
      slug: "workflow-engine",
      shortDescription:
        "Simplified multi-step cloud deployments with visual graphs and real-time execution status.",
      featured: false,
      sortOrder: 2,
      technologies: ["Next.js", "Tailwind CSS", "Go"],
      demoUrl: "https://example.com",
    },
  ],
  experiences: [
    {
      id: "demo-e1",
      company: "Starlight Labs",
      position: "Lead Product Designer",
      startDate: "2023-03-01",
      currentlyWorking: true,
      description:
        "Led core design systems, developer experience workflows, and client-facing interfaces.",
      sortOrder: 1,
    },
  ],
  educations: [
    {
      id: "demo-ed1",
      school: "University of Technology",
      degree: "B.S. in Computer Science",
      major: "Software Engineering",
      startDate: "2018-09-01",
      endDate: "2022-06-01",
      sortOrder: 1,
    },
  ],
  skills: [
    { id: "demo-s1", name: "TypeScript", category: "Code", sortOrder: 1 },
    { id: "demo-s2", name: "React / Next.js", category: "Code", sortOrder: 2 },
    { id: "demo-s3", name: "Design Systems", category: "Design", sortOrder: 3 },
    { id: "demo-s4", name: "Tailwind CSS", category: "Design", sortOrder: 4 },
  ],
  socialLinks: [
    { id: "demo-so1", platform: "GITHUB", url: "https://github.com", sortOrder: 1 },
    { id: "demo-so2", platform: "LINKEDIN", url: "https://linkedin.com", sortOrder: 2 },
  ],
};

type PreviewDevice = "desktop" | "tablet" | "mobile";
const deviceWidths: Record<PreviewDevice, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export function TemplateStep({
  selected,
  onSelect,
  onContinue,
  onBack,
}: {
  selected: TemplateId;
  onSelect: (templateId: TemplateId) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [previewId, setPreviewId] = useState<TemplateId | null>(null);
  const [device, setDevice] = useState<PreviewDevice>("desktop");

  const previewTemplate = previewId ? portfolioTemplateRegistry[previewId] : null;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Choose a starting template
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base max-w-md mx-auto">
          Pick the visual style that matches your craft. You can customize colors,
          typography, and switch templates anytime later without losing your content.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Portfolio templates"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PORTFOLIO_TEMPLATES.map((template) => {
          const isSelected = selected === template.id;
          const isDark = template.defaultTheme.mode === "dark";

          return (
            <motion.div
              key={template.id}
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <Card
                role="radio"
                aria-label={`${template.name} template`}
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => onSelect(template.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(template.id);
                  }
                }}
                className={`group flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-primary bg-white shadow-sm ring-2 ring-primary/20"
                    : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs"
                }`}
              >
                {/* Visual Header Mockup */}
                <div
                  className={`relative p-4 border-b ${
                    isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full"
                        style={{ background: template.defaultTheme.primaryColor }}
                      />
                      <span className="text-xs font-bold tracking-tight">
                        {template.name}
                      </span>
                    </div>

                    <div
                      className={`flex size-5 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 bg-white text-transparent"
                      }`}
                    >
                      {isSelected && <Check size={12} className="stroke-[3]" />}
                    </div>
                  </div>

                  {/* Wireframe Mockup */}
                  <div className="mt-3 space-y-1.5">
                    <div
                      className={`h-2.5 w-3/4 rounded ${
                        isDark ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    />
                    <div
                      className={`h-1.5 w-1/2 rounded ${
                        isDark ? "bg-slate-800/60" : "bg-slate-200/60"
                      }`}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    <div
                      className={`h-7 rounded-md border ${
                        isDark
                          ? "border-slate-800 bg-slate-900/60"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    <div
                      className={`h-7 rounded-md border ${
                        isDark
                          ? "border-slate-800 bg-slate-900/60"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                  </div>
                </div>

                {/* Body Details */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">
                        {template.name}
                      </h3>
                      <Badge variant="outline" className="text-[10px]">
                        {template.category}
                      </Badge>
                    </div>

                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {template.description}
                    </p>

                    <p className="mt-2 text-[11px] font-medium text-slate-500">
                      Best for: {template.recommendedFor.join(", ")}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewId(template.id);
                        setDevice("desktop");
                      }}
                      className="w-full text-xs font-semibold gap-1.5"
                    >
                      <Eye size={14} />
                      <span>Preview template</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onBack}
          className="w-full sm:w-auto gap-2"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Button>

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

      {/* Fullscreen Preview Modal */}
      {previewId && previewTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Template preview"
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in-50"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b border-slate-200 bg-white px-5 py-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900">
                {previewTemplate.name}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {previewTemplate.category}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <div
                aria-label="Preview device"
                className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100/70 p-1"
              >
                {(
                  [
                    { id: "desktop", icon: Monitor, label: "Desktop" },
                    { id: "tablet", icon: Tablet, label: "Tablet" },
                    { id: "mobile", icon: Smartphone, label: "Mobile" },
                  ] as const
                ).map(({ id, icon: Icon, label }) => {
                  const isActive = device === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-label={`${id} preview`}
                      aria-pressed={isActive}
                      onClick={() => setDevice(id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isActive
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        size={14}
                        className={isActive ? "text-primary" : "text-slate-400"}
                      />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  );
                })}
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onSelect(previewTemplate.id);
                  setPreviewId(null);
                }}
                className="gap-1.5 text-xs font-semibold"
              >
                <Check size={14} />
                <span>Use this template</span>
              </Button>

              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setPreviewId(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-auto rounded-b-2xl bg-slate-200/90 p-4 sm:p-8">
            <div
              data-preview-device={device}
              className="mx-auto min-h-full overflow-hidden bg-white shadow-2xl rounded-xl transition-[width] duration-300 ease-out"
              style={{ width: deviceWidths[device], maxWidth: "100%" }}
            >
              <PortfolioRenderer
                portfolio={demoData}
                templateOverride={previewId}
                themeOverride={previewTemplate.defaultTheme}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
