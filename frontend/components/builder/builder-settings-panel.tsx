import type { ReactNode } from "react";

export function BuilderSettingsPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <aside className="min-w-0 border-l border-slate-200/80 bg-white overflow-y-auto lg:w-[380px] xl:w-[400px]">
      <div className="p-5 sm:p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {subtitle ?? "Configure your portfolio presentation and content."}
          </p>
        </div>
        <div>{children}</div>
      </div>
    </aside>
  );
}
