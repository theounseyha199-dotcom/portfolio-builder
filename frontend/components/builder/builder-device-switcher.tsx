"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

const deviceIcons = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
} as const;

export function BuilderDeviceSwitcher({
  value,
  onChange,
}: {
  value: PreviewDevice;
  onChange: (value: PreviewDevice) => void;
}) {
  return (
    <div
      className="inline-flex items-center rounded-xl border border-slate-200/80 bg-slate-100/70 p-1 shadow-xs"
      aria-label="Preview device"
    >
      {(["desktop", "tablet", "mobile"] as const).map((device) => {
        const Icon = deviceIcons[device];
        const isActive = value === device;
        return (
          <Button
            key={device}
            type="button"
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={
              isActive
                ? "h-7 px-2.5 text-xs font-bold text-slate-900 bg-white border border-slate-200/80 shadow-xs gap-1.5"
                : "h-7 px-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/50 border border-transparent gap-1.5"
            }
            onClick={() => onChange(device)}
          >
            <Icon size={14} className={isActive ? "text-primary" : "text-slate-500"} />
            <span>{device[0].toUpperCase() + device.slice(1)}</span>
          </Button>
        );
      })}
    </div>
  );
}
