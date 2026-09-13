import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";

export type ResumePreview = { profile: { fullName?: string; headline?: string; email?: string; phone?: string; location?: string; website?: string; linkedinUrl?: string; githubUrl?: string }; experiences: { company?: string; position?: string; location?: string; startDate?: string; endDate?: string; currentlyWorking: boolean; description?: string; rawText: string }[]; educations: { school?: string; degree?: string; major?: string; startDate?: string; endDate?: string; description?: string; rawText: string }[]; skills: { name: string; category?: string }[]; projects: { title?: string; description?: string; githubUrl?: string; demoUrl?: string; technologies: string[]; rawText: string }[]; warnings: string[] };
export const resumeApi = { parse: () => api<ApiResponse<ResumePreview>>("/api/resume/parse", { method: "POST" }).then((result) => result.data) };
