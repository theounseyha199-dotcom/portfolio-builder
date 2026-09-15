"use client";

import Image from "next/image";
import { useState } from "react";
import { ProfileAvatar } from "@/components/portfolio/profile-avatar";
import {
  Calendar,
  ExternalLink,
  FileDown,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaDiscord,
  FaDribbble,
  FaGlobe,
} from "react-icons/fa6";
import { motion, useReducedMotion } from "@/lib/motion";
import type {
  PortfolioSection,
  PortfolioSectionType,
  PortfolioTemplateProps,
} from "../types";

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <FaGithub size={14} className="shrink-0" />;
  if (p.includes("linkedin")) return <FaLinkedin size={14} className="shrink-0 text-[#0a66c2]" />;
  if (p.includes("twitter") || p.includes("x")) return <FaXTwitter size={14} className="shrink-0" />;
  if (p.includes("instagram")) return <FaInstagram size={14} className="shrink-0 text-[#e4405f]" />;
  if (p.includes("youtube")) return <FaYoutube size={14} className="shrink-0 text-[#ff0000]" />;
  if (p.includes("discord")) return <FaDiscord size={14} className="shrink-0 text-[#5865f2]" />;
  if (p.includes("dribbble")) return <FaDribbble size={14} className="shrink-0 text-[#ea4c89]" />;
  return <FaGlobe size={14} className="shrink-0 opacity-80" />;
}

type Variant =
  | "minimal"
  | "developer"
  | "modern"
  | "professional"
  | "creative"
  | "student";

const names: Record<PortfolioSectionType, string> = {
  HERO: "Home",
  ABOUT: "About",
  EXPERIENCE: "Experience",
  EDUCATION: "Education",
  SKILLS: "Skills",
  PROJECTS: "Projects",
  SOCIAL: "Contact",
  RESUME: "Resume",
};

function hasContent(
  type: PortfolioSection["sectionType"],
  p: PortfolioTemplateProps["portfolio"]
) {
  return (
    type === "HERO" ||
    (type === "ABOUT" && Boolean(p.bio)) ||
    (type === "EXPERIENCE" && p.experiences.length > 0) ||
    (type === "EDUCATION" && p.educations.length > 0) ||
    (type === "SKILLS" && p.skills.length > 0) ||
    (type === "PROJECTS" && p.projects.length > 0) ||
    (type === "SOCIAL" &&
      (p.socialLinks.length > 0 || Boolean(p.publicEmail))) ||
    (type === "RESUME" && Boolean(p.resume?.available && p.resume.url))
  );
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length >= 2) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${months[monthIndex]} ${year}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function formatTimeline(
  start?: string,
  end?: string,
  current?: boolean
): string {
  const s = formatDate(start);
  if (current) {
    return s ? `${s} — Present` : "Present";
  }
  const e = formatDate(end);
  if (s && e) return `${s} — ${e}`;
  if (s) return s;
  if (e) return e;
  return "";
}

export function TemplateLayout({
  portfolio,
  sections,
  variant,
}: PortfolioTemplateProps & { variant: Variant }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ordered = sections
    .filter((s) => s.enabled && hasContent(s.sectionType, portfolio))
    .sort((a, b) => a.position - b.position);

  const navSections = ordered.filter(
    (s) => !["HERO", "RESUME"].includes(s.sectionType)
  );

  return (
    <main
      className={`portfolio-${variant} min-h-screen overflow-x-hidden bg-[var(--portfolio-background)] text-[var(--portfolio-text)] ${
        variant === "minimal" ? "selection:bg-[var(--portfolio-primary)]/15" : ""
      }`}
      style={{ fontFamily: "var(--portfolio-font-body)" }}
    >
      {/* Sticky Header with Navigation */}
      <nav
        aria-label="Portfolio sections"
        className={`sticky top-0 z-40 border-b border-current/10 bg-[var(--portfolio-background)]/90 backdrop-blur-md transition-colors ${
          variant === "minimal" ? "shadow-[0_1px_0_rgba(15,23,42,0.02)]" : ""
        }`}
      >
        <div className={`mx-auto flex max-w-[var(--portfolio-content-width)] items-center justify-between gap-4 px-5 sm:px-8 ${
          variant === "minimal" ? "py-4" : "py-3.5"
        }`}>
          <a
            href="#portfolio-hero"
            className="flex items-center gap-2.5 text-base font-bold tracking-tight hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--portfolio-font-heading)" }}
          >
            <ProfileAvatar src={portfolio.profileImageUrl} name={portfolio.fullName} width={32} height={32}
              className="size-7 rounded-full object-cover border border-current/15"
              fallbackClassName="flex size-7 items-center justify-center rounded-full border border-current/15 text-[10px]" />
            <span>{portfolio.fullName}</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden flex-wrap items-center gap-6 text-sm font-medium sm:flex">
            {navSections.map((s) => (
              <a
                key={s.sectionType}
                href={`#portfolio-${s.sectionType.toLowerCase()}`}
                className="opacity-75 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--portfolio-primary)]"
              >
                {names[s.sectionType]}
              </a>
            ))}
            {portfolio.resume?.available && portfolio.resume.url && (
              <a
                href={portfolio.resume.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[var(--portfolio-radius)] bg-[var(--portfolio-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:opacity-90 transition-opacity"
              >
                <FileDown size={13} />
                <span>Resume</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden inline-flex items-center justify-center rounded-lg border border-current/15 p-2 opacity-80 hover:opacity-100 transition-opacity"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-current/10 bg-[var(--portfolio-background)] px-5 py-4 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-3 text-sm font-medium">
              {navSections.map((s) => (
                <a
                  key={s.sectionType}
                  href={`#portfolio-${s.sectionType.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 opacity-80 hover:opacity-100 transition-opacity"
                >
                  {names[s.sectionType]}
                </a>
              ))}
              {portfolio.resume?.available && portfolio.resume.url && (
                <div className="pt-2 border-t border-current/10">
                  <a
                    href={portfolio.resume.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--portfolio-primary)]"
                  >
                    <FileDown size={14} />
                    <span>Download Resume</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <div className={`mx-auto max-w-[var(--portfolio-content-width)] px-5 sm:px-8 ${
        variant === "minimal" ? "py-4 sm:py-6" : "py-8"
      }`}>
        {ordered.map((section) => (
          <TemplateSection
            key={section.sectionType}
            section={section}
            variant={variant}
            portfolio={portfolio}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-current/10 py-10 text-center text-xs opacity-60">
        <div className="mx-auto max-w-[var(--portfolio-content-width)] px-5">
          <p>© {new Date().getFullYear()} {portfolio.fullName}. All rights reserved.</p>
          <p className="mt-1">
            Built with{" "}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline underline-offset-2 hover:opacity-100"
            >
              Portfolia
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

function TemplateSection({
  section,
  portfolio,
  variant,
}: {
  section: PortfolioSection;
  portfolio: PortfolioTemplateProps["portfolio"];
  variant: Variant;
}) {
  const prefersReducedMotion = useReducedMotion();
  const type = section.sectionType;
  const card =
    "rounded-[var(--portfolio-radius)] border border-current/10 bg-[var(--portfolio-surface)]";

  const wrap = (title: string, children: React.ReactNode) => (
    <motion.section
      id={`portfolio-${type.toLowerCase()}`}
      aria-labelledby={`${type.toLowerCase()}-heading`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`scroll-mt-20 py-[calc(var(--portfolio-section-gap)/2)] ${
        variant === "minimal" ? "border-t border-current/10 first:border-t-0" : ""
      }`}
    >
      <div className={`mb-6 flex items-center gap-3 ${variant === "minimal" ? "pt-1" : ""}`}>
        <h2
          id={`${type.toLowerCase()}-heading`}
          className={`${
            variant === "creative"
              ? "text-3xl sm:text-4xl"
              : variant === "minimal"
              ? "text-xs font-bold uppercase tracking-[0.16em] text-[var(--portfolio-muted)]"
              : "text-2xl sm:text-3xl font-bold"
          }`}
          style={{ fontFamily: "var(--portfolio-font-heading)" }}
        >
          {title}
        </h2>
        {variant === "developer" && (
          <span className="font-mono text-xs opacity-50">/&gt;</span>
        )}
      </div>
      {children}
    </motion.section>
  );

  // HERO SECTION
  if (type === "HERO") {
    return (
      <motion.header
        id="portfolio-hero"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`py-[var(--portfolio-section-gap)] ${
          variant === "modern"
            ? `${card} my-6 px-6 text-center sm:px-12`
            : variant === "creative"
            ? "grid items-center gap-8 sm:grid-cols-[1fr_1.4fr]"
            : variant === "developer"
            ? "border-l-4 pl-6"
            : variant === "minimal"
            ? "grid gap-8 border-b border-current/10 py-14 sm:grid-cols-[auto_1fr] sm:items-center sm:py-20"
            : "flex flex-col gap-7 sm:flex-row sm:items-center"
        }`}
        style={
          variant === "developer"
            ? { borderColor: "var(--portfolio-primary)" }
            : undefined
        }
      >
        <div className="shrink-0">
          <ProfileAvatar src={portfolio.profileImageUrl} name={portfolio.fullName}
            width={variant === "creative" ? 420 : 144} height={variant === "creative" ? 520 : 144}
            className={`${variant === "creative" ? "aspect-[4/5] w-full" : variant === "minimal" ? "size-24 sm:size-32" : "size-28 sm:size-36"} rounded-[var(--portfolio-radius)] object-cover shadow-sm border border-current/10`}
            fallbackClassName={`${variant === "creative" ? "aspect-[4/5] w-full" : variant === "minimal" ? "size-24 sm:size-32" : "size-28 sm:size-36"} flex items-center justify-center rounded-[var(--portfolio-radius)] border border-current/10 text-2xl`} />
        </div>
        <div className={variant === "modern" ? "mx-auto max-w-2xl" : ""}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {portfolio.location && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--portfolio-primary)]">
                <MapPin size={12} />
                <span>{portfolio.location}</span>
              </span>
            )}
            {variant === "developer" && (
              <span className="rounded bg-current/5 px-2 py-0.5 font-mono text-[11px] text-[var(--portfolio-primary)]">
                dev // active
              </span>
            )}
          </div>
          <h1
            className={`${
              variant === "creative"
                ? "text-5xl sm:text-7xl"
                : variant === "minimal"
                ? "text-4xl sm:text-6xl font-semibold tracking-[-0.045em]"
                : "text-4xl sm:text-6xl font-bold"
            } leading-[1.05] tracking-tight`}
            style={{ fontFamily: "var(--portfolio-font-heading)" }}
          >
            {portfolio.fullName}
          </h1>
          {portfolio.headline && (
            <p className="mt-4 max-w-2xl text-base text-[var(--portfolio-muted)] sm:text-lg leading-relaxed">
              {portfolio.headline}
            </p>
          )}
          {/* Quick CTA row */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {portfolio.publicEmail && (
              <a
                href={`mailto:${portfolio.publicEmail}`}
                className="inline-flex items-center gap-1.5 rounded-[var(--portfolio-radius)] bg-[var(--portfolio-primary)] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-opacity"
              >
                <Mail size={13} />
                <span>Get in touch</span>
              </a>
            )}
            {portfolio.resume?.available && portfolio.resume.url && (
              <a
                href={portfolio.resume.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[var(--portfolio-radius)] border border-current/20 px-4 py-2 text-xs font-semibold hover:bg-current/5 transition-colors"
              >
                <FileDown size={13} />
                <span>Download Resume</span>
              </a>
            )}
          </div>
        </div>
      </motion.header>
    );
  }

  // ABOUT SECTION
  if (type === "ABOUT") {
    return wrap(
      "About",
      <p
        className={`max-w-3xl whitespace-pre-wrap leading-relaxed text-[var(--portfolio-muted)] ${
          variant === "minimal" ? "text-base sm:text-lg" : "text-sm sm:text-base"
        }`}
      >
        {portfolio.bio}
      </p>
    );
  }

  // EXPERIENCE SECTION
  if (type === "EXPERIENCE") {
    return wrap(
      "Experience",
      <div
        className={
          variant === "modern"
            ? "grid gap-4 md:grid-cols-2"
            : variant === "professional"
            ? "relative border-l-2 border-current/15 ml-3 pl-6 space-y-8"
            : variant === "minimal"
            ? "divide-y divide-current/10"
            : "space-y-6"
        }
      >
        {portfolio.experiences.map((item) => {
          const timeline = formatTimeline(
            item.startDate,
            item.endDate,
            item.currentlyWorking
          );

          return (
            <article
              key={item.id}
              className={`relative ${
                variant === "modern"
                  ? `${card} p-5`
                  : variant === "minimal"
                  ? "py-5 first:pt-0 last:pb-0"
                  : ""
              }`}
            >
              {/* Timeline Dot for Professional variant */}
              {variant === "professional" && (
                <span
                  className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-[var(--portfolio-background)] bg-[var(--portfolio-primary)]"
                />
              )}

              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div>
                  <h3 className="text-base font-bold">{item.position}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--portfolio-primary)]">
                    <span>{item.company}</span>
                    {item.location && (
                      <>
                        <span className="text-xs opacity-50">·</span>
                        <span className="text-xs font-normal opacity-80 flex items-center gap-1">
                          <MapPin size={11} />
                          {item.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {timeline && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--portfolio-muted)]">
                    <Calendar size={12} className="opacity-70" />
                    <span>{timeline}</span>
                  </span>
                )}
              </div>

              {item.description && (
                <p className="mt-2.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--portfolio-muted)]">
                  {item.description}
                </p>
              )}
            </article>
          );
        })}
      </div>
    );
  }

  // EDUCATION SECTION
  if (type === "EDUCATION") {
    return wrap(
      "Education",
      <div
        className={
          variant === "student"
            ? "grid gap-4 sm:grid-cols-2"
            : "space-y-4"
        }
      >
        {portfolio.educations.map((item) => {
          const timeline = formatTimeline(item.startDate, item.endDate);

          return (
            <article
              key={item.id}
              className={`${
                variant === "student" || variant === "modern"
                  ? `${card} p-5`
                  : "border-b border-current/10 pb-4 last:border-b-0"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GraduationCap
                    size={16}
                    className="text-[var(--portfolio-primary)] shrink-0"
                  />
                  <h3 className="text-base font-bold">{item.school}</h3>
                </div>
                {timeline && (
                  <span className="text-xs text-[var(--portfolio-muted)]">
                    {timeline}
                  </span>
                )}
              </div>
              {item.degree && (
                <p className="mt-1 text-sm font-medium text-[var(--portfolio-muted)]">
                  {item.degree}
                  {item.major ? ` · ${item.major}` : ""}
                </p>
              )}
              {item.description && (
                <p className="mt-2 text-xs leading-relaxed text-[var(--portfolio-muted)]">
                  {item.description}
                </p>
              )}
            </article>
          );
        })}
      </div>
    );
  }

  // SKILLS SECTION
  if (type === "SKILLS") {
    return wrap(
      "Skills",
      <div
        className={
          variant === "student"
            ? "grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4"
            : "flex flex-wrap gap-2"
        }
      >
        {portfolio.skills.map((skill) => (
          <motion.span
            key={skill.id}
            whileHover={
              prefersReducedMotion
                ? undefined
                : variant === "student"
                ? { scale: 1.05 }
                : variant === "developer"
                ? { y: -1, scale: 1.02 }
                : { scale: 1.02 }
            }
            transition={{ duration: 0.15 }}
            className={`${card} px-3 py-1.5 text-xs font-semibold cursor-default ${
              variant === "developer"
                ? "font-mono border-[var(--portfolio-primary)]/30 text-[var(--portfolio-primary)]"
                : ""
            }`}
          >
            {variant === "developer" ? `<${skill.name}>` : skill.name}
          </motion.span>
        ))}
      </div>
    );
  }

  // PROJECTS SECTION
  if (type === "PROJECTS") {
    const isList = variant === "minimal" || section.layout === "list";

    return wrap(
      "Projects",
      <div
        className={
          isList
            ? "space-y-6"
            : "grid gap-6 sm:grid-cols-2"
        }
      >
        {portfolio.projects
          .slice()
          .sort((a, b) => Number(b.featured) - Number(a.featured))
          .map((project, index) => (
            <motion.article
              key={project.id}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : variant === "creative"
                  ? { y: -4, scale: 1.01 }
                  : variant === "modern"
                  ? { y: -3 }
                  : { y: -2 }
              }
              transition={{ duration: 0.2 }}
              className={`${card} flex flex-col justify-between overflow-hidden transition-shadow ${
                variant === "creative" && index === 0 ? "sm:col-span-2" : ""
              }`}
            >
              {project.thumbnailUrl && (
                <div className="relative aspect-video w-full overflow-hidden bg-current/5">
                  <Image
                    src={project.thumbnailUrl}
                    alt={`${project.title} project preview`}
                    width={1200}
                    height={675}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="size-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold">{project.title}</h3>
                    {project.featured && (
                      <span className="rounded bg-[var(--portfolio-primary)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--portfolio-primary)]">
                        Featured
                      </span>
                    )}
                  </div>
                  {project.shortDescription && (
                    <p className="mt-2 text-xs leading-relaxed text-[var(--portfolio-muted)]">
                      {project.shortDescription}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-current/5 px-2 py-0.5 text-[11px] font-medium text-[var(--portfolio-primary)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Links */}
                {(project.demoUrl || project.githubUrl) && (
                  <div className="flex items-center gap-4 pt-3 border-t border-current/10 text-xs font-semibold">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[var(--portfolio-primary)] hover:underline"
                      >
                        <ExternalLink size={13} />
                        <span>Live demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 opacity-75 hover:opacity-100 hover:underline"
                      >
                        <FaGithub size={13} />
                        <span>Source code</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
      </div>
    );
  }

  // SOCIAL / CONTACT SECTION
  if (type === "SOCIAL") {
    return wrap(
      "Contact",
      <div className="flex flex-wrap gap-4">
        {portfolio.publicEmail && (
          <a
            className="inline-flex items-center gap-1.5 rounded-[var(--portfolio-radius)] border border-current/15 px-4 py-2 text-xs font-semibold text-[var(--portfolio-primary)] hover:bg-current/5 transition-colors"
            href={`mailto:${portfolio.publicEmail}`}
          >
            <Mail size={14} />
            <span>{portfolio.publicEmail}</span>
          </a>
        )}
        {portfolio.socialLinks.map((item) => (
          <a
            key={item.id}
            href={item.url}
            className="inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] border border-current/15 px-4 py-2 text-xs font-semibold opacity-80 hover:opacity-100 hover:bg-current/5 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            <SocialIcon platform={item.platform} />
            <span>{item.platform}</span>
          </a>
        ))}
      </div>
    );
  }

  // RESUME SECTION
  if (type === "RESUME") {
    return (
      <section
        id="portfolio-resume"
        className="py-[calc(var(--portfolio-section-gap)/2)] text-center sm:text-left"
      >
        <a
          href={portfolio.resume?.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] bg-[var(--portfolio-primary)] px-6 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
        >
          <FileDown size={16} />
          <span>Download Resume</span>
        </a>
      </section>
    );
  }

  return null;
}
