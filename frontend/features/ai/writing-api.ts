import { baseApi, type ApiResponse } from "@/store/api/base-api";

export type WritingTarget = "PROFILE_BIO" | "EXPERIENCE_DESCRIPTION" | "PROJECT_DESCRIPTION";
export type WritingAction = "IMPROVE" | "PROFESSIONAL" | "CONCISE" | "HIGHLIGHT_IMPACT" | "FIX_GRAMMAR";
export type WritingRequest = { target: WritingTarget; action: WritingAction; text: string };
export type WritingSuggestion = { originalText: string; suggestedText: string; target: WritingTarget; action: WritingAction };
export const writingApi = baseApi.injectEndpoints({ endpoints: (build) => ({
  improveWriting: build.mutation<ApiResponse<WritingSuggestion>, WritingRequest>({
    query: (body) => ({ url: "/api/ai/writing/improve", method: "POST", body }),
    // Suggestions never invalidate or update portfolio caches.
  }),
}) });
export const { useImproveWritingMutation } = writingApi;
