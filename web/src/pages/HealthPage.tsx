import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { fetchHealth } from '../api/health';
import type { HealthResponse } from '../types/health';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export function HealthPage() {
  const [state, setState] = useState<LoadingState>('idle');
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState('loading');

      try {
        const result = await fetchHealth();
        if (cancelled) return;

        setHealth(result);
        setState('success');
      } catch (error) {
        if (cancelled) return;

        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setState('error');
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedTimestamp = useMemo(() => {
    if (!health?.timestamp) return '-';
    return dayjs(health.timestamp).format('YYYY-MM-DD HH:mm:ss');
  }, [health?.timestamp]);

  if (state === 'loading' || state === 'idle') {
    return <main style={pageStyle}>Loading health status...</main>;
  }

  if (state === 'error') {
    return (
      <main style={pageStyle}>
        <h1 style={titleStyle}>PaiAgent MVP - Health Check</h1>
        <p style={errorStyle}>Health check failed: {errorMessage}</p>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <h1 style={titleStyle}>PaiAgent MVP - Health Check</h1>
      <p>
        <strong>Status:</strong> {health?.status}
      </p>
      <p>
        <strong>Service:</strong> {health?.service}
      </p>
      <p>
        <strong>Timestamp:</strong> {formattedTimestamp}
      </p>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  margin: '48px auto',
  maxWidth: '720px',
  padding: '0 16px'
};

const titleStyle: React.CSSProperties = {
  marginBottom: '16px'
};

const errorStyle: React.CSSProperties = {
  color: '#b91c1c'
};
