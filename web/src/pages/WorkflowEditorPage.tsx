import type { CSSProperties } from 'react';

import { WorkflowForm } from '../components/WorkflowForm';
import type { WorkflowDraft } from '../types/workflow';

type WorkflowEditorPageProps = {
  workflow: WorkflowDraft;
  isLoading: boolean;
  isSaving: boolean;
  isRunning: boolean;
  runInput: string;
  onChange: (workflow: WorkflowDraft) => void;
  onRunInputChange: (value: string) => void;
  onSave: () => void;
  onRun: () => void;
};

export function WorkflowEditorPage({
  workflow,
  isLoading,
  isSaving,
  isRunning,
  runInput,
  onChange,
  onRunInputChange,
  onSave,
  onRun
}: WorkflowEditorPageProps) {
  if (isLoading) {
    return <section style={loadingCardStyle}>Loading workflow details...</section>;
  }

  return (
    <div style={editorLayoutStyle}>
      <WorkflowForm workflow={workflow} isSaving={isSaving} onChange={onChange} onSave={onSave} />

      <section style={runPanelStyle}>
        <div>
          <p style={eyebrowStyle}>Run Console</p>
          <h2 style={panelTitleStyle}>Trigger One Runtime Pass</h2>
          <p style={panelTextStyle}>
            Save first, then run once. That keeps every debug trail tied to a persisted workflow definition during acceptance review.
          </p>
        </div>

        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>Run Input</span>
          <textarea
            style={textAreaStyle}
            rows={6}
            value={runInput}
            onChange={(event) => onRunInputChange(event.target.value)}
            placeholder="Paste the initial runtime input for this demo run."
          />
        </label>

        <button
          style={runButtonStyle}
          type="button"
          onClick={onRun}
          disabled={isRunning || workflow.id == null}
        >
          {isRunning ? 'Running Workflow...' : 'Run Workflow'}
        </button>

        {workflow.id == null ? (
          <p style={helperTextStyle}>Save the workflow first so the run detail can point back to a stored definition.</p>
        ) : null}
      </section>
    </div>
  );
}

const editorLayoutStyle: CSSProperties = {
  display: 'grid',
  gap: 20
};

const loadingCardStyle: CSSProperties = {
  background: 'rgba(255, 251, 245, 0.8)',
  border: '1px solid rgba(33, 94, 79, 0.12)',
  borderRadius: 24,
  color: '#17352f',
  padding: 24
};

const runPanelStyle: CSSProperties = {
  background: 'linear-gradient(135deg, rgba(28, 69, 58, 0.96), rgba(22, 46, 39, 0.96))',
  borderRadius: 28,
  color: '#f6f2ea',
  display: 'grid',
  gap: 16,
  padding: 24
};

const eyebrowStyle: CSSProperties = {
  color: '#d1c2a3',
  fontSize: 12,
  letterSpacing: 1.5,
  margin: 0,
  textTransform: 'uppercase'
};

const panelTitleStyle: CSSProperties = {
  color: '#f6f2ea',
  fontSize: 28,
  margin: '6px 0 8px'
};

const panelTextStyle: CSSProperties = {
  color: 'rgba(246, 242, 234, 0.82)',
  margin: 0
};

const fieldStyle: CSSProperties = {
  display: 'grid',
  gap: 8
};

const fieldLabelStyle: CSSProperties = {
  color: '#ebdfc8',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 0.3
};

const textAreaStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 16,
  color: '#f6f2ea',
  fontSize: 14,
  minHeight: 132,
  padding: 14,
  resize: 'vertical'
};

const runButtonStyle: CSSProperties = {
  background: '#f3c46a',
  border: 'none',
  borderRadius: 999,
  color: '#17352f',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 800,
  minHeight: 46,
  padding: '0 18px',
  width: 'fit-content'
};

const helperTextStyle: CSSProperties = {
  color: 'rgba(246, 242, 234, 0.76)',
  margin: 0
};
