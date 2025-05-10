import { API_CONFIG } from './api-config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const toBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]); // Remove data URL prefix
    };
    reader.onerror = (error) => reject(error);
  });
};

export const validateFile = (file: File) => {
  if (file.size > API_CONFIG.MAX_FILE_SIZE) {
    throw new ApiError('File size exceeds limit', 400, 'FILE_TOO_LARGE');
  }
  
  if (!API_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new ApiError('File type not supported', 400, 'INVALID_FILE_TYPE');
  }
};

export const handleRunPodError = (error: any): never => {
  console.error('RunPod API Error:', error);
  
  if (error.response?.status === 429) {
    throw new ApiError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
  }
  
  if (error.response?.status === 401) {
    throw new ApiError('Invalid API key', 401, 'INVALID_API_KEY');
  }
  
  throw new ApiError(
    error.message || 'An error occurred while processing your request',
    error.response?.status || 500
  );
};
