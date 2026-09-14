import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Github,
  Layers,
  LayoutTemplate,
  Palette,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Upload,
} from "lucide-react";
import { AuthButton } from "@/components/auth/auth-button";
import { portfolioTemplateList } from "@/components/portfolio/templates";
import { Badge, Button } from "@/components/ui";

const steps = [
  {
    number: "01",
    title: "Add your information",
    description: "Import from your resume or GitHub, or enter your experience manually.",
  },
  {
    number: "02",
    title: "Choose a template",
    description: "Select from six tailored layouts built for developers, designers, and professionals.",
  },
  {
    number: "03",
    title: "Customize your design",
    description: "Fine-tune colors, typography, spacing, and section order with real-time preview.",
  },
  {
    number: "04",
    title: "Publish your portfolio",
    description: "Launch your personal link instantly with fast, responsive performance.",
  },
];

const benefits = [
  {
    icon: Layers,
    title: "Content-Safe Design",
    description:
      "Switch templates anytime without re-entering data or risking layout corruption. Your content is strictly decoupled from presentation.",
  },
  {
    icon: Upload,
    title: "Instant Import Options",
    description:
      "Parse existing PDF resumes with text extraction or connect GitHub to import repositories, technologies, and project links in seconds.",
  },
  {
    icon: Palette,
    title: "Curated Style Tokens",
    description:
      "Select refined color palettes, typography pairings, and section arrangements designed by professional interface standards.",
  },
  {
    icon: Smartphone,
    title: "Responsive by Default",
    description:
      "Every template scales gracefully across desktop, tablet, and mobile screens without manual breakpoint adjustments.",
  },
];

export default function Home() {
  const featuredTemplates = portfolioTemplateList.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900">
      {/* Navigation Shell */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
              <Sparkles size={16} />
            </span>
            <span>Portfolia</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/templates"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Templates
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white to-slate-50/80 px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles size={13} />
                <span>Professional Portfolio Builder</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Build a portfolio that gets you noticed.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                Create, customize, and publish your professional portfolio in one
                focused workspace—no code, no clutter, and complete design control.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
                >
                  Build My Portfolio
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100"
                >
                  Explore Templates
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Free to start
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Resume & GitHub sync
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Instant publishing
                </span>
              </div>
            </div>

            {/* Realistic Product Builder Mockup (The Hero Visual) */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-slate-300/80 bg-slate-900 shadow-2xl ring-1 ring-slate-900/10">
                {/* Browser Top Window Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-red-500/80" />
                    <span className="size-2.5 rounded-full bg-amber-500/80" />
                    <span className="size-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1 text-[11px] text-slate-400 border border-slate-800 font-mono">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>portfolia.app/dashboard/builder</span>
                  </div>
                  <div className="w-10" />
                </div>

                {/* Inner Builder UI Showcase */}
                <div className="grid grid-cols-[80px_1fr_100px] sm:grid-cols-[110px_1fr_130px] bg-slate-900 text-xs">
                  {/* Mini Sidebar */}
                  <div className="border-r border-slate-800 p-2.5 space-y-2 hidden sm:block">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                      Content
                    </span>
                    <div className="rounded-md bg-primary/20 px-2 py-1 text-[11px] font-semibold text-blue-400 border border-blue-500/30">
                      Profile
                    </div>
                    <div className="rounded-md px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200">
                      Projects
                    </div>
                    <div className="rounded-md px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200">
                      Experience
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block pt-1">
                      Design
                    </span>
                    <div className="rounded-md px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200">
                      Templates
                    </div>
                    <div className="rounded-md px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200">
                      Style
                    </div>
                  </div>

                  {/* Centered Canvas / Live Preview */}
                  <div className="bg-slate-950 p-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-primary flex items-center justify-center font-bold text-white text-xs">
                            AD
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200 text-xs">
                              Alex Daniels
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Software Engineer
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold">
                          LIVE
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="h-1.5 w-1/4 rounded bg-primary/80" />
                        <div className="h-3 w-3/4 rounded bg-slate-700/60" />
                        <div className="h-2 w-full rounded bg-slate-800" />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                          <p className="font-semibold text-slate-300 text-[11px]">
                            Distributed Engine
                          </p>
                          <div className="mt-1 flex gap-1">
                            <span className="rounded bg-slate-800 px-1 text-[8px] text-slate-400">
                              Go
                            </span>
                            <span className="rounded bg-slate-800 px-1 text-[8px] text-slate-400">
                              Kafka
                            </span>
                          </div>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                          <p className="font-semibold text-slate-300 text-[11px]">
                            Cloud Analytics UI
                          </p>
                          <div className="mt-1 flex gap-1">
                            <span className="rounded bg-slate-800 px-1 text-[8px] text-slate-400">
                              React
                            </span>
                            <span className="rounded bg-slate-800 px-1 text-[8px] text-slate-400">
                              TypeScript
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini Editor Right Panel */}
                  <div className="border-l border-slate-800 bg-slate-900/60 p-3 space-y-2.5 hidden sm:block">
                    <p className="text-[11px] font-semibold text-slate-300">
                      Editor
                    </p>
                    <div className="space-y-1">
                      <div className="h-2 w-12 rounded bg-slate-700" />
                      <div className="h-6 rounded border border-slate-700 bg-slate-950 px-2 text-[10px] text-slate-400 flex items-center">
                        Alex Daniels
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-16 rounded bg-slate-700" />
                      <div className="h-6 rounded border border-slate-700 bg-slate-950 px-2 text-[10px] text-slate-400 flex items-center">
                        alex-daniels
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="h-6 rounded bg-primary text-center text-[10px] font-semibold text-white flex items-center justify-center">
                        Save
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b border-slate-200/80 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-wider uppercase text-primary">
              Simple Workflow
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Go from zero to a live, polished portfolio in four predictable steps.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all hover:border-blue-200 hover:bg-white hover:shadow-sm"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-primary border border-blue-100">
                  {step.number}
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section className="border-b border-slate-200/80 bg-slate-50/50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <LayoutTemplate size={16} />
                <span>Tailored Layouts</span>
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Six focused templates
              </h2>
              <p className="mt-2 max-w-xl text-base text-slate-600">
                Explore starting structures crafted for distinct professions.
                Switch anytime without losing your saved content.
              </p>
            </div>

            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-blue-800 transition-colors"
            >
              Explore all 6 templates
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* 3 Featured Templates */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredTemplates.map((template) => {
              const isDark = template.defaultTheme.mode === "dark";
              return (
                <div
                  key={template.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                >
                  {/* Thumbnail */}
                  <div
                    className={`relative h-48 p-4 ${isDark ? "bg-slate-950 text-white" : "bg-slate-100/80 text-slate-900"}`}
                  >
                    <div
                      className={`h-full rounded-xl border p-4 flex flex-col justify-between shadow-xs ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div
                            className="size-4 rounded-full"
                            style={{ background: template.defaultTheme.primaryColor }}
                          />
                          <span className="text-[10px] font-mono opacity-50 uppercase">
                            {template.category}
                          </span>
                        </div>
                        <div
                          className={`mt-4 h-3.5 w-3/4 rounded ${isDark ? "bg-slate-700" : "bg-slate-800"}`}
                        />
                        <div
                          className={`mt-2 h-2 w-1/2 rounded ${isDark ? "bg-slate-800" : "bg-slate-200"}`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className={`h-9 rounded-md border ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-100 bg-slate-50"}`}
                        />
                        <div
                          className={`h-9 rounded-md border ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-100 bg-slate-50"}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">
                          {template.name}
                        </h3>
                        <Badge variant="outline" className="text-[11px]">
                          {template.tier}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                        {template.description}
                      </p>
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        Best for: {template.recommendedFor.join(", ")}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href="/templates"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-blue-800"
                      >
                        View Template
                        <ChevronRight size={15} />
                      </Link>
                      <Link
                        href="/dashboard"
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Use in Builder →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-800"
            >
              Explore all templates and live previews
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="border-b border-slate-200/80 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-wider uppercase text-primary">
              Core Principles
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for simplicity and polish
            </h2>
            <p className="mt-3 text-base text-slate-600">
              No endless drag-and-drop wrestling. Portfolia guarantees professional
              visual balance out of the box.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="space-y-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100">
                    <Icon size={20} />
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary py-20 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to put your work forward?
          </h2>
          <p className="mt-4 text-base text-blue-100 sm:text-lg">
            Join professionals building calm, distinctive portfolios without
            writing a line of CSS.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-primary shadow-sm hover:bg-blue-50 active:bg-blue-100 transition-colors"
            >
              Build My Portfolio
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-transparent px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              Explore Templates
            </Link>
          </div>
        </div>
      </section>

      {/* Application Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-2 font-bold text-white">
            <Sparkles size={16} className="text-primary" />
            <span>Portfolia</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link href="/templates" className="hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>

          <div className="text-xs text-slate-500">
            © 2026 Portfolia. Built for professional work.
          </div>
        </div>
      </footer>
    </main>
  );
}
