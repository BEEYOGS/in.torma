
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

interface AiTaskCreatorProps {
  onTaskCreated: (prefillData: Partial<Task>) => void;
}

export function AiTaskCreator({ onTaskCreated }: AiTaskCreatorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const { toast } = useToast();

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
        
        // Close the AI dialog first
        setIsDialogOpen(false); 
        // Then call the callback to open the main TaskDialog with prefilled data
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
    }
    setIsDialogOpen(open);
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
        <Wand2 className="mr-2 h-4 w-4" />
        AI Assistant
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="font-headline">AI Assistant</DialogTitle>
            <DialogDescription>
              Buat tugas menggunakan bahasa alami atau ajukan pertanyaan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="cth: buatkan tugas untuk Rinan Corp, desain ulang spanduk, deadline besok"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={4}
            />
            {aiAnswer && (
              <Alert>
                <AlertTitle>Jawaban AI</AlertTitle>
                <AlertDescription>{aiAnswer}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleAiSubmit} disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Kirim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
