import type { ComponentType } from "react";
import type { Education, Experience, Project, Skill, SocialLink } from "@/features/content/types";

export type TemplateId = "minimal" | "developer" | "modern" | "professional" | "creative" | "student";
export type TemplateCategory = "MINIMAL" | "DEVELOPER" | "PROFESSIONAL" | "CREATIVE" | "STUDENT";
export type PortfolioSectionType = "HERO" | "ABOUT" | "EXPERIENCE" | "EDUCATION" | "SKILLS" | "PROJECTS" | "SOCIAL" | "RESUME";
export type PortfolioTheme = { mode: "light" | "dark"; primaryColor: string; backgroundColor: string; surfaceColor: string; textColor: string; mutedTextColor: string; fontHeading: string; fontBody: string; borderRadius: "none" | "small" | "medium" | "large"; contentWidth: "narrow" | "medium" | "wide"; spacing: "compact" | "normal" | "relaxed" };
export type PortfolioSection = { id?: string; sectionType: PortfolioSectionType; position: number; enabled: boolean; layout?: string; alignment?: "left" | "center"; background?: "default" | "muted" | "accent"; spacing?: "compact" | "normal" | "large" };
export type PortfolioRenderData = { id?: string; slug?: string; fullName: string; headline?: string; bio?: string; location?: string; publicEmail?: string; phone?: string; profileImageUrl?: string; resume?: { available: boolean; url?: string }; templateKey?: TemplateId; themeConfig?: string | Partial<PortfolioTheme>; sections?: PortfolioSection[]; projects: Project[]; experiences: Experience[]; educations: Education[]; skills: Skill[]; socialLinks: SocialLink[] };
export type PortfolioTemplateProps = { portfolio: PortfolioRenderData; theme: PortfolioTheme; sections: PortfolioSection[] };
export type PortfolioTemplateDefinition = { id: TemplateId; name: string; description: string; category: TemplateCategory; recommendedFor: string[]; tier: "FREE" | "PRO"; thumbnail: string; supportsDarkMode: boolean; defaultTheme: PortfolioTheme; defaultSectionOrder: PortfolioSectionType[]; supportedSectionLayouts: Partial<Record<PortfolioSectionType, string[]>>; component: ComponentType<PortfolioTemplateProps> };
