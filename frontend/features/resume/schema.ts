import { z } from "zod";
import type { ResumeImportRequest, ResumePreview } from "./rtk-api";

const optionalText = z.string().trim().optional();
const experience = z.object({ selected: z.boolean(), company: optionalText, position: optionalText, location: optionalText, startDate: optionalText, endDate: optionalText, currentlyWorking: z.boolean(), description: optionalText });
const education = z.object({ selected: z.boolean(), school: optionalText, degree: optionalText, major: optionalText, startDate: optionalText, endDate: optionalText, description: optionalText });
const skill = z.object({ selected: z.boolean(), name: optionalText, category: optionalText });
const project = z.object({ selected: z.boolean(), title: optionalText, description: optionalText, githubUrl: optionalText, demoUrl: optionalText, technologies: z.array(z.string().trim()) });

export const resumeImportSchema = z.object({
  profile: z.object({ selected: z.boolean(), fullName: optionalText, headline: optionalText, email: z.union([z.literal(""), z.string().email("Enter a valid email address")]).optional(), phone: optionalText, location: optionalText, website: optionalText, linkedinUrl: optionalText, githubUrl: optionalText }),
  experiences: z.array(experience), educations: z.array(education), skills: z.array(skill), projects: z.array(project),
}).superRefine((value, context) => {
  value.experiences.forEach((item, index) => { if (item.selected && !item.company) context.addIssue({ code: z.ZodIssueCode.custom, path: ["experiences", index, "company"], message: "Company is required for selected experience." }); if (item.selected && !item.position) context.addIssue({ code: z.ZodIssueCode.custom, path: ["experiences", index, "position"], message: "Position is required for selected experience." }); });
  value.educations.forEach((item, index) => { if (item.selected && !item.school) context.addIssue({ code: z.ZodIssueCode.custom, path: ["educations", index, "school"], message: "School is required for selected education." }); });
  value.skills.forEach((item, index) => { if (item.selected && !item.name) context.addIssue({ code: z.ZodIssueCode.custom, path: ["skills", index, "name"], message: "Name is required for selected skill." }); });
  value.projects.forEach((item, index) => { if (item.selected && !item.title) context.addIssue({ code: z.ZodIssueCode.custom, path: ["projects", index, "title"], message: "Title is required for selected project." }); });
});

export type ResumeImportFormValues = z.infer<typeof resumeImportSchema>;

export function mapResumePreviewToFormValues(preview: ResumePreview): ResumeImportFormValues {
  return {
    profile: { selected: Boolean(preview.profile.fullName || preview.profile.email), fullName: preview.profile.fullName ?? "", headline: preview.profile.headline ?? "", email: preview.profile.email ?? "", phone: preview.profile.phone ?? "", location: preview.profile.location ?? "", website: preview.profile.website ?? "", linkedinUrl: preview.profile.linkedinUrl ?? "", githubUrl: preview.profile.githubUrl ?? "" },
    experiences: preview.experiences.map((item) => ({ selected: true, company: item.company ?? "", position: item.position ?? "", location: item.location ?? "", startDate: item.startDate ?? "", endDate: item.endDate ?? "", currentlyWorking: item.currentlyWorking, description: item.description ?? "" })),
    educations: preview.educations.map((item) => ({ selected: true, school: item.school ?? "", degree: item.degree ?? "", major: item.major ?? "", startDate: item.startDate ?? "", endDate: item.endDate ?? "", description: item.description ?? "" })),
    skills: preview.skills.map((item) => ({ selected: true, name: item.name, category: item.category ?? "" })),
    projects: preview.projects.map((item) => ({ selected: true, title: item.title ?? "", description: item.description ?? "", githubUrl: item.githubUrl ?? "", demoUrl: item.demoUrl ?? "", technologies: item.technologies })),
  };
}

const textOrUndefined = (value: string | undefined) => value?.trim() || undefined;
const isoDateOrUndefined = (value: string | undefined) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") ? value : undefined;

/** Converts browser form values into the exact Spring request contract. */
export function mapFormValuesToImportRequest(values: ResumeImportFormValues): ResumeImportRequest {
  return {
    profile: { selected: values.profile.selected, fullName: textOrUndefined(values.profile.fullName), headline: textOrUndefined(values.profile.headline), email: textOrUndefined(values.profile.email), phone: textOrUndefined(values.profile.phone), location: textOrUndefined(values.profile.location), website: textOrUndefined(values.profile.website), linkedinUrl: textOrUndefined(values.profile.linkedinUrl), githubUrl: textOrUndefined(values.profile.githubUrl) },
    experiences: values.experiences.map((item) => ({ selected: item.selected, company: textOrUndefined(item.company), position: textOrUndefined(item.position), location: textOrUndefined(item.location), startDate: isoDateOrUndefined(item.startDate), endDate: item.currentlyWorking ? undefined : isoDateOrUndefined(item.endDate), currentlyWorking: item.currentlyWorking, description: textOrUndefined(item.description) })),
    educations: values.educations.map((item) => ({ selected: item.selected, school: textOrUndefined(item.school), degree: textOrUndefined(item.degree), major: textOrUndefined(item.major), startDate: isoDateOrUndefined(item.startDate), endDate: isoDateOrUndefined(item.endDate), description: textOrUndefined(item.description) })),
    skills: values.skills.map((item) => ({ selected: item.selected, name: textOrUndefined(item.name), category: textOrUndefined(item.category) })),
    projects: values.projects.map((item) => ({ selected: item.selected, title: textOrUndefined(item.title), description: textOrUndefined(item.description), githubUrl: textOrUndefined(item.githubUrl), demoUrl: textOrUndefined(item.demoUrl), technologies: item.technologies.map((technology) => technology.trim()).filter(Boolean) })),
  };
}
