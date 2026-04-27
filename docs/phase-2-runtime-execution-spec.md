# Phase 2 Runtime Execution Spec

## Goal

Implement the minimum backend runtime loop for PaiAgent MVP:

- trigger one workflow run
- execute nodes in serial order
- persist run and step status
- load run detail for debugging

## Current Status

This phase is implemented. The backend can now trigger one serial run, persist run and step records, and return runtime details through dedicated APIs.

## In Scope

- `POST /api/workflows/{workflowId}/runs`
- `GET /api/runs/{runId}`
- local runtime persistence with `workflow_run` and `workflow_run_step`
- mock LLM and TTS provider implementations
- synchronous serial execution only

## Out of Scope

- real external LLM/TTS integration
- async queue or scheduler
- retry, pause, resume, cancel
- branching or graph execution
- frontend runtime UI

## Runtime Model

### workflow_run

- `id`
- `workflow_id`
- `status`
- `input_payload`
- `output_payload`
- `error_message`
- `created_at`
- `updated_at`
- `started_at`
- `finished_at`

### workflow_run_step

- `id`
- `run_id`
- `node_key`
- `node_type`
- `step_order`
- `status`
- `input_payload`
- `output_payload`
- `error_message`
- `started_at`
- `finished_at`

## Status Rules

- run starts at `PENDING`
- run becomes `RUNNING` when serial execution starts
- every step records `PENDING`, `RUNNING`, then `SUCCEEDED` or `FAILED`
- run becomes `SUCCEEDED` only when all steps succeed
- any provider failure marks both the current step and the run as `FAILED`

## Execution Rules

- `START` passes request input into the runtime context
- `LLM` uses mock text generation output
- `TTS` uses mock speech metadata output
- `END` returns the final accumulated payload

Phase 2 intentionally uses one payload channel where the previous step output becomes the next step input.

## Suggested Validation

```bash
cd api
./mvnw spring-boot:run
```

Then verify:

- create a workflow with `START -> LLM -> END`
- trigger a run
- load run detail
- create a workflow with `START -> LLM -> TTS -> END`
- force provider failure via mock config and confirm `FAILED` status is persisted

## Notes

- runtime payloads are stored as raw text so the Phase 3 debug UI can render them directly
- mock providers close the MVP loop without introducing external dependency management
- provider failures are intentionally persisted to run and step records so the debug UI can show where the chain stopped
