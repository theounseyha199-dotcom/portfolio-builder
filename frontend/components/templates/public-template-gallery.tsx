"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  X,
} from "lucide-react";
import { PortfolioRenderer } from "@/components/portfolio/renderer/portfolio-renderer";
import {
  portfolioTemplateList,
  portfolioTemplateRegistry,
  type PortfolioRenderData,
  type TemplateCategory,
  type TemplateId,
} from "@/components/portfolio/templates";
import { Badge, Button, Card } from "@/components/ui";

const demo: PortfolioRenderData = {
  fullName: "Alex Morgan",
  headline: "Product designer building thoughtful digital experiences",
  bio: "I turn complex product problems into clear, useful experiences. Over the past 6 years, I've designed design systems, web tools, and mobile workflows used by over 50,000 active users.",
  location: "San Francisco, CA",
  projects: [
    {
      id: "demo-project-1",
      title: "Design System 2.0",
      slug: "design-system-2",
      shortDescription:
        "A modular design system of 40+ accessible UI components adopted by 12 engineering teams.",
      featured: true,
      sortOrder: 1,
      technologies: ["Design Systems", "Figma", "TypeScript", "React"],
      demoUrl: "https://example.com",
      githubUrl: "https://github.com/theounseyha199-dotcom",
    },
    {
      id: "demo-project-2",
      title: "Workflow Automation Tool",
      slug: "workflow-automation",
      shortDescription:
        "Simplified multi-step cloud deployments with visual configuration and instant feedback.",
      featured: false,
      sortOrder: 2,
      technologies: ["Next.js", "Tailwind CSS", "Go"],
      demoUrl: "https://example.com",
    },
  ],
  experiences: [
    {
      id: "demo-exp-1",
      company: "Starlight Labs",
      position: "Senior Product Designer",
      startDate: "2023-03-01",
      endDate: undefined,
      currentlyWorking: true,
      description:
        "Led product design initiatives, user research, and cross-functional design system adoption.",
      sortOrder: 1,
    },
  ],
  educations: [
    {
      id: "demo-education",
      school: "Design Institute",
      degree: "Bachelor of Design",
      major: "Interactive Media",
      startDate: "2017-09-01",
      endDate: "2021-06-01",
      sortOrder: 1,
    },
  ],
  skills: [
    { id: "demo-skill-1", name: "Product Design", category: "Design", sortOrder: 1 },
    { id: "demo-skill-2", name: "Design Systems", category: "Design", sortOrder: 2 },
    { id: "demo-skill-3", name: "TypeScript", category: "Code", sortOrder: 3 },
    { id: "demo-skill-4", name: "React / Next.js", category: "Code", sortOrder: 4 },
  ],
  socialLinks: [
    { id: "demo-social-1", platform: "GITHUB", url: "https://github.com", sortOrder: 1 },
    { id: "demo-social-2", platform: "LINKEDIN", url: "https://linkedin.com", sortOrder: 2 },
  ],
};

type Device = "desktop" | "tablet" | "mobile";
const widths: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};
const categories: Array<"ALL" | TemplateCategory> = [
  "ALL",
  "PROFESSIONAL",
  "DEVELOPER",
  "CREATIVE",
  "STUDENT",
  "MINIMAL",
];

export function PublicTemplateGallery() {
  const [category, setCategory] = useState<(typeof categories)[number]>("ALL");
  const [preview, setPreview] = useState<TemplateId | null>(null);
  const [device, setDevice] = useState<Device>("desktop");

  const shown = useMemo(
    () =>
      category === "ALL"
        ? portfolioTemplateList
        : portfolioTemplateList.filter((item) => item.category === category),
    [category],
  );

  const previewTemplate = preview ? portfolioTemplateRegistry[preview] : null;

  return (
    <>
      {/* Category Tabs */}
      <div
        className="flex flex-wrap items-center gap-1.5"
        aria-label="Template categories"
      >
        {categories.map((item) => {
          const isActive = category === item;
          return (
            <Button
              key={item}
              type="button"
              variant={isActive ? "primary" : "secondary"}
              size="sm"
              onClick={() => setCategory(item)}
              className={
                isActive
                  ? "h-8 px-3.5 text-xs font-semibold shadow-xs"
                  : "h-8 px-3.5 text-xs font-medium text-slate-600 bg-white border-slate-200 hover:bg-slate-50"
              }
            >
              {item === "ALL" ? "All" : item[0] + item.slice(1).toLowerCase()}
            </Button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((template) => {
          const isDark = template.defaultTheme.mode === "dark";
          return (
            <Card
              key={template.id}
              className="group flex flex-col overflow-hidden p-0 border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200"
            >
              {/* Thumbnail Container */}
              <div
                className={`relative h-48 p-4 ${
                  isDark ? "bg-slate-950 text-white" : "bg-slate-100/70 text-slate-900"
                }`}
              >
                <div
                  className={`h-full rounded-xl border p-4 flex flex-col justify-between shadow-xs transition-transform group-hover:scale-[1.01] ${
                    isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-current/10 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="size-3 rounded-full"
                        style={{ background: template.defaultTheme.primaryColor }}
                      />
                      <span className="text-[11px] font-bold tracking-tight">
                        {template.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono opacity-50 uppercase">
                      {template.category}
                    </span>
                  </div>

                  <div className="space-y-1.5 py-1">
                    <div
                      className={`h-2.5 w-3/4 rounded ${
                        isDark ? "bg-slate-700" : "bg-slate-800"
                      }`}
                    />
                    <div
                      className={`h-1.5 w-1/2 rounded ${
                        isDark ? "bg-slate-800" : "bg-slate-200"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`h-9 rounded-md border ${
                        isDark
                          ? "border-slate-800 bg-slate-950/60"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    />
                    <div
                      className={`h-9 rounded-md border ${
                        isDark
                          ? "border-slate-800 bg-slate-950/60"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      {template.name}
                    </h2>
                    <Badge variant="outline" className="text-[10px]">
                      {template.tier}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                    {template.description}
                  </p>
                  <p className="mt-2 text-[11px] font-medium text-slate-500">
                    Best for: {template.recommendedFor.join(", ")}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setPreview(template.id);
                      setDevice("desktop");
                    }}
                    className="flex-1 text-xs font-semibold gap-1.5"
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </Button>

                  <Link
                    href="/dashboard/builder"
                    className="flex-1 inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Large Fullscreen Template Preview Modal */}
      {preview && previewTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Template preview"
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in-50"
        >
          {/* Modal Topbar */}
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
              {/* Device Selector */}
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

              <Link
                href="/dashboard/builder"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <span>Use this template</span>
                <ArrowRight size={13} />
              </Link>

              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setPreview(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Preview Body */}
          <div className="mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-auto rounded-b-2xl bg-slate-200/90 p-4 sm:p-8">
            <div
              data-preview-device={device}
              className="mx-auto min-h-full overflow-hidden bg-white shadow-2xl rounded-xl transition-[width] duration-200"
              style={{ width: widths[device], maxWidth: "100%" }}
            >
              <PortfolioRenderer
                portfolio={demo}
                templateOverride={preview}
                themeOverride={previewTemplate.defaultTheme}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
