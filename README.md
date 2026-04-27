# PaiAgent MVP

PaiAgent is an MVP-focused agent workflow product.

## Tech Stack

- Backend: Java 21, Spring Boot 3, Maven Wrapper (`./mvnw`)
- Frontend: React 18+, TypeScript, Vite, pnpm

## Repository Layout

- `api/`: backend service, domain model, execution engine, provider abstraction, persistence
- `web/`: frontend app, workflow editor UI, runtime and debug UI
- `docs/`: phase plans, design notes, acceptance materials
- `scripts/`: helper scripts only when truly necessary

## Current MVP Scope

The repository currently includes the following delivered phases:

- Phase 0: project baseline and health-check chain
- Phase 1: backend workflow CRUD with serial node validation
- Phase 2: backend serial runtime execution with persisted run and step tracking
- Phase 3: frontend workflow console for editing workflows and viewing run details

Current MVP limits:

- workflows are serial node lists, not free-form graphs
- node types are limited to `START`, `LLM`, `TTS`, and `END`
- provider integrations are mock implementations
- runtime execution is synchronous
- node config and debug payloads are handled as raw text

## API Surface

- `GET /api/health`
- `GET /api/workflows`
- `POST /api/workflows`
- `GET /api/workflows/{workflowId}`
- `PUT /api/workflows/{workflowId}`
- `POST /api/workflows/{workflowId}/runs`
- `GET /api/runs/{runId}`

## Local Run

Backend:

```bash
cd api
./mvnw spring-boot:run
```

Frontend:

```bash
cd web
pnpm install
pnpm dev
```

Build frontend:

```bash
cd web
pnpm build
```

## Demo Flow

1. Start the backend.
2. Start the frontend.
3. Create a serial workflow such as `START -> LLM -> TTS -> END`.
4. Save the workflow from the editor.
5. Trigger a run with manual input.
6. Inspect the run detail view and step payloads.

## Notes

- Do not use global `mvn`; use `./mvnw` only.
- Use `pnpm` for all frontend package commands.
- Do not run full test suites as part of the AI delivery flow in this repository.
- See `docs/phase-0-init-spec.md` through `docs/phase-4-acceptance-alignment-spec.md` for phase-by-phase scope.
