
'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createTask } from '@/ai/flows/create-task-flow';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { Task } from '@/types/task';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useSound } from '@/hooks/use-sound';

interface AiTaskCreatorProps {
  onTaskCreated: (prefillData: Partial<Task>) => void;
  children?: React.ReactNode;
}

export function AiTaskCreator({ onTaskCreated, children }: AiTaskCreatorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const { toast } = useToast();
  const playOpenDialogSound = useSound('https://www.myinstants.com/media/sounds/swoosh-1.mp3', 0.5);

  const handleAiSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setAiAnswer(null);

    try {
      const result = await createTask({ userInput });
      if (result.isTask && result.taskDetails) {
        const { customerName, description, dueDate } = result.taskDetails;
        const dataToPrefill: Partial<Task & {dueDate?: string | Date}> = {};
        if (customerName) dataToPrefill.customerName = customerName;
        if (description) dataToPrefill.description = description;
        if (dueDate) dataToPrefill.dueDate = dueDate;
        
        setIsDialogOpen(false); 
        onTaskCreated(dataToPrefill);
      } else if (result.answer) {
        setAiAnswer(result.answer);
      } else {
        setAiAnswer("Maaf, saya tidak dapat memproses permintaan Anda saat ini.");
      }
    } catch (error) {
      console.error("AI Task Creator Error:", error);
      toast({
        variant: 'destructive',
        title: 'AI Assistant Error',
        description: 'Terjadi kesalahan saat berkomunikasi dengan asisten AI.',
      });
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if(!open) {
      setUserInput('');
      setAiAnswer(null);
    } else {
        playOpenDialogSound();
    }
    setIsDialogOpen(open);
  }

  const DialogLayout = (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md max-w-[90vw] glass-card border-white/10">
        <DialogHeader>
            <DialogTitle className="font-headline">AI Assistant</DialogTitle>
            <DialogDescription>
            Buat tugas menggunakan bahasa alami atau ajukan pertanyaan.
            </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
            <Textarea
            placeholder="cth: buatkan tugas untuk Rinan Corp, desain ulang spanduk, deadline besok"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={4}
            className="bg-secondary/50 border-white/10"
            />
            {aiAnswer && (
            <Alert className="bg-secondary/50 border-white/10">
                <AlertTitle>Jawaban AI</AlertTitle>
                <AlertDescription>{aiAnswer}</AlertDescription>
            </Alert>
            )}
        </div>
        <DialogFooter>
            <Button onClick={handleAiSubmit} disabled={isLoading} className="w-full">
            {isLoading ? 'Memproses...' : 'Proses'}
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
  
  const handleTriggerClick = () => {
    handleOpenChange(true);
  }

  // If children are provided, use them as the trigger
  if (children) {
    return (
        <>
            <div 
              onClick={handleTriggerClick} 
              className="cursor-pointer h-auto w-full flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground p-2"
            >
                {children}
            </div>
            {DialogLayout}
      </>
    )
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTriggerClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <Wand2 />
            <span className="sr-only">AI Assistant</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI Assistant</p>
        </TooltipContent>
      </Tooltip>
      {DialogLayout}
    </>
  );
}
