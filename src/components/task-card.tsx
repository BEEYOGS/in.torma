
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, GripVertical, Sparkles, Trash2, MoreVertical } from 'lucide-react';
import type { Task, TaskStatus } from '@/types/task';
import { deleteTask } from '@/services/task-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { ConceptImageGenerator } from './concept-image-generator';
import { TaskDescriptionSpeaker } from './task-description-speaker';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useState, useEffect, useCallback } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogTrigger } from './ui/dialog';

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task;
  onEdit?: (task: Task) => void;
  isOverlay?: boolean;
}

const statusStyles: Record<TaskStatus, { text: string; hover: string, color: string }> = {
  'Proses Desain': {
    text: 'text-orange-500',
    hover: 'hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10',
    color: 'rgb(249 115 22)', // orange-500
  },
  'Proses ACC': {
    text: 'text-sky-500',
    hover: 'hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10',
    color: 'rgb(14 165 233)', // sky-500
  },
  'Selesai': {
    text: 'text-green-500',
    hover: 'hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10',
    color: 'rgb(34 197 94)', // green-500
  },
};

const useTypingAnimation = (text: string) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    useEffect(() => {
        const typingSpeed = 150;
        const deletingSpeed = 75;
        const pauseDuration = 2000;

        let ticker: NodeJS.Timeout;

        const handleTyping = () => {
            const fullText = text;
            const updatedText = isDeleting
                ? fullText.substring(0, displayedText.length - 1)
                : fullText.substring(0, displayedText.length + 1);

            setDisplayedText(updatedText);

            if (!isDeleting && updatedText === fullText) {
                // Pause at end
                ticker = setTimeout(() => setIsDeleting(true), pauseDuration);
            } else if (isDeleting && updatedText === '') {
                // Finish deleting
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };
        
        ticker = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
        
        return () => clearTimeout(ticker);
    }, [displayedText, isDeleting, text, loopNum]);

    return displayedText;
}

export const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, isOverlay, ...props }, ref) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const animatedStatus = useTypingAnimation(task.status);
  const [isConceptDialogOpen, setIsConceptDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other click events
    try {
      await deleteTask(task.id);
      toast({
        title: 'Tugas Dihapus',
        description: `Tugas untuk ${task.customerName} telah berhasil dihapus.`,
      });
    } catch (error)
      {
      toast({
        variant: 'destructive',
        title: 'Gagal Menghapus Tugas',
        description: 'Terjadi kesalahan saat menghapus tugas.',
      });
    }
  };

  const handleDialogContentOpen = useCallback(() => {
    setIsGenerating(true);
  }, []);
  
  const displayDate = task.dueDate ? new Date(`${task.dueDate}T00:00:00`) : null;

  const DesktopActions = () => (
    <div className={cn(
        "absolute top-2 right-2 flex items-center gap-1 transition-opacity opacity-0 group-hover:opacity-100"
    )}>
        <TaskDescriptionSpeaker task={task} />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary/80 hover:text-primary">
                <Sparkles className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <ConceptImageGenerator task={task} onOpen={handleDialogContentOpen}/>
        </Dialog>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
              e.stopPropagation();
              onEdit?.(task)
          }}
        >
            <Pencil className="h-4 w-4" />
        </Button>
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive/70 hover:text-destructive"
            onClick={handleDelete}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    </div>
  )

  const MobileActions = () => (
    <div className="flex-shrink-0">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="bg-popover/80 backdrop-blur-lg border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <DropdownMenuItem onSelect={() => onEdit?.(task)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setIsConceptDialogOpen(true); }}>
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    <span>Konsep Visual AI</span>
                </DropdownMenuItem>

                 <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleDelete(e as any) }} className="text-destructive">
                     <Trash2 className="mr-2 h-4 w-4" />
                     <span>Hapus</span>
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )

  const cardContent = (
    <>
      <Card className={cn(
          "relative group overflow-hidden bg-card/20 border border-white/10 transition-all duration-300 shadow-md shadow-transparent",
          statusStyles[task.status].hover,
          isOverlay && "ring-2 ring-primary"
      )}>
          <CardHeader className="relative p-4 pb-2">
              <div className="flex justify-between items-start gap-2">
                  <div className="flex-grow min-w-0" onClick={() => onEdit?.(task)}>
                      <CardTitle className="text-base font-headline mb-1 text-foreground truncate">
                          {task.customerName}
                      </CardTitle>
                      <CardDescription className="text-sm truncate">{task.description}</CardDescription>
                  </div>
                  {isMobile ? <MobileActions /> : <DesktopActions />}
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {displayDate && (
                    <Badge variant="outline" className="border-white/20 bg-black/10">
                        {format(displayDate, 'dd MMM yyyy')}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-black/20 text-muted-foreground">{task.source}</Badge>
              </div>
          </CardHeader>
          <CardContent className="relative p-4 pt-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                  {!isMobile && (
                      <div {...props} className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground">
                          <GripVertical className="h-5 w-5" />
                      </div>
                  )}
                   <TaskDescriptionSpeaker task={task} isMobile={isMobile} />
                   <span
                      style={{ '--caret-color': statusStyles[task.status].color } as React.CSSProperties}
                      className={cn(
                      "text-xs font-medium min-w-[80px] text-left transition-opacity duration-300 typing-cursor",
                      statusStyles[task.status].text
                   )}>
                      {animatedStatus || ''}
                  </span>
              </div>
          </CardContent>
      </Card>
      
      <Dialog open={isConceptDialogOpen} onOpenChange={setIsConceptDialogOpen}>
        <ConceptImageGenerator task={task} onOpen={handleDialogContentOpen} />
      </Dialog>
    </>
  )

  return (
    <div ref={ref} {...props}>
        {cardContent}
    </div>
  );
});

TaskCard.displayName = "TaskCard";
