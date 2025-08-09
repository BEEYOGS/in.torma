
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { Loader2, Volume2, X } from 'lucide-react';
import type { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskDescriptionSpeakerProps {
  task: Task;
  isMobile?: boolean;
}

export function TaskDescriptionSpeaker({ task, isMobile = false }: TaskDescriptionSpeakerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlaySound = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    if (audio) {
      audio.pause();
      setAudio(null);
      return;
    }

    setIsLoading(true);

    try {
      const result = await textToSpeech(task.description);
      if (result.media) {
        const audioInstance = new Audio(result.media);
        setAudio(audioInstance);
        audioInstance.play();
        audioInstance.onended = () => {
            setAudio(null);
            setIsLoading(false);
        };
        // Note: setIsLoading(false) is called in onended
      } else {
        throw new Error("No audio media returned from TTS flow.");
      }
    } catch (error) {
      console.error('Task Description Speaker Error:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Memutar Suara',
        description: 'Terjadi kesalahan saat membuat audio deskripsi.',
      });
      setIsLoading(false);
    }
  };

  return (
    <Button 
        variant="ghost" 
        size="icon" 
        className={cn("h-8 w-8 text-sky-400/80 hover:text-sky-400", isMobile && "w-auto px-2 justify-start")}
        onClick={handlePlaySound}
        disabled={isLoading}
    >
      {audio ? <X className="h-4 w-4" /> : (isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />)}
      {isMobile && <span className="ml-2 text-xs">Dengar</span>}
    </Button>
  );
}
