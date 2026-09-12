"use client";
import Link from "next/link"; import { LogOut } from "lucide-react"; import { useAuth } from "./auth-provider";
export function AuthButton() { const { ready, authenticated, login, logout } = useAuth(); if (!ready) return <span className="text-sm text-muted">Loading…</span>; if (!authenticated) return <button onClick={login} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Log in</button>; return <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold"><LogOut size={16}/>Log out</button>; }

