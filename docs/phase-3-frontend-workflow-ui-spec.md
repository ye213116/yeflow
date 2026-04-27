# Phase 3 Frontend Workflow UI Spec

## Goal

Implement the minimum frontend workflow management and runtime debugging UI for PaiAgent MVP:

- view workflow list
- create and edit workflows
- trigger workflow runs
- inspect run and step status

## Current Status

This phase is implemented. The app now exposes a single-page workflow console with a workflow list, a serial node editor, and a run detail panel backed by the Phase 1 and Phase 2 APIs.

## In Scope

- single-page workflow console in `web/`
- workflow list panel
- serial node list editor
- run detail panel
- frontend API wrappers for workflow and run endpoints

## Out of Scope

- drag-and-drop graph editor
- routing framework migration
- global state management library
- real-time polling
- advanced config editors
- UI library adoption

## Screen Model

- left panel: workflow list and create action
- main panel:
  - workflow editor view
  - run detail view

The app uses local React state to switch views instead of introducing a routing dependency in MVP phase 3.

## Editing Rules

- workflow name is required
- node order is derived from the visible list order
- first node stays `START`
- last node stays `END`
- middle nodes can be `LLM` or `TTS`
- run can only be triggered for a saved workflow

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

Then verify:

- workflow list loads
- a new workflow can be created and saved
- an existing workflow can be loaded and updated
- a run can be triggered from the editor
- run detail shows step status and payloads
- backend validation or runtime failures surface as readable frontend errors

## Notes

- the frontend keeps node config as raw text to match the Phase 1 and Phase 2 backend contract
- payload blocks are shown as plain text to keep the debug surface simple in MVP
- the UI intentionally avoids a routing dependency and uses local state transitions to keep the MVP surface compact
