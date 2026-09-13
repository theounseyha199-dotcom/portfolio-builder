import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortfolioRenderer, type PortfolioData } from "./portfolio-renderer";
import { portfolioTemplateList } from "@/components/portfolio/templates";

const portfolio: PortfolioData = { fullName: "Ada Lovelace", templateKey: "minimal", projects: [], experiences: [], educations: [], skills: [], socialLinks: [], sections: [] };
describe("PortfolioRenderer", () => {
  it("does not render empty sections", () => { render(<PortfolioRenderer portfolio={portfolio} />); expect(screen.queryByText("Projects")).not.toBeInTheDocument(); expect(screen.queryByText("Experience")).not.toBeInTheDocument(); });
  it("does not render disabled sections", () => { render(<PortfolioRenderer portfolio={{ ...portfolio, projects: [{ id: "1", title: "Hidden", featured: false, technologies: [] }], sections: [{ sectionType: "PROJECTS", position: 0, enabled: false }] }} />); expect(screen.queryByText("Hidden")).not.toBeInTheDocument(); });
  it("hides resume when absent", () => { render(<PortfolioRenderer portfolio={portfolio} />); expect(screen.queryByRole("link", { name: "Download Resume" })).not.toBeInTheDocument(); });
  it("renders selected template content", () => { render(<PortfolioRenderer portfolio={{ ...portfolio, templateKey: "developer", headline: "Engineer" }} />); expect(screen.getByRole("heading", { name: /ada lovelace/i })).toBeInTheDocument(); expect(screen.getByText("Engineer")).toBeInTheDocument(); });
  it("renders every registered template with the shared data contract", () => { for (const template of portfolioTemplateList) { const { unmount } = render(<PortfolioRenderer portfolio={{ ...portfolio, templateKey: template.id }} />); expect(screen.getByRole("heading", { name: /ada lovelace/i })).toBeInTheDocument(); unmount(); } });
  it("respects the saved section order", () => { render(<PortfolioRenderer portfolio={{ ...portfolio, bio: "Biography", skills: [{ id: "s1", name: "Java" }], sections: [{ sectionType: "SKILLS", position: 1, enabled: true }, { sectionType: "ABOUT", position: 2, enabled: true }] }} />); const headings = screen.getAllByRole("heading", { level: 2 }); expect(headings.map((heading) => heading.textContent)).toEqual(["Skills", "About"]); });
});
