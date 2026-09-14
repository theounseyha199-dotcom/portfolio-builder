import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContentManager } from "./content-manager";

vi.mock("@/features/content/api", () => ({ contentApi: { list: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({ id: "saved" }) } }));
vi.mock("@/components/ai/writing-assistant", () => ({ WritingAssistant: ({ target, text, onAccept }: { target: string; text: string; onAccept: (text: string) => void }) =>
  <button type="button" onClick={() => onAccept("Reviewed description")} data-source={text}>AI {target}</button> }));

describe("Writing integration with existing content forms", () => {
  it.each([['experiences', 'experience', 'Description', 'EXPERIENCE_DESCRIPTION'], ['projects', 'project', 'Short Description', 'PROJECT_DESCRIPTION']] as const)("uses unsaved %s description and applies only to the field", async (kind, singular, label, target) => {
    render(<ContentManager kind={kind}/>);
    fireEvent.click((await screen.findAllByRole("button", { name: new RegExp(`Add ${singular}`, 'i') }))[0]);
    const field = screen.getByLabelText(label);
    fireEvent.change(field, { target: { value: "Current unsaved source" } });
    const assistant = screen.getByRole('button', { name: `AI ${target}` });
    expect(assistant).toHaveAttribute('data-source', 'Current unsaved source');
    fireEvent.click(assistant);
    expect(field).toHaveValue('Reviewed description');
    const { contentApi } = await import('@/features/content/api');
    expect(contentApi.create).not.toHaveBeenCalled();
  });
  it("does not add AI to unsupported education fields", async () => {
    render(<ContentManager kind="educations"/>);
    fireEvent.click((await screen.findAllByRole('button', { name: /Add education/i }))[0]);
    expect(screen.queryByRole('button', { name: /^AI / })).not.toBeInTheDocument();
  });
});
