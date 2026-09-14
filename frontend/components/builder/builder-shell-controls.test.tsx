import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BuilderDeviceSwitcher } from "./builder-device-switcher";
import { BuilderMobileNavigation, BuilderSidebar } from "./builder-sidebar";
import { BuilderTopbar } from "./builder-topbar";

describe("visual builder controls", () => {
  it("lets mobile users open every builder panel", () => {
    const select = vi.fn();
    render(<BuilderMobileNavigation active="Profile" onSelect={select} />);
    fireEvent.change(screen.getByLabelText("Builder panel"), {
      target: { value: "Templates" },
    });
    expect(select).toHaveBeenCalledWith("Templates");
    expect(
      screen.getByRole("option", { name: "Publishing" })
    ).toBeInTheDocument();
  });

  it("changes the preview device", () => {
    const change = vi.fn();
    render(<BuilderDeviceSwitcher value="desktop" onChange={change} />);
    fireEvent.click(screen.getByRole("button", { name: "Mobile" }));
    expect(change).toHaveBeenCalledWith("mobile");
  });

  it("changes the active settings panel", () => {
    const select = vi.fn();
    render(<BuilderSidebar active="Profile" onSelect={select} />);
    fireEvent.click(screen.getByRole("button", { name: "Templates" }));
    expect(select).toHaveBeenCalledWith("Templates");
  });

  it("renders published topbar with copy link action and save status", () => {
    const deviceChange = vi.fn();
    const preview = vi.fn();
    const publish = vi.fn();

    const { rerender } = render(
      <BuilderTopbar
        name="Alex Morgan"
        published={true}
        slug="alex-morgan"
        device="desktop"
        saveStatus="saved"
        onDeviceChange={deviceChange}
        onPreview={preview}
        onPublish={publish}
      />
    );

    expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy public link" })
    ).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();

    // Rerender in saving state
    rerender(
      <BuilderTopbar
        name="Alex Morgan"
        published={false}
        slug="alex-morgan"
        device="desktop"
        saveStatus="saving"
        onDeviceChange={deviceChange}
        onPreview={preview}
        onPublish={publish}
      />
    );
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText("Saving…")).toBeInTheDocument();
  });
});
