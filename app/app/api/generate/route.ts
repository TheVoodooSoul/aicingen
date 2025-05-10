import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { ApiError, toBase64, validateFile, handleRunPodError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const model = formData.get('model') as string;
    const motionModule = formData.get('motionModule') as string;
    const frames = Number(formData.get('frames'));
    const outputType = formData.get('outputType') as string;
    const file = formData.get('file') as File | null;

    if (!prompt) {
      throw new ApiError('Prompt is required', 400, 'MISSING_PROMPT');
    }

    let base64File: string | undefined;
    if (file) {
      validateFile(file);
      base64File = await toBase64(file);
    }

    const response = await fetch(API_CONFIG.RUNPOD_ENDPOINT_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.RUNPOD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          prompt,
          model,
          motion_module: motionModule,
          num_frames: frames,
          output_type: outputType,
          reference_image: base64File,
          webhook: API_CONFIG.RUNPOD_WEBHOOK_URL,
        },
      }),
    });

    if (!response.ok) {
      throw await response.json();
    }

    const data = await response.json();
    
    return NextResponse.json({
      id: data.id,
      status: 'PENDING',
    });
    
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }
    return handleRunPodError(error);
  }
}
