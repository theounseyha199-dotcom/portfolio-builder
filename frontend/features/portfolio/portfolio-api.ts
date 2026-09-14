import type { TemplateId } from "@/components/portfolio/templates";
import { baseApi, type ApiResponse } from "@/store/api/base-api";
import type { Portfolio } from "@/types";

export interface CreatePortfolioPayload {
  name: string;
  slug: string;
  template: TemplateId;
  headline?: string;
}

export const portfolioApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPortfolioMe: build.query<ApiResponse<Portfolio>, void>({
      query: () => ({ url: "/api/portfolios/me" }),
      providesTags: ["Portfolio"],
    }),
    createPortfolio: build.mutation<ApiResponse<Portfolio>, CreatePortfolioPayload>({
      query: (body) => ({
        url: "/api/portfolios",
        method: "POST",
        body: {
          fullName: body.name,
          slug: body.slug,
          templateKey: body.template,
          headline: body.headline,
        },
      }),
      invalidatesTags: [
        "Portfolio",
        "PortfolioDesign",
        "PortfolioSections",
        "PortfolioCompleteness",
        "PortfolioPreview",
      ],
    }),
  }),
});

export const { useGetPortfolioMeQuery, useCreatePortfolioMutation } = portfolioApi;
