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
