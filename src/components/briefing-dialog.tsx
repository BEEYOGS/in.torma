
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, UserCog, Bot, Equalizer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dailySummary } from '@/ai/flows/daily-summary-flow';
import type { Task } from '@/types/task';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';

interface DailyBriefingDialogProps {
  tasks: Task[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type Speaker = 'Manager' | 'Asisten';

interface TranscriptLine {
  speaker: Speaker;
  text: string;
}

const parseTranscript = (transcript: string): TranscriptLine[] => {
  return transcript.split('\n').map(line => {
    const [speaker, ...textParts] = line.split(': ');
    return {
      speaker: speaker.trim() as Speaker,
      text: textParts.join(': '),
    };
  }).filter(line => line.speaker && line.text);
};

export function DailyBriefingDialog({ tasks, isOpen, onOpenChange }: DailyBriefingDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const { toast } = useToast();

  const handleGetBriefing = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setTranscriptLines([]);

    try {
      const activeTasks = tasks.filter(task => task.status !== 'Selesai');
      const result = await dailySummary({ tasks: activeTasks });

      if (result.audioUri && result.transcript) {
        setTranscriptLines(parseTranscript(result.transcript));
        const audioInstance = new Audio(result.audioUri);
        setAudio(audioInstance);
        audioInstance.play();
        setIsPlaying(true);
        audioInstance.onended = () => {
            setIsPlaying(false);
            setAudio(null);
        }
      } else {
        throw new Error("No audio media returned.");
      }
    } catch (error: any) {
      console.error('Daily Briefing Error:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Rangkuman',
        description: `Terjadi kesalahan saat membuat rangkuman harian: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleGetBriefing();
    } else {
      // Cleanup when dialog is closed
      if (audio) {
        audio.pause();
        setAudio(null);
        setIsPlaying(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  
  const SpeakerAvatar = ({ speaker, isPlaying }: { speaker: Speaker, isPlaying: boolean }) => (
    <Avatar className="h-12 w-12 border-2 border-white/10">
        <AvatarFallback className={cn(
            "bg-secondary/50",
            speaker === 'Manager' && 'text-primary',
            speaker === 'Asisten' && 'text-sky-400'
        )}>
            {isPlaying ? (
                <Equalizer className="w-5 h-5 animate-pulse" />
            ) : (
                speaker === 'Manager' ? <UserCog className="w-6 h-6"/> : <Bot className="w-6 h-6"/>
            )}
        </AvatarFallback>
    </Avatar>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[90vw] glass-card border-white/10 flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Rangkuman Harian</DialogTitle>
          <DialogDescription>
            AI sedang membacakan ringkasan tugas aktif Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p>AI sedang menyiapkan ringkasan...</p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4 -mr-4">
              <div className="space-y-6">
                {transcriptLines.map((line, index) => (
                   <div key={index} className={cn(
                       "flex items-start gap-3",
                       line.speaker === 'Asisten' && "flex-row-reverse"
                   )}>
                       <SpeakerAvatar speaker={line.speaker} isPlaying={isPlaying} />
                       <div className={cn(
                           "relative rounded-lg p-3 max-w-[80%] bg-secondary/50",
                           line.speaker === 'Manager' ? 'rounded-tl-none' : 'rounded-tr-none'
                       )}>
                           <p className="text-sm text-foreground">{line.text}</p>
                       </div>
                   </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
