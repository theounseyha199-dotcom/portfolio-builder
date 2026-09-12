"use client";
import { useEffect } from "react"; import { useAuth } from "@/components/auth/auth-provider";
export default function LoginPage() { const { ready, authenticated, login } = useAuth(); useEffect(() => { if (ready && !authenticated) login(); }, [ready, authenticated, login]); return <main className="p-10 text-center text-muted">Redirecting to sign in…</main>; }
