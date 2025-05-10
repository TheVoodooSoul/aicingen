'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { loraOptions } from '@/lib/lora-options';

interface LoraSelectorProps {
  onSelect: (loraId: string) => void;
}

export function LoraSelector({ onSelect }: LoraSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLoras = loraOptions.filter(lora =>
    lora.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lora.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search LoRAs..."
          className="w-full pl-9 pr-3 py-2 rounded-md border bg-card text-card-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Select onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a LoRA" />
        </SelectTrigger>
        <SelectContent>
          {filteredLoras.map(lora => (
            <SelectItem
              key={lora.id}
              value={lora.id}
              className="flex flex-col items-start py-2"
            >
              <span className="font-medium">{lora.name}</span>
              <span className="text-xs text-muted-foreground">
                {lora.description}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
