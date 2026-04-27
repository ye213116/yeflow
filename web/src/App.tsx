import { useEffect, useState } from 'react';

import { createWorkflow, createWorkflowRun, getWorkflow, listWorkflows, updateWorkflow } from './api/workflows';
import { getWorkflowRun } from './api/runs';
import { RunDetailPage } from './pages/RunDetailPage';
import { WorkflowEditorPage } from './pages/WorkflowEditorPage';
import { WorkflowListPage } from './pages/WorkflowListPage';
import type { WorkflowRunDetail } from './types/run';
import type { WorkflowDetail, WorkflowDraft, WorkflowNode, WorkflowSummary } from './types/workflow';

type AppView = 'editor' | 'run';
type BannerTone = 'error' | 'success' | 'info';

type BannerState = {
  tone: BannerTone;
  message: string;
} | null;

export default function App() {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const [workflowDraft, setWorkflowDraft] = useState<WorkflowDraft>(createEmptyWorkflowDraft());
  const [currentRun, setCurrentRun] = useState<WorkflowRunDetail | null>(null);
  const [runInput, setRunInput] = useState<string>('');
  const [view, setView] = useState<AppView>('editor');
  const [banner, setBanner] = useState<BannerState>(null);
  const [isSidebarLoading, setIsSidebarLoading] = useState<boolean>(true);
  const [isEditorLoading, setIsEditorLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunLoading, setIsRunLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsSidebarLoading(true);

      try {
        const summaries = await listWorkflows();
        if (cancelled) return;

        setWorkflows(summaries);

        if (summaries.length === 0) {
          setSelectedWorkflowId(null);
          setWorkflowDraft(createEmptyWorkflowDraft());
          return;
        }

        await loadWorkflowDetail(summaries[0].id, cancelled);
      } catch (error) {
        if (cancelled) return;
        setBanner({
          tone: 'error',
          message: error instanceof Error ? error.message : 'Failed to load workflows'
        });
      } finally {
        if (cancelled) return;
        setIsSidebarLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRefreshWorkflows = async () => {
    try {
      setIsSidebarLoading(true);
      const summaries = await listWorkflows();
      setWorkflows(summaries);
      setBanner({
        tone: 'info',
        message: 'Workflow list refreshed for the latest saved definitions.'
      });
    } catch (error) {
      setBanner({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to refresh workflows'
      });
    } finally {
      setIsSidebarLoading(false);
    }
  };

  const handleCreateWorkflowDraft = () => {
    setView('editor');
    setCurrentRun(null);
    setSelectedWorkflowId(null);
    setRunInput('');
    setBanner(null);
    setWorkflowDraft(createEmptyWorkflowDraft());
  };

  const handleSelectWorkflow = async (workflowId: number) => {
    await loadWorkflowDetail(workflowId, false);
  };

  const handleSaveWorkflow = async () => {
    const validationError = validateWorkflowDraft(workflowDraft);
    if (validationError) {
      setBanner({ tone: 'error', message: validationError });
      return;
    }

    setIsSaving(true);

    try {
      const detail = workflowDraft.id
        ? await updateWorkflow(workflowDraft)
        : await createWorkflow(workflowDraft);

      const summaries = await listWorkflows();
      setWorkflows(summaries);
      setSelectedWorkflowId(detail.id);
      setWorkflowDraft(toWorkflowDraft(detail));
      setBanner({
        tone: 'success',
        message: workflowDraft.id ? 'Workflow saved successfully.' : 'Workflow created successfully.'
      });
    } catch (error) {
      setBanner({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to save workflow'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunWorkflow = async () => {
    if (workflowDraft.id == null) {
      setBanner({ tone: 'error', message: 'Save the workflow before triggering a run.' });
      return;
    }

    setIsRunning(true);

    try {
      const run = await createWorkflowRun(workflowDraft.id, {
        input: runInput
      });

      setCurrentRun(run);
      setView('run');
      setBanner({
        tone: 'success',
        message: `Run #${run.id} finished with status ${run.status}.`
      });
    } catch (error) {
      setBanner({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to run workflow'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleRefreshRun = async () => {
    if (!currentRun) return;

    setIsRunLoading(true);

    try {
      const run = await getWorkflowRun(currentRun.id);
      setCurrentRun(run);
      setBanner({
        tone: 'info',
        message: `Run #${run.id} detail refreshed.`
      });
    } catch (error) {
      setBanner({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to refresh run'
      });
    } finally {
      setIsRunLoading(false);
    }
  };

  const handleBackToEditor = () => {
    setView('editor');
  };

  return (
    <main style={appShellStyle}>
      <div style={backgroundGlowOneStyle} />
      <div style={backgroundGlowTwoStyle} />
      <div style={layoutStyle}>
        <WorkflowListPage
          workflows={workflows}
          selectedWorkflowId={selectedWorkflowId}
          isLoading={isSidebarLoading}
          onRefresh={handleRefreshWorkflows}
          onCreate={handleCreateWorkflowDraft}
          onSelectWorkflow={handleSelectWorkflow}
        />

        <section style={mainPanelStyle}>
          {banner ? <div style={bannerStyle(banner.tone)}>{banner.message}</div> : null}

          {view === 'run' ? (
            <RunDetailPage
              run={currentRun}
              isLoading={isRunLoading}
              onBack={handleBackToEditor}
              onRefresh={handleRefreshRun}
            />
          ) : (
            <WorkflowEditorPage
              workflow={workflowDraft}
              isLoading={isEditorLoading}
              isSaving={isSaving}
              isRunning={isRunning}
              runInput={runInput}
              onChange={setWorkflowDraft}
              onRunInputChange={setRunInput}
              onSave={handleSaveWorkflow}
              onRun={handleRunWorkflow}
            />
          )}
        </section>
      </div>
    </main>
  );

  async function loadWorkflowDetail(workflowId: number, cancelled: boolean) {
    setView('editor');
    setCurrentRun(null);
    setIsEditorLoading(true);

    try {
      const detail = await getWorkflow(workflowId);
      if (cancelled) return;

      setSelectedWorkflowId(detail.id);
      setWorkflowDraft(toWorkflowDraft(detail));
    } catch (error) {
      if (cancelled) return;

      setBanner({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Failed to load workflow detail'
      });
    } finally {
      if (cancelled) return;
      setIsEditorLoading(false);
    }
  }
}

function toWorkflowDraft(detail: WorkflowDetail): WorkflowDraft {
  return {
    id: detail.id,
    name: detail.name,
    description: detail.description ?? '',
    nodes: detail.nodes.map((node) => ({
      ...node,
      config: node.config ?? ''
    }))
  };
}

function createEmptyWorkflowDraft(): WorkflowDraft {
  return {
    id: null,
    name: '',
    description: '',
    nodes: [
      createBoundaryNode('start', 'START', 1),
      createEditableNode('llm-1', 'LLM', 2),
      createBoundaryNode('end', 'END', 3)
    ]
  };
}

function createBoundaryNode(nodeKey: string, nodeType: 'START' | 'END', nodeOrder: number): WorkflowNode {
  return {
    nodeKey,
    nodeType,
    nodeOrder,
    config: ''
  };
}

function createEditableNode(
  nodeKey: string,
  nodeType: 'LLM' | 'TTS',
  nodeOrder: number
): WorkflowNode {
  return {
    nodeKey,
    nodeType,
    nodeOrder,
    config: ''
  };
}

function validateWorkflowDraft(workflow: WorkflowDraft): string | null {
  if (workflow.name.trim().length === 0) {
    return 'Workflow name is required.';
  }

  if (workflow.nodes.length === 0) {
    return 'Workflow must contain at least one node.';
  }

  const firstNode = workflow.nodes[0];
  const lastNode = workflow.nodes[workflow.nodes.length - 1];

  if (firstNode?.nodeType !== 'START') {
    return 'The first node must be START.';
  }

  if (lastNode?.nodeType !== 'END') {
    return 'The last node must be END.';
  }

  const duplicateNodeKey = findDuplicateNodeKey(workflow.nodes);
  if (duplicateNodeKey) {
    return `Duplicate nodeKey found: ${duplicateNodeKey}`;
  }

  const hasInvalidMiddleNode = workflow.nodes
    .slice(1, workflow.nodes.length - 1)
    .some((node) => node.nodeType !== 'LLM' && node.nodeType !== 'TTS');

  if (hasInvalidMiddleNode) {
    return 'Only LLM or TTS nodes are allowed between START and END.';
  }

  return null;
}

function findDuplicateNodeKey(nodes: WorkflowNode[]): string | null {
  const seenKeys = new Set<string>();

  for (const node of nodes) {
    const normalizedKey = node.nodeKey.trim();
    if (normalizedKey.length === 0) return 'Node key cannot be empty.';
    if (seenKeys.has(normalizedKey)) return normalizedKey;
    seenKeys.add(normalizedKey);
  }

  return null;
}

function bannerStyle(tone: BannerTone) {
  const toneStyle = tone === 'error'
    ? { background: '#fff1ef', borderColor: 'rgba(171, 61, 51, 0.16)', color: '#a13b31' }
    : tone === 'success'
      ? { background: '#ebf8f1', borderColor: 'rgba(30, 105, 85, 0.16)', color: '#1e6955' }
      : { background: '#f5efe5', borderColor: 'rgba(138, 117, 87, 0.14)', color: '#7a664d' };

  return {
    ...toneStyle,
    border: '1px solid',
    borderRadius: 18,
    fontWeight: 700,
    padding: '14px 16px'
  };
}

const appShellStyle: React.CSSProperties = {
  background: 'radial-gradient(circle at top left, #f7efe1 0%, #eef4ef 52%, #dceee7 100%)',
  minHeight: '100vh',
  overflow: 'hidden',
  position: 'relative'
};

const backgroundGlowOneStyle: React.CSSProperties = {
  background: 'rgba(243, 196, 106, 0.24)',
  borderRadius: '50%',
  filter: 'blur(40px)',
  height: 220,
  left: -40,
  position: 'absolute',
  top: 48,
  width: 220
};

const backgroundGlowTwoStyle: React.CSSProperties = {
  background: 'rgba(47, 123, 105, 0.16)',
  borderRadius: '50%',
  filter: 'blur(46px)',
  height: 260,
  position: 'absolute',
  right: -30,
  top: 160,
  width: 260
};

const layoutStyle: React.CSSProperties = {
  display: 'grid',
  gap: 24,
  gridTemplateColumns: 'minmax(280px, 360px) minmax(0, 1fr)',
  margin: '0 auto',
  maxWidth: 1400,
  padding: '32px 20px 48px',
  position: 'relative',
  zIndex: 1
};

const mainPanelStyle: React.CSSProperties = {
  display: 'grid',
  alignContent: 'start',
  gap: 18
};
