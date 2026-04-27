export type WorkflowNodeType = 'START' | 'LLM' | 'TTS' | 'END';

export type WorkflowNode = {
  nodeKey: string;
  nodeType: WorkflowNodeType;
  nodeOrder: number;
  config: string | null;
};

export type WorkflowSummary = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
};

export type WorkflowDetail = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNode[];
};

export type WorkflowDraft = {
  id: number | null;
  name: string;
  description: string;
  nodes: WorkflowNode[];
};
