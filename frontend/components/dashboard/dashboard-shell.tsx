"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  Github,
  LayoutTemplate,
  Pencil,
  Plus,
  Sparkles,
  User,
} from "lucide-react";
import { AuthButton } from "@/components/auth/auth-button";
import { useAuth } from "@/components/auth/auth-provider";
import { portfolioTemplateList } from "@/components/portfolio/templates";
import { Badge, Button, Card } from "@/components/ui";
import { api } from "@/lib/api";
import type { ApiResponse, Portfolio } from "@/types/index";

interface ContentCounts {
  projects: number;
  experiences: number;
  skills: number;
  educations: number;
}

export function DashboardShell() {
  const { ready, authenticated, login } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [counts, setCounts] = useState<ContentCounts>({
    projects: 0,
    experiences: 0,
    skills: 0,
    educations: 0,
  });
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const p = await api<ApiResponse<Portfolio>>("/api/portfolios/me");
      setPortfolio(p.data);

      // Fetch related stats
      const [projects, experiences, skills, educations] = await Promise.all([
        api<ApiResponse<unknown[]>>("/api/projects").catch(() => ({ data: [] })),
        api<ApiResponse<unknown[]>>("/api/experiences").catch(() => ({ data: [] })),
        api<ApiResponse<unknown[]>>("/api/skills").catch(() => ({ data: [] })),
        api<ApiResponse<unknown[]>>("/api/educations").catch(() => ({ data: [] })),
      ]);

      setCounts({
        projects: projects.data?.length ?? 0,
        experiences: experiences.data?.length ?? 0,
        skills: skills.data?.length ?? 0,
        educations: educations.data?.length ?? 0,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.includes("not found")) {
        setError(msg);
      }
      setPortfolio(null);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      void loadData();
    }
  }, [authenticated, loadData]);

  async function togglePublish() {
    if (!portfolio) return;
    setPublishing(true);
    try {
      const action = portfolio.published ? "unpublish" : "publish";
      const response = await api<ApiResponse<Portfolio>>(
        `/api/portfolios/${portfolio.id}/${action}`,
        { method: "POST" },
      );
      setPortfolio(response.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update publication status.");
    } finally {
      setPublishing(false);
    }
  }

  const copyUrl = async () => {
    if (!portfolio?.slug) return;
    const url = `${window.location.origin}/u/${portfolio.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading skeleton state
  if (!ready || (authenticated && loadingData && !portfolio && !error)) {
    return (
      <main className="min-h-screen bg-slate-50/50">
        <header className="border-b border-slate-200/80 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 text-xl font-bold text-primary">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
                <Sparkles size={16} />
              </span>
              <span>Portfolia</span>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-12 space-y-6 animate-pulse">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-200" />
          <div className="h-64 rounded-2xl border border-slate-200 bg-white p-8" />
        </div>
      </main>
    );
  }

  // Unauthenticated landing state
  if (!authenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50/60 p-6">
        <Card className="w-full max-w-md rounded-2xl p-8 text-center shadow-sm">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-xs">
            <Sparkles size={22} />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Welcome to Portfolia
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Log in or create an account to build and manage your portfolio.
          </p>
          <Button
            size="lg"
            onClick={login}
            className="mt-6 w-full justify-center shadow-xs"
          >
            Continue with Keycloak
            <ArrowRight size={17} />
          </Button>
        </Card>
      </main>
    );
  }

  // Common Header Shell for Authenticated Users
  const renderNavbar = () => (
    <header className="border-b border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary transition-opacity hover:opacity-90"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
              <Sparkles size={16} />
            </span>
            <span>Portfolia</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link
              href="/dashboard"
              className="text-primary font-semibold transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/templates"
              className="hover:text-slate-900 transition-colors"
            >
              Templates
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );

  // Empty state: onboarding flow for users without a portfolio
  if (!portfolio) {
    const previewTemplates = portfolioTemplateList.slice(0, 3);
    return (
      <main className="min-h-screen bg-slate-50/50">
        {renderNavbar()}

        <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
          {/* Main Onboarding Hero */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-primary border border-blue-100">
              <BriefcaseBusiness size={28} />
            </span>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Create your professional portfolio
            </h1>
            <p className="mt-3 max-w-xl mx-auto text-base text-slate-600">
              Import your resume, connect GitHub, or start from scratch. Build and
              publish your tailored showcase in minutes.
            </p>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
              <Link
                href="/dashboard/builder"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Create Portfolio
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LayoutTemplate size={18} />
                View Templates
              </Link>
            </div>

            {/* Guided Path Options */}
            <div className="mt-12 grid gap-4 sm:grid-cols-3 text-left border-t border-slate-100 pt-8">
              <Link
                href="/dashboard/builder"
                className="group rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all hover:border-blue-200 hover:bg-white hover:shadow-xs"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 group-hover:text-primary group-hover:border-primary/30">
                  <User size={18} />
                </span>
                <h3 className="mt-3 font-bold text-slate-900 text-sm">
                  Start from Scratch
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Enter your background and projects step by step.
                </p>
              </Link>

              <Link
                href="/dashboard/builder"
                className="group rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all hover:border-blue-200 hover:bg-white hover:shadow-xs"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 group-hover:text-primary group-hover:border-primary/30">
                  <FileText size={18} />
                </span>
                <h3 className="mt-3 font-bold text-slate-900 text-sm">
                  Import Resume PDF
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Extract experience, skills, and education instantly.
                </p>
              </Link>

              <Link
                href="/dashboard/builder"
                className="group rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all hover:border-blue-200 hover:bg-white hover:shadow-xs"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 group-hover:text-primary group-hover:border-primary/30">
                  <Github size={18} />
                </span>
                <h3 className="mt-3 font-bold text-slate-900 text-sm">
                  Connect GitHub
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Pull your best repositories, stars, and tech stacks.
                </p>
              </Link>
            </div>
          </div>

          {/* Template preview cards */}
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Popular Templates
              </h2>
              <Link
                href="/templates"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Browse all 6 templates →
              </Link>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {previewTemplates.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3 shadow-xs"
                >
                  <div
                    className="size-10 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0"
                    style={{ background: t.defaultTheme.primaryColor }}
                  >
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {t.recommendedFor[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
        </div>
      </main>
    );
  }

  // Calculate completeness score based on real data
  let score = 25; // base for having created a profile
  if (portfolio.headline) score += 15;
  if (counts.projects > 0) score += 20;
  if (counts.experiences > 0 || counts.educations > 0) score += 20;
  if (counts.skills > 0) score += 10;
  if (portfolio.published) score += 10;
  score = Math.min(100, score);

  const getNextStep = () => {
    if (!portfolio.headline) return "Add a professional headline in the Profile panel.";
    if (counts.projects === 0) return "Add your first project or import from GitHub.";
    if (counts.experiences === 0) return "Add your work experience or import your resume.";
    if (!portfolio.published) return "Your portfolio is ready! Publish it to get your live URL.";
    return "Your portfolio is live and up to date.";
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      {renderNavbar()}

      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Workspace Overview
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              My Portfolio
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              disabled={publishing}
              onClick={togglePublish}
              className="text-sm font-semibold"
            >
              {publishing ? "Updating…" : portfolio.published ? "Unpublish" : "Publish"}
            </Button>

            <Link
              href="/dashboard/builder"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <Pencil size={16} />
              Edit portfolio
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Primary Portfolio Card */}
        <Card className="rounded-2xl border-slate-200/90 bg-white p-7 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <Badge
                  variant={portfolio.published ? "success" : "warning"}
                  className="font-bold tracking-wider"
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      portfolio.published ? "bg-emerald-600" : "bg-amber-600"
                    }`}
                  />
                  {portfolio.published ? "PUBLISHED" : "DRAFT"}
                </Badge>
                <span className="text-xs font-mono text-slate-400 capitalize">
                  {portfolio.templateKey ?? "Modern"} template
                </span>
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {portfolio.fullName}
              </h2>
              {portfolio.headline && (
                <p className="mt-1 text-sm text-slate-600 font-medium">
                  {portfolio.headline}
                </p>
              )}

              {/* Public URL with Copy */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 border border-slate-200">
                  /u/{portfolio.slug}
                </span>
                <button
                  type="button"
                  onClick={() => void copyUrl()}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Copy size={13} />
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>
            </div>

            {portfolio.published && (
              <Link
                href={`/u/${portfolio.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-primary shadow-xs hover:bg-slate-50 transition-colors shrink-0"
              >
                <ExternalLink size={14} />
                View portfolio
              </Link>
            )}
          </div>

          {/* Completeness Bar */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Portfolio Completeness</span>
              <span className="text-primary font-bold">{score}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Next recommended step:</span>{" "}
              {getNextStep()}
            </p>
          </div>

          {/* Real Useful Statistics */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4">
            <Stat
              label="Projects"
              value={
                counts.projects === 1 ? "1 project" : `${counts.projects} projects`
              }
            />
            <Stat
              label="Experience"
              value={
                counts.experiences === 1
                  ? "1 position"
                  : `${counts.experiences} positions`
              }
            />
            <Stat
              label="Skills"
              value={
                counts.skills === 1 ? "1 skill" : `${counts.skills} skills`
              }
            />
            <Stat
              label="Education"
              value={
                counts.educations === 1
                  ? "1 record"
                  : `${counts.educations} records`
              }
            />
          </div>
        </Card>

        {/* Quick Actions Bar */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/builder"
            className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-blue-200 hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100">
                <Pencil size={18} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Open Portfolio Builder
                </h3>
                <p className="text-xs text-slate-500">
                  Edit bio, sections, layouts, and styles.
                </p>
              </div>
            </div>
            <ArrowRight
              size={16}
              className="text-slate-400 group-hover:text-primary transition-colors"
            />
          </Link>

          <Link
            href="/templates"
            className="group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-blue-200 hover:shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <LayoutTemplate size={18} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Browse Templates
                </h3>
                <p className="text-xs text-slate-500">
                  Preview all 6 templates with your content.
                </p>
              </div>
            </div>
            <ArrowRight
              size={16}
              className="text-slate-400 group-hover:text-slate-900 transition-colors"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900 text-sm">{value}</p>
    </div>
  );
}
