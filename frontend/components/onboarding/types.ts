import type { TemplateId } from "@/components/portfolio/templates";

export type PortfolioStartMethod = "RESUME" | "GITHUB" | "MANUAL";

export interface OnboardingState {
  step: 1 | 2 | 3;
  startMethod: PortfolioStartMethod;
  templateId: TemplateId;
  name: string;
  slug: string;
  headline?: string;
  isSlugDirty: boolean;
}
