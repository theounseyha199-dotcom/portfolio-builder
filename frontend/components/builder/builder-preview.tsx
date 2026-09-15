"use client";
import { useEffect, useRef, useState } from "react";
import { PortfolioRenderer, type PortfolioData, type Theme } from "@/components/portfolio/renderer/portfolio-renderer";
import type { PreviewDevice } from "./builder-device-switcher";
import { Button } from "@/components/ui";

export type PreviewZoom = "fit" | "75" | "100";
export function BuilderPreview({ portfolio, device, themeOverride, zoom = "fit", onAddBio, onAddProject }: {
  portfolio: PortfolioData; device: PreviewDevice; themeOverride?: Theme; zoom?: PreviewZoom;
  onAddBio?: () => void; onAddProject?: () => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(800);
  const [height, setHeight] = useState(0);
  const width = device === "desktop" ? 1200 : device === "tablet" ? 768 : 390;
  const scale = zoom === "fit" ? Math.min(1, available / width) : Number(zoom) / 100;
  useEffect(() => {
    if (!viewport.current || !canvas.current) return;
    const observer = new ResizeObserver(() => {
      setAvailable(viewport.current?.clientWidth ?? 800);
      setHeight(canvas.current?.offsetHeight ?? 0);
    });
    observer.observe(viewport.current); observer.observe(canvas.current);
    return () => observer.disconnect();
  }, []);
  const sparse = !portfolio.bio?.trim() && !portfolio.projects?.length && !portfolio.experiences?.length && !portfolio.skills?.length;
  return <section className="min-h-0 flex-1 overflow-auto bg-[#f5f6f8] p-4 lg:p-6" aria-label={device + " portfolio preview"}>
    {sparse && <div className="mb-4 rounded-lg border border-slate-200 bg-white/80 p-3 text-sm">
      <p className="font-medium text-slate-700">Your portfolio is looking a little empty.</p>
      <p className="mt-1 text-xs text-slate-500">Add a bio, experience, skills, or projects to make your portfolio stand out.</p>
      <div className="mt-2 flex gap-2"><Button size="sm" variant="ghost" onClick={onAddBio}>Add Bio</Button><Button size="sm" variant="ghost" onClick={onAddProject}>Add Project</Button></div>
    </div>}
    <div ref={viewport} className="w-full">
      <div className="mx-auto" style={{ width: width * scale, height: height * scale }}>
        <div ref={canvas} data-preview-device={device} data-preview-zoom={zoom} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          style={{ width, transform: "scale(" + scale + ")", transformOrigin: "top left" }}>
          <PortfolioRenderer portfolio={portfolio} themeOverride={themeOverride}/>
        </div>
      </div>
    </div>
  </section>;
}
