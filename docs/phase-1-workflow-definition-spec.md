# Phase 1 Workflow Definition Spec

## Goal

Implement the minimum backend workflow definition loop for PaiAgent MVP:

- create workflow
- list workflows
- load workflow detail
- update workflow

This phase only supports a serial node list and does not include runtime execution.

## Current Status

This phase is implemented. The backend now persists workflow definitions with H2 + JPA and enforces serial-node validation before create and update operations succeed.

## In Scope

- Spring Boot backend workflow CRUD APIs
- local persistence with H2 + JPA
- serial node validation
- minimal error responses for invalid definitions and missing workflows

## Out of Scope

- workflow run APIs
- execution engine
- LLM or TTS provider integration
- frontend workflow editor
- workflow publish/version model
- async scheduling or retry orchestration

## API Contracts

- `GET /api/workflows`
- `POST /api/workflows`
- `GET /api/workflows/{workflowId}`
- `PUT /api/workflows/{workflowId}`

## Data Model

### workflow

- `id`
- `name`
- `description`
- `created_at`
- `updated_at`

### workflow_node

- `id`
- `workflow_id`
- `node_key`
- `node_type`
- `node_order`
- `config_json`

## Validation Rules

- a workflow must contain at least one node
- node list must be a serial ordered list
- `START` must appear exactly once and be the first node
- `END` must appear exactly once and be the last node
- middle nodes can only be `LLM` or `TTS`
- `node_key` must be unique within one workflow
- `node_order` must be unique and continuous starting from `1`

## Planned File Scope

- `api/pom.xml`
- `api/src/main/resources/application.yml`
- `api/src/main/java/com/paiagent/api/controller/*`
- `api/src/main/java/com/paiagent/api/service/*`
- `api/src/main/java/com/paiagent/api/domain/workflow/*`
- `api/src/main/java/com/paiagent/api/repository/*`
- `api/src/main/java/com/paiagent/api/entity/*`

## Suggested Validation

```bash
cd api
./mvnw spring-boot:run
```

Then verify:

- create a workflow with `START -> LLM -> END`
- list workflows
- load workflow detail
- update workflow content
- invalid definitions return clear `400` responses

## Notes

- This phase deliberately keeps the workflow model linear so the runtime phase can stay lightweight.
- Node config is stored as raw JSON text in MVP phase 1 to avoid premature schema fragmentation.
- Workflow updates replace the full node list so Phase 1 can stay explicit and avoid partial patch semantics.
