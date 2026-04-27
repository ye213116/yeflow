import type { WorkflowNodeType } from './workflow';

export type WorkflowRunStatus = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';

export type WorkflowRunStep = {
  id: number | null;
  nodeKey: string;
  nodeType: WorkflowNodeType;
  stepOrder: number;
  status: WorkflowRunStatus;
  inputPayload: string | null;
  outputPayload: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
};

export type WorkflowRunDetail = {
  id: number;
  workflowId: number;
  status: WorkflowRunStatus;
  inputPayload: string | null;
  outputPayload: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  steps: WorkflowRunStep[];
};
