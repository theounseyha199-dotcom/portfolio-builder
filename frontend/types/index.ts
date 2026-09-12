export type ApiResponse<T> = { status: "success" | "error"; message: string; data: T };
export type Portfolio = { id: string; slug: string; fullName: string; headline?: string; bio?: string; location?: string; publicEmail?: string; phone?: string; templateKey: string; themeConfig: string; published: boolean };

