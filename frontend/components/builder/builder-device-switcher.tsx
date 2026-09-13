"use client";

import { Button } from "@/components/ui";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

export function BuilderDeviceSwitcher({ value, onChange }: { value: PreviewDevice; onChange: (value: PreviewDevice) => void }) {
  return <div className="inline-flex rounded-lg border bg-white p-1" aria-label="Preview device">{(["desktop", "tablet", "mobile"] as const).map((device) => <Button key={device} type="button" className={value === device ? "px-3 py-1.5 text-sm" : "bg-transparent px-3 py-1.5 text-sm text-muted"} onClick={() => onChange(device)}>{device[0].toUpperCase() + device.slice(1)}</Button>)}</div>;
}
