# Phase 4 Acceptance Alignment Spec

## Goal

Close the MVP loop for demo and handoff purposes without adding new product scope:

- align repository docs with the implemented Phase 0-3 state
- document the manual demo path
- tighten a few user-facing messages for clearer acceptance review

## In Scope

- `README.md` alignment
- phase document alignment across `docs/`
- small frontend copy refinements
- small backend error wording refinements

## Out of Scope

- new workflow features
- new node types
- real provider integrations
- async runtime orchestration
- drag-and-drop editor
- routing or state-management refactors

## Current Delivered Scope

- Phase 0: project baseline, health endpoint, frontend baseline
- Phase 1: workflow CRUD with serial node validation
- Phase 2: serial runtime execution with persisted run and step records
- Phase 3: frontend workflow console and runtime detail UI

## Manual Demo Flow

1. Start backend with `cd api && ./mvnw spring-boot:run`
2. Start frontend with `cd web && pnpm dev`
3. Open the workflow console
4. Create a serial workflow such as `START -> LLM -> TTS -> END`
5. Save the workflow
6. Trigger a run with manual input
7. Inspect run status, step status, payloads, and any error messages

## Known MVP Limits

- workflow model is linear only, not a free-form graph
- provider responses are mock outputs, not real external integrations
- runtime execution is synchronous
- node config is stored and edited as raw text
- payload debug blocks are shown as plain text

## Suggested Validation

```bash
cd api
./mvnw spring-boot:run
```

```bash
cd web
pnpm dev
```

```bash
cd web
pnpm build
```

Then verify the manual demo flow end to end and confirm docs match observed behavior.
