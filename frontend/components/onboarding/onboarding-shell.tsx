"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isTemplateId, type TemplateId } from "@/components/portfolio/templates";
import { useCreatePortfolioMutation } from "@/features/portfolio";
import { fadeUp, motion, useReducedMotion } from "@/lib/motion";
import { OnboardingProgress } from "./onboarding-progress";
import {
  PortfolioBasicsStep,
  type PortfolioBasicsFormData,
} from "./portfolio-basics-step";
import { StartMethodStep } from "./start-method-step";
import { TemplateStep } from "./template-step";
import type { OnboardingState, PortfolioStartMethod } from "./types";

export function OnboardingShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const [createPortfolio, { isLoading }] = useCreatePortfolioMutation();

  const [state, setState] = useState<OnboardingState>(() => {
    // Check URL query parameters or temporary session storage for pre-selected template
    let initialTemplate: TemplateId = "minimal";
    const paramTemplate = searchParams.get("template");
    if (paramTemplate && isTemplateId(paramTemplate)) {
      initialTemplate = paramTemplate;
    }

    // Check URL query parameter for starting method
    let initialMethod: PortfolioStartMethod = "MANUAL";
    const paramStart = searchParams.get("start")?.toUpperCase();
    if (
      paramStart === "RESUME" ||
      paramStart === "GITHUB" ||
      paramStart === "MANUAL"
    ) {
      initialMethod = paramStart;
    }

    return {
      step: 1,
      startMethod: initialMethod,
      templateId: initialTemplate,
      name: "",
      slug: "",
      headline: "",
      isSlugDirty: false,
    };
  });

  const [serverError, setServerError] = useState("");

  // Also check sessionStorage on mount if not in URL query
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("portfolia_intended_template");
      if (stored && isTemplateId(stored)) {
        setState((prev) => ({ ...prev, templateId: stored }));
      }
    }
  }, []);

  const handleStartMethodSelect = (method: PortfolioStartMethod) => {
    setState((prev) => ({ ...prev, startMethod: method }));
  };

  const handleTemplateSelect = (templateId: TemplateId) => {
    setState((prev) => ({ ...prev, templateId }));
  };

  const handleBasicsBack = (
    data: PortfolioBasicsFormData,
    isSlugDirty: boolean
  ) => {
    setState((prev) => ({
      ...prev,
      step: 2,
      name: data.name,
      slug: data.slug,
      headline: data.headline,
      isSlugDirty,
    }));
    setServerError("");
  };

  const handleBasicsSubmit = async (
    data: PortfolioBasicsFormData,
    isSlugDirty: boolean
  ) => {
    setServerError("");
    setState((prev) => ({
      ...prev,
      name: data.name,
      slug: data.slug,
      headline: data.headline,
      isSlugDirty,
    }));

    try {
      await createPortfolio({
        name: data.name,
        slug: data.slug,
        template: state.templateId,
        headline: data.headline || undefined,
      }).unwrap();

      // Clean up temporary intent storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("portfolia_intended_template");
      }

      // Route based on starting method
      if (state.startMethod === "RESUME") {
        router.push("/dashboard/builder?panel=resume-import");
      } else if (state.startMethod === "GITHUB") {
        router.push("/dashboard/builder?panel=github");
      } else {
        router.push("/dashboard/builder?panel=profile");
      }
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Failed to create portfolio. Please verify your details.";
      setServerError(message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 space-y-10">
      {/* Progress Indicator */}
      <OnboardingProgress
        currentStep={state.step}
        onStepClick={(targetStep) => {
          if (targetStep < state.step) {
            setState((prev) => ({ ...prev, step: targetStep }));
          }
        }}
      />

      {/* Active Step Content */}
      <motion.div
        key={state.step}
        variants={prefersReducedMotion ? undefined : fadeUp}
        initial={prefersReducedMotion ? false : "initial"}
        animate={prefersReducedMotion ? false : "animate"}
        transition={{ duration: 0.22 }}
      >
        {state.step === 1 && (
          <StartMethodStep
            selected={state.startMethod}
            onSelect={handleStartMethodSelect}
            onContinue={() => setState((prev) => ({ ...prev, step: 2 }))}
          />
        )}

        {state.step === 2 && (
          <TemplateStep
            selected={state.templateId}
            onSelect={handleTemplateSelect}
            onContinue={() => setState((prev) => ({ ...prev, step: 3 }))}
            onBack={() => setState((prev) => ({ ...prev, step: 1 }))}
          />
        )}

        {state.step === 3 && (
          <PortfolioBasicsStep
            initialValues={{
              name: state.name,
              slug: state.slug,
              headline: state.headline,
            }}
            isSlugDirtyInitial={state.isSlugDirty}
            isLoading={isLoading}
            serverError={serverError}
            onSubmit={handleBasicsSubmit}
            onBack={handleBasicsBack}
          />
        )}
      </motion.div>
    </div>
  );
}
