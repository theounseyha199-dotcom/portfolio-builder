# Portfolio Builder

An MVP SaaS for creating and publishing professional portfolios without code. This repository implements **Milestone 1**: platform infrastructure, Keycloak login, JWT-protected Spring API, automatic application-user synchronization, one portfolio per user, basic portfolio publishing, and a responsive dashboard shell.

## Architecture

```text
Next.js (3000) → Spring Boot REST API (8081) → PostgreSQL (5434 on the host; 5432 in Docker)
       ↓                     ↑
   Keycloak (8082) — JWT access token
```

The frontend only talks to the REST API. Spring Security validates JWTs issued by Keycloak. Keycloak owns credentials and identity sessions; the application `users` table only stores a Keycloak subject and profile metadata.

## Tech stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Keycloak JS, TanStack Query-ready project structure
- Backend: Java 21, Spring Boot, Spring Security OAuth2 Resource Server, Spring Data JPA, Flyway, PostgreSQL, Lombok, MapStruct
- Infrastructure: Docker Compose, PostgreSQL 17, Keycloak 26

## Requirements

- Docker Compose v2 for the full stack, or
- Node.js 22+, npm, Java 21, Maven, and PostgreSQL 17 for local development.

## Environment

Copy the sample and replace all development defaults before sharing or deploying:

```bash
cp .env.example .env
```

Key variables: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `KEYCLOAK_ADMIN_PASSWORD`, `APP_ENCRYPTION_KEY`, service ports, and the `NEXT_PUBLIC_*` Keycloak/API URLs. `.env` is ignored by Git. Generate the encryption key with `openssl rand -base64 32`; it must decode to exactly 32 bytes.

## Run with Docker

```bash
docker compose up --build
```

On the first run, PostgreSQL creates separate `portfolio_db` and `keycloak_db` databases. Flyway creates application tables in `portfolio_db`; Keycloak stores its own tables only in `keycloak_db`.

Open:

- Frontend: http://localhost:3000 (stop any existing local Next.js server first)
- Backend health: http://localhost:8081/api/public/health
- Keycloak Admin: http://localhost:8082 (credentials from `.env`)

The supplied realm import creates `portfolio-builder`, a public client named `portfolio-frontend`, self-registration, forgot-password support, and `USER`/`ADMIN` realm roles. Use the dashboard login button to register a user. The first authenticated `/api/me` or portfolio request creates the corresponding app user automatically.

## Local development

Start only the infrastructure services, then run the applications locally. This
avoids starting a second backend or frontend on ports `8081` and `3000`:

```bash
docker compose up -d postgres keycloak

cd backend && ./mvnw spring-boot:run
cd ../frontend && npm ci && npm run dev
```

The local backend defaults to the Compose database at `localhost:5434` and the
issuer `http://localhost:8082/realms/portfolio-builder`. If you use a different
database, override `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and
`SPRING_DATASOURCE_PASSWORD` explicitly. For the full Docker stack, run only
`docker compose up --build`; do not additionally start a local backend or `npm run dev`.

## Testing and CI

The Maven wrapper is the only backend build system:

```bash
cd backend && ./mvnw clean verify
cd ../frontend && npm ci && npm run lint && npm run test && npm run build
```

GitHub Actions runs those checks, validates Compose, builds Docker images, and surfaces frontend dependency vulnerabilities on every push and pull request.

## Security

GitHub OAuth access tokens are stored as AES-256-GCM ciphertext in `github_connections.encrypted_access_token`. Ciphertext uses the versioned format `v1:<base64-iv>:<base64-ciphertext>` and a fresh random IV per token. Existing plaintext connections are intentionally invalid after the migration and must reconnect; plaintext is never guessed or silently used. Keep `APP_ENCRYPTION_KEY` in a secret manager and plan future version/key rotation around the ciphertext version marker.

Never log GitHub tokens, authorization headers, or encryption keys. Production secrets must be supplied through the deployment platform or a managed secret store (for example AWS KMS/Secrets Manager, Vault, GCP Secret Manager, or Azure Key Vault).

## Production

`docker-compose.yml` is development-oriented and runs Keycloak with `start-dev`. Production must use the override and an external TLS reverse proxy:

```bash
docker compose --env-file .env.production -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Copy `.env.production.example` to a secure deployment secret source first. The production profile requires database credentials, issuer URL, CORS/public URLs, `APP_ENCRYPTION_KEY`, S3 credentials, and GitHub OAuth secrets without development defaults. Keycloak uses `start`, hostname configuration, and proxy headers; terminate TLS at the reverse proxy and do not expose PostgreSQL directly. Pin production images to immutable digests as part of release management.

## API overview

Public:

- `GET /api/public/health`
- `GET /api/public/portfolios/{slug}` — only returns published portfolios

Authenticated (Bearer token):

- `GET /api/me`
- `POST /api/portfolios`
- `GET /api/portfolios/me`
- `PUT /api/portfolios/{id}`
- `POST /api/portfolios/{id}/publish`
- `POST /api/portfolios/{id}/unpublish`

All responses follow `{ "status", "message", "data" }`. The backend derives ownership from JWT `sub`; it never accepts a user ID from the client. API paths under `/api/admin/**` require `ADMIN`.

## Repository layout

```text
frontend/   Next.js UI, Keycloak client login, dashboard and builder shell
backend/    Spring Boot feature-based API and Flyway migrations
keycloak/   Development realm import
docker-compose.yml
.env.example
```

## Asset storage

The builder supports JPEG, PNG, and WebP profile/project images. Profile images are limited to 5 MB and project images to 8 MB. Resumes must be PDFs and are limited to 5 MB.

For local development, set `STORAGE_TYPE=local`. Files are held below `STORAGE_LOCAL_PATH` in generated paths such as `portfolios/{portfolio-id}/profile`, `projects`, and `resume`, and served only through `/api/public/assets/...`. In Docker the `backend_storage` volume is mounted at `/app/storage`.

For production, do not rely on local container storage. Set `STORAGE_TYPE=s3` and configure `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, and `S3_PUBLIC_BASE_URL`. `S3_ENDPOINT` is optional for AWS S3 and should be set for Cloudflare R2 or MinIO-compatible storage. `S3_PUBLIC_BASE_URL` must be a public CDN/bucket origin and contains no credentials.

`APP_PUBLIC_BASE_URL` determines the public origin for local asset URLs (default: `http://localhost:8081`).

## GitHub integration

GitHub remains an optional project-import integration; users continue to authenticate with Keycloak. Create a GitHub OAuth App with homepage `http://localhost:3000` and callback `http://localhost:8081/api/integrations/github/callback`, then set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_REDIRECT_URI`, and `FRONTEND_URL`. The backend stores access tokens server-side only and requests the minimal `read:user` scope for account connection.

## Resume analysis

Content → Resume remains the place to upload or manage a resume. Import → Resume analyzes that existing upload and shows a read-only preview; it does not create or modify portfolio content.

Resume analysis accepts PDF files only and supports text-based PDFs. Scanned/image-only resumes and password-protected PDFs are not supported yet. The pipeline uses PDFBox and deterministic local rules only: no AI, OCR, external parsing service, network crawl, or automatic import is involved. Extraction and parsing are performed transiently, and the resume text or parsed personal information is not logged.
