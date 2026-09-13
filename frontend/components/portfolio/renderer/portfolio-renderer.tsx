import { portfolioTemplateRegistry } from "@/components/portfolio/templates";
import type { PortfolioRenderData, PortfolioSection, PortfolioTheme, TemplateId } from "@/components/portfolio/templates";

export type Theme = PortfolioTheme;
export type Section = PortfolioSection;
export type PortfolioData = PortfolioRenderData;
export const defaultTheme: Theme = portfolioTemplateRegistry.minimal.defaultTheme;

export function PortfolioRenderer({ portfolio }: { portfolio: PortfolioData }) {
  const templateId: TemplateId = portfolio.templateKey && portfolio.templateKey in portfolioTemplateRegistry ? portfolio.templateKey : "minimal";
  const definition = portfolioTemplateRegistry[templateId];
  let theme = definition.defaultTheme;
  try { theme = { ...theme, ...JSON.parse(portfolio.themeConfig || "{}") as Partial<Theme> }; } catch { /* Use safe template defaults if stored JSON is invalid. */ }
  const Template = definition.component;
  return <Template portfolio={portfolio} theme={theme} sections={portfolio.sections || []} />;
}
