export const API_CONFIG = {
  RUNPOD_API_KEY: process.env.RUNPOD_API_KEY,
  RUNPOD_ENDPOINT_URL: process.env.RUNPOD_ENDPOINT_URL,
  RUNPOD_WEBHOOK_URL: process.env.RUNPOD_WEBHOOK_URL,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
  POLL_INTERVAL: 2000, // 2 seconds
  MAX_POLL_TIME: 300000, // 5 minutes
};

export type JobStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface RunPodResponse {
  id: string;
  status: JobStatus;
  output?: {
    url?: string;
    error?: string;
  };
}
