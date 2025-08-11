
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dailySummary } from '@/ai/flows/daily-summary-flow';
import type { Task } from '@/types/task';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface DailyBriefingProps {
  tasks: Task[];
  children: React.ReactElement;
}

export function DailyBriefing({ tasks, children }: DailyBriefingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleGetBriefing = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    try {
      const activeTasks = tasks.filter(task => task.status !== 'Selesai');
      const result = await dailySummary({ tasks: activeTasks });
      if (result.media) {
        const audioInstance = new Audio(result.media);
        setAudio(audioInstance);
        audioInstance.play();
        audioInstance.onended = () => setAudio(null);
      } else {
        throw new Error("No audio media returned.");
      }
    } catch (error) {
      console.error('Daily Briefing Error:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Rangkuman',
        description: 'Terjadi kesalahan saat membuat rangkuman harian.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const childProps = {
    onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        handleGetBriefing();
    },
    disabled: isLoading,
  }

  const trigger = React.cloneElement(children, childProps);

  if (React.isValidElement(children)) {
    return trigger;
  }

  // Fallback for non-element children or legacy usage
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGetBriefing}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Users />}
          <span className="sr-only">Rangkuman Harian</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Rangkuman Harian</p>
      </TooltipContent>
    </Tooltip>
  );
}

