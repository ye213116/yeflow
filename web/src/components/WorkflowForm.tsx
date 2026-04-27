import type { CSSProperties } from 'react';

import { NodeListEditor } from './NodeListEditor';
import type { WorkflowDraft, WorkflowNode } from '../types/workflow';

type WorkflowFormProps = {
  workflow: WorkflowDraft;
  isSaving: boolean;
  onChange: (workflow: WorkflowDraft) => void;
  onSave: () => void;
};

export function WorkflowForm({ workflow, isSaving, onChange, onSave }: WorkflowFormProps) {
  const handleFieldChange = (patch: Partial<WorkflowDraft>) => {
    onChange({
      ...workflow,
      ...patch
    });
  };

  const handleNodeChange = (nodes: WorkflowNode[]) => {
    handleFieldChange({ nodes });
  };

  return (
    <section style={panelStyle}>
      <div style={panelHeaderStyle}>
        <div>
          <p style={eyebrowStyle}>Workflow Editor</p>
          <h2 style={panelTitleStyle}>{workflow.id ? `Workflow #${workflow.id}` : 'New Workflow'}</h2>
        </div>
        <button style={primaryButtonStyle} type="button" onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : workflow.id ? 'Save Changes' : 'Create Workflow'}
        </button>
      </div>

      <div style={formGridStyle}>
        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>Workflow Name</span>
          <input
            style={inputStyle}
            type="text"
            value={workflow.name}
            onChange={(event) => handleFieldChange({ name: event.target.value })}
            placeholder="Customer support responder"
          />
        </label>

        <label style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
          <span style={fieldLabelStyle}>Description</span>
          <textarea
            style={textAreaStyle}
            rows={3}
            value={workflow.description}
            onChange={(event) => handleFieldChange({ description: event.target.value })}
            placeholder="Describe what this workflow is supposed to do in the MVP demo."
          />
        </label>
      </div>

      <NodeListEditor nodes={workflow.nodes} onChange={handleNodeChange} />
    </section>
  );
}

const panelStyle: CSSProperties = {
  background: 'rgba(255, 251, 245, 0.86)',
  border: '1px solid rgba(33, 94, 79, 0.14)',
  borderRadius: 28,
  boxShadow: '0 24px 60px rgba(23, 53, 47, 0.08)',
  display: 'grid',
  gap: 20,
  padding: 24
};

const panelHeaderStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: 16,
  justifyContent: 'space-between'
};

const eyebrowStyle: CSSProperties = {
  color: '#8a7557',
  fontSize: 12,
  letterSpacing: 1.4,
  margin: 0,
  textTransform: 'uppercase'
};

const panelTitleStyle: CSSProperties = {
  color: '#17352f',
  fontSize: 28,
  margin: '6px 0 0'
};

const formGridStyle: CSSProperties = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const fieldStyle: CSSProperties = {
  display: 'grid',
  gap: 8
};

const fieldLabelStyle: CSSProperties = {
  color: '#365b53',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 0.3
};

const inputStyle: CSSProperties = {
  background: '#fffdf9',
  border: '1px solid rgba(33, 94, 79, 0.18)',
  borderRadius: 14,
  color: '#17352f',
  fontSize: 15,
  minHeight: 48,
  padding: '12px 14px'
};

const textAreaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 104,
  resize: 'vertical'
};

const primaryButtonStyle: CSSProperties = {
  background: 'linear-gradient(135deg, #215e4f, #2f7b69)',
  border: 'none',
  borderRadius: 999,
  color: '#f7f4ee',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 700,
  minHeight: 44,
  padding: '0 18px'
};
