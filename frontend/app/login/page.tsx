"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button, Card } from "@/components/ui";

export default function LoginPage() {
  const { ready, authenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.replace("/dashboard");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="text-sm font-medium text-slate-500">
          Preparing secure workspace…
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50/70 p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
              <Sparkles size={18} />
            </span>
            <span>Portfolia</span>
          </Link>
        </div>

        {/* Auth Card */}
        <Card className="rounded-2xl border-slate-200/80 p-8 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-600">
              Build and manage your professional portfolio.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              size="lg"
              className="w-full justify-center gap-2 font-semibold shadow-xs"
              onClick={login}
            >
              Continue with Portfolia
              <ArrowRight size={17} />
            </Button>

            <div className="rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 border border-slate-100">
              <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
              <span>Single sign-on protected by Keycloak identity</span>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-primary shrink-0" />
                <span>Zero-code portfolio customization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-primary shrink-0" />
                <span>Resume & GitHub instant profile import</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-primary shrink-0" />
                <span>Switch between 6 premium templates anytime</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400">
          <p>© 2026 Portfolia. Built for professional careers.</p>
        </div>
      </div>
    </main>
  );
}
