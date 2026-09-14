import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DesignPanel } from "./design-panel";
import { SectionsPanel } from "./sections-panel";
import { portfolioTemplateRegistry } from "@/components/portfolio/templates";

describe("portfolio design controls", () => {
  it("updates the live theme without persisting until Save", () => {
    const change = vi.fn();
    const save = vi.fn();
    render(
      <DesignPanel
        value={portfolioTemplateRegistry.modern.defaultTheme}
        busy={false}
        onChange={change}
        onSave={save}
      />
    );
    fireEvent.change(screen.getByLabelText("Spacing"), {
      target: { value: "relaxed" },
    });
    expect(change).toHaveBeenCalledWith(
      expect.objectContaining({ spacing: "relaxed" })
    );
    expect(save).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Save design" }));
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ spacing: "relaxed" })
    );
  });

  it("applies curated style presets immediately to live theme", () => {
    const change = vi.fn();
    const save = vi.fn();
    render(
      <DesignPanel
        value={portfolioTemplateRegistry.modern.defaultTheme}
        busy={false}
        onChange={change}
        onSave={save}
      />
    );
    fireEvent.click(screen.getByText("Midnight"));
    expect(change).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "dark",
        primaryColor: "#3b82f6",
        backgroundColor: "#090d16",
      })
    );
  });

  it("resets theme to template defaults with confirmation", () => {
    const change = vi.fn();
    const save = vi.fn();
    render(
      <DesignPanel
        value={{
          ...portfolioTemplateRegistry.modern.defaultTheme,
          primaryColor: "#ff0000",
        }}
        templateId="modern"
        busy={false}
        onChange={change}
        onSave={save}
      />
    );
    // Click Reset button to open AlertDialog
    fireEvent.click(screen.getByRole("button", { name: /reset/i }));
    expect(
      screen.getByText("Reset to Template Defaults?")
    ).toBeInTheDocument();

    // Confirm the reset
    fireEvent.click(screen.getByRole("button", { name: "Reset Theme" }));
    expect(change).toHaveBeenCalledWith(
      expect.objectContaining({
        primaryColor: portfolioTemplateRegistry.modern.defaultTheme.primaryColor,
      })
    );
  });

  it("changes visibility and ordering and only exposes supported layouts", () => {
    const save = vi.fn();
    const sections = [
      { sectionType: "HERO" as const, position: 1, enabled: true },
      { sectionType: "PROJECTS" as const, position: 2, enabled: true },
      { sectionType: "SKILLS" as const, position: 3, enabled: true },
    ];
    render(
      <SectionsPanel
        sections={sections}
        templateId="minimal"
        busy={false}
        onSave={save}
      />
    );
    fireEvent.click(screen.getByLabelText("Show SKILLS"));
    expect(save).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ sectionType: "SKILLS", enabled: false }),
      ])
    );
    fireEvent.click(screen.getByLabelText("Move PROJECTS up"));
    expect(save).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ sectionType: "PROJECTS", position: 2 }),
      ])
    );
    expect(screen.getByLabelText("PROJECTS layout")).toHaveTextContent("List");
  });
});
