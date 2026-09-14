"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Sparkles } from "lucide-react";

export function LandingBuilderDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      // 1. Frame entrance
      tl.from(".demo-window-frame", {
        opacity: 0,
        y: 20,
        duration: 0.7,
      })
        // 2. Sidebar items stagger in
        .from(
          ".demo-sidebar-item",
          {
            opacity: 0,
            x: -12,
            duration: 0.4,
            stagger: 0.06,
          },
          "-=0.3"
        )
        // 3. Central preview card enters
        .from(
          ".demo-preview-card",
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.6,
          },
          "-=0.3"
        )
        // 4. Editor panel items reveal
        .from(
          ".demo-editor-item",
          {
            opacity: 0,
            y: 8,
            duration: 0.4,
            stagger: 0.08,
          },
          "-=0.3"
        )
        // 5. Subtle active highlight pulse
        .to(".demo-active-badge", {
          scale: 1.05,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Decorative ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-linear-to-r from-blue-600/10 via-indigo-600/10 to-teal-600/10 blur-2xl"
      />

      {/* Realistic Builder Window Mockup */}
      <div className="demo-window-frame relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 p-3 shadow-2xl shadow-slate-900/50">
        {/* Window Chrome / Titlebar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 px-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-yellow-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 text-[11px] font-mono text-slate-400 border border-slate-800">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span>portfolia.app/dashboard/builder</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Builder Work Area */}
        <div className="grid grid-cols-[110px_1fr_120px] gap-3 pt-3 text-xs">
          {/* Left Sidebar */}
          <div className="space-y-3 border-r border-slate-800/70 pr-2">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1.5">
                Content
              </p>
              <div className="space-y-1">
                <div className="demo-sidebar-item demo-active-badge flex items-center gap-1.5 rounded-md bg-blue-600/20 px-2 py-1 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
                  <span>Profile</span>
                </div>
                <div className="demo-sidebar-item flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200">
                  <span>Projects</span>
                </div>
                <div className="demo-sidebar-item flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200">
                  <span>Experience</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1.5">
                Design
              </p>
              <div className="space-y-1">
                <div className="demo-sidebar-item flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200">
                  <span>Templates</span>
                </div>
                <div className="demo-sidebar-item flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200">
                  <span>Style</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Canvas Preview */}
          <div className="demo-preview-card rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xs">
                  AD
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Alex Daniels</p>
                  <p className="text-[10px] text-slate-400">
                    Software Engineer
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </div>

            <div className="space-y-2 py-3">
              <div className="h-1.5 w-12 rounded bg-blue-500" />
              <div className="h-2 w-3/4 rounded bg-slate-800" />
              <div className="h-2 w-5/6 rounded bg-slate-850" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 space-y-1.5">
                <p className="font-bold text-[11px] text-slate-200">
                  Distributed Engine
                </p>
                <div className="flex gap-1">
                  <span className="rounded bg-slate-800 px-1 py-0.5 text-[8px] text-slate-300">
                    Go
                  </span>
                  <span className="rounded bg-slate-800 px-1 py-0.5 text-[8px] text-slate-300">
                    Kafka
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 space-y-1.5">
                <p className="font-bold text-[11px] text-slate-200">
                  Cloud Analytics UI
                </p>
                <div className="flex gap-1">
                  <span className="rounded bg-slate-800 px-1 py-0.5 text-[8px] text-slate-300">
                    React
                  </span>
                  <span className="rounded bg-slate-800 px-1 py-0.5 text-[8px] text-slate-300">
                    TypeScript
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Editor Inspector */}
          <div className="space-y-2.5 border-l border-slate-800/70 pl-2">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-1">
              Editor
            </p>
            <div className="space-y-2">
              <div className="demo-editor-item space-y-1">
                <div className="h-1.5 w-10 rounded bg-slate-700" />
                <div className="rounded border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] text-slate-300">
                  Alex Daniels
                </div>
              </div>
              <div className="demo-editor-item space-y-1">
                <div className="h-1.5 w-8 rounded bg-slate-700" />
                <div className="rounded border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] text-slate-400">
                  alex-daniels
                </div>
              </div>
              <div className="demo-editor-item pt-1">
                <button
                  type="button"
                  className="w-full rounded bg-blue-600 py-1 text-[10px] font-semibold text-white shadow-xs flex items-center justify-center gap-1"
                >
                  <Sparkles size={10} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
