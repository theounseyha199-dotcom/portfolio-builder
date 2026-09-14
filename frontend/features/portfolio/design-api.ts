import type { PortfolioSection, PortfolioTheme, TemplateId } from "@/components/portfolio/templates";
import { baseApi, type ApiResponse } from "@/store/api/base-api";
import type { Portfolio } from "@/types";

type UpdatePortfolioDesign = { templateKey: TemplateId; themeConfig: PortfolioTheme };

export const portfolioDesignApi = baseApi.injectEndpoints({ endpoints: (build) => ({
  getPortfolioSections: build.query<ApiResponse<PortfolioSection[]>, void>({ query: () => ({ url: "/api/portfolio-sections" }), providesTags: ["PortfolioSections"] }),
  updatePortfolioDesign: build.mutation<ApiResponse<Portfolio>, UpdatePortfolioDesign>({ query: (body) => ({ url: "/api/portfolios/me/design", method: "PUT", body }), invalidatesTags: ["Portfolio", "PortfolioDesign", "PortfolioPreview"] }),
  updatePortfolioSections: build.mutation<ApiResponse<PortfolioSection[]>, { sections: PortfolioSection[] }>({ query: (body) => ({ url: "/api/portfolio-sections", method: "PUT", body }), invalidatesTags: ["PortfolioSections", "PortfolioPreview"] }),
}) });
export const { useGetPortfolioSectionsQuery, useUpdatePortfolioDesignMutation, useUpdatePortfolioSectionsMutation } = portfolioDesignApi;
