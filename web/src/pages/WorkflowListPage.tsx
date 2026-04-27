import type { CSSProperties } from 'react';

import dayjs from 'dayjs';

import type { WorkflowSummary } from '../types/workflow';

type WorkflowListPageProps = {
  workflows: WorkflowSummary[];
  selectedWorkflowId: number | null;
  isLoading: boolean;
  onRefresh: () => void;
  onCreate: () => void;
  onSelectWorkflow: (workflowId: number) => void;
};

export function WorkflowListPage({
  workflows,
  selectedWorkflowId,
  isLoading,
  onRefresh,
  onCreate,
  onSelectWorkflow
}: WorkflowListPageProps) {
  return (
    <aside style={sidebarStyle}>
      <div style={sidebarHeaderStyle}>
        <div>
          <p style={eyebrowStyle}>PaiAgent MVP</p>
          <h1 style={titleStyle}>Workflow Console</h1>
          <p style={subtitleStyle}>Edit saved workflows and inspect runtime detail from one focused MVP console.</p>
        </div>
        <div style={sidebarActionStyle}>
          <button style={ghostButtonStyle} type="button" onClick={onRefresh}>
            Refresh
          </button>
          <button style={primaryButtonStyle} type="button" onClick={onCreate}>
            New Workflow
          </button>
        </div>
      </div>

      {isLoading && workflows.length === 0 ? <p style={mutedStyle}>Loading workflows...</p> : null}

      {!isLoading && workflows.length === 0 ? (
        <div style={emptyCardStyle}>
          <h2 style={emptyTitleStyle}>No workflows yet</h2>
          <p style={mutedStyle}>Create the first serial workflow to start the MVP demo loop.</p>
        </div>
      ) : null}

      <div style={listStyle}>
        {workflows.map((workflow) => {
          const isSelected = workflow.id === selectedWorkflowId;

          return (
            <button
              key={workflow.id}
              style={workflowCardStyle(isSelected)}
              type="button"
              onClick={() => onSelectWorkflow(workflow.id)}
            >
              <div style={workflowCardHeaderStyle}>
                <strong style={workflowNameStyle}>{workflow.name}</strong>
                <span style={nodeCountBadgeStyle}>{workflow.nodeCount} nodes</span>
              </div>
              <p style={workflowDescriptionStyle}>{workflow.description || 'No description yet.'}</p>
              <p style={workflowMetaStyle}>Updated {dayjs(workflow.updatedAt).format('YYYY-MM-DD HH:mm')}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function workflowCardStyle(isSelected: boolean): CSSProperties {
  return {
    background: isSelected ? 'linear-gradient(135deg, #215e4f, #2f7b69)' : 'rgba(255, 251, 245, 0.82)',
    border: isSelected ? '1px solid rgba(33, 94, 79, 0.2)' : '1px solid rgba(33, 94, 79, 0.1)',
    borderRadius: 22,
    color: isSelected ? '#f7f4ee' : '#17352f',
    cursor: 'pointer',
    display: 'grid',
    gap: 10,
    padding: 18,
    textAlign: 'left'
  };
}

const sidebarStyle: CSSProperties = {
  display: 'grid',
  gap: 18
};

const sidebarHeaderStyle: CSSProperties = {
  background: 'rgba(255, 251, 245, 0.72)',
  border: '1px solid rgba(33, 94, 79, 0.12)',
  borderRadius: 28,
  display: 'grid',
  gap: 18,
  padding: 22
};

const eyebrowStyle: CSSProperties = {
  color: '#8a7557',
  fontSize: 12,
  letterSpacing: 1.5,
  margin: 0,
  textTransform: 'uppercase'
};

const titleStyle: CSSProperties = {
  color: '#17352f',
  fontSize: 30,
  lineHeight: 1.1,
  margin: '6px 0 8px'
};

const subtitleStyle: CSSProperties = {
  color: '#587069',
  margin: 0
};

const sidebarActionStyle: CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap'
};

const listStyle: CSSProperties = {
  display: 'grid',
  gap: 12
};

const emptyCardStyle: CSSProperties = {
  background: 'rgba(255, 251, 245, 0.78)',
  border: '1px dashed rgba(33, 94, 79, 0.18)',
  borderRadius: 22,
  padding: 18
};

const emptyTitleStyle: CSSProperties = {
  color: '#17352f',
  margin: '0 0 8px'
};

const mutedStyle: CSSProperties = {
  color: '#587069',
  margin: 0
};

const workflowCardHeaderStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between'
};

const workflowNameStyle: CSSProperties = {
  fontSize: 18
};

const nodeCountBadgeStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.18)',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.6,
  padding: '6px 10px',
  textTransform: 'uppercase'
};

const workflowDescriptionStyle: CSSProperties = {
  color: 'inherit',
  margin: 0,
  opacity: 0.86
};

const workflowMetaStyle: CSSProperties = {
  color: 'inherit',
  fontSize: 12,
  letterSpacing: 0.4,
  margin: 0,
  opacity: 0.72
};

const primaryButtonStyle: CSSProperties = {
  background: 'linear-gradient(135deg, #215e4f, #2f7b69)',
  border: 'none',
  borderRadius: 999,
  color: '#f7f4ee',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 700,
  minHeight: 42,
  padding: '0 18px'
};

const ghostButtonStyle: CSSProperties = {
  background: '#edf7f2',
  border: '1px solid rgba(33, 94, 79, 0.16)',
  borderRadius: 999,
  color: '#1f5447',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 700,
  minHeight: 42,
  padding: '0 16px'
};
