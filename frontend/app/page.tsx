import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  LayoutTemplate,
  Palette,
  Sparkles,
  Smartphone,
  Upload,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { AuthButton } from "@/components/auth/auth-button";
import { LandingBuilderDemo } from "@/components/landing/landing-builder-demo";
import { Reveal } from "@/components/landing/reveal";
import { portfolioTemplateList } from "@/components/portfolio/templates";
import { LandingFooterCta, LandingHeroCta } from "@/components/landing/landing-cta";
import {
  AnimatedGridPattern,
  Badge,
  BorderBeam,
} from "@/components/ui";

const steps = [
  {
    number: "01",
    title: "Add your information",
    description:
      "Import from your resume or GitHub, or enter your experience manually.",
  },
  {
    number: "02",
    title: "Choose a template",
    description:
      "Select from six tailored layouts built for developers, designers, and professionals.",
  },
  {
    number: "03",
    title: "Customize your design",
    description:
      "Fine-tune colors, typography, spacing, and section order with real-time preview.",
  },
  {
    number: "04",
    title: "Publish your portfolio",
    description:
      "Launch your personal link instantly with fast, responsive performance.",
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
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
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

      {/* Hero Section with Decorative Animated Grid Pattern */}
      <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-slate-50/80 px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Subtle Decorative Animated Grid */}
        <AnimatedGridPattern
          width={48}
          height={48}
          className="opacity-25 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            {/* Left Hero Content */}
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
                <LandingHeroCta />

                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100"
                >
                  Explore Templates
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-500">
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

            {/* Right Hero Visual: Isolated GSAP Sequence Component */}
            <div className="flex justify-center">
              <LandingBuilderDemo />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b border-slate-200/80 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-wider uppercase text-primary">
                Simple Workflow
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How it works
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Go from zero to a live, polished portfolio in four predictable
                steps.
              </p>
            </div>
          </Reveal>

          {/* Desktop connecting guide indicator */}
          <div className="relative mt-14">
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-linear-to-r from-blue-100 via-blue-200 to-blue-100 z-0"
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              {steps.map((step, index) => (
                <Reveal key={step.number} delay={index * 0.08}>
                  <div className="group relative rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-md">
                    <span className="inline-flex size-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-primary border border-blue-100 shadow-2xs">
                      {step.number}
                    </span>
                    <h3 className="mt-4 text-base font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section className="border-b border-slate-200/80 bg-slate-50/50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
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
          </Reveal>

          {/* 3 Featured Templates */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featuredTemplates.map((template, idx) => {
              const isDark = template.defaultTheme.mode === "dark";
              const isFeatured = idx === 1; // Highlight the middle template with BorderBeam

              return (
                <Reveal key={template.id} delay={idx * 0.1}>
                  <div
                    className={`relative group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                      isFeatured
                        ? "border-blue-300/80 ring-1 ring-blue-500/20"
                        : "border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    {/* Subtle Border Beam for primary featured card */}
                    {isFeatured && (
                      <BorderBeam
                        size={180}
                        duration={14}
                        borderWidth={1.5}
                        colorFrom="#2563eb"
                        colorTo="#60a5fa"
                      />
                    )}

                    {/* Thumbnail */}
                    <div
                      className={`relative h-48 p-4 ${
                        isDark
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100/80 text-slate-900"
                      }`}
                    >
                      <div
                        className={`h-full rounded-xl border p-4 flex flex-col justify-between shadow-xs transition-transform duration-300 group-hover:scale-[1.015] ${
                          isDark
                            ? "border-slate-800 bg-slate-900"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div
                              className="size-4 rounded-full"
                              style={{
                                background: template.defaultTheme.primaryColor,
                              }}
                            />
                            <span className="text-[10px] font-mono opacity-50 uppercase">
                              {template.category}
                            </span>
                          </div>
                          <div
                            className={`mt-4 h-3.5 w-3/4 rounded ${
                              isDark ? "bg-slate-700" : "bg-slate-800"
                            }`}
                          />
                          <div
                            className={`mt-2 h-2 w-1/2 rounded ${
                              isDark ? "bg-slate-800" : "bg-slate-200"
                            }`}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div
                            className={`h-9 rounded-md border ${
                              isDark
                                ? "border-slate-800 bg-slate-950/60"
                                : "border-slate-100 bg-slate-50"
                            }`}
                          />
                          <div
                            className={`h-9 rounded-md border ${
                              isDark
                                ? "border-slate-800 bg-slate-950/60"
                                : "border-slate-100 bg-slate-50"
                            }`}
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
                </Reveal>
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
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-wider uppercase text-primary">
                Core Principles
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Engineered for simplicity and polish
              </h2>
              <p className="mt-3 text-base text-slate-600">
                No endless drag-and-drop wrestling. Portfolia guarantees
                professional visual balance out of the box.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <Reveal key={benefit.title} delay={i * 0.08}>
                  <div className="space-y-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100 shadow-2xs">
                      <Icon size={20} />
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary py-20 px-6 text-center text-white relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to put your work forward?
            </h2>
            <p className="mt-4 text-base text-blue-100 sm:text-lg">
              Join professionals building calm, distinctive portfolios without
              writing a line of CSS.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <LandingFooterCta />
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-transparent px-6 py-3.5 text-base font-semibold text-white hover:bg-white/10 active:bg-white/20 transition-colors"
              >
                Explore Templates
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Application Footer with Social Brand Icons */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-2 font-bold text-white">
            <Sparkles size={16} className="text-primary" />
            <span>Portfolia</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link
              href="/templates"
              className="hover:text-white transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>

          {/* Social Icons from react-icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-white transition-colors"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X (formerly Twitter)"
              className="hover:text-white transition-colors"
            >
              <FaXTwitter size={18} />
            </a>
          </div>

          <div className="text-xs text-slate-500">
            © 2026 Portfolia. Built for professional work.
          </div>
        </div>
      </footer>
    </main>
  );
}
