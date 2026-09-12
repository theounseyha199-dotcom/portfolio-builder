"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ApiResponse } from "@/types";
import type { Education, Experience, Project, Skill, SocialLink } from "@/features/content/types";
import { PortfolioRenderer } from "@/components/portfolio/renderer/portfolio-renderer";
type PublicPortfolio={id:string;slug:string;fullName:string;headline?:string;bio?:string;location?:string;experiences:Experience[];educations:Education[];skills:Skill[];projects:Project[];socialLinks:SocialLink[]};

export default function PublicPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    params.then(({ slug }) => api<ApiResponse<PublicPortfolio>>(`/api/public/portfolios/${slug}`)
      .then((response) => setPortfolio(response.data))
      .catch(() => setMissing(true)));
  }, [params]);

  if (missing) return <main className="mx-auto max-w-2xl px-6 py-28 text-center"><p className="font-semibold text-primary">404</p><h1 className="mt-3 text-4xl font-bold">Portfolio not found</h1><p className="mt-4 text-muted">This portfolio may be unpublished or the link is incorrect.</p></main>;
  if (!portfolio) return <main className="p-10 text-center text-muted">Loading portfolio…</main>;
  return <PortfolioRenderer portfolio={portfolio}/>;
}
