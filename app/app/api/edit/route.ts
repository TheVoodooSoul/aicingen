import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { handleRunPodError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    const response = await fetch(`${API_CONFIG.RUNPOD_ENDPOINT_URL}/edit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.RUNPOD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw await response.json();
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return handleRunPodError(error);
  }
}
