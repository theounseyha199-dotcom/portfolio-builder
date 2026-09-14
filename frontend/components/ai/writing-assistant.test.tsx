import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WritingAssistant } from "./writing-assistant";

const mocks = vi.hoisted(() => ({ generate: vi.fn(), loading: false }));
vi.mock("@/features/ai/writing-api", () => ({ useImproveWritingMutation: () => [mocks.generate, { isLoading: mocks.loading }] }));
beforeEach(() => { mocks.generate.mockReset(); mocks.loading = false; });
const original = "Built a platform using Next.js.";
function setup() {
  const accept = vi.fn();
  const view = render(<WritingAssistant target="PROJECT_DESCRIPTION" text={original} onAccept={accept}/>);
  return { accept, ...view };
}
function generate() { fireEvent.click(screen.getByRole("button", { name: "Improve with AI" })); fireEvent.click(screen.getByRole("button", { name: "Generate suggestion" })); }
function success() { mocks.generate.mockReturnValue({ unwrap: () => Promise.resolve({ data: { suggestedText: "Developed a platform using Next.js." } }), abort: vi.fn() }); }

describe("Writing assistant", () => {
  it("blocks empty input without requesting AI", () => {
    render(<WritingAssistant target="PROFILE_BIO" text="" onAccept={vi.fn()}/>); generate();
    expect(screen.getByRole("alert")).toHaveTextContent("Add some details first"); expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("limits actions by target", () => {
    render(<WritingAssistant target="PROFILE_BIO" text={original} onAccept={vi.fn()}/>);
    fireEvent.click(screen.getByRole("button", { name: "Improve with AI" }));
    expect(screen.queryByRole("option", { name: "Highlight impact" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });
  it("sends current text and selected action only", async () => {
    success(); setup(); fireEvent.click(screen.getByRole("button", { name: "Improve with AI" }));
    fireEvent.change(screen.getByLabelText("Writing action"), { target: { value: "PROFESSIONAL" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate suggestion" }));
    await screen.findByRole("dialog");
    expect(mocks.generate).toHaveBeenCalledWith({ target: "PROJECT_DESCRIPTION", action: "PROFESSIONAL", text: original });
  });
  it("shows original and suggestion without applying, and rejects unchanged", async () => {
    success(); const { accept } = setup(); generate(); await screen.findByRole("dialog");
    expect(screen.getByText(original)).toBeInTheDocument(); expect(screen.getByLabelText("Suggested")).toHaveValue("Developed a platform using Next.js.");
    expect(accept).not.toHaveBeenCalled(); fireEvent.click(screen.getByRole("button", { name: "Reject" })); expect(accept).not.toHaveBeenCalled();
  });
  it("accepts user edited suggestion only on explicit acceptance", async () => {
    success(); const { accept } = setup(); generate(); await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Suggested"), { target: { value: "My reviewed wording." } });
    fireEvent.click(screen.getByRole("button", { name: "Use Suggestion" })); expect(accept).toHaveBeenCalledWith("My reviewed wording.");
  });
  it("preserves form on provider failure", async () => {
    mocks.generate.mockReturnValue({ unwrap: () => Promise.reject(new Error("private provider detail")), abort: vi.fn() });
    const { accept } = setup(); generate(); await screen.findByRole("alert"); expect(accept).not.toHaveBeenCalled(); expect(screen.queryByText("private provider detail")).not.toBeInTheDocument();
  });
  it("prevents applying stale output after field changes", async () => {
    success(); const { rerender, accept } = setup(); generate(); await screen.findByRole("dialog");
    rerender(<WritingAssistant target="PROJECT_DESCRIPTION" text="New unsaved text" onAccept={accept}/>);
    expect(screen.getByRole("button", { name: "Use Suggestion" })).toBeDisabled();
  });
  it("announces generation and disables repeated actions", () => {
    mocks.loading = true; setup(); expect(screen.getByRole("button", { name: "Generating…" })).toBeDisabled(); expect(screen.getByRole("status")).toHaveTextContent("Generating writing suggestion");
  });
  it("rejects oversized input", async () => {
    render(<WritingAssistant target="PROFILE_BIO" text={"x".repeat(3001)} onAccept={vi.fn()}/>); generate();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("3000")); expect(mocks.generate).not.toHaveBeenCalled();
  });
});
