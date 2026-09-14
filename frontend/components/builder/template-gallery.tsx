"use client";

import { Check, Eye, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  PortfolioRenderer,
  type PortfolioData,
} from "@/components/portfolio/renderer/portfolio-renderer";
import {
  portfolioTemplateList,
  portfolioTemplateRegistry,
  type TemplateCategory,
  type TemplateId,
} from "@/components/portfolio/templates";
import { Badge, Button, Card } from "@/components/ui";
import { useUpdatePortfolioDesignMutation } from "@/features/portfolio/design-api";

type Device = "desktop" | "tablet" | "mobile";
const filters: Array<"ALL" | TemplateCategory> = [
  "ALL",
  "PROFESSIONAL",
  "DEVELOPER",
  "CREATIVE",
  "STUDENT",
  "MINIMAL",
];
const widths: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

export function TemplateGallery({
  portfolio,
  currentTemplate,
  onApplied,
}: {
  portfolio: PortfolioData;
  currentTemplate: TemplateId;
  onApplied: () => void | Promise<void>;
}) {
  const [category, setCategory] = useState<(typeof filters)[number]>("ALL");
  const [previewId, setPreviewId] = useState<TemplateId | null>(null);
  const [confirmId, setConfirmId] = useState<TemplateId | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [notice, setNotice] = useState("");
  const [updateDesign, { isLoading }] = useUpdatePortfolioDesignMutation();

  const templates = useMemo(
    () =>
      category === "ALL"
        ? portfolioTemplateList
        : portfolioTemplateList.filter((template) => template.category === category),
    [category],
  );
  const previewTemplate = previewId ? portfolioTemplateRegistry[previewId] : null;

  async function applyTemplate(id: TemplateId) {
    const template = portfolioTemplateRegistry[id];
    setNotice("");
    try {
      await updateDesign({
        templateKey: id,
        themeConfig: template.defaultTheme,
      }).unwrap();
      setConfirmId(null);
      setPreviewId(null);
      setNotice(`${template.name} template applied.`);
      await onApplied();
    } catch {
      setNotice(
        "Unable to apply template. Your current template has not changed.",
      );
    }
  }

  return (
    <section aria-labelledby="template-gallery-title" className="space-y-5">
      {/* Category Pills */}
      <div
        aria-label="Template categories"
        className="flex flex-wrap items-center gap-1.5"
      >
        {filters.map((filter) => {
          const isActive = category === filter;
          const label =
            filter === "ALL" ? "All" : filter[0] + filter.slice(1).toLowerCase();
          return (
            <Button
              key={filter}
              type="button"
              variant={isActive ? "primary" : "secondary"}
              size="sm"
              onClick={() => setCategory(filter)}
              className={
                isActive
                  ? "h-8 px-3 text-xs font-semibold shadow-xs"
                  : "h-8 px-3 text-xs font-medium text-slate-600 bg-white border-slate-200 hover:bg-slate-50"
              }
            >
              {label}
            </Button>
          );
        })}
      </div>

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-blue-100 bg-blue-50/80 p-3 text-xs font-medium text-primary flex items-center justify-between"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="text-primary hover:underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Template Cards Grid */}
      <div className="grid gap-4">
        {templates.map((template) => {
          const isCurrent = currentTemplate === template.id;
          return (
            <Card
              key={template.id}
              className={`group overflow-hidden p-0 transition-all duration-200 ${
                isCurrent
                  ? "border-primary/80 ring-2 ring-primary/20 shadow-sm"
                  : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {/* Thumbnail representation */}
              <TemplateThumbnail template={template.id} />

              {/* Card Meta & Actions */}
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {template.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  {isCurrent ? (
                    <Badge variant="primary" className="shrink-0 font-bold">
                      <Check size={12} className="text-primary" />
                      <span>Current</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      {template.category}
                    </Badge>
                  )}
                </div>

                <p className="text-[11px] font-medium text-slate-500">
                  Best for: {template.recommendedFor.join(", ")}.
                </p>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setPreviewId(template.id);
                      setDevice("desktop");
                    }}
                    className="flex-1 text-xs font-semibold gap-1.5"
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </Button>

                  <Button
                    type="button"
                    variant={isCurrent ? "secondary" : "primary"}
                    size="sm"
                    disabled={isCurrent || isLoading}
                    onClick={() => setConfirmId(template.id)}
                    className="flex-1 text-xs font-semibold"
                  >
                    {isCurrent ? "Selected" : "Use Template"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Large Fullscreen Template Preview Modal */}
      {previewTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${previewTemplate.name} template preview`}
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in-50"
        >
          {/* Sticky Modal Topbar */}
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b border-slate-200 bg-white px-5 py-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900">
                {previewTemplate.name}
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-500">
                Preview with your content
              </span>
            </div>

            <div className="flex items-center gap-3">
              <DeviceButtons value={device} onChange={setDevice} />

              <Button
                type="button"
                variant={currentTemplate === previewTemplate.id ? "secondary" : "primary"}
                size="sm"
                disabled={currentTemplate === previewTemplate.id || isLoading}
                onClick={() => setConfirmId(previewTemplate.id)}
                className="text-xs font-semibold"
              >
                {currentTemplate === previewTemplate.id
                  ? "Current Template"
                  : "Use This Template"}
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

          {/* Preview Canvas Area */}
          <div className="mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-auto rounded-b-2xl bg-slate-200/90 p-4 sm:p-8">
            <div
              data-preview-device={device}
              className="mx-auto min-h-full overflow-hidden bg-white shadow-2xl rounded-xl transition-[width] duration-200"
              style={{ width: widths[device], maxWidth: "100%" }}
            >
              <PortfolioRenderer
                portfolio={portfolio}
                templateOverride={previewTemplate.id}
                themeOverride={previewTemplate.defaultTheme}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Before Switching Template */}
      {confirmId && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="apply-template-title"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in-50"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <h2
              id="apply-template-title"
              className="text-lg font-bold text-slate-900"
            >
              Apply {portfolioTemplateRegistry[confirmId].name} template?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your portfolio content (projects, experience, bio) will stay
              completely safe. Style colors and typography will adopt this
              template&apos;s recommended defaults.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="secondary"
                disabled={isLoading}
                onClick={() => setConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={isLoading}
                onClick={() => void applyTemplate(confirmId)}
              >
                {isLoading ? "Applying…" : "Apply Template"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function TemplateThumbnail({ template }: { template: TemplateId }) {
  const definition = portfolioTemplateRegistry[template];
  const isDark = definition.defaultTheme.mode === "dark";

  return (
    <div
      aria-hidden="true"
      className={`h-40 border-b p-3 transition-colors ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-100/70 text-slate-900"
      }`}
    >
      <div
        className={`mx-auto h-full max-w-xs overflow-hidden rounded-xl border p-3 flex flex-col justify-between shadow-xs transition-transform group-hover:scale-[1.01] ${
          isDark
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200/90 bg-white"
        }`}
      >
        <div className="flex items-center justify-between border-b border-current/10 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className="size-3.5 rounded-full"
              style={{ background: definition.defaultTheme.primaryColor }}
            />
            <span className="text-[10px] font-bold tracking-tight opacity-75">
              {definition.name}
            </span>
          </div>
          <span className="text-[9px] font-mono opacity-50 uppercase">
            {definition.category}
          </span>
        </div>

        <div className="space-y-1.5 py-1">
          <div
            className={`h-2.5 w-2/3 rounded ${
              isDark ? "bg-slate-700" : "bg-slate-800"
            }`}
          />
          <div
            className={`h-1.5 w-full rounded ${
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
  );
}

function DeviceButtons({
  value,
  onChange,
}: {
  value: Device;
  onChange: (device: Device) => void;
}) {
  return (
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
        const isActive = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-label={`${id} preview`}
            aria-pressed={isActive}
            onClick={() => onChange(id)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon size={14} className={isActive ? "text-primary" : "text-slate-400"} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
