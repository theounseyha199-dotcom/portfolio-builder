"use client";

import {
  PortfolioRenderer,
  type PortfolioData,
  type Theme,
} from "@/components/portfolio/renderer/portfolio-renderer";
import type { PreviewDevice } from "./builder-device-switcher";

const frameStyles: Record<PreviewDevice, string> = {
  desktop: "w-full max-w-full rounded-xl border border-slate-200/80 bg-white shadow-xs",
  tablet: "w-[768px] max-w-full rounded-2xl border border-slate-300/80 bg-white shadow-md my-4",
  mobile: "w-[390px] max-w-full rounded-3xl border border-slate-300/90 bg-white shadow-lg my-4",
};

export function BuilderPreview({
  portfolio,
  device,
  themeOverride,
}: {
  portfolio: PortfolioData;
  device: PreviewDevice;
  themeOverride?: Theme;
}) {
  return (
    <section
      className="flex min-h-[600px] flex-1 justify-center overflow-auto bg-slate-100/90 p-3 sm:p-6 lg:p-8 transition-all"
      aria-label={`${device} portfolio preview`}
    >
      <div
        data-preview-device={device}
        className={`${frameStyles[device]} min-h-full overflow-hidden transition-[width,border-radius] duration-200`}
      >
        {device !== "desktop" && (
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 py-1.5 text-[11px] font-medium text-slate-500">
            <span className="capitalize">{device} Viewport</span>
            <span>{device === "tablet" ? "768px" : "390px"}</span>
          </div>
        )}
        <PortfolioRenderer portfolio={portfolio} themeOverride={themeOverride} />
      </div>
    </section>
  );
}
