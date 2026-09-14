"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Save, Upload, Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { BuilderDeviceSwitcher, type PreviewDevice } from "@/components/builder/builder-device-switcher";
import { BuilderPreview } from "@/components/builder/builder-preview";
import { BuilderSettingsPanel } from "@/components/builder/builder-settings-panel";
import { BuilderSidebar, type BuilderPanel } from "@/components/builder/builder-sidebar";
import { BuilderTopbar } from "@/components/builder/builder-topbar";
import { ContentManager } from "@/components/builder/content-manager";
import { DesignPanel } from "@/components/design/design-panel";
import { SectionsPanel } from "@/components/design/sections-panel";
import { GitHubImportPanel } from "@/components/builder/github-import-panel";
import { ResumeImportPanel } from "@/components/builder/resume-import-panel";
import { TemplateGallery } from "@/components/builder/template-gallery";
import { defaultTheme, type PortfolioData, type Section as PortfolioSection, type Theme } from "@/components/portfolio/renderer/portfolio-renderer";
import type { TemplateId } from "@/components/portfolio/templates";
import { Button } from "@/components/ui";
import { assetApi, type AssetInfo } from "@/features/content/assets";
import type { Education, Experience, Project, Skill, SocialLink } from "@/features/content/types";
import { useUpdatePortfolioDesignMutation, useUpdatePortfolioSectionsMutation } from "@/features/portfolio/design-api";
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
  const [section, setSection] = useState<BuilderPanel>("Profile"),
    [portfolio, setPortfolio] = useState<BuilderPortfolio | null>(null),
    [form, setForm] = useState({ slug: "", fullName: "", headline: "" }),
    [resume, setResume] = useState<AssetInfo | null>(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [device, setDevice] = useState<PreviewDevice>("desktop"),
    [preview, setPreview] = useState<PortfolioData | null>(null),
    [themeDraft, setThemeDraft] = useState<Theme>(defaultTheme);
  const load = async () => {
    try {
      const p = await api<ApiResponse<BuilderPortfolio>>("/api/portfolios/me");
      setPortfolio(p.data);
      setForm({
        slug: p.data.slug,
        fullName: p.data.fullName,
        headline: p.data.headline ?? "",
      });
      const [experiences, educations, skills, projects, socialLinks, sections, resumeAsset] = await Promise.all([
        api<ApiResponse<Experience[]>>("/api/experiences").then((value) => value.data),
        api<ApiResponse<Education[]>>("/api/educations").then((value) => value.data),
        api<ApiResponse<Skill[]>>("/api/skills").then((value) => value.data),
        api<ApiResponse<Project[]>>("/api/projects").then((value) => value.data),
        api<ApiResponse<SocialLink[]>>("/api/social-links").then((value) => value.data),
        api<ApiResponse<PortfolioSection[]>>("/api/portfolio-sections").then((value) => value.data),
        assetApi.resume(),
      ]);
      setResume(resumeAsset);
      const renderPortfolio: PortfolioData = { ...p.data, templateKey: p.data.templateKey as PortfolioData["templateKey"], experiences, educations, skills, projects, socialLinks, sections, resume: resumeAsset ? { available: true, url: resumeAsset.url } : { available: false } };
      setPreview(renderPortfolio);
      setThemeDraft(resolvePortfolioTheme(renderPortfolio));
    } catch {
      setPortfolio(null);
      setResume(null);
      setPreview(null);
    }
  };
  useEffect(() => {
    if (authenticated) void load();
  }, [authenticated]);
  const error = (e: unknown, fallback: string) =>
    setMessage(e instanceof Error ? e.message : fallback);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const response = portfolio
        ? await api<ApiResponse<BuilderPortfolio>>(
            `/api/portfolios/${portfolio.id}`,
            { method: "PUT", body: JSON.stringify(form) },
          )
        : await api<ApiResponse<BuilderPortfolio>>("/api/portfolios", {
            method: "POST",
            body: JSON.stringify(form),
          });
      setPortfolio(response.data);
      setMessage("Profile saved.");
    } catch (e) {
      error(e, "Unable to save profile.");
    } finally {
      setBusy(false);
    }
  }
  async function profile(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      return setMessage("Only JPEG, PNG, and WebP images are supported.");
    if (file.size > 5242880)
      return setMessage("Profile image must be smaller than 5 MB.");
    setBusy(true);
    try {
      await assetApi.uploadProfileImage(file);
      setMessage("Profile image uploaded.");
      await load();
    } catch (e) {
      error(e, "Unable to upload profile image.");
    } finally {
      setBusy(false);
    }
  }
  async function deleteProfile() {
    setBusy(true);
    try {
      await assetApi.deleteProfileImage();
      setMessage("Profile image removed.");
      await load();
    } catch (e) {
      error(e, "Unable to remove profile image.");
    } finally {
      setBusy(false);
    }
  }
  async function uploadResume(file?: File) {
    if (!file) return;
    if (file.type !== "application/pdf")
      return setMessage("Resume must be a PDF.");
    if (file.size > 5242880)
      return setMessage("Resume must be smaller than 5 MB.");
    setBusy(true);
    try {
      await assetApi.uploadResume(file);
      setMessage("Resume uploaded.");
      await load();
    } catch (e) {
      error(e, "Unable to upload resume.");
    } finally {
      setBusy(false);
    }
  }
  async function deleteResume() {
    setBusy(true);
    try {
      await assetApi.deleteResume();
      setMessage("Resume removed.");
      await load();
    } catch (e) {
      error(e, "Unable to remove resume.");
    } finally {
      setBusy(false);
    }
  }
  async function togglePublish() { if (!portfolio) return; setBusy(true); try { const action = portfolio.published ? "unpublish" : "publish"; const response = await api<ApiResponse<BuilderPortfolio>>(`/api/portfolios/${portfolio.id}/${action}`, { method: "POST" }); setPortfolio(response.data); await load(); } catch (e) { error(e, "Unable to update publishing."); } finally { setBusy(false); } }
  async function saveDesign(nextTemplate = portfolio?.templateKey ?? "modern", nextTheme = themeDraft) { if (!portfolio) return; setBusy(true); try { await updatePortfolioDesign({ templateKey: nextTemplate as TemplateId, themeConfig: nextTheme }).unwrap(); setMessage("Design saved."); await load(); } catch (e) { error(e, "Unable to save design changes."); } finally { setBusy(false); } }
  async function saveSections(next: PortfolioSection[]) { if (!portfolio) return; setBusy(true); try { await updatePortfolioSections({ sections: next.map((item, index) => ({ ...item, position: index + 1 })) }).unwrap(); await load(); } catch (e) { error(e, "Unable to save section changes."); } finally { setBusy(false); } }
  if (!authenticated)
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">Portfolio Builder</h1>
        <button
          onClick={login}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-white"
        >
          Log in
        </button>
      </main>
    );
  const initials = (form.fullName || "?")
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);
  return (
    <main className="min-h-screen bg-surface">
      <BuilderTopbar name={portfolio?.fullName ?? form.fullName} published={Boolean(portfolio?.published)} slug={portfolio?.slug} device={device} onDeviceChange={setDevice} onPreview={() => { if (portfolio) window.open(`/u/${portfolio.slug}`, "_blank", "noopener,noreferrer"); }} onPublish={() => void togglePublish()} />
      <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[220px_minmax(0,1fr)_360px]">
        <div className="hidden border-r lg:block"><BuilderSidebar active={section} onSelect={setSection} /></div>
        <div className="flex min-w-0 flex-col">
          <div className="flex gap-2 overflow-x-auto border-b bg-white p-2 lg:hidden"><BuilderDeviceSwitcher value={device} onChange={setDevice} /></div>
          {preview ? <BuilderPreview portfolio={preview} device={device} themeOverride={themeDraft} /> : <div className="flex flex-1 items-center justify-center p-8 text-center text-muted">Save your profile to start your live preview.</div>}
        </div>
        <BuilderSettingsPanel title={section}>
            {section === "Profile" ? (
              <form
                id="portfolio-form"
                onSubmit={save}
                className="rounded-xl border bg-white p-6"
              >
                <h2 className="text-xl font-bold">Profile</h2>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-bold text-primary">
                    {portfolio?.profileImageUrl ? (
                      <Image
                        src={portfolio.profileImageUrl}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="size-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm">
                      <Upload size={15} />
                      {busy ? "Uploading…" : "Upload Photo"}
                      <input
                        className="hidden"
                        disabled={busy || !portfolio}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => void profile(e.target.files?.[0])}
                      />
                    </label>
                    {portfolio?.profileImageUrl && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void deleteProfile()}
                        className="inline-flex items-center gap-2 rounded border border-red-200 px-3 py-2 text-sm text-red-600"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted">
                  JPEG, PNG, or WebP · up to 5 MB.
                </p>
                <div className="mt-6 space-y-4">
                  {(
                    [
                      ["fullName", "Full name", "Your full name"],
                      ["slug", "Public URL slug", "e.g. jane-doe"],
                      [
                        "headline",
                        "Professional headline",
                        "e.g. Product designer",
                      ],
                    ] as const
                  ).map(([key, label, placeholder]) => (
                    <label key={key} className="block text-sm font-medium">
                      {label}
                      <input
                        required={key !== "headline"}
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        placeholder={placeholder}
                        className="mt-1.5 w-full rounded-lg border px-3 py-2.5"
                      />
                    </label>
                  ))}
                </div>
                {message && (
                  <p className="mt-4 text-sm text-primary">{message}</p>
                )}
                <Button className="mt-5 inline-flex items-center gap-2" disabled={busy}><Save size={16} />{busy ? "Saving…" : "Save profile"}</Button>
              </form>
            ) : section === "Resume" ? (
              <section className="rounded-xl border bg-white p-6">
                <h2 className="text-xl font-bold">Resume</h2>
                {resume ? (
                  <div className="mt-5 flex items-center justify-between gap-4 rounded-lg bg-surface p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{resume.filename}</p>
                      <p className="text-sm text-muted">
                        PDF · {Math.ceil(resume.size / 1024)} KB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <label className="cursor-pointer rounded border px-3 py-2 text-sm">
                        {busy ? "Uploading…" : "Replace Resume"}
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
                      <button
                        disabled={busy}
                        onClick={() => void deleteResume()}
                        className="rounded border border-red-200 px-3 py-2 text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-lg bg-surface p-5">
                    <p className="text-muted">
                      Add a resume so visitors can download it from your
                      portfolio.
                    </p>
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-semibold text-white">
                      <Upload size={15} />
                      {busy ? "Uploading…" : "Upload Resume"}
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
                {message && (
                  <p className="mt-4 text-sm text-primary">{message}</p>
                )}
              </section>
            ) : section === "GitHub" ? (
              <GitHubImportPanel />
            ) : section === "Resume Import" ? (
              <ResumeImportPanel hasResume={Boolean(resume)} onGoToResume={() => setSection("Resume")} />
            ) : section === "Templates" ? (
              preview && portfolio ? <TemplateGallery portfolio={preview} currentTemplate={(portfolio.templateKey || "minimal") as TemplateId} onApplied={load} /> : <p className="text-sm text-muted">Save your profile before choosing a template.</p>
            ) : section === "Style" ? (
              <DesignPanel value={themeDraft} busy={busy} onChange={setThemeDraft} onSave={(next) => saveDesign(undefined, next)} />
            ) : section === "Sections" ? (
              <SectionsPanel sections={preview?.sections ?? []} templateId={(portfolio?.templateKey || "modern") as TemplateId} busy={busy} onSave={saveSections}/>
            ) : section === "Portfolio" || section === "Publishing" ? (
              <div className="space-y-3 text-sm"><p>{portfolio ? `Your public address is /u/${portfolio.slug}` : "Create a portfolio from the Profile panel first."}</p>{portfolio && <Button type="button" disabled={busy} onClick={() => void togglePublish()}>{portfolio.published ? "Unpublish portfolio" : "Publish portfolio"}</Button>}</div>
            ) : (
              <ContentManager kind={content[section]} />
            )}
        </BuilderSettingsPanel>
      </div>
    </main>
  );
}
