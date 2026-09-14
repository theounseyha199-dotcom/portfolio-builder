"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Globe, Loader2, Sparkles } from "lucide-react";
import { z } from "zod";
import { Button, Input, Label } from "@/components/ui";

export const portfolioBasicsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Portfolio name is required.")
    .max(255, "Portfolio name must be 255 characters or less."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Public slug is required.")
    .max(100, "Slug must be 100 characters or less.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must use only lowercase letters, numbers, and hyphens (no spaces or slashes)."
    ),
  headline: z.string().max(255, "Headline must be 255 characters or less.").optional(),
});

export type PortfolioBasicsFormData = z.infer<typeof portfolioBasicsSchema>;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PortfolioBasicsStep({
  initialValues,
  isSlugDirtyInitial = false,
  onSubmit,
  onBack,
  isLoading,
  serverError,
}: {
  initialValues: { name: string; slug: string; headline?: string };
  isSlugDirtyInitial?: boolean;
  onSubmit: (data: PortfolioBasicsFormData, isSlugDirty: boolean) => void | Promise<void>;
  onBack: (data: PortfolioBasicsFormData, isSlugDirty: boolean) => void;
  isLoading: boolean;
  serverError?: string;
}) {
  const [isSlugDirty, setIsSlugDirty] = useState(isSlugDirtyInitial);
  const [origin, setOrigin] = useState("https://portfolia.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const form = useForm<PortfolioBasicsFormData>({
    resolver: zodResolver(portfolioBasicsSchema),
    defaultValues: {
      name: initialValues.name,
      slug: initialValues.slug,
      headline: initialValues.headline ?? "",
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = form;

  const currentSlug = watch("slug");
  const currentName = watch("name");

  // Suggest slug from name if user hasn't manually edited the slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextName = e.target.value;
    setValue("name", nextName, { shouldValidate: true });
    if (!isSlugDirty) {
      setValue("slug", slugify(nextName), { shouldValidate: true });
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugDirty(true);
    setValue("slug", e.target.value.toLowerCase(), { shouldValidate: true });
  };

  // Surface server-side slug conflict directly to the field
  useEffect(() => {
    if (serverError) {
      const lower = serverError.toLowerCase();
      if (lower.includes("slug")) {
        setError("slug", { message: serverError });
      }
    }
  }, [serverError, setError]);

  const onFormSubmit = (data: PortfolioBasicsFormData) => {
    return onSubmit(data, isSlugDirty);
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Set up your portfolio basics
        </h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Name your portfolio and pick your custom link. You can edit your headline
          and bio anytime in the builder.
        </p>
      </div>

      {serverError && !serverError.toLowerCase().includes("slug") && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="portfolio-name" className="text-sm font-semibold text-slate-900">
            Portfolio Name or Full Name
          </Label>
          <Input
            id="portfolio-name"
            placeholder="e.g. Seyha Theoun"
            disabled={isLoading}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            value={currentName}
            onChange={handleNameChange}
            className="h-11 rounded-xl"
          />
          {errors.name && (
            <p id="name-error" className="text-xs font-medium text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Public Slug Field */}
        <div className="space-y-2">
          <Label htmlFor="portfolio-slug" className="text-sm font-semibold text-slate-900">
            Public Portfolio URL
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-mono text-slate-400 select-none">
              /u/
            </span>
            <Input
              id="portfolio-slug"
              placeholder="e.g. seyha"
              disabled={isLoading}
              aria-invalid={Boolean(errors.slug)}
              aria-describedby={errors.slug ? "slug-error" : "slug-preview"}
              value={currentSlug}
              onChange={handleSlugChange}
              className="h-11 rounded-xl pl-9 font-mono text-sm lowercase"
            />
          </div>

          {errors.slug ? (
            <p id="slug-error" className="text-xs font-medium text-red-600">
              {errors.slug.message}
            </p>
          ) : (
            <p id="slug-preview" className="flex items-center gap-1.5 text-xs text-slate-500">
              <Globe size={13} className="text-slate-400" />
              <span>Your public link: </span>
              <span className="font-mono text-slate-700">
                {origin}/u/{currentSlug || "your-slug"}
              </span>
            </p>
          )}
        </div>

        {/* Headline Field (Optional) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="portfolio-headline" className="text-sm font-semibold text-slate-900">
              Professional Headline
            </Label>
            <span className="text-[11px] font-medium text-slate-400">Optional</span>
          </div>
          <Input
            id="portfolio-headline"
            placeholder="e.g. Full-Stack Engineer & Open Source Enthusiast"
            disabled={isLoading}
            {...register("headline")}
            className="h-11 rounded-xl"
          />
          {errors.headline && (
            <p className="text-xs font-medium text-red-600">
              {errors.headline.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={isLoading}
            onClick={() => onBack(form.getValues(), isSlugDirty)}
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 gap-2 shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating your portfolio…</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Create Portfolio</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
