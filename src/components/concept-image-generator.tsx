
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateConceptImage } from '@/ai/flows/generate-concept-image-flow';
import { Loader2, Wand2 } from 'lucide-react';
import type { Task } from '@/types/task';
import { Button } from './ui/button';

interface ConceptImageGeneratorProps {
  task: Task;
}

export function ConceptImageGenerator({ task }: ConceptImageGeneratorProps) {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <DialogContent className="sm:max-w-xl max-w-[90vw] bg-background/80 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Konsep Visual AI</DialogTitle>
          <DialogDescription>
            Buat konsep visual berdasarkan deskripsi tugas: "{task.description}"
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex items-center justify-center min-h-[300px] bg-secondary/30 rounded-md overflow-hidden">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary"/>
                <p className="text-sm">AI sedang menggambar...</p>
            </div>
          )}
          {!isLoading && imageUrl && (
            <Image 
                src={imageUrl} 
                alt={`AI concept for ${task.description}`} 
                width={1024}
                height={1024}
                className="object-contain"
                unoptimized
            />
          )}
          {!isLoading && !imageUrl && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Wand2 className="h-10 w-10"/>
              <p className="text-sm">Klik tombol di bawah untuk memulai.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleGenerateImage} disabled={isLoading} className="w-full">
            {isLoading ? 'Membuat...' : 'Buat Gambar Konsep'}
          </Button>
        </DialogFooter>
      </DialogContent>
  );
}
