import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";

type Request = { url: string; method?: "GET" | "POST" | "PUT" | "DELETE"; body?: unknown };
type ApiError = { message: string };
const authenticatedBaseQuery: BaseQueryFn<Request, unknown, ApiError> = async ({ url, method = "GET", body }) => {
  try { return { data: await api<unknown>(url, { method, body: body === undefined ? undefined : JSON.stringify(body) }) }; }
  catch (error) { return { error: { message: error instanceof Error ? error.message : "Request failed." } }; }
};
export const baseApi = createApi({ reducerPath: "api", baseQuery: authenticatedBaseQuery, tagTypes: ["Portfolio", "PortfolioCompleteness", "PortfolioDesign", "PortfolioPreview", "Profile", "Experience", "Education", "Skill", "Project", "Resume", "ResumePreview"], endpoints: () => ({}) });
export type { ApiResponse };
