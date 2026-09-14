"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button, ShimmerButton } from "@/components/ui";
import { api } from "@/lib/api";
import type { ApiResponse, Portfolio } from "@/types";

export function LandingHeroCta() {
  const router = useRouter();
  const { authenticated, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!authenticated) {
      login({
        redirectUri:
          typeof window !== "undefined"
            ? `${window.location.origin}/dashboard/onboarding`
            : undefined,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api<ApiResponse<Portfolio>>("/api/portfolios/me");
      if (res?.data?.id) {
        router.push("/dashboard/builder");
      } else {
        router.push("/dashboard/onboarding");
      }
    } catch {
      router.push("/dashboard/onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShimmerButton
      shimmerColor="#ffffff"
      shimmerDuration="3s"
      onClick={() => void handleClick()}
      disabled={loading}
      className="gap-2 text-base font-semibold"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        <>
          <span>Build My Portfolio</span>
          <ArrowRight size={17} />
        </>
      )}
    </ShimmerButton>
  );
}

export function LandingFooterCta() {
  const router = useRouter();
  const { authenticated, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!authenticated) {
      login({
        redirectUri:
          typeof window !== "undefined"
            ? `${window.location.origin}/dashboard/onboarding`
            : undefined,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api<ApiResponse<Portfolio>>("/api/portfolios/me");
      if (res?.data?.id) {
        router.push("/dashboard/builder");
      } else {
        router.push("/dashboard/onboarding");
      }
    } catch {
      router.push("/dashboard/onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      onClick={() => void handleClick()}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-primary shadow-sm hover:bg-blue-50 active:bg-blue-100 transition-colors"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        <>
          <span>Build My Portfolio</span>
          <ArrowRight size={17} />
        </>
      )}
    </Button>
  );
}
