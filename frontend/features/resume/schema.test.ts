import { describe, expect, it } from "vitest";
import { mapFormValuesToImportRequest, mapResumePreviewToFormValues } from "./schema";

describe("resume import mapping", () => {
  it("maps only real parser values into selected editable records", () => {
    const values = mapResumePreviewToFormValues({ profile: { fullName: "Ada" }, experiences: [{ company: "Analytical Engines", position: "Engineer", currentlyWorking: false, rawText: "source" }], educations: [], skills: [{ name: "Mathematics" }], projects: [], warnings: [] });
    expect(values.profile.fullName).toBe("Ada"); expect(values.experiences[0]).toMatchObject({ selected: true, company: "Analytical Engines" }); expect(values.skills[0]).toMatchObject({ selected: true, name: "Mathematics" });
  });
  it("creates a Spring-compatible request and omits blank or invalid optional dates", () => {
    const request = mapFormValuesToImportRequest({ profile: { selected: true, fullName: " Ada ", headline: "", email: "", phone: "", location: "", website: "", linkedinUrl: "", githubUrl: "" }, experiences: [{ selected: true, company: " Acme ", position: " Engineer ", location: "", startDate: "Jan 2024", endDate: "", currentlyWorking: false, description: "" }], educations: [], skills: [{ selected: true, name: " Java ", category: "" }], projects: [{ selected: true, title: " App ", description: "", githubUrl: "", demoUrl: "", technologies: [" TypeScript ", ""] }] });
    expect(request.profile).toMatchObject({ website: undefined, linkedinUrl: undefined, githubUrl: undefined }); expect(request.experiences[0]).toMatchObject({ company: "Acme", position: "Engineer", startDate: undefined }); expect(request.skills[0].name).toBe("Java"); expect(request.projects[0].technologies).toEqual(["TypeScript"]);
  });
});
