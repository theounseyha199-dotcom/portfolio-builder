"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Palette,
  RotateCcw,
  Sparkles,
  SunMoon,
  Type,
} from "lucide-react";
import {
  getTemplateById,
  type PortfolioTheme,
  type TemplateId,
} from "@/components/portfolio/templates";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { portfolioFonts } from "@/lib/design/font-registry";

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  theme: Partial<PortfolioTheme>;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "clean",
    name: "Clean",
    description: "Neutral & balanced modern sans",
    theme: {
      mode: "light",
      primaryColor: "#2563eb",
      backgroundColor: "#ffffff",
      surfaceColor: "#f8fafc",
      textColor: "#0f172a",
      mutedTextColor: "#64748b",
      fontHeading: "inter",
      fontBody: "inter",
      borderRadius: "medium",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Dark, sleek modern blue",
    theme: {
      mode: "dark",
      primaryColor: "#3b82f6",
      backgroundColor: "#090d16",
      surfaceColor: "#111827",
      textColor: "#f8fafc",
      mutedTextColor: "#94a3b8",
      fontHeading: "geist",
      fontBody: "inter",
      borderRadius: "medium",
    },
  },
  {
    id: "warm",
    name: "Warm",
    description: "Earthy, editorial serif tones",
    theme: {
      mode: "light",
      primaryColor: "#c2410c",
      backgroundColor: "#fbf9f5",
      surfaceColor: "#f4efe6",
      textColor: "#292524",
      mutedTextColor: "#78716c",
      fontHeading: "playfair",
      fontBody: "source-sans",
      borderRadius: "small",
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "High-contrast serif & monospace",
    theme: {
      mode: "light",
      primaryColor: "#18181b",
      backgroundColor: "#ffffff",
      surfaceColor: "#f4f4f5",
      textColor: "#09090b",
      mutedTextColor: "#71717a",
      fontHeading: "playfair",
      fontBody: "geist-mono",
      borderRadius: "none",
    },
  },
  {
    id: "slate",
    name: "Slate",
    description: "Cool gray, technical palette",
    theme: {
      mode: "light",
      primaryColor: "#0284c7",
      backgroundColor: "#f8fafc",
      surfaceColor: "#f1f5f9",
      textColor: "#0f172a",
      mutedTextColor: "#475569",
      fontHeading: "geist-mono",
      fontBody: "inter",
      borderRadius: "small",
    },
  },
];

const QUICK_COLORS = [
  "#2563eb", // Blue
  "#4f46e5", // Indigo
  "#0d9488", // Teal
  "#16a34a", // Green
  "#ea580c", // Orange
  "#e11d48", // Rose
  "#0f172a", // Slate
  "#18181b", // Zinc
];

function getLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return 0.5;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  try {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 21;
  }
}

export function DesignPanel({
  value,
  busy,
  templateId = "modern",
  onChange,
  onSave,
}: {
  value: PortfolioTheme;
  busy: boolean;
  templateId?: TemplateId;
  onChange: (theme: PortfolioTheme) => void;
  onSave: (theme: PortfolioTheme) => void | Promise<void>;
}) {
  const [draft, setDraft] = useState(value);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => setDraft(value), [value]);

  function update<K extends keyof PortfolioTheme>(
    key: K,
    next: PortfolioTheme[K]
  ) {
    const changed = { ...draft, [key]: next };
    setDraft(changed);
    onChange(changed);
  }

  function applyPreset(preset: StylePreset) {
    const next = { ...draft, ...preset.theme };
    setDraft(next);
    onChange(next);
  }

  function handleResetDefaults() {
    const defaultTheme = getTemplateById(templateId).defaultTheme;
    setDraft(defaultTheme);
    onChange(defaultTheme);
    setShowResetConfirm(false);
  }

  const contrastRatio = useMemo(
    () => getContrastRatio(draft.backgroundColor, draft.textColor),
    [draft.backgroundColor, draft.textColor]
  );
  const isLowContrast = contrastRatio < 4.5;

  const colorRow = (
    key:
      | "primaryColor"
      | "backgroundColor"
      | "surfaceColor"
      | "textColor"
      | "mutedTextColor",
    label: string
  ) => {
    return (
      <div key={key} className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">
            {label}
          </label>
          <span className="font-mono text-[11px] text-slate-400 uppercase">
            {draft[key]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-slate-200 shadow-2xs">
            <input
              aria-label={label}
              type="color"
              value={draft[key]}
              onChange={(e) => update(key, e.target.value)}
              className="absolute -inset-2 size-12 cursor-pointer border-0 p-0"
            />
          </div>
          <input
            aria-label={`${label} hex`}
            value={draft[key]}
            onChange={(e) =>
              /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) &&
              update(key, e.target.value)
            }
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-800 uppercase focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>
    );
  };

  const selectRow = <K extends keyof PortfolioTheme>(
    key: K,
    label: string,
    options: readonly { value: string; label: string }[]
  ) => (
    <div key={key} className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-700">{label}</label>
      <select
        aria-label={label}
        value={String(draft[key])}
        onChange={(e) => update(key, e.target.value as PortfolioTheme[K])}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Header Actions: Reset Defaults */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Styling & Theme</h3>
          <p className="text-xs text-slate-500">
            Customize colors, typography, and structure.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowResetConfirm(true)}
          className="text-[11px] h-7 px-2.5 text-slate-600 hover:text-slate-900 gap-1"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </Button>
      </div>

      {/* Style Presets */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Curated Presets
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STYLE_PRESETS.map((preset) => {
            const isActive =
              draft.primaryColor === preset.theme.primaryColor &&
              draft.mode === preset.theme.mode;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`relative flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                  isActive
                    ? "border-primary bg-blue-50/40 ring-1 ring-primary/20 shadow-xs"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex w-full items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1">
                    <span
                      className="size-3 rounded-full border border-black/10 shadow-2xs"
                      style={{ background: preset.theme.primaryColor }}
                    />
                    <span
                      className="size-3 rounded-full border border-black/10 shadow-2xs"
                      style={{ background: preset.theme.backgroundColor }}
                    />
                  </div>
                  {isActive && <Check size={12} className="text-primary" />}
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {preset.name}
                </span>
                <span className="text-[10px] text-slate-500 line-clamp-1">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appearance: Mode & Colors */}
      <Card className="p-4 space-y-4 border-slate-200/80 shadow-2xs bg-slate-50/40">
        <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2.5">
          <SunMoon size={14} className="text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Appearance & Colors
          </span>
        </div>

        {/* Mode Selector */}
        {selectRow("mode", "Theme mode", [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ])}

        {/* Quick Palette Swatches for Primary Color */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500">
            Quick Brand Palettes
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={`Select ${hex}`}
                onClick={() => update("primaryColor", hex)}
                className={`size-6 rounded-full border border-black/10 transition-transform hover:scale-110 ${
                  draft.primaryColor === hex
                    ? "ring-2 ring-primary ring-offset-2 scale-105"
                    : ""
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        {/* Individual Color Fields */}
        <div className="space-y-3 pt-1">
          {colorRow("primaryColor", "Primary color")}
          {colorRow("backgroundColor", "Background color")}
          {colorRow("surfaceColor", "Surface color")}
          {colorRow("textColor", "Text color")}
          {colorRow("mutedTextColor", "Muted text color")}
        </div>

        {/* Contrast Warning Banner */}
        {isLowContrast && (
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-amber-800">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold">Low contrast warning:</span> Text
              contrast ratio is {contrastRatio.toFixed(1)}:1 (recommended 4.5:1
              minimum). Text may be difficult to read on this background.
            </div>
          </div>
        )}
      </Card>

      {/* Typography */}
      <Card className="p-4 space-y-4 border-slate-200/80 shadow-2xs bg-slate-50/40">
        <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2.5">
          <Type size={14} className="text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Typography
          </span>
        </div>

        <div className="space-y-3">
          {selectRow(
            "fontHeading",
            "Heading font",
            portfolioFonts.map((font) => ({
              value: font.id,
              label: font.name,
            }))
          )}

          {selectRow(
            "fontBody",
            "Body font",
            portfolioFonts.map((font) => ({
              value: font.id,
              label: font.name,
            }))
          )}
        </div>
      </Card>

      {/* Layout & Structure */}
      <Card className="p-4 space-y-4 border-slate-200/80 shadow-2xs bg-slate-50/40">
        <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2.5">
          <Palette size={14} className="text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Layout & Spacing
          </span>
        </div>

        <div className="space-y-3">
          {selectRow("contentWidth", "Content width", [
            { value: "narrow", label: "Narrow (max 768px)" },
            { value: "medium", label: "Medium (max 1024px)" },
            { value: "wide", label: "Wide (max 1280px)" },
          ])}

          {selectRow("spacing", "Spacing", [
            { value: "compact", label: "Compact" },
            { value: "normal", label: "Normal" },
            { value: "relaxed", label: "Relaxed" },
          ])}

          {selectRow("borderRadius", "Border radius", [
            { value: "none", label: "Sharp (0px)" },
            { value: "small", label: "Small (6px)" },
            { value: "medium", label: "Medium (12px)" },
            { value: "large", label: "Large (20px)" },
          ])}
        </div>
      </Card>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs pt-2 pb-1 border-t border-slate-100">
        <Button
          type="button"
          disabled={busy}
          onClick={() => void onSave(draft)}
          className="w-full h-10 font-semibold shadow-sm"
        >
          {busy ? "Saving…" : "Save design"}
        </Button>
      </div>

      {/* Confirmation Dialog for Reset Defaults */}
      <AlertDialog
        open={showResetConfirm}
        onOpenChange={(open) => setShowResetConfirm(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Template Defaults?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the original color scheme, typography, and
              layout settings of the active template. Any custom styling changes
              will be replaced with the default preset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetDefaults}>
              Reset Theme
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
