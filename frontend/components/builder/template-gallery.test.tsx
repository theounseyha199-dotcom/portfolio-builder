import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PortfolioData } from "@/components/portfolio/renderer/portfolio-renderer";
import { TemplateGallery } from "./template-gallery";

const unwrap = vi.fn();
const updateDesign = vi.fn(() => ({ unwrap }));
vi.mock("@/features/portfolio/design-api", () => ({ useUpdatePortfolioDesignMutation: () => [updateDesign, { isLoading: false }] }));

const portfolio: PortfolioData = { fullName: "Portfolio Owner", headline: "Product engineer", templateKey: "minimal", projects: [], experiences: [], educations: [], skills: [], socialLinks: [], sections: [] };

describe("TemplateGallery", () => {
  beforeEach(() => { updateDesign.mockClear(); unwrap.mockReset(); unwrap.mockResolvedValue({}); });

  it("renders six templates and marks the current selection", () => {
    render(<TemplateGallery portfolio={portfolio} currentTemplate="minimal" onApplied={vi.fn()} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("filters templates by user-friendly category", () => {
    render(<TemplateGallery portfolio={portfolio} currentTemplate="minimal" onApplied={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Student" }));
    expect(screen.getByRole("heading", { name: "Student" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Developer" })).not.toBeInTheDocument();
  });

  it("previews with real content and switches device without saving", () => {
    render(<TemplateGallery portfolio={portfolio} currentTemplate="minimal" onApplied={vi.fn()} />);
    fireEvent.click(screen.getAllByRole("button", { name: /preview/i })[1]);
    expect(screen.getByRole("dialog", { name: "Developer template preview" })).toHaveTextContent("Portfolio Owner");
    fireEvent.click(screen.getByRole("button", { name: "mobile preview" }));
    expect(screen.getByRole("button", { name: "mobile preview" })).toHaveAttribute("aria-pressed", "true");
    expect(updateDesign).not.toHaveBeenCalled();
  });

  it("applies defaults only after confirmation", async () => {
    const onApplied = vi.fn();
    render(<TemplateGallery portfolio={portfolio} currentTemplate="minimal" onApplied={onApplied} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Use Template" })[0]);
    expect(updateDesign).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Apply Template" }));
    await waitFor(() => expect(updateDesign).toHaveBeenCalledWith(expect.objectContaining({ templateKey: "developer" })));
    expect(onApplied).toHaveBeenCalled();
  });

  it("keeps the current selection when applying fails", async () => {
    unwrap.mockRejectedValueOnce(new Error("offline"));
    render(<TemplateGallery portfolio={portfolio} currentTemplate="minimal" onApplied={vi.fn()} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Use Template" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Apply Template" }));
    expect(await screen.findByText(/current template has not changed/i)).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });
});
