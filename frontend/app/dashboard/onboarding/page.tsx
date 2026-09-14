"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuthButton } from "@/components/auth/auth-button";
import { useAuth } from "@/components/auth/auth-provider";
import { OnboardingShell } from "@/components/onboarding";
import { Button, Card } from "@/components/ui";
import { api } from "@/lib/api";
import type { ApiResponse, Portfolio } from "@/types";

function OnboardingContent() {
  const router = useRouter();
  const { ready, authenticated, login } = useAuth();
  const [checkingPortfolio, setCheckingPortfolio] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkExisting() {
      if (!authenticated) {
        setCheckingPortfolio(false);
        return;
      }

      try {
        const res = await api<ApiResponse<Portfolio>>("/api/portfolios/me");
        if (res?.data?.id && active) {
          // Existing portfolio detected — redirect away from onboarding
          router.replace("/dashboard");
          return;
        }
      } catch {
        // 404 or no portfolio found — user is eligible for onboarding
      } finally {
        if (active) setCheckingPortfolio(false);
      }
    }

    if (ready) {
      void checkExisting();
    }

    return () => {
      active = false;
    };
  }, [ready, authenticated, router]);

  // Loading state while checking auth / existing portfolio
  if (!ready || checkingPortfolio) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="space-y-4 text-center animate-pulse">
          <div className="mx-auto size-10 rounded-xl bg-slate-200" />
          <div className="h-5 w-44 rounded-lg bg-slate-200 mx-auto" />
          <div className="h-3 w-64 rounded bg-slate-200 mx-auto" />
        </div>
      </div>
    );
  }

  // Unauthenticated guard
  if (!authenticated) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-2xl p-8 text-center shadow-sm">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-xs">
            <Sparkles size={22} />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Create Your Portfolio
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Log in or create your account to begin building your custom portfolio.
          </p>
          <Button
            size="lg"
            onClick={() =>
              login({
                redirectUri:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/dashboard/onboarding`
                    : undefined,
              })
            }
            className="mt-6 w-full justify-center shadow-xs gap-2"
          >
            <span>Log in with Keycloak</span>
            <ArrowRight size={17} />
          </Button>
        </Card>
      </div>
    );
  }

  return <OnboardingShell />;
}

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Header Shell */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-primary transition-opacity hover:opacity-90"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
                <Sparkles size={16} />
              </span>
              <span>Portfolia</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link
                href="/dashboard"
                className="hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/templates"
                className="hover:text-slate-900 transition-colors"
              >
                Templates
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="h-8 w-48 rounded bg-slate-200 animate-pulse" />
          </div>
        }
      >
        <OnboardingContent />
      </Suspense>
    </main>
  );
}
