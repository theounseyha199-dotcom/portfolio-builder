"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FileText,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { type PreviewDevice } from "@/components/builder/builder-device-switcher";
import { BuilderPreview } from "@/components/builder/builder-preview";
import { BuilderSettingsPanel } from "@/components/builder/builder-settings-panel";
import { BuilderMobileNavigation, BuilderSidebar, type BuilderPanel } from "@/components/builder/builder-sidebar";
import { BuilderTopbar, type SaveState } from "@/components/builder/builder-topbar";
import { ContentManager } from "@/components/builder/content-manager";
import { GitHubImportPanel } from "@/components/builder/github-import-panel";
import { ResumeImportPanel } from "@/components/builder/resume-import-panel";
import { TemplateGallery } from "@/components/builder/template-gallery";
import { DesignPanel } from "@/components/design/design-panel";
import { SectionsPanel } from "@/components/design/sections-panel";
import {
  defaultTheme,
  type PortfolioData,
  type Section as PortfolioSection,
  type Theme,
} from "@/components/portfolio/renderer/portfolio-renderer";
import type { TemplateId } from "@/components/portfolio/templates";
import { Button, Input, Label } from "@/components/ui";
import { assetApi, type AssetInfo } from "@/features/content/assets";
import type { Education, Experience, Project, Skill, SocialLink } from "@/features/content/types";
import {
  useUpdatePortfolioDesignMutation,
  useUpdatePortfolioSectionsMutation,
} from "@/features/portfolio/design-api";
import { api } from "@/lib/api";
import { resolvePortfolioTheme } from "@/lib/design/theme-utils";
import type { ApiResponse, Portfolio } from "@/types";

type BuilderPortfolio = Portfolio & { profileImageUrl?: string };

const content = {
  Experience: "experiences",
  Education: "educations",
  Projects: "projects",
  Skills: "skills",
  "Social Links": "social-links",
} as const;

export default function BuilderPage() {
  const { authenticated, login } = useAuth();
  const [updatePortfolioDesign] = useUpdatePortfolioDesignMutation();
  const [updatePortfolioSections] = useUpdatePortfolioSectionsMutation();

  const [section, setSection] = useState<BuilderPanel>("Profile");
  const [portfolio, setPortfolio] = useState<BuilderPortfolio | null>(null);
  const [form, setForm] = useState({ slug: "", fullName: "", headline: "" });
  const [resume, setResume] = useState<AssetInfo | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveState>("saved");
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [preview, setPreview] = useState<PortfolioData | null>(null);
  const [themeDraft, setThemeDraft] = useState<Theme>(defaultTheme);
  const [mobileTab, setMobileTab] = useState<"preview" | "editor">("editor");

  const load = async () => {
    try {
      const p = await api<ApiResponse<BuilderPortfolio>>("/api/portfolios/me");
      setPortfolio(p.data);
      setForm({
        slug: p.data.slug,
        fullName: p.data.fullName,
        headline: p.data.headline ?? "",
      });

      const [experiences, educations, skills, projects, socialLinks, sections, resumeAsset] =
        await Promise.all([
          api<ApiResponse<Experience[]>>("/api/experiences").then((value) => value.data),
          api<ApiResponse<Education[]>>("/api/educations").then((value) => value.data),
          api<ApiResponse<Skill[]>>("/api/skills").then((value) => value.data),
          api<ApiResponse<Project[]>>("/api/projects").then((value) => value.data),
          api<ApiResponse<SocialLink[]>>("/api/social-links").then((value) => value.data),
          api<ApiResponse<PortfolioSection[]>>("/api/portfolio-sections").then((value) => value.data),
          assetApi.resume(),
        ]);

      setResume(resumeAsset);
      const renderPortfolio: PortfolioData = {
        ...p.data,
        templateKey: p.data.templateKey as PortfolioData["templateKey"],
        experiences,
        educations,
        skills,
        projects,
        socialLinks,
        sections,
        resume: resumeAsset
          ? { available: true, url: resumeAsset.url }
          : { available: false },
      };
      setPreview(renderPortfolio);
      setThemeDraft(resolvePortfolioTheme(renderPortfolio));
      setSaveStatus("saved");
    } catch {
      setPortfolio(null);
      setResume(null);
      setPreview(null);
    }
  };

  useEffect(() => {
    if (authenticated) void load();
  }, [authenticated]);

  const error = (e: unknown, fallback: string) => {
    setMessage(e instanceof Error ? e.message : fallback);
    setSaveStatus("error");
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaveStatus("saving");
    try {
      const response = portfolio
        ? await api<ApiResponse<BuilderPortfolio>>(`/api/portfolios/${portfolio.id}`, {
            method: "PUT",
            body: JSON.stringify(form),
          })
        : await api<ApiResponse<BuilderPortfolio>>("/api/portfolios", {
            method: "POST",
            body: JSON.stringify(form),
          });
      setPortfolio(response.data);
      setMessage("Profile saved.");
      setSaveStatus("saved");
      await load();
    } catch (e) {
      error(e, "Unable to save profile.");
    } finally {
      setBusy(false);
    }
  }

  async function profileUpload(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return setMessage("Only JPEG, PNG, and WebP images are supported.");
    }
    if (file.size > 5242880) {
      return setMessage("Profile image must be smaller than 5 MB.");
    }
    setBusy(true);
    setSaveStatus("saving");
    try {
      await assetApi.uploadProfileImage(file);
      setMessage("Profile photo uploaded.");
      setSaveStatus("saved");
      await load();
    } catch (e) {
      error(e, "Unable to upload profile photo.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProfile() {
    setBusy(true);
    setSaveStatus("saving");
    try {
      await assetApi.deleteProfileImage();
      setMessage("Profile photo removed.");
      setSaveStatus("saved");
      await load();
    } catch (e) {
      error(e, "Unable to remove profile photo.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadResume(file?: File) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      return setMessage("Resume must be a PDF.");
    }
    if (file.size > 5242880) {
      return setMessage("Resume must be smaller than 5 MB.");
    }
    setBusy(true);
    setSaveStatus("saving");
    try {
      await assetApi.uploadResume(file);
      setMessage("Resume uploaded.");
      setSaveStatus("saved");
      await load();
    } catch (e) {
      error(e, "Unable to upload resume.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteResume() {
    setBusy(true);
    setSaveStatus("saving");
    try {
      await assetApi.deleteResume();
      setMessage("Resume removed.");
      setSaveStatus("saved");
      await load();
    } catch (e) {
      error(e, "Unable to remove resume.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePublish() {
    if (!portfolio) return;
    setBusy(true);
    setSaveStatus("saving");
    try {
      const action = portfolio.published ? "unpublish" : "publish";
      const response = await api<ApiResponse<BuilderPortfolio>>(
        `/api/portfolios/${portfolio.id}/${action}`,
        { method: "POST" },
      );
      setPortfolio(response.data);
      setMessage(portfolio.published ? "Portfolio unpublished." : "Portfolio published.");
      setSaveStatus("saved");
      await load();
    } catch (e) {
      error(e, "Unable to update publishing status.");
    } finally {
      setBusy(false);
    }
  }

  async function saveDesign(
    nextTemplate = portfolio?.templateKey ?? "modern",
    nextTheme = themeDraft,
  ) {
    if (!portfolio) return;
    setBusy(true);
    setSaveStatus("saving");
    try {
      await updatePortfolioDesign({
        templateKey: nextTemplate as TemplateId,
        themeConfig: nextTheme,
      }).unwrap();
      setMessage("Design saved.");
      setSaveStatus("saved");
      await load();
    } catch (e) {
      error(e, "Unable to save design changes.");
    } finally {
      setBusy(false);
    }
  }

  async function saveSections(next: PortfolioSection[]) {
    if (!portfolio) return;
    setBusy(true);
    setSaveStatus("saving");
    try {
      await updatePortfolioSections({
        sections: next.map((item, index) => ({ ...item, position: index + 1 })),
      }).unwrap();
      setMessage("Sections saved.");
      setSaveStatus("saved");
      await load();
    } catch (e) {
      error(e, "Unable to save section changes.");
    } finally {
      setBusy(false);
    }
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Portfolio Builder
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Please authenticate to access your portfolio workspace.
          </p>
          <Button onClick={login} size="lg" className="mt-6 w-full justify-center">
            Log in with Keycloak
          </Button>
        </div>
      </main>
    );
  }

  const initials = (form.fullName || "?")
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-100/70 flex flex-col">
      {/* Topbar */}
      <BuilderTopbar
        name={portfolio?.fullName ?? form.fullName}
        published={Boolean(portfolio?.published)}
        slug={portfolio?.slug}
        device={device}
        saveStatus={busy ? "saving" : saveStatus}
        saveMessage={message}
        onDeviceChange={setDevice}
        onPreview={() => {
          if (portfolio) {
            window.open(`/u/${portfolio.slug}`, "_blank", "noopener,noreferrer");
          }
        }}
        onPublish={() => void togglePublish()}
      />

      {/* Mobile Bar: Tab switch + Panel Select */}
      <div className="border-b border-slate-200/80 bg-white p-3 space-y-2 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 flex-1 rounded-xl border border-slate-200 bg-slate-100/70 p-1">
            <button
              type="button"
              onClick={() => setMobileTab("editor")}
              className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                mobileTab === "editor"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Editor ({section})
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                mobileTab === "preview"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Live Preview
            </button>
          </div>
        </div>

        <BuilderMobileNavigation
          active={section}
          onSelect={(s) => {
            setSection(s);
            setMobileTab("editor");
          }}
        />
      </div>

      {/* Main 3-Column Layout on Desktop, Responsive on Tablet/Mobile */}
      <div className="grid flex-1 lg:grid-cols-[240px_minmax(0,1fr)_380px] xl:grid-cols-[260px_minmax(0,1fr)_400px]">
        {/* Left: Sidebar (Desktop) */}
        <div className="hidden border-r border-slate-200/80 lg:block bg-white">
          <BuilderSidebar active={section} onSelect={setSection} />
        </div>

        {/* Center: Live Preview Canvas */}
        <div
          className={`min-w-0 flex-col ${
            mobileTab === "preview" ? "flex" : "hidden lg:flex"
          }`}
        >
          {preview ? (
            <BuilderPreview
              portfolio={preview}
              device={device}
              themeOverride={themeDraft}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-slate-500">
              <div className="max-w-sm space-y-2">
                <p className="font-semibold text-slate-700">
                  Live Canvas Ready
                </p>
                <p className="text-xs text-slate-500">
                  Save your profile in the editor to start the real-time preview.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Settings & Content Editor Panel */}
        <div
          className={`min-w-0 flex-col ${
            mobileTab === "editor" ? "flex" : "hidden lg:flex"
          }`}
        >
          <BuilderSettingsPanel title={section}>
            {message && (
              <div
                role="status"
                className="mb-4 rounded-xl border border-blue-100 bg-blue-50/80 p-3 text-xs font-medium text-primary flex items-center justify-between"
              >
                <span>{message}</span>
                <button
                  type="button"
                  onClick={() => setMessage("")}
                  className="text-primary hover:underline text-[11px]"
                >
                  Dismiss
                </button>
              </div>
            )}

            {section === "Profile" ? (
              <form id="portfolio-form" onSubmit={save} className="space-y-6">
                {/* Photo Upload Row */}
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-bold text-primary text-base shadow-xs shrink-0 border border-primary/20">
                    {portfolio?.profileImageUrl ? (
                      <Image
                        src={portfolio.profileImageUrl}
                        alt="Profile photo"
                        width={64}
                        height={64}
                        className="size-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900">
                      Profile Photo
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors">
                        <Upload size={13} />
                        <span>{busy ? "Uploading…" : "Upload Photo"}</span>
                        <input
                          className="hidden"
                          disabled={busy || !portfolio}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => void profileUpload(e.target.files?.[0])}
                        />
                      </label>
                      {portfolio?.profileImageUrl && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void deleteProfile()}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      JPEG, PNG, or WebP · Up to 5 MB
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prof-fullName">Full Name</Label>
                    <Input
                      id="prof-fullName"
                      required
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      placeholder="e.g. Alex Morgan"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="prof-slug">Public URL Slug</Label>
                    <div className="mt-1.5 flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                      <span className="px-3 text-xs text-slate-400 font-mono select-none">
                        /u/
                      </span>
                      <input
                        id="prof-slug"
                        required
                        value={form.slug}
                        onChange={(e) =>
                          setForm({ ...form, slug: e.target.value.toLowerCase() })
                        }
                        placeholder="alex-morgan"
                        className="h-10 flex-1 bg-white px-2.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prof-headline">Professional Headline</Label>
                    <Input
                      id="prof-headline"
                      value={form.headline}
                      onChange={(e) =>
                        setForm({ ...form, headline: e.target.value })
                      }
                      placeholder="e.g. Senior Software Engineer & Designer"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full justify-center gap-2 shadow-xs"
                  >
                    <Save size={16} />
                    <span>{busy ? "Saving…" : "Save profile"}</span>
                  </Button>
                </div>
              </form>
            ) : section === "Resume" ? (
              <div className="space-y-4">
                {resume ? (
                  <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-primary shrink-0 border border-blue-100">
                        <FileText size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {resume.filename}
                        </p>
                        <p className="text-xs text-slate-500">
                          PDF document · {Math.ceil(resume.size / 1024)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors">
                        <Upload size={13} />
                        <span>{busy ? "Uploading…" : "Replace resume"}</span>
                        <input
                          className="hidden"
                          disabled={busy}
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(e) =>
                            void uploadResume(e.target.files?.[0])
                          }
                        />
                      </label>
                      <Button
                        type="button"
                        variant="destructive-outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => void deleteResume()}
                        className="text-xs h-8"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-7 text-center">
                    <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-primary border border-blue-100">
                      <FileText size={24} />
                    </span>
                    <h3 className="mt-3 font-bold text-slate-900 text-sm">
                      Upload your PDF resume
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                      Add a downloadable resume file for visitors, or import its
                      contents into your portfolio sections.
                    </p>
                    <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors">
                      <Upload size={15} />
                      <span>{busy ? "Uploading…" : "Choose PDF file"}</span>
                      <input
                        className="hidden"
                        disabled={busy || !portfolio}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => void uploadResume(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                )}
              </div>
            ) : section === "GitHub" ? (
              <GitHubImportPanel />
            ) : section === "Resume Import" ? (
              <ResumeImportPanel
                hasResume={Boolean(resume)}
                onGoToResume={() => setSection("Resume")}
              />
            ) : section === "Templates" ? (
              preview && portfolio ? (
                <TemplateGallery
                  portfolio={preview}
                  currentTemplate={(portfolio.templateKey || "minimal") as TemplateId}
                  onApplied={load}
                />
              ) : (
                <p className="text-xs text-slate-500">
                  Save your profile before selecting a template.
                </p>
              )
            ) : section === "Style" ? (
              <DesignPanel
                value={themeDraft}
                busy={busy}
                onChange={setThemeDraft}
                onSave={(next) => saveDesign(undefined, next)}
              />
            ) : section === "Sections" ? (
              <SectionsPanel
                sections={preview?.sections ?? []}
                templateId={(portfolio?.templateKey || "modern") as TemplateId}
                busy={busy}
                onSave={saveSections}
              />
            ) : section === "Portfolio" || section === "Publishing" ? (
              <div className="space-y-4 text-sm">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Public Address
                  </p>
                  <p className="font-mono text-sm font-bold text-slate-900">
                    {portfolio
                      ? `/u/${portfolio.slug}`
                      : "Create a portfolio first"}
                  </p>
                </div>
                {portfolio && (
                  <Button
                    type="button"
                    disabled={busy}
                    variant={portfolio.published ? "secondary" : "primary"}
                    onClick={() => void togglePublish()}
                    className="w-full justify-center"
                  >
                    {portfolio.published
                      ? "Unpublish portfolio"
                      : "Publish portfolio"}
                  </Button>
                )}
              </div>
            ) : (
              <ContentManager kind={content[section]} />
            )}
          </BuilderSettingsPanel>
        </div>
      </div>
    </main>
  );
}
