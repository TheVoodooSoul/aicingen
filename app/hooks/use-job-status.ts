import { useState, useEffect } from 'react';
import { API_CONFIG, JobStatus, RunPodResponse } from '@/lib/api-config';

export function useJobStatus(jobId: string | null) {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    let timeoutId: NodeJS.Timeout;
    let totalTime = 0;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/status/${jobId}`);
        const data: RunPodResponse = await response.json();

        setStatus(data.status);

        if (data.status === 'COMPLETED' && data.output?.url) {
          setResult(data.output.url);
          return true;
        }

        if (data.status === 'FAILED') {
          setError(data.output?.error || 'Generation failed');
          return true;
        }

        return false;
      } catch (error) {
        setError('Failed to check job status');
        return true;
      }
    };

    const poll = async () => {
      const isDone = await checkStatus();

      if (!isDone && totalTime < API_CONFIG.MAX_POLL_TIME) {
        timeoutId = setTimeout(poll, API_CONFIG.POLL_INTERVAL);
        totalTime += API_CONFIG.POLL_INTERVAL;
      } else if (!isDone) {
        setError('Generation timed out');
      }
    };

    poll();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [jobId]);

  return { status, result, error };
}
