"use client";

import {
  Briefcase,
  Code2,
  FileText,
  FileUp,
  FolderGit2,
  Github,
  Globe,
  GraduationCap,
  Layers,
  LayoutTemplate,
  Palette,
  Radio,
  Share2,
  User,
  type LucideIcon,
} from "lucide-react";
import { Separator } from "@/components/ui";
import { motion, useReducedMotion } from "@/lib/motion";

export type BuilderPanel =
  | "Profile"
  | "Experience"
  | "Education"
  | "Skills"
  | "Projects"
  | "Social Links"
  | "Resume"
  | "Resume Import"
  | "GitHub"
  | "Templates"
  | "Style"
  | "Sections"
  | "Portfolio"
  | "Publishing";

export const panelIcons: Record<BuilderPanel, LucideIcon> = {
  Profile: User,
  Experience: Briefcase,
  Education: GraduationCap,
  Skills: Code2,
  Projects: FolderGit2,
  "Social Links": Share2,
  Resume: FileText,
  "Resume Import": FileUp,
  GitHub: Github,
  Templates: LayoutTemplate,
  Style: Palette,
  Sections: Layers,
  Portfolio: Globe,
  Publishing: Radio,
};

const PANEL_QUERY_MAP: Record<string, BuilderPanel> = {
  profile: "Profile",
  "resume-import": "Resume Import",
  resumeimport: "Resume Import",
  github: "GitHub",
  templates: "Templates",
  template: "Templates",
  style: "Style",
  design: "Style",
  sections: "Sections",
  section: "Sections",
  experience: "Experience",
  experiences: "Experience",
  education: "Education",
  educations: "Education",
  skills: "Skills",
  skill: "Skills",
  projects: "Projects",
  project: "Projects",
  "social-links": "Social Links",
  social: "Social Links",
  resume: "Resume",
  publishing: "Publishing",
  publish: "Publishing",
  portfolio: "Portfolio",
};

export function parsePanelQuery(param: string | null): BuilderPanel {
  if (!param) return "Profile";
  const normalized = param.toLowerCase().trim();
  return PANEL_QUERY_MAP[normalized] ?? "Profile";
}

const groups: Array<{ label: string; panels: BuilderPanel[] }> = [
  {
    label: "CONTENT",
    panels: [
      "Profile",
      "Experience",
      "Education",
      "Skills",
      "Projects",
      "Social Links",
      "Resume",
    ],
  },
  { label: "IMPORT", panels: ["Resume Import", "GitHub"] },
  { label: "DESIGN", panels: ["Templates", "Style", "Sections"] },
  { label: "SETTINGS", panels: ["Portfolio", "Publishing"] },
];

const panels = groups.flatMap((group) => group.panels);

export function BuilderSidebar({
  active,
  onSelect,
}: {
  active: BuilderPanel;
  onSelect: (panel: BuilderPanel) => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <nav
      className="h-full overflow-y-auto bg-white p-3 space-y-4"
      aria-label="Builder tools"
    >
      {groups.map((group, index) => (
        <div key={group.label} className="space-y-1">
          {index > 0 && <Separator className="my-3 opacity-60" />}
          <p className="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.panels.map((panel) => {
              const Icon = panelIcons[panel];
              const isActive = active === panel;
              return (
                <button
                  key={panel}
                  type="button"
                  onClick={() => onSelect(panel)}
                  className={`relative w-full flex items-center gap-2.5 rounded-lg h-9 px-3 text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? "text-primary"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {isActive && !prefersReducedMotion && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute inset-0 rounded-lg bg-blue-50/90 border border-blue-200/80 shadow-xs"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}
                  {isActive && prefersReducedMotion && (
                    <div className="absolute inset-0 rounded-lg bg-blue-50/90 border border-blue-200/80 shadow-xs" />
                  )}
                  <Icon
                    size={16}
                    className={`relative z-10 shrink-0 ${
                      isActive ? "text-primary" : "text-slate-400"
                    }`}
                  />
                  <span className="relative z-10 truncate">{panel}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function BuilderMobileNavigation({
  active,
  onSelect,
}: {
  active: BuilderPanel;
  onSelect: (panel: BuilderPanel) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
        Builder panel
        <select
          aria-label="Builder panel"
          value={active}
          onChange={(event) => onSelect(event.target.value as BuilderPanel)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-xs focus:border-primary focus:outline-none"
        >
          {panels.map((panel) => (
            <option key={panel} value={panel}>
              {panel}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
