'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { PlayCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dailySummary } from '@/ai/flows/daily-summary-flow';

export function DailyBriefing() {
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleGetBriefing = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd pass a real user ID
      const result = await dailySummary({ userId: '12345' });
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
    <Button variant="outline" onClick={handleGetBriefing} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <PlayCircle className="mr-2 h-4 w-4" />
      )}
      Rangkuman Harian
    </Button>
  );
}
