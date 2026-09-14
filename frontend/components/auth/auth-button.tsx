"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "./auth-provider";

export function AuthButton() {
  const { ready, authenticated, login, logout } = useAuth();

  if (!ready) {
    return <span className="text-sm text-slate-400">Loading…</span>;
  }

  if (!authenticated) {
    return (
      <Button onClick={login} size="sm" variant="primary">
        Log in
      </Button>
    );
  }

  return (
    <Button
      onClick={logout}
      variant="secondary"
      size="sm"
      className="gap-1.5 text-slate-700"
    >
      <LogOut size={15} />
      Log out
    </Button>
  );
}
