import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BuilderDeviceSwitcher } from "./builder-device-switcher";
import { BuilderMobileNavigation, BuilderSidebar } from "./builder-sidebar";

describe("visual builder controls", () => {
  it("lets mobile users open every builder panel", () => { const select = vi.fn(); render(<BuilderMobileNavigation active="Profile" onSelect={select}/>); fireEvent.change(screen.getByLabelText("Builder panel"), { target: { value: "Templates" } }); expect(select).toHaveBeenCalledWith("Templates"); expect(screen.getByRole("option", { name: "Publishing" })).toBeInTheDocument(); });
  it("changes the preview device", () => { const change = vi.fn(); render(<BuilderDeviceSwitcher value="desktop" onChange={change} />); fireEvent.click(screen.getByRole("button", { name: "Mobile" })); expect(change).toHaveBeenCalledWith("mobile"); });
  it("changes the active settings panel", () => { const select = vi.fn(); render(<BuilderSidebar active="Profile" onSelect={select} />); fireEvent.click(screen.getByRole("button", { name: "Templates" })); expect(select).toHaveBeenCalledWith("Templates"); });
});
