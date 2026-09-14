"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Send,
  Sparkles,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import type { PreviewDevice } from "./builder-device-switcher";
import { BuilderDeviceSwitcher } from "./builder-device-switcher";

export type SaveState = "saved" | "saving" | "unsaved" | "error";

export function BuilderTopbar({
  name,
  published,
  slug,
  device,
  saveStatus = "saved",
  saveMessage,
  onDeviceChange,
  onPreview,
  onPublish,
}: {
  name: string;
  published: boolean;
  slug?: string;
  device: PreviewDevice;
  saveStatus?: SaveState;
  saveMessage?: string;
  onDeviceChange: (device: PreviewDevice) => void;
  onPreview: () => void;
  onPublish: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (slug) {
      await navigator.clipboard.writeText(`${window.location.origin}/u/${slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 py-2.5 shadow-2xs">
      {/* Left section: Dashboard link, name, and save status */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <p className="max-w-[140px] sm:max-w-[200px] truncate text-sm font-bold text-slate-900">
            {name || "New portfolio"}
          </p>

          <Badge
            variant={published ? "success" : "warning"}
            className="text-[10px] uppercase font-bold py-0"
          >
            {published ? "Published" : "Draft"}
          </Badge>

          {/* Subtle Save Status Indicator */}
          <div
            role="status"
            aria-live="polite"
            className="hidden md:flex items-center gap-1.5 text-xs font-medium pl-2"
          >
            {saveStatus === "saving" ? (
              <span className="inline-flex items-center gap-1 text-primary">
                <Loader2 size={12} className="animate-spin" />
                <span>Saving…</span>
              </span>
            ) : saveStatus === "error" ? (
              <span className="inline-flex items-center gap-1 text-red-600">
                <span className="size-1.5 rounded-full bg-red-600" />
                <span>{saveMessage || "Save failed"}</span>
              </span>
            ) : saveStatus === "unsaved" ? (
              <span className="inline-flex items-center gap-1 text-amber-600">
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span>Unsaved changes</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Saved</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Device Switcher */}
      <div className="order-3 sm:order-2">
        <BuilderDeviceSwitcher value={device} onChange={onDeviceChange} />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 order-2 sm:order-3">
        {published && slug && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="text-xs gap-1.5 hidden sm:inline-flex"
            aria-label="Copy public link"
            onClick={() => void copy()}
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy link"}</span>
          </Button>
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="text-xs gap-1.5 font-semibold"
          onClick={onPreview}
        >
          <ExternalLink size={14} />
          <span>Preview</span>
        </Button>

        <Button
          type="button"
          variant={published ? "secondary" : "primary"}
          size="sm"
          className="text-xs font-semibold gap-1.5"
          onClick={onPublish}
        >
          <Send size={14} />
          <span>{published ? "Unpublish" : "Publish"}</span>
        </Button>
      </div>
    </header>
  );
}
