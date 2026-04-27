import { requestJson } from './http';
import type { WorkflowRunDetail } from '../types/run';

export function getWorkflowRun(runId: number): Promise<WorkflowRunDetail> {
  return requestJson<WorkflowRunDetail>(`/api/runs/${runId}`);
}
