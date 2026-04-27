import type { CSSProperties } from 'react';

import dayjs from 'dayjs';

import type { WorkflowRunStep } from '../types/run';

type RunStepListProps = {
  steps: WorkflowRunStep[];
};

export function RunStepList({ steps }: RunStepListProps) {
  if (steps.length === 0) {
    return <p style={emptyStyle}>No steps were recorded for this run.</p>;
  }

  return (
    <section style={listStyle}>
      {steps.map((step) => (
        <article key={`${step.stepOrder}-${step.nodeKey}`} style={stepCardStyle}>
          <div style={stepHeaderStyle}>
            <div>
              <p style={stepMetaStyle}>Step {step.stepOrder}</p>
              <h3 style={stepTitleStyle}>
                {step.nodeKey} · {step.nodeType}
              </h3>
            </div>
            <span style={statusBadge(step.status)}>{step.status}</span>
          </div>

          <dl style={detailGridStyle}>
            <div>
              <dt style={labelStyle}>Started</dt>
              <dd style={valueStyle}>{formatTime(step.startedAt)}</dd>
            </div>
            <div>
              <dt style={labelStyle}>Finished</dt>
              <dd style={valueStyle}>{formatTime(step.finishedAt)}</dd>
            </div>
          </dl>

          <PayloadBlock label="Input Payload" value={step.inputPayload} />
          <PayloadBlock label="Output Payload" value={step.outputPayload} />

          {step.errorMessage ? (
            <div style={errorBoxStyle}>
              <strong style={{ display: 'block', marginBottom: 6 }}>Error</strong>
              <span>{step.errorMessage}</span>
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function PayloadBlock({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={payloadSectionStyle}>
      <p style={labelStyle}>{label}</p>
      <pre style={payloadStyle}>{value ?? '-'}</pre>
    </div>
  );
}

function formatTime(value: string | null): string {
  if (!value) return '-';
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

function statusBadge(status: string): CSSProperties {
  const tone = status === 'FAILED'
    ? { background: '#fff1ef', color: '#ab3d33' }
    : status === 'SUCCEEDED'
      ? { background: '#ebf8f1', color: '#1e6955' }
      : { background: '#f5efe5', color: '#7a664d' };

  return {
    ...tone,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.6,
    padding: '8px 12px',
    textTransform: 'uppercase'
  };
}

const listStyle: CSSProperties = {
  display: 'grid',
  gap: 16
};

const emptyStyle: CSSProperties = {
  color: '#587069',
  margin: 0
};

const stepCardStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(33, 94, 79, 0.12)',
  borderRadius: 22,
  display: 'grid',
  gap: 16,
  padding: 20
};

const stepHeaderStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: 16,
  justifyContent: 'space-between'
};

const stepMetaStyle: CSSProperties = {
  color: '#8a7557',
  fontSize: 12,
  letterSpacing: 1,
  margin: 0,
  textTransform: 'uppercase'
};

const stepTitleStyle: CSSProperties = {
  color: '#17352f',
  margin: '5px 0 0'
};

const detailGridStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  margin: 0
};

const labelStyle: CSSProperties = {
  color: '#587069',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.8,
  margin: 0,
  textTransform: 'uppercase'
};

const valueStyle: CSSProperties = {
  color: '#17352f',
  margin: '6px 0 0'
};

const payloadSectionStyle: CSSProperties = {
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
