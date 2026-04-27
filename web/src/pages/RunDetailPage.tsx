import type { CSSProperties } from 'react';

import dayjs from 'dayjs';

import { RunStepList } from '../components/RunStepList';
import type { WorkflowRunDetail } from '../types/run';

type RunDetailPageProps = {
  run: WorkflowRunDetail | null;
  isLoading: boolean;
  onBack: () => void;
  onRefresh: () => void;
};

export function RunDetailPage({ run, isLoading, onBack, onRefresh }: RunDetailPageProps) {
  if (isLoading && !run) {
    return <section style={loadingCardStyle}>Loading run details...</section>;
  }

  if (!run) {
    return <section style={loadingCardStyle}>No run selected.</section>;
  }

  return (
    <section style={panelStyle}>
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Run Detail</p>
          <h2 style={titleStyle}>Run #{run.id}</h2>
          <p style={metaStyle}>
            Workflow #{run.workflowId} · Created {dayjs(run.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </p>
        </div>
        <div style={headerActionsStyle}>
          <button style={secondaryButtonStyle} type="button" onClick={onBack}>
            Back to Editor
          </button>
          <button style={primaryButtonStyle} type="button" onClick={onRefresh}>
            Refresh Run Detail
          </button>
        </div>
      </div>

      <div style={summaryGridStyle}>
        <MetricCard label="Status" value={run.status} accent={run.status === 'FAILED' ? '#ab3d33' : '#1e6955'} />
        <MetricCard label="Started" value={formatTime(run.startedAt)} accent="#17352f" />
        <MetricCard label="Finished" value={formatTime(run.finishedAt)} accent="#17352f" />
      </div>

      <PayloadPanel label="Run Input" value={run.inputPayload} />
      <PayloadPanel label="Run Output" value={run.outputPayload} />

      {run.errorMessage ? (
        <div style={errorBoxStyle}>
          <strong style={{ display: 'block', marginBottom: 6 }}>Run Failed</strong>
          <span>{run.errorMessage}</span>
        </div>
      ) : null}

      <RunStepList steps={run.steps} />
    </section>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={metricCardStyle}>
      <p style={metricLabelStyle}>{label}</p>
      <p style={{ ...metricValueStyle, color: accent }}>{value}</p>
    </div>
  );
}

function PayloadPanel({ label, value }: { label: string; value: string | null }) {
  return (
    <section style={payloadPanelStyle}>
      <p style={metricLabelStyle}>{label}</p>
      <pre style={payloadStyle}>{value ?? '-'}</pre>
    </section>
  );
}

function formatTime(value: string | null): string {
  if (!value) return '-';
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

const loadingCardStyle: CSSProperties = {
  background: 'rgba(255, 251, 245, 0.8)',
  border: '1px solid rgba(33, 94, 79, 0.12)',
  borderRadius: 24,
  color: '#17352f',
  padding: 24
};

const panelStyle: CSSProperties = {
  background: 'rgba(255, 251, 245, 0.86)',
  border: '1px solid rgba(33, 94, 79, 0.12)',
  borderRadius: 28,
  boxShadow: '0 24px 60px rgba(23, 53, 47, 0.08)',
  display: 'grid',
  gap: 20,
  padding: 24
};

const headerStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: 16,
  justifyContent: 'space-between'
};

const headerActionsStyle: CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap'
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
  fontSize: 28,
  margin: '6px 0 8px'
};

const metaStyle: CSSProperties = {
  color: '#587069',
  margin: 0
};

const summaryGridStyle: CSSProperties = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
};

const metricCardStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.84)',
  border: '1px solid rgba(33, 94, 79, 0.12)',
  borderRadius: 18,
  padding: 18
};

const metricLabelStyle: CSSProperties = {
  color: '#587069',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.8,
  margin: 0,
  textTransform: 'uppercase'
};

const metricValueStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  margin: '10px 0 0'
};

const payloadPanelStyle: CSSProperties = {
  display: 'grid',
  gap: 8
};

const payloadStyle: CSSProperties = {
  background: '#17352f',
  borderRadius: 16,
  color: '#e9fbf5',
  fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  fontSize: 13,
  margin: 0,
  overflowX: 'auto',
  padding: 16,
  whiteSpace: 'pre-wrap'
};

const errorBoxStyle: CSSProperties = {
  background: '#fff1ef',
  border: '1px solid rgba(171, 61, 51, 0.16)',
  borderRadius: 16,
  color: '#a13b31',
  padding: 14
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

const secondaryButtonStyle: CSSProperties = {
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
