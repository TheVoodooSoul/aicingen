import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { handleRunPodError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const response = await fetch(
      `${API_CONFIG.RUNPOD_ENDPOINT_URL}/status/${params.jobId}`,
      {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.RUNPOD_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw await response.json();
    }

    const data = await response.json();
    
    return NextResponse.json({
      id: params.jobId,
      status: data.status,
      output: data.output,
    });
    
  } catch (error) {
    return handleRunPodError(error);
  }
}
