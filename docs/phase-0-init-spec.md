# Phase 0 Init Spec

## Goal

Establish a runnable baseline for PaiAgent MVP without entering business implementation.

## Current Status

This baseline is complete and remains part of the current MVP. The frontend health page still exists in the codebase, but the main app entry now points to the workflow console introduced in Phase 3.

## In Scope

- Project skeleton under `api/`, `web/`, `docs/`
- Backend bootstrapping with Java 21 + Spring Boot 3
- Frontend bootstrapping with React + TypeScript + Vite + pnpm
- Minimal health-check chain between frontend and backend
- Basic repository-wide conventions

## Out of Scope

- Workflow definition CRUD
- Workflow execution engine and state machine
- Real LLM/TTS provider integrations
- Heavyweight infrastructure (Kafka, Temporal, Camunda, MQ)

## Baseline Contracts

- Backend health endpoint: `GET /api/health`
- Response body fields:
  - `status`
  - `service`
  - `timestamp`

## Suggested Manual Validation

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

Build check:

```bash
cd web
pnpm build
```

## Completion Checklist

- Backend and frontend can start independently.
- Frontend can display backend health response.
- No unauthorized frameworks introduced.
- No git commands executed.
- No full test suite executed.
