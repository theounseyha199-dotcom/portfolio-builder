import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuthButton } from "@/components/auth/auth-button";
import { PublicTemplateGallery } from "@/components/templates/public-template-gallery";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-900">
      {/* Navigation Shell */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
              <Sparkles size={16} />
            </span>
            <span>Portfolia</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <span>Build My Portfolio</span>
              <ArrowRight size={13} />
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section className="mx-auto max-w-6xl px-6 pt-12 pb-20">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Curated Layouts
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Choose your template
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Start with a layout crafted for your specific career discipline. You
            can switch templates at any time without losing any of your saved
            content.
          </p>
        </div>

        <div className="mt-10">
          <PublicTemplateGallery />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Portfolia. All templates preserve user content on switch.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
            <Link href="/templates" className="text-primary font-semibold">
              Templates
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
