"use client";

import { Button, Separator } from "@/components/ui";

export type BuilderPanel = "Profile" | "Experience" | "Education" | "Skills" | "Projects" | "Social Links" | "Resume" | "Resume Import" | "GitHub" | "Templates" | "Style" | "Sections" | "Portfolio" | "Publishing";
const groups: Array<{ label: string; panels: BuilderPanel[] }> = [{ label: "CONTENT", panels: ["Profile", "Experience", "Education", "Skills", "Projects", "Social Links", "Resume"] }, { label: "IMPORT", panels: ["Resume Import", "GitHub"] }, { label: "DESIGN", panels: ["Templates", "Style", "Sections"] }, { label: "SETTINGS", panels: ["Portfolio", "Publishing"] }];
const panels = groups.flatMap((group) => group.panels);

export function BuilderSidebar({ active, onSelect }: { active: BuilderPanel; onSelect: (panel: BuilderPanel) => void }) {
  return <nav className="h-full overflow-y-auto bg-white p-3" aria-label="Builder tools">{groups.map((group, index) => <div key={group.label} className="py-3 first:pt-0">{index > 0 && <Separator className="mb-3" />}<p className="px-3 pb-2 text-xs font-semibold tracking-wider text-muted">{group.label}</p>{group.panels.map((panel) => <Button key={panel} type="button" className={active === panel ? "mb-1 w-full justify-start" : "mb-1 w-full justify-start bg-transparent text-muted hover:bg-surface hover:text-primary"} onClick={() => onSelect(panel)}>{panel}</Button>)}</div>)}</nav>;
}

export function BuilderMobileNavigation({ active, onSelect }: { active: BuilderPanel; onSelect: (panel: BuilderPanel) => void }) {
  return <label className="block text-sm font-medium lg:hidden">Builder panel<select aria-label="Builder panel" value={active} onChange={(event) => onSelect(event.target.value as BuilderPanel)} className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5">{panels.map((panel) => <option key={panel}>{panel}</option>)}</select></label>;
}
