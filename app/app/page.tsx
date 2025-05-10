'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { OutputSection } from '@/components/ui/output-section';
import { LoraSelector } from '@/components/ui/lora-selector';
import { modelOptions, motionModules, outputTypes } from '@/lib/motion-modules';
import { useJobStatus } from '@/hooks/use-job-status';
import { toast } from 'sonner';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(modelOptions[0].value);
  const [selectedLora, setSelectedLora] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [frames, setFrames] = useState(30);
  const [motionModule, setMotionModule] = useState(motionModules[0].id);
  const [outputType, setOutputType] = useState(outputTypes[0].value);
  const [jobId, setJobId] = useState<string | null>(null);

  const { status, result, error } = useJobStatus(jobId);
  const isGenerating = status === 'PENDING' || status === 'IN_PROGRESS';

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('model', selectedModel);
      formData.append('motionModule', motionModule);
      formData.append('frames', frames.toString());
      formData.append('outputType', outputType);
      if (selectedLora) {
        formData.append('lora', selectedLora);
      }
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start generation');
      }

      setJobId(data.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate scene');
    }
  };

  const handleUpscale = async () => {
    toast.promise(
      fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: result }),
      }).then(res => {
        if (!res.ok) throw new Error('Failed to upscale');
        return res.json();
      }),
      {
        loading: 'Upscaling...',
        success: 'Upscaled successfully',
        error: 'Failed to upscale',
      }
    );
  };

  const handleInpaint = async () => {
    toast.promise(
      fetch('/api/inpaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: result }),
      }).then(res => {
        if (!res.ok) throw new Error('Failed to inpaint');
        return res.json();
      }),
      {
        loading: 'Inpainting...',
        success: 'Inpainting completed',
        error: 'Failed to inpaint',
      }
    );
  };

  const handleEdit = async () => {
    toast.promise(
      fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: result }),
      }).then(res => {
        if (!res.ok) throw new Error('Failed to edit');
        return res.json();
      }),
      {
        loading: 'Editing...',
        success: 'Edit completed',
        error: 'Failed to edit',
      }
    );
  };

  if (error) {
    toast.error(error);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Cinematic AI Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create stunning AI-generated action scenes with our advanced tools
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div 
            className="space-y-6 bg-card rounded-lg p-6 shadow-lg border border-border"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">LoRA Selection</label>
              <LoraSelector onSelect={setSelectedLora} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Scene Description</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full min-h-[120px] p-3 rounded-md border bg-card text-card-foreground"
                placeholder="Describe your action scene..."
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">
                {prompt.length}/500 characters
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Upload Reference</label>
              <FileUpload onFileSelect={setFile} />
            </div>
          </motion.div>

          <motion.div 
            className="space-y-6 bg-card rounded-lg p-6 shadow-lg border border-border"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Number of Frames</label>
                <Slider
                  value={[frames]}
                  onValueChange={([value]) => setFrames(value)}
                  max={120}
                  min={15}
                  step={1}
                />
                <div className="text-xs text-muted-foreground">
                  {frames} frames
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Motion Module</label>
                <Select value={motionModule} onValueChange={setMotionModule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a motion module" />
                  </SelectTrigger>
                  <SelectContent>
                    {motionModules.map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Output Type</label>
                <Select value={outputType} onValueChange={setOutputType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select output type" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isGenerating ? 'Generating...' : 'Generate Scene'}
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <OutputSection
            isLoading={isGenerating}
            result={result}
            resultType={outputType === 'gif' ? 'image' : 'video'}
            onUpscale={handleUpscale}
            onInpaint={handleInpaint}
            onEdit={handleEdit}
          />
        </motion.div>
      </motion.div>
    </main>
  );
}
