"use client";

import { Check, Eye, Monitor, Smartphone, Tablet } from "lucide-react";
import { useMemo, useState } from "react";
import { PortfolioRenderer, type PortfolioData } from "@/components/portfolio/renderer/portfolio-renderer";
import { portfolioTemplateList, portfolioTemplateRegistry, type TemplateCategory, type TemplateId } from "@/components/portfolio/templates";
import { Badge, Button, Card } from "@/components/ui";
import { useUpdatePortfolioDesignMutation } from "@/features/portfolio/design-api";

type Device = "desktop" | "tablet" | "mobile";
const filters: Array<"ALL" | TemplateCategory> = ["ALL", "PROFESSIONAL", "DEVELOPER", "CREATIVE", "STUDENT", "MINIMAL"];
const widths: Record<Device, string> = { desktop: "100%", tablet: "768px", mobile: "390px" };

export function TemplateGallery({ portfolio, currentTemplate, onApplied }: { portfolio: PortfolioData; currentTemplate: TemplateId; onApplied: () => void | Promise<void> }) {
  const [category, setCategory] = useState<(typeof filters)[number]>("ALL");
  const [previewId, setPreviewId] = useState<TemplateId | null>(null);
  const [confirmId, setConfirmId] = useState<TemplateId | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [notice, setNotice] = useState("");
  const [updateDesign, { isLoading }] = useUpdatePortfolioDesignMutation();
  const templates = useMemo(() => category === "ALL" ? portfolioTemplateList : portfolioTemplateList.filter((template) => template.category === category), [category]);
  const previewTemplate = previewId ? portfolioTemplateRegistry[previewId] : null;

  async function applyTemplate(id: TemplateId) {
    const template = portfolioTemplateRegistry[id];
    setNotice("");
    try {
      await updateDesign({ templateKey: id, themeConfig: template.defaultTheme }).unwrap();
      setConfirmId(null);
      setPreviewId(null);
      setNotice(`${template.name} template applied.`);
      await onApplied();
    } catch {
      setNotice("Unable to apply template. Your current template has not changed.");
    }
  }

  return <section aria-labelledby="template-gallery-title" className="space-y-5">
    <div><h2 id="template-gallery-title" className="text-xl font-bold">Templates</h2><p className="mt-1 text-sm text-muted">Choose a professional starting point. Your content always stays the same.</p></div>
    <div aria-label="Template categories" className="flex flex-wrap gap-2">{filters.map((filter) => <Button key={filter} type="button" onClick={() => setCategory(filter)} className={category === filter ? "px-3 py-1.5 text-sm" : "bg-white px-3 py-1.5 text-sm text-primary ring-1 ring-border"}>{filter === "ALL" ? "All" : filter[0] + filter.slice(1).toLowerCase()}</Button>)}</div>
    {notice && <p role="status" className="rounded-lg bg-surface p-3 text-sm">{notice}</p>}
    <div className="grid gap-4 xl:grid-cols-2">{templates.map((template) => {
      const current = currentTemplate === template.id;
      return <Card key={template.id} className="overflow-hidden p-0">
        <TemplateThumbnail template={template.id} />
        <div className="space-y-3 p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-bold">{template.name}</h3><Badge>{template.category}</Badge></div>{current && <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary"><Check size={14} /> Current</span>}</div>
          <p className="text-sm text-muted">{template.description}</p><p className="text-xs text-muted">Best for {template.recommendedFor.join(", ")}.</p>
          <div className="flex gap-2"><Button type="button" onClick={() => { setPreviewId(template.id); setDevice("desktop"); }} className="flex-1 bg-white text-primary ring-1 ring-border"><Eye size={15} /> Preview</Button><Button type="button" disabled={current || isLoading} onClick={() => setConfirmId(template.id)} className="flex-1">{current ? "Selected" : "Use Template"}</Button></div>
        </div>
      </Card>;
    })}</div>
    {previewTemplate && <div role="dialog" aria-modal="true" aria-label={`${previewTemplate.name} template preview`} className="fixed inset-0 z-50 flex flex-col bg-slate-950/70 p-3 sm:p-6">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 rounded-t-xl bg-white p-3"><div><strong>{previewTemplate.name}</strong><span className="ml-2 text-sm text-muted">Preview with your content</span></div><div className="flex items-center gap-2"><DeviceButtons value={device} onChange={setDevice} /><Button type="button" disabled={currentTemplate === previewTemplate.id || isLoading} onClick={() => setConfirmId(previewTemplate.id)}>{currentTemplate === previewTemplate.id ? "Current Template" : "Use This Template"}</Button><Button type="button" className="bg-white text-primary ring-1 ring-border" onClick={() => setPreviewId(null)}>Close</Button></div></div>
      <div className="mx-auto min-h-0 w-full max-w-7xl flex-1 overflow-auto rounded-b-xl bg-slate-200 p-3 sm:p-6"><div data-preview-device={device} className="mx-auto min-h-full overflow-hidden bg-white shadow-xl transition-[width]" style={{ width: widths[device], maxWidth: "100%" }}><PortfolioRenderer portfolio={portfolio} templateOverride={previewTemplate.id} themeOverride={previewTemplate.defaultTheme} /></div></div>
    </div>}
    {confirmId && <div role="alertdialog" aria-modal="true" aria-labelledby="apply-template-title" className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/60 p-4"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"><h2 id="apply-template-title" className="text-lg font-bold">Apply {portfolioTemplateRegistry[confirmId].name} template?</h2><p className="mt-3 text-sm text-muted">Your portfolio content will stay the same. Design settings will change to this template&apos;s recommended defaults.</p><div className="mt-6 flex justify-end gap-2"><Button type="button" className="bg-white text-primary ring-1 ring-border" disabled={isLoading} onClick={() => setConfirmId(null)}>Cancel</Button><Button type="button" disabled={isLoading} onClick={() => void applyTemplate(confirmId)}>{isLoading ? "Applying…" : "Apply Template"}</Button></div></div></div>}
  </section>;
}

function TemplateThumbnail({ template }: { template: TemplateId }) {
  const definition = portfolioTemplateRegistry[template];
  const dark = definition.defaultTheme.mode === "dark";
  return <div aria-hidden="true" className={`h-40 border-b p-4 ${dark ? "bg-slate-950" : "bg-slate-100"}`}><div className={`mx-auto h-full max-w-xs overflow-hidden rounded-md border shadow-sm ${dark ? "border-slate-700 bg-slate-900" : "bg-white"}`}><div className="flex h-full"><div className="w-1/3 p-3"><div className="h-7 w-7 rounded-full" style={{ background: definition.defaultTheme.primaryColor }} /><div className={`mt-3 h-2 w-full rounded ${dark ? "bg-slate-700" : "bg-slate-200"}`} /><div className={`mt-2 h-2 w-2/3 rounded ${dark ? "bg-slate-700" : "bg-slate-200"}`} /></div><div className="grid flex-1 grid-cols-2 gap-2 p-3"><div className={`col-span-2 h-3 rounded ${dark ? "bg-slate-700" : "bg-slate-200"}`} /><div className={`rounded border ${dark ? "border-slate-700" : "border-slate-200"}`} /><div className={`rounded border ${dark ? "border-slate-700" : "border-slate-200"}`} /></div></div></div></div>;
}

function DeviceButtons({ value, onChange }: { value: Device; onChange: (device: Device) => void }) {
  return <div aria-label="Preview device" className="flex gap-1">{([{ id: "desktop", icon: Monitor }, { id: "tablet", icon: Tablet }, { id: "mobile", icon: Smartphone }] as const).map(({ id, icon: Icon }) => <button key={id} type="button" aria-label={`${id} preview`} aria-pressed={value === id} onClick={() => onChange(id)} className={`rounded p-2 ${value === id ? "bg-primary text-white" : "bg-surface"}`}><Icon size={16} /></button>)}</div>;
}
