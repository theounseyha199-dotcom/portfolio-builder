import { getTemplateById } from "@/components/portfolio/templates";
import type { PortfolioRenderData, PortfolioSection, PortfolioTheme, TemplateId } from "@/components/portfolio/templates";
import { resolvePortfolioTheme, themeCssVariables } from "@/lib/design/theme-utils";
export type Theme = PortfolioTheme; export type Section = PortfolioSection; export type PortfolioData = PortfolioRenderData;
export const defaultTheme: Theme = getTemplateById("modern").defaultTheme;
export function PortfolioRenderer({ portfolio, templateOverride, themeOverride }: { portfolio: PortfolioData; templateOverride?: TemplateId; themeOverride?: Partial<Theme> }) { const definition = getTemplateById(templateOverride ?? portfolio.templateKey); const theme = { ...resolvePortfolioTheme(portfolio, definition.id), ...themeOverride }; const Template = definition.component; const sections = portfolio.sections?.length ? portfolio.sections : definition.defaultSectionOrder.map((sectionType, index) => ({ sectionType, position: index + 1, enabled: true })); return <div data-template={definition.id} style={themeCssVariables(theme)}><Template portfolio={portfolio} theme={theme} sections={sections} /></div>; }
