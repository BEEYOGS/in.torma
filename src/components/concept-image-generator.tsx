
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateConceptImage } from '@/ai/flows/generate-concept-image-flow';
import { Loader2, Sparkles } from 'lucide-react';
import type { Task } from '@/types/task';

interface ConceptImageGeneratorProps {
  task: Task;
  children: (openDialog: () => void) => React.ReactNode;
}

export function ConceptImageGenerator({ task, children }: ConceptImageGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if(open) {
        handleGenerateImage();
    } else {
        setImageUrl(null);
        setIsLoading(false);
    }
  }

  const openDialog = () => {
    handleOpenChange(true);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children(openDialog)}
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
