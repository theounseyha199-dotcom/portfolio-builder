import type { ComponentType } from "react";
import type { Education, Experience, Project, Skill, SocialLink } from "@/features/content/types";

export type PortfolioTheme = { primaryColor: string; backgroundColor: string; textColor: string; mutedColor: string; fontFamily: string; mode: "light" | "dark"; radius: "none" | "small" | "medium" | "large"; projectLayout: "grid" | "list"; contentWidth: "narrow" | "medium" | "wide" };
export type PortfolioSection = { sectionType: string; position: number; enabled: boolean };
export type PortfolioRenderData = { fullName: string; headline?: string; bio?: string; location?: string; publicEmail?: string; profileImageUrl?: string; resume?: { available: boolean; url?: string }; templateKey?: TemplateId; themeConfig?: string; sections?: PortfolioSection[]; projects: Project[]; experiences: Experience[]; educations: Education[]; skills: Skill[]; socialLinks: SocialLink[] };
export type PortfolioTemplateProps = { portfolio: PortfolioRenderData; theme: PortfolioTheme; sections: PortfolioSection[] };
export type TemplateId = "minimal" | "developer" | "modern" | "professional" | "creative" | "student";
export type TemplateCategory = "Professional" | "Developer" | "Designer" | "Student" | "Minimal" | "Creative";
export type PortfolioTemplate = { id: TemplateId; name: string; description: string; category: TemplateCategory; recommendedFor: string[]; tier: "FREE" | "PRO"; supportsDarkMode: boolean; defaultTheme: PortfolioTheme; defaultSectionOrder: string[]; component: ComponentType<PortfolioTemplateProps> };
