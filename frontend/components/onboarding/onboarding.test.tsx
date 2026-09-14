import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  OnboardingProgress,
  OnboardingShell,
  PortfolioBasicsStep,
  StartMethodStep,
  TemplateStep,
} from "@/components/onboarding";
import { parsePanelQuery } from "@/components/builder/builder-sidebar";
import { store } from "@/store/store";

// Mock next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

// Mock useAuth
const mockLogin = vi.fn();
const mockAuthState = {
  ready: true,
  authenticated: true,
  login: mockLogin,
  logout: vi.fn(),
};

vi.mock("@/components/auth/auth-provider", () => ({
  useAuth: () => mockAuthState,
}));

// Mock api lib
const mockApi = vi.fn();
vi.mock("@/lib/api", () => ({
  api: (...args: unknown[]) => mockApi(...args),
}));

describe("Portfolio Onboarding Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
  });

  describe("OnboardingProgress", () => {
    it("renders 3 steps and highlights current step", () => {
      render(<OnboardingProgress currentStep={2} />);
      expect(screen.getByText("Start")).toBeInTheDocument();
      expect(screen.getByText("Template")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();

      const items = screen.getAllByRole("listitem");
      expect(items[1]).toHaveAttribute("aria-current", "step");
    });
  });

  describe("Step 1: StartMethodStep", () => {
    it("renders Resume, GitHub, and Manual options", () => {
      const select = vi.fn();
      const cont = vi.fn();

      render(
        <StartMethodStep
          selected="MANUAL"
          onSelect={select}
          onContinue={cont}
        />
      );

      expect(screen.getByText("Upload Resume")).toBeInTheDocument();
      expect(screen.getByText("Import from GitHub")).toBeInTheDocument();
      expect(screen.getByText("Start Manually")).toBeInTheDocument();

      const manualCard = screen.getByRole("radio", { name: /start manually/i });
      expect(manualCard).toHaveAttribute("aria-checked", "true");
    });

    it("allows selecting options with click and keyboard", () => {
      const select = vi.fn();
      const cont = vi.fn();

      render(
        <StartMethodStep
          selected="MANUAL"
          onSelect={select}
          onContinue={cont}
        />
      );

      fireEvent.click(screen.getByRole("radio", { name: /upload resume/i }));
      expect(select).toHaveBeenCalledWith("RESUME");

      fireEvent.keyDown(screen.getByRole("radio", { name: /import from github/i }), {
        key: "Enter",
      });
      expect(select).toHaveBeenCalledWith("GITHUB");

      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      expect(cont).toHaveBeenCalled();
    });
  });

  describe("Step 2: TemplateStep", () => {
    it("renders all 6 templates and marks selected template", () => {
      const select = vi.fn();
      const cont = vi.fn();
      const back = vi.fn();

      render(
        <TemplateStep
          selected="developer"
          onSelect={select}
          onContinue={cont}
          onBack={back}
        />
      );

      expect(screen.getByRole("radio", { name: "Minimal template" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Developer template" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Modern template" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Professional template" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Creative template" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Student template" })).toBeInTheDocument();

      const devCard = screen.getByRole("radio", { name: "Developer template" });
      expect(devCard).toHaveAttribute("aria-checked", "true");
    });

    it("allows selecting a template and triggers back/continue", () => {
      const select = vi.fn();
      const cont = vi.fn();
      const back = vi.fn();

      render(
        <TemplateStep
          selected="minimal"
          onSelect={select}
          onContinue={cont}
          onBack={back}
        />
      );

      fireEvent.click(screen.getByRole("radio", { name: "Creative template" }));
      expect(select).toHaveBeenCalledWith("creative");

      fireEvent.click(screen.getByRole("button", { name: /back/i }));
      expect(back).toHaveBeenCalled();

      fireEvent.click(screen.getByRole("button", { name: /continue/i }));
      expect(cont).toHaveBeenCalled();
    });

    it("opens full interactive preview modal without persisting", () => {
      render(
        <TemplateStep
          selected="developer"
          onSelect={vi.fn()}
          onContinue={vi.fn()}
          onBack={vi.fn()}
        />
      );

      const previewButtons = screen.getAllByRole("button", { name: /preview template/i });
      fireEvent.click(previewButtons[0]);

      expect(screen.getByRole("dialog", { name: /template preview/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /tablet preview/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /mobile preview/i })).toBeInTheDocument();

      // Close preview
      fireEvent.click(screen.getByRole("button", { name: /close preview/i }));
      expect(screen.queryByRole("dialog", { name: /template preview/i })).not.toBeInTheDocument();
    });
  });

  describe("Step 3: PortfolioBasicsStep", () => {
    it("validates required portfolio name and slug", async () => {
      const submit = vi.fn();
      const back = vi.fn();

      render(
        <PortfolioBasicsStep
          initialValues={{ name: "", slug: "" }}
          onSubmit={submit}
          onBack={back}
          isLoading={false}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /create portfolio/i }));

      await waitFor(() => {
        expect(screen.getByText("Portfolio name is required.")).toBeInTheDocument();
      });
      expect(submit).not.toHaveBeenCalled();
    });

    it("validates slug characters and rejects invalid formats", async () => {
      const submit = vi.fn();

      render(
        <PortfolioBasicsStep
          initialValues={{ name: "Valid Name", slug: "invalid slug with spaces" }}
          isSlugDirtyInitial={true}
          onSubmit={submit}
          onBack={vi.fn()}
          isLoading={false}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /create portfolio/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/slug must use only lowercase letters, numbers, and hyphens/i)
        ).toBeInTheDocument();
      });
      expect(submit).not.toHaveBeenCalled();
    });

    it("automatically suggests slug from name until user manually edits slug", () => {
      render(
        <PortfolioBasicsStep
          initialValues={{ name: "", slug: "" }}
          onSubmit={vi.fn()}
          onBack={vi.fn()}
          isLoading={false}
        />
      );

      const nameInput = screen.getByLabelText(/portfolio name/i);
      const slugInput = screen.getByLabelText(/public portfolio url/i) as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: "SeyHa Theoun" } });
      expect(slugInput.value).toBe("seyha-theoun");

      // User manually edits slug
      fireEvent.change(slugInput, { target: { value: "custom-slug" } });
      expect(slugInput.value).toBe("custom-slug");

      // Subsequent changes to name do not overwrite custom slug
      fireEvent.change(nameInput, { target: { value: "New Name" } });
      expect(slugInput.value).toBe("custom-slug");
    });

    it("surfaces server slug conflict error directly to the slug field", () => {
      render(
        <PortfolioBasicsStep
          initialValues={{ name: "Seyha", slug: "taken-slug" }}
          onSubmit={vi.fn()}
          onBack={vi.fn()}
          isLoading={false}
          serverError="Slug is already in use."
        />
      );

      expect(screen.getByText("Slug is already in use.")).toBeInTheDocument();
    });

    it("disables inputs and buttons while loading", () => {
      render(
        <PortfolioBasicsStep
          initialValues={{ name: "Seyha", slug: "seyha" }}
          onSubmit={vi.fn()}
          onBack={vi.fn()}
          isLoading={true}
        />
      );

      expect(screen.getByLabelText(/portfolio name/i)).toBeDisabled();
      expect(screen.getByLabelText(/public portfolio url/i)).toBeDisabled();
      expect(screen.getByRole("button", { name: /creating your portfolio/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /back/i })).toBeDisabled();
    });
  });

  describe("OnboardingShell integration", () => {
    it("respects pre-selected template from URL search parameters", () => {
      mockSearchParams = new URLSearchParams("template=developer");

      render(
        <Provider store={store}>
          <OnboardingShell />
        </Provider>
      );

      // Advance to step 2
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Verify developer template is marked as selected
      const devCard = screen.getByRole("radio", { name: "Developer template" });
      expect(devCard).toHaveAttribute("aria-checked", "true");
    });

    it("preserves start method when navigating back from template step", () => {
      render(
        <Provider store={store}>
          <OnboardingShell />
        </Provider>
      );

      // Select GitHub start method
      fireEvent.click(screen.getByRole("radio", { name: /import from github/i }));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Now on template step — click Back
      fireEvent.click(screen.getByRole("button", { name: /back/i }));

      // Verify GitHub is still selected
      expect(screen.getByRole("radio", { name: /import from github/i })).toHaveAttribute(
        "aria-checked",
        "true"
      );
    });

    it("routes to profile builder for manual start method after creation", async () => {
      mockApi.mockResolvedValueOnce({
        status: "success",
        data: { id: "p-123", slug: "ada", fullName: "Ada" },
      });

      render(
        <Provider store={store}>
          <OnboardingShell />
        </Provider>
      );

      // Step 1: Start manually (default) -> Continue
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 2: Template -> Continue
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 3: Enter name and slug
      fireEvent.change(screen.getByLabelText(/portfolio name/i), {
        target: { value: "Ada Lovelace" },
      });
      fireEvent.change(screen.getByLabelText(/public portfolio url/i), {
        target: { value: "ada" },
      });

      fireEvent.click(screen.getByRole("button", { name: /create portfolio/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard/builder?panel=profile");
      });
    });

    it("routes to resume-import for resume start method after creation", async () => {
      mockApi.mockResolvedValueOnce({
        status: "success",
        data: { id: "p-123", slug: "ada", fullName: "Ada" },
      });

      render(
        <Provider store={store}>
          <OnboardingShell />
        </Provider>
      );

      // Step 1: Upload Resume -> Continue
      fireEvent.click(screen.getByRole("radio", { name: /upload resume/i }));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 2: Template -> Continue
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 3: Enter name and slug
      fireEvent.change(screen.getByLabelText(/portfolio name/i), {
        target: { value: "Ada Lovelace" },
      });
      fireEvent.change(screen.getByLabelText(/public portfolio url/i), {
        target: { value: "ada" },
      });

      fireEvent.click(screen.getByRole("button", { name: /create portfolio/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard/builder?panel=resume-import");
      });
    });

    it("routes to github for github start method after creation", async () => {
      mockApi.mockResolvedValueOnce({
        status: "success",
        data: { id: "p-123", slug: "ada", fullName: "Ada" },
      });

      render(
        <Provider store={store}>
          <OnboardingShell />
        </Provider>
      );

      // Step 1: Import from GitHub -> Continue
      fireEvent.click(screen.getByRole("radio", { name: /import from github/i }));
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 2: Template -> Continue
      fireEvent.click(screen.getByRole("button", { name: /continue/i }));

      // Step 3: Enter name and slug
      fireEvent.change(screen.getByLabelText(/portfolio name/i), {
        target: { value: "Ada Lovelace" },
      });
      fireEvent.change(screen.getByLabelText(/public portfolio url/i), {
        target: { value: "ada" },
      });

      fireEvent.click(screen.getByRole("button", { name: /create portfolio/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard/builder?panel=github");
      });
    });
  });

  describe("Dashboard No-Portfolio Empty State", () => {
    it("renders empty state with link to /dashboard/onboarding", async () => {
      mockApi.mockRejectedValueOnce(new Error("Portfolio not found."));

      render(<DashboardShell />);

      await waitFor(() => {
        expect(
          screen.getByText("Create your professional portfolio")
        ).toBeInTheDocument();
      });

      const createLink = screen.getByRole("link", { name: /create portfolio/i });
      expect(createLink).toHaveAttribute("href", "/dashboard/onboarding");

      const exploreLink = screen.getByRole("link", { name: /explore templates/i });
      expect(exploreLink).toHaveAttribute("href", "/templates");
    });
  });

  describe("Builder deep linking", () => {
    it("parses panel queries correctly and falls back to Profile", () => {
      expect(parsePanelQuery("profile")).toBe("Profile");
      expect(parsePanelQuery("resume-import")).toBe("Resume Import");
      expect(parsePanelQuery("github")).toBe("GitHub");
      expect(parsePanelQuery("templates")).toBe("Templates");
      expect(parsePanelQuery("style")).toBe("Style");
      expect(parsePanelQuery("sections")).toBe("Sections");
      expect(parsePanelQuery("invalid-panel")).toBe("Profile");
      expect(parsePanelQuery(null)).toBe("Profile");
    });
  });
});
