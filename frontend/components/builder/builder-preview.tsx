"use client";

import { PortfolioRenderer, type PortfolioData } from "@/components/portfolio/renderer/portfolio-renderer";
import type { PreviewDevice } from "./builder-device-switcher";

const widths: Record<PreviewDevice, string> = { desktop: "w-full", tablet: "w-[768px] max-w-full", mobile: "w-[390px] max-w-full" };

export function BuilderPreview({ portfolio, device }: { portfolio: PortfolioData; device: PreviewDevice }) {
  return <section className="flex min-h-[640px] flex-1 justify-center overflow-auto bg-slate-100 p-4 sm:p-8" aria-label={`${device} portfolio preview`}><div className={`${widths[device]} min-h-full overflow-hidden rounded-xl border bg-white shadow-sm transition-[width]`}><PortfolioRenderer portfolio={portfolio} /></div></section>;
}
