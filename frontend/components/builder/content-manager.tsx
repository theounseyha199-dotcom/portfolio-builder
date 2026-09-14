"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Checkbox,
  Input,
  Label,
  Textarea,
} from "@/components/ui";
import { assetApi } from "@/features/content/assets";
import { contentApi } from "@/features/content/api";

type Kind = "experiences" | "educations" | "skills" | "projects" | "social-links";

interface ContentItem {
  id: string;
  title?: string;
  company?: string;
  school?: string;
  name?: string;
  platform?: string;
  position?: string;
  degree?: string;
  major?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  shortDescription?: string;
  description?: string;
  category?: string;
  url?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  technologies?: string[];
  thumbnailUrl?: string;
}

type FormValues = Record<string, string | boolean | string[]>;

const labels: Record<Kind, { singular: string; plural: string; addText: string }> = {
  experiences: { singular: "experience", plural: "Experience", addText: "+ Add experience" },
  educations: { singular: "education", plural: "Education", addText: "+ Add education" },
  skills: { singular: "skill", plural: "Skills", addText: "+ Add skill" },
  projects: { singular: "project", plural: "Projects", addText: "+ Add project" },
  "social-links": { singular: "social link", plural: "Social Links", addText: "+ Add social link" },
};

export function ContentManager({ kind }: { kind: Kind }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await contentApi.list<ContentItem>(`/api/${kind}`));
    } catch {
      setError("Unable to load items for this section.");
    }
  }, [kind]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (data: FormValues) => {
    setSaving(true);
    setError("");
    try {
      if (editingItem) {
        const updated = await contentApi.update<ContentItem>(
          `/api/${kind}`,
          editingItem.id,
          data,
        );
        setItems((current) =>
          current.map((item) => (item.id === editingItem.id ? updated : item)),
        );
        setEditingItem(null);
      } else {
        const created = await contentApi.create<ContentItem>(`/api/${kind}`, data);
        setItems((current) => [...current, created]);
        setIsAdding(false);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save item.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await contentApi.remove(`/api/${kind}`, deleteTarget.id);
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setError("Unable to delete this item.");
    } finally {
      setDeleting(false);
    }
  };

  const config = labels[kind];

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500 font-medium">
          {items.length === 0
            ? `No ${config.plural.toLowerCase()} added yet.`
            : `${items.length} ${items.length === 1 ? config.singular : config.plural.toLowerCase()} recorded`}
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditingItem(null);
            setIsAdding(true);
          }}
          className="font-semibold shadow-xs"
        >
          <Plus size={15} />
          <span>{config.addText}</span>
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No {config.plural.toLowerCase()} yet
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
              Add details to enrich your portfolio presentation for recruiters and visitors.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="mt-4"
            >
              {config.addText}
            </Button>
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {item.title ??
                        item.company ??
                        item.school ??
                        item.name ??
                        item.platform}
                    </p>
                    {item.featured && (
                      <Badge variant="primary" className="text-[10px] py-0">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 truncate">
                    {item.position ??
                      item.degree ??
                      item.shortDescription ??
                      item.category ??
                      item.url}
                  </p>

                  {(item.startDate || item.endDate || item.currentlyWorking) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <Calendar size={12} />
                      <span>
                        {item.startDate ?? ""}
                        {item.startDate ? " — " : ""}
                        {item.currentlyWorking
                          ? "Present"
                          : (item.endDate ?? "")}
                      </span>
                    </div>
                  )}

                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-primary border border-blue-100"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {kind === "projects" && (
                    <ProjectImage item={item} onChange={load} onError={setError} />
                  )}
                </div>

                {/* Edit & Delete Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    aria-label={`Edit ${item.title ?? item.company ?? item.school ?? item.name ?? "item"}`}
                    onClick={() => {
                      setIsAdding(false);
                      setEditingItem(item);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${item.title ?? item.company ?? item.school ?? item.name ?? "item"}`}
                    onClick={() => setDeleteTarget(item)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Entry / Edit Modal Form */}
      {(isAdding || editingItem) && (
        <EntryForm
          kind={kind}
          item={editingItem}
          saving={saving}
          onCancel={() => {
            setIsAdding(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this {config.singular}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This entry will be permanently removed
              from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProjectImage({
  item,
  onChange,
  onError,
}: {
  item: ContentItem;
  onChange: () => Promise<void>;
  onError: (value: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  const upload = async (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      onError("Only JPEG, PNG, and WebP images are supported.");
      return;
    }
    setBusy(true);
    try {
      await assetApi.uploadProjectImage(item.id, file);
      await onChange();
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Unable to upload project image.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await assetApi.deleteProjectImage(item.id);
      await onChange();
    } catch {
      onError("Unable to remove project image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
      {item.thumbnailUrl && (
        <Image
          src={item.thumbnailUrl}
          alt="Project thumbnail"
          width={80}
          height={45}
          className="aspect-video rounded-md border border-slate-200 object-cover"
        />
      )}
      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs">
        <Upload size={12} />
        {busy ? "Uploading…" : item.thumbnailUrl ? "Replace image" : "Add image"}
        <input
          className="hidden"
          disabled={busy}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => void upload(e.target.files?.[0])}
        />
      </label>
      {item.thumbnailUrl && (
        <button
          type="button"
          disabled={busy}
          onClick={() => void remove()}
          className="text-xs text-red-600 hover:underline cursor-pointer"
        >
          Remove
        </button>
      )}
    </div>
  );
}

function EntryForm({
  kind,
  item,
  saving,
  onCancel,
  onSubmit,
}: {
  kind: Kind;
  item: ContentItem | null;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (value: FormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<FormValues>({
    company: item?.company ?? "",
    position: item?.position ?? "",
    school: item?.school ?? "",
    degree: item?.degree ?? "",
    major: item?.major ?? "",
    location: item?.location ?? "",
    startDate: item?.startDate ?? "",
    endDate: item?.endDate ?? "",
    currentlyWorking: item?.currentlyWorking ?? false,
    name: item?.name ?? "",
    category: item?.category ?? "",
    title: item?.title ?? "",
    shortDescription: item?.shortDescription ?? item?.description ?? "",
    githubUrl: item?.githubUrl ?? "",
    demoUrl: item?.demoUrl ?? "",
    technologies: (item?.technologies ?? []).join(", "),
    featured: item?.featured ?? false,
    platform: item?.platform ?? "",
    url: item?.url ?? "",
  });

  const text = (name: string) =>
    typeof values[name] === "string" ? (values[name] as string) : "";
  const checked = (name: string) => values[name] === true;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const technologies = text("technologies")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    void onSubmit({
      ...values,
      currentlyWorking: checked("currentlyWorking"),
      featured: checked("featured"),
      technologies,
    });
  };

  const config = labels[kind];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in-50"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl space-y-5"
      >
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {item ? `Edit ${config.singular}` : `Add ${config.singular}`}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Fill in the details below. All changes will be saved to your portfolio.
          </p>
        </div>

        <div className="space-y-4">
          {kind === "experiences" && (
            <>
              <div>
                <Label htmlFor="exp-company">Company</Label>
                <Input
                  id="exp-company"
                  required
                  value={text("company")}
                  onChange={(e) =>
                    setValues((curr) => ({ ...curr, company: e.target.value }))
                  }
                  placeholder="e.g. Acme Corp"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="exp-position">Position / Role</Label>
                <Input
                  id="exp-position"
                  required
                  value={text("position")}
                  onChange={(e) =>
                    setValues((curr) => ({ ...curr, position: e.target.value }))
                  }
                  placeholder="e.g. Senior Software Engineer"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="exp-location">Location</Label>
                <Input
                  id="exp-location"
                  value={text("location")}
                  onChange={(e) =>
                    setValues((curr) => ({ ...curr, location: e.target.value }))
                  }
                  placeholder="e.g. Phnom Penh, Remote"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="exp-start">Start Date</Label>
                  <Input
                    id="exp-start"
                    required
                    type="date"
                    value={text("startDate")}
                    onChange={(e) =>
                      setValues((curr) => ({ ...curr, startDate: e.target.value }))
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="exp-end">End Date</Label>
                  <Input
                    id="exp-end"
                    type="date"
                    disabled={checked("currentlyWorking")}
                    value={text("endDate")}
                    onChange={(e) =>
                      setValues((curr) => ({ ...curr, endDate: e.target.value }))
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer pt-1">
                <Checkbox
                  checked={checked("currentlyWorking")}
                  onChange={(e) =>
                    setValues((curr) => ({
                      ...curr,
                      currentlyWorking: e.target.checked,
                      endDate: e.target.checked ? "" : curr.endDate,
                    }))
                  }
                />
                <span>I currently work here</span>
              </label>

              <div>
                <Label htmlFor="exp-desc">Description</Label>
                <Textarea
                  id="exp-desc"
                  value={text("shortDescription")}
                  onChange={(e) =>
                    setValues((curr) => ({
                      ...curr,
                      shortDescription: e.target.value,
                    }))
                  }
                  placeholder="Key accomplishments and responsibilities…"
                  className="mt-1.5"
                />
              </div>
            </>
          )}

          {kind === "educations" && (
            <>
              <div>
                <Label htmlFor="edu-school">School / University</Label>
                <Input
                  id="edu-school"
                  required
                  value={text("school")}
                  onChange={(e) =>
                    setValues((curr) => ({ ...curr, school: e.target.value }))
                  }
                  placeholder="e.g. Royal University of Phnom Penh"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edu-degree">Degree</Label>
                  <Input
                    id="edu-degree"
                    value={text("degree")}
                    onChange={(e) =>
                      setValues((curr) => ({ ...curr, degree: e.target.value }))
                    }
                    placeholder="e.g. Bachelor of Science"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edu-major">Field of Study / Major</Label>
                  <Input
                    id="edu-major"
                    value={text("major")}
                    onChange={(e) =>
                      setValues((curr) => ({ ...curr, major: e.target.value }))
                    }
                    placeholder="e.g. Computer Science"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edu-start">Start Date</Label>
                  <Input
                    id="edu-start"
                    type="date"
                    value={text("startDate")}
                    onChange={(e) =>
                      setValues((curr) => ({ ...curr, startDate: e.target.value }))
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="edu-end">Graduation Date</Label>
                  <Input
                    id="edu-end"
                    type="date"
                    value={text("endDate")}
                    onChange={(e) =>
                      setValues((curr) => ({ ...curr, endDate: e.target.value }))
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>
            </>
          )}

          {kind === "skills" && (
            <>
              <div>
                <Label htmlFor="skill-name">Skill Name</Label>
                <Input
                  id="skill-name"
                  required
                  value={text("name")}
                  onChange={(e) =>
                    setValues((curr) => ({ ...curr, name: e.target.value }))
                  }
                  placeholder="e.g. TypeScript, UI Design, Docker"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="skill-cat">Category</Label>
                <Input
                  id="skill-cat"
                  value={text("category")}
                  onChange={(e) =>
                    setValues((curr) => ({ ...curr, category: e.target.value }))
                  }
                  placeholder="e.g. Frontend, Design, Cloud"
                  className="mt-1.5"
                />
              </div>
            </>
          )}

          {kind === "projects" && (
            <>
              <div>
                <Label htmlFor="proj-title">Project Title</Label>
                <Input
                  id="proj-title"
                  required
                  value={text("title")}
                  onChange={(e) =>
                    setValues((curr) => ({ ...curr, title: e.target.value }))
                  }
                  placeholder="e.g. Realtime Analytics Platform"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="proj-desc">Short Description</Label>
                <Textarea
                  id="proj-desc"
                  value={text("shortDescription")}
                  onChange={(e) =>
                    setValues((curr) => ({
                      ...curr,
                      shortDescription: e.target.value,
                    }))
                  }
                  placeholder="Describe the problem, your solution, and measurable results…"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="proj-tech">Technologies (comma separated)</Label>
                <Input
                  id="proj-tech"
                  value={text("technologies")}
                  onChange={(e) =>
                    setValues((curr) => ({
                      ...curr,
                      technologies: e.target.value,
                    }))
                  }
                  placeholder="React, TypeScript, Tailwind, Spring Boot"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="proj-github">GitHub URL</Label>
                  <Input
                    id="proj-github"
                    type="url"
                    value={text("githubUrl")}
                    onChange={(e) =>
                      setValues((curr) => ({ ...curr, githubUrl: e.target.value }))
                    }
                    placeholder="https://github.com/..."
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="proj-demo">Live Demo URL</Label>
                  <Input
                    id="proj-demo"
                    type="url"
                    value={text("demoUrl")}
                    onChange={(e) =>
                      setValues((curr) => ({ ...curr, demoUrl: e.target.value }))
                    }
                    placeholder="https://example.com"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer pt-1">
                <Checkbox
                  checked={checked("featured")}
                  onChange={(e) =>
                    setValues((curr) => ({
                      ...curr,
                      featured: e.target.checked,
                    }))
                  }
                />
                <span>Feature this project prominently</span>
              </label>
            </>
          )}

          {kind === "social-links" && (
            <>
              <div>
                <Label htmlFor="social-platform">Platform</Label>
                <select
                  id="social-platform"
                  required
                  value={text("platform")}
                  onChange={(e) =>
                    setValues((curr) => ({ ...curr, platform: e.target.value }))
                  }
                  className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-primary focus:outline-none"
                >
                  <option value="">Choose platform</option>
                  {[
                    "GITHUB",
                    "LINKEDIN",
                    "FACEBOOK",
                    "INSTAGRAM",
                    "TELEGRAM",
                    "YOUTUBE",
                    "X",
                    "WEBSITE",
                  ].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="social-url">Profile / Website URL</Label>
                <Input
                  id="social-url"
                  required
                  type="url"
                  value={text("url")}
                  onChange={(e) =>
                    setValues((curr) => ({ ...curr, url: e.target.value }))
                  }
                  placeholder="https://..."
                  className="mt-1.5"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
