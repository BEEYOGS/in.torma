'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dailySummary } from '@/ai/flows/daily-summary-flow';
import type { Task } from '@/types/task';
import { SidebarMenuButton } from './ui/sidebar';

interface DailyBriefingProps {
  tasks: Task[];
}

export function DailyBriefing({ tasks }: DailyBriefingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleGetBriefing = async () => {
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

  return (
    <SidebarMenuButton
      onClick={handleGetBriefing}
      disabled={isLoading}
      className="w-full justify-start"
      tooltip="Rangkuman Harian"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <Users />}
      <span className="group-data-[collapsible=icon]:hidden">Rangkuman Harian</span>
    </SidebarMenuButton>
  );
}
