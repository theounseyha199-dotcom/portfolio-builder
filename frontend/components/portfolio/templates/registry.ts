import { CreativeTemplate } from "./creative/creative-template";
import { DeveloperTemplate } from "./developer/developer-template";
import { MinimalTemplate } from "./minimal/minimal-template";
import { ModernTemplate } from "./modern/modern-template";
import { ProfessionalTemplate } from "./professional/professional-template";
import { StudentTemplate } from "./student/student-template";
import type { PortfolioTemplate, PortfolioTheme, TemplateId } from "./types";

const lightTheme: PortfolioTheme = { primaryColor: "#20419E", backgroundColor: "#FFFFFF", textColor: "#111827", mutedColor: "#667085", fontFamily: "Inter", mode: "light", radius: "medium", projectLayout: "grid", contentWidth: "medium" };
const order = ["HERO", "ABOUT", "EXPERIENCE", "PROJECTS", "SKILLS", "EDUCATION", "CONTACT"];

export const portfolioTemplateList: PortfolioTemplate[] = [
  { id: "minimal", name: "Minimal", description: "A quiet, focused layout that keeps your work and experience easy to scan.", category: "Minimal", recommendedFor: ["Recruiters", "Engineers", "Professionals"], tier: "FREE", supportsDarkMode: true, defaultTheme: { ...lightTheme, radius: "small", projectLayout: "list" }, defaultSectionOrder: order, component: MinimalTemplate },
  { id: "developer", name: "Developer", description: "A polished technical portfolio with project cards, skills, and GitHub-friendly details.", category: "Developer", recommendedFor: ["Software developers", "DevOps", "Engineers"], tier: "FREE", supportsDarkMode: true, defaultTheme: { ...lightTheme, primaryColor: "#22C55E", backgroundColor: "#0B1220", textColor: "#F8FAFC", mode: "dark", contentWidth: "wide" }, defaultSectionOrder: ["HERO", "PROJECTS", "SKILLS", "EXPERIENCE", "EDUCATION", "ABOUT", "CONTACT"], component: DeveloperTemplate },
  { id: "modern", name: "Modern", description: "A balanced contemporary design with a strong introduction and clear visual cards.", category: "Professional", recommendedFor: ["Product people", "Startup teams", "Engineers"], tier: "FREE", supportsDarkMode: true, defaultTheme: { ...lightTheme, primaryColor: "#4F46E5", radius: "large", contentWidth: "wide" }, defaultSectionOrder: order, component: ModernTemplate },
  { id: "professional", name: "Professional", description: "A formal, highly readable layout that gives career history the strongest emphasis.", category: "Professional", recommendedFor: ["Consultants", "Managers", "Finance"], tier: "FREE", supportsDarkMode: true, defaultTheme: { ...lightTheme, primaryColor: "#1E3A5F", radius: "small", projectLayout: "list" }, defaultSectionOrder: ["HERO", "ABOUT", "EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "CONTACT"], component: ProfessionalTemplate },
  { id: "creative", name: "Creative", description: "An expressive visual layout for showcasing image-led projects without losing clarity.", category: "Creative", recommendedFor: ["Designers", "Photographers", "Creative developers"], tier: "FREE", supportsDarkMode: true, defaultTheme: { ...lightTheme, primaryColor: "#DB2777", radius: "large", contentWidth: "wide" }, defaultSectionOrder: ["HERO", "PROJECTS", "ABOUT", "SKILLS", "EXPERIENCE", "EDUCATION", "CONTACT"], component: CreativeTemplate },
  { id: "student", name: "Student", description: "A project-first design that highlights education, skills, GitHub work, and potential.", category: "Student", recommendedFor: ["Students", "Graduates", "Internship applicants"], tier: "FREE", supportsDarkMode: true, defaultTheme: { ...lightTheme, primaryColor: "#7C3AED" }, defaultSectionOrder: ["HERO", "PROJECTS", "SKILLS", "EDUCATION", "EXPERIENCE", "ABOUT", "CONTACT"], component: StudentTemplate },
];

export const portfolioTemplateRegistry = Object.fromEntries(portfolioTemplateList.map((template) => [template.id, template])) as Record<TemplateId, PortfolioTemplate>;
