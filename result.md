# Milestone 5D — Engineering Hardening

## Completed

- Maven is the sole backend build system. Gradle configuration, wrapper, and scripts were removed after Maven parity verification.
- GitHub OAuth tokens now use AES-256-GCM with a random 96-bit IV per encryption and versioned `v1:<iv>:<ciphertext>` storage.
- Flyway migration `V6__encrypt_github_tokens.sql` renames the database column to `encrypted_access_token`. Existing plaintext connections are intentionally invalid and must reconnect.
- The encryption key is externalized as `APP_ENCRYPTION_KEY`, a Base64-encoded 32-byte key. No token or key is logged.
- Frontend Docker builds use `npm ci` with the lockfile. Docker ignore files reduce build context size.
- Frontend lint is clean: 0 warnings and 0 errors (previously 20 warnings).
- Added Vitest + React Testing Library with 7 component tests.
- Expanded backend regression suite to 23 tests for encryption, GitHub states/import restrictions, ownership, publishing visibility, and asset validation.
- Added GitHub Actions CI for Maven verification, frontend lint/test/build, Compose validation, Docker builds, and non-blocking npm vulnerability reporting.
- Added Spring `dev` and `prod` profiles plus `docker-compose.prod.yml` and `.env.production.example` for production-oriented deployment configuration.

## Verification

| Check | Result |
| --- | --- |
| `backend/./mvnw clean verify` | Passed — 23 tests |
| `frontend/npm run lint` | Passed — 0 warnings, 0 errors |
| `frontend/npm run test` | Passed — 7 tests |
| `frontend/npm run build` after clean `.next` | Passed |
| `docker compose config --quiet` | Passed |
| Development + production Compose config validation | Passed |
| Docker backend/frontend image builds | Passed |
| API health probe | Passed: `{"status":"success","message":"Service is healthy.","data":"ok"}` |

## Required local GitHub setup

GitHub OAuth is deliberately unavailable until an encryption key is supplied. Generate and export one before using the GitHub connection flow:

```bash
export APP_ENCRYPTION_KEY="$(openssl rand -base64 32)"
```

For Docker Compose, put the same value in the ignored `.env` file. Store the production key in a managed secret system; losing or changing it without a migration makes existing encrypted tokens unrecoverable.

## Remaining production risks

- `npm audit` currently reports one moderate and one high vulnerability; CI surfaces these without blocking until they are triaged.
- Mockito uses dynamic JVM agent attachment, which future JDK defaults may reject; configure it as a test agent before upgrading to such a runtime.
- Production still requires a real TLS reverse proxy, managed secret store, backup/restore plan, observability, and digest-pinned image release process.
- Testcontainers/PostgreSQL integration tests and full MockMvc JWT authorization tests remain the next test-hardening step; the current suite is focused unit/regression coverage.

# Milestone 6A — Resume Analysis Preview

## Completed

- Added private object reads to `StorageService`, with normalized local-path protection and direct S3 `GetObject` access.
- Added PDFBox text extraction and a deterministic, read-only parser for profile/contact information, experience, education, skills, projects, and review warnings.
- Added authenticated `POST /api/resume/parse`. It resolves only the current user's active resume and persists no parsed content or preview records.
- Added Builder Import → Resume with a `ResumeImportPanel`; it handles missing files, loading/errors, a read-only preview, and non-blocking parser warnings.
- Added parser, PDF extraction, service, and component tests using synthetic data only.

## Verification

| Check | Result |
| --- | --- |
| `backend/./mvnw clean verify` | Passed — 33 tests |
| `frontend/npm run lint` | Passed — 0 warnings, 0 errors |
| `frontend/npm run test` | Passed — 11 tests |
| `frontend/npm run build` | Passed |
| `docker compose config --quiet` | Passed |
| `docker compose build backend frontend` | Passed |

## Limitations

- Text-based PDFs only; scanned/image-only and password-protected PDFs return a clean message.
- Parsing is conservative and best-effort. Results are preview-only: there is no editing, selection, duplicate resolution, or database import in 6A.

# Full Project Verification — 2026-09-13

## Result

The current application builds and its automated checks pass. The frontend has
12 passing tests and the backend has 33 passing tests. Docker images for both
application services build successfully.

## Checks performed

| Check | Result |
| --- | --- |
| `frontend/npm run lint` | Passed — no lint errors or warnings reported |
| `frontend/npm run test` | Passed — 4 test files, 12 tests |
| `frontend/npm run build` | Passed — Next.js 15.5.25 production build |
| `backend/./mvnw clean verify` | Passed — 33 tests, 0 failures, 0 errors, 0 skipped; JAR produced |
| `docker compose config --quiet` | Passed — Compose syntax/configuration is valid |
| `docker compose -f docker-compose.yml -f docker-compose.prod.yml config --quiet` | Passed — production override is syntactically valid |
| `docker compose build` | Passed — `build-portfolio-backend:latest` and `build-portfolio-frontend:latest` built |
| Source scan for `TODO`, `FIXME`, `XXX`, and `HACK` markers | No matches found in application source/configuration |

## Findings requiring follow-up

1. **Rotate and remove the GitHub OAuth client secret in `.env.example` immediately.**
   The example file contains a populated `GITHUB_CLIENT_SECRET`, rather than a
   placeholder. Treat it as exposed: revoke/rotate it in GitHub, replace it
   with an empty placeholder, and provide the new value only through local or
   deployment secret management.
2. **Frontend dependency advisory:** `npm audit --audit-level=high` reports two
   findings (one moderate, one high) through Next.js's bundled PostCSS. The
   available automated remediation upgrades Next.js to 16.3.5 and is a
   breaking change, so it should be evaluated and tested rather than applied
   blindly.
3. **Compose environment:** validation without a populated `.env`/production
   secret source emits expected warnings for unset credentials and URLs. The
   configuration parses, but a real deployment still needs all required values
   supplied securely.
4. **Test-runtime warnings:** Maven passes, but Mockito dynamically attaches a
   JVM agent. Future JDK defaults may prohibit this; configure Mockito as an
   explicit test agent before upgrading to a runtime that disallows dynamic
   agent loading.

## Scope note

This verification covers build, lint, unit/component tests, Compose
configuration, Docker image builds, and a source-marker scan. It does not run
the full Keycloak/PostgreSQL stack or exercise authenticated browser/API flows
with live credentials.

# Milestone 6B — Resume Review and Import (in progress)

## Security hotfix

- Replaced the committed GitHub OAuth client-secret value in `.env.example`
  with an empty placeholder. No replacement secret was generated or stored in
  a tracked file.
- A source/configuration scan found only environment references and documented
  development defaults; no additional populated application credential was
  identified.
- **The previously committed GitHub OAuth client secret must be revoked/rotated
  in GitHub.** The replacement must exist only in an ignored `.env`, deployment
  secret manager, CI secret store, or production secret system—never in
  `.env.example`.
- This workspace does not contain `.git` metadata, so the required separate
  `fix: remove exposed github client secret` commit and push could not be made.
  The configured global identity is `Theoun SeyHa <theounseyha199@gmail.com>`.

## Implemented review workflow

- Added `resumeImportSchema`, `ResumeImportFormValues`, and
  `mapResumePreviewToFormValues()` for the real `POST /api/resume/parse`
  response.
- Replaced the read-only resume preview with one React Hook Form review form,
  Zod conditional validation, field arrays, editable parsed values, per-section
  select/deselect-all controls, selected counts, and confirmation counts.
- The form uses `useParseResumeMutation` and `useImportResumeMutation`; it
  submits the edited current form values, retains them after a failed import,
  and renders the real import summary (including skipped duplicates as
  `Already exists`). RTK Query invalidation remains defined on the import
  mutation for Portfolio, completeness, content, resume, and preview tags.
- Added a UI barrel export and controlled support to the existing AlertDialog
  primitive for the confirmation dialog.

## Verification

| Check | Result |
| --- | --- |
| `frontend/npm run lint` | Passed |
| `frontend/npm run test` | Passed — 12 tests |
| `frontend/npm run build` | Passed |
| `backend/./mvnw clean verify` | Passed — 33 tests, 0 failures, 0 errors, 0 skipped |

## Not yet verified

- A real authenticated Keycloak/PostgreSQL upload, parse, edit, import,
  duplicate, builder-refresh, and completeness-refresh flow was not run:
  this workspace has no supplied development account or live resume artifact.
- Docker re-validation was not repeated after this frontend-only change.
- The missing Git metadata prevents commits/pushes until the repository is
  restored in this workspace.

## Final code-level verification update

- Added focused `ResumeImportServiceTest` coverage for selected profile updates,
  selected/unselected experiences, duplicate experience and project handling,
  case-insensitive skill duplicates, and project technologies.
- Added frontend mapper tests proving that real parse data populates form state
  and that the import payload is normalized to Spring's DTO contract (blank or
  non-ISO optional dates are omitted rather than causing `LocalDate`
  deserialization errors).
- Re-exported the remaining Accordion and Label primitives through the UI
  foundation barrel.

| Check | Result |
| --- | --- |
| `backend/./mvnw clean verify` | Passed — 38 tests, 0 failures, 0 errors, 0 skipped |
| `frontend/npm run lint` | Passed |
| `frontend/npm run test` | Passed — 5 files, 14 tests |
| Clean `frontend/npm run build` | Passed |
| Development and production Compose config | Passed (expected unset-secret warnings without a `.env`) |
| `docker compose build backend frontend` | Passed |

Milestone 6B remains **not eligible to be marked fully complete** until the
real authenticated Keycloak/PostgreSQL flow is run with a real uploaded
text-based PDF and a development user, and the absent Git metadata is restored
so the requested part-by-part commits can be pushed.

## Live verification attempt — 2026-09-13

- Local PostgreSQL and Keycloak containers are healthy (`5434` and `8082`).
- The existing Spring Boot API on `8081` returned the health response
  successfully. `POST /api/resume/parse` correctly returned `401` without a
  Bearer token, confirming endpoint protection on the live API.
- The frontend on `3000` is serving after the clean Next.js rebuild.
- No uploaded or supplied PDF resume exists in the workspace, and no real
  authenticated Keycloak session was supplied. The upload → parse → edit →
  import → PostgreSQL → builder/completeness refresh path is therefore still
  pending manual execution; no mock runtime data was used as a substitute.
- A usable Git database exists at `/tmp/portfolio-builder-git-meta`, on `main`
  with the configured GitHub origin. The workspace `.git` mount itself is an
  empty read-only directory, so direct Git commands and a normal commit/push
  workflow cannot be restored until that mount is repaired. The recoverable
  Git history already has `GITHUB_CLIENT_SECRET=` in its tracked `.env.example`.

## Verification refresh — 2026-09-13

- Production frontend source was scanned for common resume sample markers
  (`John Doe`, `Example Company`, `sample resume`, `mock resume`, and `fake
  resume`) excluding test fixtures. No runtime resume demo record was found.
- The review form now renders inline Zod/RHF validation feedback for selected
  incomplete records. A focused test confirms incomplete unselected records
  may proceed, and another confirms edits and deselection survive a failed
  import mutation.
- Added focused backend partial-success coverage: a valid selected record is
  persisted while another invalid selected record is reported as failed.

| Check | Result |
| --- | --- |
| `backend/./mvnw clean verify` | Passed — 39 tests, 0 failures, 0 errors, 0 skipped |
| `frontend/npm run lint` | Passed — 0 errors, 0 warnings |
| `frontend/npm run test` | Passed — 5 files, 15 tests |
| Clean `frontend/npm run build` | Passed |
| Development Compose config | Passed |
| Production Compose config | Passed — expected unset-secret warnings without deployment environment values |
| `docker compose build backend frontend` | Passed |

The authenticated browser flow remains pending: no real Keycloak login,
upload, parse, import, duplicate re-import, persistence inspection, builder
refresh, completeness refresh, or preview rendering was claimed as verified.

## Git recovery and delivery update — 2026-09-13

- The usable repository metadata is at `/tmp/portfolio-builder-git-meta` and
  targets `https://github.com/theounseyha199-dotcom/portfolio-builder.git` on
  `main`. The workspace `.git` mount remains unavailable, but the recovered
  metadata was used successfully for normal commits and pushes.
- Verified commit author: `Theoun SeyHa <theounseyha199@gmail.com>`.
- Pushed commits:
  - `36ff41a add: add real resume review form`
  - `245ee38 test: add resume import regression tests`
  - `ba40d29 docs: record milestone 6b verification status`
- Existing upstream history already included the shadcn foundation and RTK
  resume-analysis migration, so no duplicate commits were manufactured.
- Other existing workspace changes (GitHub integration, Docker, build-system,
  and infrastructure work) were intentionally left uncommitted because they
  are outside the Resume 6B scope.
- The tracked `GITHUB_CLIENT_SECRET` remains an empty placeholder. The
  previously exposed GitHub OAuth client secret must still be revoked/rotated
  manually in GitHub; a replacement belongs only in ignored local `.env` or a
  deployment/CI secret store.

Milestone 6B remains **in progress**. The missing evidence is the real
authenticated end-to-end browser flow; all source-level, test, build, and
Docker checks listed above have passed.

# Portfolio Template System and Customization Architecture — 2026-09-14

## Implemented

- Established one shared `PortfolioRenderData` content contract for every
  template. No template-specific content models or duplicate portfolio stores
  were introduced.
- Centralized all six templates in `PORTFOLIO_TEMPLATES`, including controlled
  default themes, categories, tiers, recommendations, section orders, and
  supported section layouts.
- Added Minimal, Developer, Modern, Professional, Creative, and Student
  presentations with different content priorities and visual treatments.
- Centralized rendering through one `PortfolioRenderer`. Builder, template
  previews, and public portfolios use the same renderer.
- Added `templateOverride` and `themeOverride` renderer inputs. Previewing a
  template does not mutate or persist the portfolio.
- Added controlled CSS theme variables for primary, background, surface, text,
  muted text, radius, content width, spacing, heading font, and body font.
- Added a controlled font registry. Arbitrary remote fonts, CSS, HTML, and
  JavaScript are not accepted.
- Added the public `/templates` gallery with category filters and Desktop,
  Tablet, and Mobile previews. Marketing preview content remains static and is
  never written to a user portfolio.
- Updated the landing-page template links to route to `/templates`.
- Added the builder Templates panel with current-template status, preview,
  confirmation, and persistence through RTK Query.
- Added a separate Style panel with instant local preview and explicit Save.
  It controls mode, five color tokens, heading/body fonts, content width,
  spacing, and border radius.
- Added a Sections panel for visibility, ordering, and only the layouts
  supported by the selected template. The Hero section remains mandatory.
- Empty content sections and their navigation links are not rendered.
- Added backend validation for the six supported template IDs, controlled
  theme values, section types, layout identifiers, alignment, background, and
  spacing.
- Extended public portfolio responses with the saved template, theme, and
  section configuration, so `/u/{slug}` uses the same saved design as Builder.
- Added Flyway migration `V7__portfolio_design_tokens.sql`; it adds normalized
  section style fields, migrates `CONTACT` to `SOCIAL`, and adds `RESUME`
  configuration without duplicating existing portfolio tables.
- Design and section mutations use RTK Query with portfolio preview/design tag
  invalidation. No page reload is used.

## Verification

| Check | Result |
| --- | --- |
| `frontend/npm run lint` | Passed — 0 errors and 0 warnings |
| `frontend/npm run test` | Passed — 8 files, 27 tests |
| Clean `frontend/npm run build` | Passed — Next.js 15.5.25 |
| `backend/./mvnw clean verify` | Passed |
| Development Compose config | Passed |
| Production Compose config | Passed; expected unset-secret warnings were emitted without production environment values |
| `docker compose build backend frontend` | Passed |
| Flyway migration | Passed — schema advanced from V6 to V7 |
| Docker backend health | Passed: `{"status":"success","message":"Service is healthy.","data":"ok"}` |
| Public `/templates` route | Passed — HTTP 200 |

Frontend regression coverage includes registry completeness, rendering all
templates from the shared content contract, temporary preview override,
non-persisting preview, confirmed template persistence, current-template
indication, theme live-preview/save separation, section visibility and order,
supported section layouts, empty-section behavior, and preview device changes.
Backend coverage includes valid and invalid template validation, content
preservation during template changes, controlled theme persistence, owned
portfolio resolution, and section order/visibility/style persistence.

## Authenticated workflow closure — 2026-09-14

- A normal Keycloak authorization-code login was verified. The supplied
  personal account authenticates successfully but has no portfolio, so it was
  left unchanged. The full mutation workflow used a dedicated verified
  development account and content entered through the application's own forms
  and APIs, not direct database writes or runtime mocks.
- Real UI-created content covered Profile, Experience, Education, Skills,
  Projects, and Social Links. Counts remained unchanged across template
  switches; no records were duplicated or deleted.
- All six templates, category metadata, current status, Preview, and Use
  Template controls were verified. Creative preview used the authenticated
  portfolio at Desktop, Tablet, and Mobile widths and did not persist after
  closing or reloading.
- Applying Developer displayed the content-preservation/default-style warning
  and persisted after reload. Applying a different template predictably resets
  style to that template's controlled defaults, matching the confirmation
  copy.
- Theme controls updated the preview locally. Unsaved changes did not survive
  reload; saved primary color, font, and spacing did. Subsequent template
  application reset them to the selected template defaults as documented.
- Skills visibility, Projects `featured` layout, and reordered Projects-before-
  Experience position persisted after reload. Hero was disabled in the UI,
  labeled as required, and always remained enabled. Only layouts declared by
  the selected template were offered.
- Publish and unpublish were verified. The unpublished slug returned the
  not-found state without content; after republishing, `/u/{slug}` used the
  saved template, theme, section order, visibility, layout, and real content.
  Minimal, Developer, Professional, and Creative were each confirmed on the
  public route.
- Empty About, Resume, and disabled Skills sections did not render headings,
  CTAs, or empty regions publicly.
- `/templates` returned successfully with six thumbnail cards and on-demand
  full previews. The landing-page `View Templates` CTA was browser-tested and
  corrected to remain reliable before client hydration.
- At 390 px, the builder exposed every Content, Import, Design, and Settings
  panel through accessible mobile navigation; template preview/application,
  Style, Sections, and Publish remained reachable without horizontal overflow.
- Accessibility review confirmed labeled controls, semantic dialogs, visible
  focus styling, device-button labels, keyboard-usable template controls, and
  the required-Hero explanation. Save feedback is now exposed through a live
  status region.
- Read-only PostgreSQL verification confirmed `developer`, `published=true`,
  controlled Developer theme defaults, Projects at position 3 with
  `layout=featured`, Experience at position 4, and Skills disabled.
- Temporary Keycloak bootstrap service clients used to provision the isolated
  development account were removed after verification. No credential was
  written to the repository.

## Defects fixed during real workflow verification

- Flushed section deletion before reinsertion to prevent the portfolio/section
  unique constraint from rejecting legitimate visibility, order, and layout
  saves in the same transaction.
- Normalized project technologies to the backend array contract.
- Reloaded portfolio preview data immediately after initial profile creation
  and profile saves.
- Added builder-wide save/error status feedback and explicit section-save
  confirmation.
- Added usable mobile builder panel navigation and mandatory-Hero explanation.
- Made the landing template CTA resilient to incomplete client hydration.

## Final verification

| Check | Result |
| --- | --- |
| Real Keycloak login and authenticated portfolio workflow | Passed |
| Preview non-persistence and template persistence | Passed |
| Content preservation | Passed |
| Theme local preview/save/reload | Passed |
| Section visibility/order/layout reload | Passed |
| Publish, unpublish privacy, and public cross-template rendering | Passed |
| Mobile 390 px builder workflow | Passed |
| `backend/./mvnw clean verify` | Passed — 43 tests, 0 failures, 0 errors, 0 skipped |
| `frontend/npm run lint` | Passed — 0 errors and 0 warnings |
| `frontend/npm run test` | Passed — 8 files, 28 tests |
| Clean `frontend/npm run build` | Passed — Next.js 15.5.25 |
| Development and production Compose config | Passed; expected unset production-secret warnings only |
| `docker compose build backend frontend` | Passed |

The Portfolio Template System milestone is complete. Remaining broader project
limitations are outside this milestone: the supplied personal account still
needs a portfolio created before it can use the builder, production deployment
secrets must be supplied externally, and the existing dependency/JVM warnings
documented above remain scheduled hardening work.

# Milestone 8 — UI/UX Redesign & Experience Transformation — 2026-09-14

## Completed

- **Design System & Token Architecture**:
  - Unified CSS custom properties in `frontend/app/globals.css` (`--app-bg`, `--app-card`, `--app-surface`, `--app-border`, `--app-text`, `--app-muted`, `--app-primary`, `--app-radius-*`).
  - Standardized primary brand color to a restrained professional blue (`#1d4ed8` / hover `#1e40af`).
  - Standardized core component primitives (`Button`, `Input`, `Textarea`, `Badge`, `Card`, `AlertDialog`, `Alert`, `Separator`).
  - Added `disabled` prop support to `AlertDialogCancel` and `AlertDialogAction`.
- **Landing Page (`/`)**:
  - Transformed into a high-conversion SaaS landing page featuring a realistic dark builder hero mockup, 4-step workflow guide, 3 featured templates, key benefits, and clean footer.
  - Verified responsive layout across 1440px, 1280px, 1024px, 768px, 390px, and 375px with zero horizontal scroll overflow.
- **Dashboard (`/dashboard`)**:
  - Replaced placeholder analytics with a focused workspace overview.
  - Added live portfolio status pill (`PUBLISHED` / `DRAFT`), active template tag, real-time completeness progress bar, and actual item counts (projects, experiences, skills, education).
- **Visual Builder Shell (`/dashboard/builder`)**:
  - Implemented a 3-column layout on desktop with sticky topbar, sidebar tool groups (`CONTENT`, `IMPORT`, `DESIGN`, `SETTINGS`), and centered canvas.
  - Added `← Dashboard` back navigation, subtle save state indicator (`• Saved`, `Saving…`, `Unsaved changes`, `Save failed`), and copy public link button.
  - Implemented responsive mobile builder mode with segmented `Editor ({section})` vs `Live Preview` tabs and single-tap panel selector dropdown.
  - Centered preview canvas with realistic device viewport frames (`w-[768px]`, `w-[390px]`, and 100%).
- **Content Manager**:
  - Modernized dense lists into collapsed, scannable item cards with dates and status badges.
  - Switched editing and creation to modal dialogs to preserve scroll context and prevent layout jumps.
  - Added `AlertDialog` confirmation for safe deletion.
- **Template Gallery (`/templates` & Builder)**:
  - Upgraded cards with realistic wireframe mockups, color swatches, and tier badges.
  - Added interactive full-screen preview modal with real-time device switching (`Desktop`, `Tablet`, `Mobile`).
- **Design Controls (Style & Sections Panels)**:
  - Added 5 curated style presets (`Clean`, `Midnight`, `Warm`, `Editorial`, `Slate`) that update color and typography tokens in sync.
  - Added real-time contrast calculation with low-contrast warning banner (< 4.5:1).
  - Added quick brand palette swatches and validated hex inputs.
  - Added "Reset to template defaults" with confirmation `AlertDialog`.
  - Upgraded Sections panel with section icons, "Required" badge for Hero (replacing disabled checkbox), instant Up/Down reordering with immediate canvas reflection, and layout style dropdowns.
- **Responsive Portfolio Templates**:
  - Added responsive mobile navigation drawer menu (`Menu` / `X` toggle) to `TemplateLayout`.
  - Added rich date hierarchy to Experience items (`Jan 2023 — Present`, location indicators).
  - Added project links with icons (`ExternalLink` for live demos, `Github` for source code) and technology pills.
  - Added template differentiation accents (Developer monospace tags, Creative display headings, Modern cards, Professional timeline rule, Student chips).
  - Added clean portfolio footer.

## Verification

| Check | Result |
| --- | --- |
| `frontend/npm run lint` | Passed — 0 errors and 0 warnings |
| `frontend/npm run test` | Passed — 8 test files, 31 tests |
| Clean `frontend/npm run build` | Passed — Next.js 15.5.25 (8/8 routes generated) |
| `backend/./mvnw clean verify` | Passed — 43 tests, 0 failures, 0 errors, 0 skipped |
| `docker compose config --quiet` | Passed |
| Production Compose override config validation | Passed — expected unset-secret warnings without production environment values |
| `docker compose build backend frontend` | Passed — both Docker images built successfully |
| End-to-end Selenium QA (`/tmp/verify_milestone8.py`) | Passed across 1440px, 768px, and 390px viewports (Auth, Dashboard, Builder, Presets, Device Switcher, Public Portfolio, Mobile Drawer) |

## Commits Pushed to `origin/main`

All commits created using git identity `Theoun SeyHa <theounseyha199@gmail.com>` and pushed to `origin main`:

1. `1637aa7` — `refactor: unify portfolia design system`
2. `4392fc4` — `refactor: polish landing and dashboard design`
3. `505ccfb` — `refactor: improve portfolio builder ux`
4. `624ba60` — `refactor: polish template gallery experience`
5. `71bade3` — `refactor: improve portfolio design controls`
6. `98680c6` — `refactor: polish responsive portfolio templates`
7. `545b064` — `test: add design workflow regression coverage`

# Milestone 9 — Premium Visual Enhancement Pass — 2026-09-14

## Completed

- **Visual Design Philosophy & Motion Architecture**:
  - Maintained a calm, productive, and focused aesthetic: no rainbow buttons, no over-animation, no gaming aesthetics, no neon effects.
  - Built `frontend/lib/motion.ts` standardizing motion curves and timing tokens: `TRANSITION_FAST` (0.15s), `TRANSITION_NORMAL` (0.22s), `TRANSITION_SLOW` (0.35s), `SPRING_GENTLE`, and `SPRING_RESPONSIVE`.
  - Exported reusable variants: `fadeIn`, `fadeUp`, `panelTransition`, `staggerContainer`, and the `useReducedMotion` hook.
  - Strictly respected `prefers-reduced-motion` in all components and templates.
- **Magic UI & shadcn Component Primitives (`frontend/components/ui`)**:
  - `AnimatedGridPattern`: Subtle SVG background grid with animated opacity squares.
  - `ShimmerButton`: Polished primary CTA button with gentle sweep animation, accessible disabled states, and zero layout shift.
  - `BorderBeam`: Refined running border beam with CSS variables (`--size`, `--duration`, `--delay`, `--color-from`, `--color-to`). Added `@keyframes border-beam` to `globals.css`.
  - `NumberTicker`: Smooth number counter for metric and percentage animations with decimal place support.
  - `EmptyState`: Clean dashed border card with icon, title, description, and primary/secondary action slot.
  - `Skeleton`: Content placeholder with pulse animation.
- **Landing Page Interactions (`/`)**:
  - Integrated `AnimatedGridPattern` behind the hero section with gradient fade mask.
  - Integrated `ShimmerButton` on the primary call-to-action ("Build My Portfolio").
  - Built `LandingBuilderDemo` (`frontend/components/landing/landing-builder-demo.tsx`) using scoped `useGSAP()` timeline animating builder mockup interactions (typing headline, switching templates, updating metrics) with a static fallback when reduced motion is preferred.
  - Built `Reveal` (`frontend/components/landing/reveal.tsx`) with Motion viewport entry transitions.
  - Highlighted the featured template card with `BorderBeam`.
  - Integrated `react-icons/fa6` brand icons (`FaGithub`, `FaLinkedin`, `FaXTwitter`) in the landing footer.
- **Dashboard Microinteractions (`/dashboard`)**:
  - Added `NumberTicker` on the completeness percentage and content item counters (projects, experience, education, skills).
  - Integrated `EmptyState` component with `Sparkles` icon and direct builder CTA for accounts without a portfolio.
  - Added subtle Motion hover lift on quick-action cards.
- **Visual Builder Motion & Feedback (`/dashboard/builder`)**:
  - Added smooth sliding `layoutId="activeSidebarIndicator"` on `BuilderSidebar` items.
  - Added Motion transition on the topbar save status indicator (`Saved`, `Saving…`, `Unsaved changes`, `Save failed`).
  - Added `AnimatePresence` and `motion.div` transitions to `BuilderSettingsPanel` when switching sidebar tabs.
  - Added `AnimatePresence mode="popLayout"` and `motion.article layout` animations to `ContentManager` items for smooth addition, edit, and deletion.
- **Template Gallery Interactions (`/templates` & Builder)**:
  - Added animated category filter pill with `layoutId="activeTemplateCategoryIndicator"`.
  - Added hover lift and scale animations to template cards (`whileHover={{ y: -2, scale: 1.01 }}`).
  - Upgraded fullscreen preview modal device switcher with smooth width transition (`transition-[width] duration-300 ease-out`) between Desktop (100%), Tablet (768px), and Mobile (390px).
  - Added subtle motion entry to template application confirmation notice.
- **Portfolio Design Controls (Style & Sections Panels)**:
  - Added Motion hover and tap states to style preset cards (`whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}`) with checkmark bounce.
  - Added animated scale and ring pop to quick brand palette swatches.
  - Added motion reveal to the contrast warning banner when color combinations fall below 4.5:1.
  - Added Motion `layout` FLIP animations to section rows in `SectionsPanel` so clicking Up/Down smoothly slides rows into their new positions.
- **Template-Specific Motion & Social Polish (`TemplateLayout`)**:
  - Tailored motion personality across all 6 templates:
    - Minimal: Quiet, subtle fade-in.
    - Developer: Monospace tags with hover lift, code badges, terminal accents.
    - Modern: Card hover lift (`whileHover={{ y: -3 }}`) and clean spacing.
    - Professional: Structured timeline rules with pulse accent dots and dignified pace.
    - Creative: Editorial display headings and project card hover scale.
    - Student: Accessible interactive chips with vibrant hover scale.
  - Integrated `react-icons/fa6` social icons in `SocialIcon` (`FaGithub`, `FaLinkedin`, `FaXTwitter`, `FaInstagram`, `FaYoutube`, `FaDiscord`, `FaDribbble`, `FaGlobe`) with standard sizing.
  - Added `FaGithub` to project source code links across all templates.
  - Added JSDOM `MockIntersectionObserver` in `frontend/test/setup.ts` to support Framer Motion viewport triggers in headless tests.
- **Animated UI Regression Coverage**:
  - Created `frontend/components/ui/motion-primitives.test.tsx` with 10 test cases verifying `AnimatedGridPattern`, `NumberTicker`, `ShimmerButton`, `BorderBeam`, `EmptyState`, `Skeleton`, and `lib/motion.ts` timing tokens and variants.

## Verification

| Check | Result |
| --- | --- |
| `frontend/npm run lint` | Passed — 0 errors and 0 warnings |
| `frontend/npm run test` | Passed — 9 test files, 41 tests |
| Clean `frontend/npm run build` | Passed — Next.js 15.5.25 (8/8 routes generated) |
| `backend/./mvnw clean verify` | Passed — 43 tests, 0 failures, 0 errors, 0 skipped |
| `docker compose config --quiet` | Passed |
| Production Compose override config validation | Passed — expected unset-secret warnings without production environment values |
| `docker compose build backend frontend` | Passed — both Docker images built successfully |

## Commits Pushed to `origin/main`

All commits created using git identity `Theoun SeyHa <theounseyha199@gmail.com>` and pushed to `origin main`:

1. `85b8adf` — `add: add frontend motion foundation`
2. `0b307b5` — `refactor: enhance landing page interactions`
3. `5153208` — `refactor: polish dashboard microinteractions`
4. `c9e9553` — `refactor: improve builder motion and feedback`
5. `1c15669` — `refactor: enhance template gallery interactions`
6. `54ef8fb` — `refactor: improve portfolio design controls`
7. `cb10225` — `refactor: add template-specific motion polish`
8. `b51f711` — `test: add animated ui regression coverage`

# Milestone 10 — Guided Portfolio Creation, New User Onboarding & Template-First Creation Flow

## Completed

- **Guided Onboarding Flow (`/dashboard/onboarding`)**:
  - Built a streamlined, non-technical 3-step creation flow for newly registered/authenticated users without a portfolio:
    1. **Start Method (`StartMethodStep`)**: Choose between "Upload Resume" (fastest path to `/dashboard/builder?panel=resume-import`), "Import from GitHub" (direct path to `/dashboard/builder?panel=github`), and "Start Manually" (direct path to `/dashboard/builder?panel=profile`). Default is "Start Manually".
    2. **Template Selection (`TemplateStep`)**: Displays all 6 production templates (Minimal, Developer, Modern, Professional, Creative, Student) from `PORTFOLIO_TEMPLATES` registry with category tags, badges, descriptions, recommended audiences, and full interactive preview modal across Desktop (100%), Tablet (768px), and Mobile (390px) device breakpoints using presentation-only fixture data.
    3. **Portfolio Basics (`PortfolioBasicsStep`)**: React Hook Form + Zod schema validation for portfolio name, automated public URL slug derivation (hyphen-separated lowercase alphanumeric, locked once manually edited), public URL preview helper (`http://localhost:3000/u/{slug}`), professional headline field, and inline server error handling (such as duplicate slug conflicts).
  - Multi-step progress bar (`OnboardingProgress`) with Motion active pill animations, step status badges, and accessible keyboard navigation (`aria-checked`, `role="radio"`).
- **Deep-Linking & Start Method Routing**:
  - Extended `BuilderSidebar` to export `parsePanelQuery(param)` and `PANEL_QUERY_MAP` supporting deep links:
    - `?panel=profile` → Profile panel
    - `?panel=resume-import` → Resume Import panel
    - `?panel=github` → GitHub Import panel
    - `?panel=templates` → Templates gallery panel
    - `?panel=style` → Style panel
    - `?panel=sections` → Sections panel
  - Builder synchronization: `/dashboard/builder` reads `?panel=` search query param on load and opens the exact requested panel while falling back safely to `profile`.
  - Guard logic:
    - If an authenticated user without a portfolio visits `/dashboard/builder`, they are automatically redirected to `/dashboard/onboarding`.
    - If an authenticated user who already owns a portfolio visits `/dashboard/onboarding`, they are automatically redirected to `/dashboard`.
- **Template-First Creation Flow (`/templates`)**:
  - Enhanced `PublicTemplateGallery` ("Use Template" buttons on all template cards):
    - **Guest (Logged Out)**: Stores intended template in `sessionStorage` (`portfolia_intended_template`) and redirects to Keycloak login with redirect URI back to `/dashboard/onboarding?template={templateId}`.
    - **Logged In (No Portfolio)**: Stores intended template and redirects directly to `/dashboard/onboarding?template={templateId}`, automatically preselecting that template in Step 2.
    - **Logged In (Existing Portfolio)**: Prompts confirmation dialog warning that styles will reset to the template's defaults while preserving all existing content, then applies the template and redirects to the builder.
  - Landing page hero and footer CTAs (`LandingHeroCta`, `LandingFooterCta`) intelligently route logged-out visitors to login/onboarding, users without portfolios to `/dashboard/onboarding`, and existing portfolio owners to `/dashboard/builder`.
  - Empty dashboard state (`/dashboard`) updated to route to `/dashboard/onboarding` for initial portfolio setup.
- **Backend Atomic Template & Section Initialization**:
  - Updated `CreatePortfolioRequest` to support both `name`/`fullName` and `template`/`templateKey` with validation regex matching the 6 production templates.
  - Added `PortfolioDesignService.initializeDefaults(Portfolio portfolio, String templateKey)`:
    - Atomically sets the selected `template_key`.
    - Sets controlled `theme_config` JSON string matching template defaults.
    - Initializes and persists default section records (`portfolio_sections`) in recommended order (HERO, PROJECTS, ABOUT, SKILLS, EXPERIENCE, EDUCATION, SOCIAL, RESUME) with enabled visibility.
  - Enforced single-portfolio constraint strictly derived from authenticated JWT `sub` claim.
- **Automated Verification & Regression Testing**:
  - Added 18 Vitest unit/component tests in `frontend/components/onboarding/onboarding.test.tsx` testing progress bar states, start method card selection, template cards, preview modal, basics form validation, auto-slug derivation, server-side conflict display, and deep-link query navigation.
  - Added backend regression tests in `backend/src/test/java/com/portfolio/features/portfolio/service/PortfolioServiceTest.java` verifying creation with template initialization, default sections, duplicate slug rejection, and invalid template rejection.
  - Executed two real end-to-end browser tests via headless Firefox and Selenium:
    1. Guest user registers via Keycloak → redirected to `/dashboard/onboarding` → selects Resume start method → previews Developer template across devices → creates portfolio → lands on `/dashboard/builder?panel=resume-import` with Developer template and dark theme active → subsequent visit to `/dashboard/onboarding` cleanly redirects to `/dashboard`.
    2. Guest user visits `/templates` → clicks "Use Template" on Creative template → registers via Keycloak → redirected to `/dashboard/onboarding?template=creative` with Creative pre-selected → completes basics → lands on `/dashboard/builder?panel=profile` with Creative template active.

## Verification

| Check | Result |
| --- | --- |
| `frontend/npm run lint` | Passed — 0 errors and 0 warnings |
| `frontend/npm run test` | Passed — 10 test files, 59 tests |
| Clean `frontend/npm run build` | Passed — Next.js 15.5.25 (9/9 routes generated including `/dashboard/onboarding`) |
| `backend/./mvnw clean test` | Passed — 46 tests, 0 failures, 0 errors, 0 skipped |
| `docker compose config --quiet` | Passed |
| Production Compose override config validation | Passed |
| `docker compose build backend frontend` | Passed — both Docker images built successfully |
| E2E Browser Test 1: Onboarding flow (Resume import start → Developer template) | Passed |
| E2E Browser Test 2: Pre-login template selection (`/templates` → Creative template) | Passed |
| Port 3000 cleanup | Verified clean |

## Commits Pushed to `origin/main`

All commits created using git identity `Theoun SeyHa <theounseyha199@gmail.com>` and pushed to `origin main`:

1. `7356f77` — `chore: sync build configuration and regression test suites`
2. `a380e48` — `add: add portfolio onboarding flow`
3. `8060b3e` — `add: add onboarding template selection`
4. `675e9ec` — `add: connect template gallery to onboarding`
5. `7ec0021` — `add: add portfolio creation basics`
6. `72674c9` — `add: route onboarding to builder start methods`
7. `2605e65` — `test: add portfolio onboarding regression tests`


