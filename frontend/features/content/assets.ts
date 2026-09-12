import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";

export type AssetInfo = { available: boolean; filename: string; size: number; url: string };
const upload = (path: string, file: File) => { const data = new FormData(); data.append("file", file); return api<ApiResponse<{ url: string }>>(path, { method: "POST", body: data }).then((result) => result.data); };
export const assetApi = {
  uploadProfileImage: (file: File) => upload("/api/portfolio/assets/profile-image", file),
  deleteProfileImage: () => api<ApiResponse<null>>("/api/portfolio/assets/profile-image", { method: "DELETE" }),
  uploadResume: (file: File) => upload("/api/portfolio/assets/resume", file),
  deleteResume: () => api<ApiResponse<null>>("/api/portfolio/assets/resume", { method: "DELETE" }),
  resume: () => api<ApiResponse<AssetInfo | null>>("/api/portfolio/assets/resume").then((result) => result.data),
  uploadProjectImage: (id: string, file: File) => upload(`/api/projects/${id}/image`, file),
  deleteProjectImage: (id: string) => api<ApiResponse<null>>(`/api/projects/${id}/image`, { method: "DELETE" }),
};
