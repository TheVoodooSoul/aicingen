'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './button';
import Image from 'next/image';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

export function FileUpload({ onFileSelect, accept = "image/*, video/*" }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileSelect(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setFileType(file.type.startsWith('image/') ? 'image' : 'video');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileType(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] bg-gray-50 dark:bg-gray-900">
        {!preview ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept={accept}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Drag and drop or click to upload
            </p>
          </>
        ) : (
          <div className="relative w-full h-full">
            {fileType === 'image' ? (
              <Image
                src={preview}
                alt="Preview"
                className="rounded-lg object-contain"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <video
                src={preview}
                className="w-full h-full rounded-lg"
                controls
              />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
