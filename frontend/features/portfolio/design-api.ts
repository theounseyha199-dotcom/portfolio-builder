import type { PortfolioTheme, TemplateId } from "@/components/portfolio/templates";
import { baseApi, type ApiResponse } from "@/store/api/base-api";
import type { Portfolio } from "@/types";

type UpdatePortfolioDesign = { templateKey: TemplateId; themeConfig: PortfolioTheme };

export const portfolioDesignApi = baseApi.injectEndpoints({ endpoints: (build) => ({
  updatePortfolioDesign: build.mutation<ApiResponse<Portfolio>, UpdatePortfolioDesign>({ query: (body) => ({ url: "/api/portfolios/me/design", method: "PUT", body }), invalidatesTags: ["Portfolio", "PortfolioDesign", "PortfolioPreview"] }),
}) });
export const { useUpdatePortfolioDesignMutation } = portfolioDesignApi;
