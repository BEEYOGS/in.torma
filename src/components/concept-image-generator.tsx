
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateConceptImage } from '@/ai/flows/generate-concept-image-flow';
import { Loader2 } from 'lucide-react';
import type { Task } from '@/types/task';

interface ConceptImageGeneratorProps {
  task: Task;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConceptImageGenerator({ task, isOpen, onOpenChange }: ConceptImageGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    if (!task.description) return;
    setIsLoading(true);
    setImageUrl(null);
    try {
      const result = await generateConceptImage({ description: task.description });
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      } else {
        throw new Error('No image URL returned from AI flow.');
      }
    } catch (error) {
      console.error('Concept Image Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Gambar',
        description: 'Terjadi kesalahan saat berkomunikasi dengan AI. Coba lagi nanti.',
      });
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      handleGenerateImage();
    } else {
      setImageUrl(null);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/80 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Konsep Visual AI</DialogTitle>
          <DialogDescription>
            Berikut adalah konsep visual yang dibuat oleh AI berdasarkan deskripsi: "{task.description}"
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex items-center justify-center min-h-[400px] bg-secondary/30 rounded-md overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                <p>AI sedang menggambar...</p>
            </div>
          )}
          {imageUrl && (
            <Image 
                src={imageUrl} 
                alt={`AI concept for ${task.description}`} 
                width={1024}
                height={1024}
                className="object-contain"
                unoptimized
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
