'use client';

import { useState } from 'react';
import { Loader2, Download, Link as LinkIcon } from 'lucide-react';
import { Button } from './button';
import Image from 'next/image';
import { toast } from 'sonner';

interface ResultDisplayProps {
  isLoading: boolean;
  result: string | null;
  resultType: 'image' | 'video' | null;
}

export function ResultDisplay({ isLoading, result, resultType }: ResultDisplayProps) {
  const [copying, setCopying] = useState(false);

  const handleDownload = () => {
    if (!result) return;
    
    const link = document.createElement('a');
    link.href = result;
    link.download = `generated-${Date.now()}.${resultType === 'video' ? 'mp4' : 'gif'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async () => {
    if (!result) return;
    
    try {
      setCopying(true);
      await navigator.clipboard.writeText(result);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    } finally {
      setCopying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Generating your scene...
        </p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
        {resultType === 'image' ? (
          <Image
            src={result}
            alt="Generated result"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <video
            src={result}
            controls
            className="w-full h-full"
          />
        )}
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyLink}
          disabled={copying}
          className="flex items-center gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          {copying ? 'Copying...' : 'Copy Link'}
        </Button>
      </div>
    </div>
  );
}
