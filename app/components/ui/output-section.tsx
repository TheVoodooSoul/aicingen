'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { Paintbrush, ArrowUpCircle, Edit, Download } from 'lucide-react';
import Image from 'next/image';

interface OutputSectionProps {
  result: string | null;
  resultType: 'image' | 'video';
  isLoading: boolean;
  onUpscale: () => void;
  onInpaint: () => void;
  onEdit: () => void;
}

export function OutputSection({
  result,
  resultType,
  isLoading,
  onUpscale,
  onInpaint,
  onEdit
}: OutputSectionProps) {
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [isInpainting, setIsInpainting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpscale = async () => {
    setIsUpscaling(true);
    try {
      await onUpscale();
    } finally {
      setIsUpscaling(false);
    }
  };

  const handleInpaint = async () => {
    setIsInpainting(true);
    try {
      await onInpaint();
    } finally {
      setIsInpainting(false);
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);
    try {
      await onEdit();
    } finally {
      setIsEditing(false);
    }
  };

  if (!result || isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg p-6 border border-border shadow-lg space-y-4"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
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

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleUpscale}
          disabled={isUpscaling}
          className="flex items-center gap-2"
        >
          <ArrowUpCircle className="w-4 h-4" />
          {isUpscaling ? 'Upscaling...' : 'Upscale'}
        </Button>

        <Button
          onClick={handleInpaint}
          disabled={isInpainting}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Paintbrush className="w-4 h-4" />
          {isInpainting ? 'Inpainting...' : 'Inpaint'}
        </Button>

        <Button
          onClick={handleEdit}
          disabled={isEditing}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? 'Editing...' : 'Edit'}
        </Button>

        <Button
          onClick={() => {
            const link = document.createElement('a');
            link.href = result;
            link.download = `forge-${Date.now()}.${resultType === 'video' ? 'mp4' : 'png'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    </motion.div>
  );
}
