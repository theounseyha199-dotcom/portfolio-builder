"use client";

import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Code2,
  FileText,
  FolderGit2,
  Globe,
  GraduationCap,
  GripVertical,
  Layers,
  Sparkles,
  User,
} from "lucide-react";
import {
  getTemplateById,
  type PortfolioSection,
  type PortfolioSectionType,
  type TemplateId,
} from "@/components/portfolio/templates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "@/lib/motion";

const SECTION_META: Record<
  PortfolioSectionType,
  { name: string; description: string; icon: typeof Sparkles }
> = {
  HERO: {
    name: "Hero",
    description: "Personal introduction, headline, and primary call to action.",
    icon: Sparkles,
  },
  ABOUT: {
    name: "About",
    description: "Detailed bio, background story, and personal focus.",
    icon: User,
  },
  EXPERIENCE: {
    name: "Experience",
    description: "Work history, positions, timelines, and accomplishments.",
    icon: Briefcase,
  },
  PROJECTS: {
    name: "Projects",
    description: "Showcase of featured portfolio work, tools, and links.",
    icon: FolderGit2,
  },
  SKILLS: {
    name: "Skills",
    description: "Core technical, professional, and language proficiencies.",
    icon: Code2,
  },
  EDUCATION: {
    name: "Education",
    description: "Degrees, institutions, honors, and academic achievements.",
    icon: GraduationCap,
  },
  SOCIAL: {
    name: "Social Links",
    description: "Profiles on GitHub, LinkedIn, Twitter, and other platforms.",
    icon: Globe,
  },
  RESUME: {
    name: "Resume",
    description: "Downloadable CV or resume document link.",
    icon: FileText,
  },
};

export function SectionsPanel({
  sections,
  templateId,
  busy,
  onSave,
}: {
  sections: PortfolioSection[];
  templateId: TemplateId;
  busy: boolean;
  onSave: (sections: PortfolioSection[]) => void | Promise<void>;
}) {
  const prefersReducedMotion = useReducedMotion();
  const template = getTemplateById(templateId);

  const update = (
    sectionType: PortfolioSection["sectionType"],
    change: Partial<PortfolioSection>
  ) =>
    onSave(
      sections.map((item) =>
        item.sectionType === sectionType ? { ...item, ...change } : item
      )
    );

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    void onSave(next);
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-primary" />
          <h3 className="text-sm font-bold text-slate-900">Page Sections</h3>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Reorder sections, toggle visibility, and pick layouts for each content
          block.
        </p>
      </div>

      <div className="space-y-2.5">
        {sections.map((item, index) => {
          const meta = SECTION_META[item.sectionType] ?? {
            name: item.sectionType,
            description: "",
            icon: Layers,
          };
          const Icon = meta.icon;
          const isHero = item.sectionType === "HERO";
          const layouts = template.supportedSectionLayouts[item.sectionType] ?? [];

          return (
            <motion.div
              key={item.sectionType}
              layout={!prefersReducedMotion}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`rounded-xl border transition-colors ${
                item.enabled
                  ? "border-slate-200 bg-white shadow-2xs"
                  : "border-dashed border-slate-200 bg-slate-50/70 opacity-70"
              } p-3.5`}
            >
              {/* Main Section Header Row */}
              <div className="flex items-center gap-2.5">
                <GripVertical
                  aria-hidden="true"
                  size={16}
                  className="shrink-0 text-slate-400 cursor-grab active:cursor-grabbing"
                />

                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Icon size={14} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {meta.name}
                    </span>
                    {isHero && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 border-slate-200"
                      >
                        Required
                      </Badge>
                    )}
                  </div>
                  <p className="line-clamp-1 text-[11px] text-slate-500">
                    {meta.description}
                  </p>
                </div>

                {/* Section Visibility Switch / Badge */}
                <div className="flex items-center gap-1 shrink-0">
                  {!isHero ? (
                    <label className="flex items-center cursor-pointer mr-1">
                      <input
                        aria-label={`Show ${item.sectionType}`}
                        type="checkbox"
                        checked={item.enabled}
                        disabled={busy}
                        onChange={(event) =>
                          void update(item.sectionType, {
                            enabled: event.target.checked,
                          })
                        }
                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                      />
                    </label>
                  ) : null}

                  {/* Move Up / Down Buttons */}
                  <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                    <Button
                      aria-label={`Move ${item.sectionType} up`}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-6 p-0 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded"
                      disabled={index === 0 || busy}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp size={13} />
                    </Button>
                    <Button
                      aria-label={`Move ${item.sectionType} down`}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-6 p-0 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded"
                      disabled={index === sections.length - 1 || busy}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown size={13} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Per-Section Layout Options (if template supports layouts for this section) */}
              {item.enabled && layouts.length > 0 && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-slate-100 pt-2.5">
                  <label className="block">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Layout Style
                    </span>
                    <select
                      aria-label={`${item.sectionType} layout`}
                      value={item.layout ?? layouts[0]}
                      disabled={busy}
                      onChange={(event) =>
                        void update(item.sectionType, {
                          layout: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary/20"
                    >
                      {layouts.map((layout) => (
                        <option key={layout} value={layout}>
                          {layout[0].toUpperCase() + layout.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Section Spacing
                    </span>
                    <select
                      aria-label={`${item.sectionType} spacing`}
                      value={item.spacing ?? "normal"}
                      disabled={busy}
                      onChange={(event) =>
                        void update(item.sectionType, {
                          spacing: event.target
                            .value as PortfolioSection["spacing"],
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 shadow-2xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary/20"
                    >
                      <option value="compact">Compact</option>
                      <option value="normal">Normal</option>
                      <option value="large">Spacious</option>
                    </select>
                  </label>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
