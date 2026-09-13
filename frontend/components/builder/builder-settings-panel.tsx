import { Card } from "@/components/ui";
import type { ReactNode } from "react";

export function BuilderSettingsPanel({ title, children }: { title: string; children: ReactNode }) { return <aside className="min-w-0 border-l bg-white p-4 lg:w-[360px]"><Card className="border-0 shadow-none"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-1 text-sm text-muted">Make changes to your portfolio.</p><div className="mt-5">{children}</div></Card></aside>; }
