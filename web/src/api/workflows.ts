import { requestJson } from './http';
import type { WorkflowDetail, WorkflowDraft, WorkflowSummary } from '../types/workflow';
import type { WorkflowRunDetail } from '../types/run';

type WorkflowRunCreateRequest = {
  input: string | null;
};

export function listWorkflows(): Promise<WorkflowSummary[]> {
  return requestJson<WorkflowSummary[]>('/api/workflows');
}

export function getWorkflow(workflowId: number): Promise<WorkflowDetail> {
  return requestJson<WorkflowDetail>(`/api/workflows/${workflowId}`);
}

export function createWorkflow(workflow: WorkflowDraft): Promise<WorkflowDetail> {
  return requestJson<WorkflowDetail>('/api/workflows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toWorkflowRequest(workflow))
  });
}

export function updateWorkflow(workflow: WorkflowDraft): Promise<WorkflowDetail> {
  if (!workflow.id) {
    throw new Error('Workflow must be saved before it can be updated');
  }

  return requestJson<WorkflowDetail>(`/api/workflows/${workflow.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toWorkflowRequest(workflow))
  });
}

export function createWorkflowRun(
  workflowId: number,
  request: WorkflowRunCreateRequest
): Promise<WorkflowRunDetail> {
  return requestJson<WorkflowRunDetail>(`/api/workflows/${workflowId}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: normalizeText(request.input)
    })
  });
}

function toWorkflowRequest(workflow: WorkflowDraft) {
  return {
    name: workflow.name.trim(),
    description: normalizeText(workflow.description),
    nodes: workflow.nodes.map((node, index) => ({
      nodeKey: node.nodeKey.trim(),
      nodeType: node.nodeType,
      nodeOrder: index + 1,
      config: normalizeText(node.config)
    }))
  };
}

function normalizeText(value: string | null | undefined): string | null {
  if (value == null) return null;

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}
