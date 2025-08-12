
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Pencil, Sparkles, Trash2, MoreVertical, AlertCircle, User, Shield, Users, FileText } from 'lucide-react';
import type { Task, TaskSource, TaskStatus } from '@/types/task';
import { deleteTask } from '@/services/task-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { ConceptImageGenerator } from './concept-image-generator';
import { TaskDescriptionSpeaker } from './task-description-speaker';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogTrigger } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task;
  onEdit?: (task: Task) => void;
  isOverlay?: boolean;
}

const statusStyles: Record<TaskStatus, { text: string; color: string, gradFrom: string, gradTo: string, glow: string }> = {
  'Proses Desain': {
    text: 'text-orange-400',
    color: 'hsl(24, 95%, 53%)',
    gradFrom: 'from-orange-500/80',
    gradTo: 'to-orange-500/0',
    glow: 'hover:shadow-[0_0_20px_0] hover:shadow-orange-500/30'
  },
  'Proses ACC': {
    text: 'text-sky-400',
    color: 'hsl(204, 90%, 53%)',
    gradFrom: 'from-sky-500/80',
    gradTo: 'to-sky-500/0',
    glow: 'hover:shadow-[0_0_20px_0] hover:shadow-sky-500/30'
  },
  'Selesai': {
    text: 'text-green-400',
    color: 'hsl(142, 71%, 45%)',
    gradFrom: 'from-green-500/80',
    gradTo: 'to-green-500/0',
    glow: 'hover:shadow-[0_0_20px_0] hover:shadow-green-500/30'
  },
};

const sourceIcons: Record<TaskSource, React.ElementType> = {
    'N': FileText,
    'CS': User,
    'Admin': Shield,
    'G': Users
}

const useTypingAnimation = (text: string, speed = 150, pauseDuration = 1500) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const type = () => {
            if (currentIndex < text.length) {
                timeout = setTimeout(() => {
                    setDisplayText(prev => prev + text[currentIndex]);
                    setCurrentIndex(prev => prev + 1);
                }, speed);
            } else {
                // Pause and then restart
                timeout = setTimeout(() => {
                    setDisplayText('');
                    setCurrentIndex(0);
                }, pauseDuration);
            }
        };

        type();

        return () => clearTimeout(timeout);
    }, [currentIndex, text, speed, pauseDuration]);

    return displayText;
};

export const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, isOverlay, ...props }, ref) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isConceptDialogOpen, setIsConceptDialogOpen] = useState(false);
  const animatedStatus = useTypingAnimation(task.status);

  const handleDelete = async () => {
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
  
  const displayDate = task.dueDate ? new Date(`${task.dueDate}T00:00:00`) : null;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // On mobile, click is handled by header
    if (targetIsAction(e.target as HTMLElement)) return;
    onEdit?.(task);
  };

  const handleHeaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile && !targetIsAction(e.target as HTMLElement)) {
          onEdit?.(task);
      }
  }

  const targetIsAction = (target: HTMLElement) => {
    return target.closest('button, [role="menuitem"], [role="dialog"], [data-dnd-handle]');
  }

  const SourceIcon = sourceIcons[task.source] || FileText;

  const ActionsMenu = (
    <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
             <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                data-dnd-handle
             >
                <MoreVertical className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            align="end"
            className="bg-popover/80 backdrop-blur-lg border-white/10"
        >
            <DropdownMenuItem onSelect={() => onEdit?.(task)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit/Lihat Detail</span>
            </DropdownMenuItem>
            
            <DialogTrigger asChild>
                <DropdownMenuItem 
                    onSelect={(e) => { 
                        e.preventDefault(); 
                        setIsConceptDialogOpen(true); 
                    }}
                >
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    <span>Konsep Visual AI</span>
                </DropdownMenuItem>
            </DialogTrigger>

            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Hapus</span>
                </DropdownMenuItem>
            </AlertDialogTrigger>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  const cardContent = (
    <Card 
        className={cn(
        "relative group overflow-hidden glass-card transition-all duration-300",
        "hover:-translate-y-1",
        statusStyles[task.status].glow,
        !isMobile && "cursor-pointer",
        isOverlay && "ring-2 ring-primary shadow-2xl shadow-primary/50",
    )}>
        <div className={cn("absolute left-0 top-0 h-full w-1 bg-gradient-to-b", statusStyles[task.status].gradFrom, statusStyles[task.status].gradTo)} />
        <CardHeader className="relative p-4 pb-2" onClick={handleHeaderClick}>
            <div className="flex justify-between items-start gap-4">
                <div className="flex-grow min-w-0">
                    <CardTitle className="text-base font-headline mb-1 text-foreground truncate">
                        {task.customerName}
                    </CardTitle>
                    <CardDescription className="text-sm truncate">{task.description}</CardDescription>
                </div>
                <div className='flex-shrink-0' {...(isMobile ? {'data-dnd-handle': true} : {})}>
                    {ActionsMenu}
                </div>
            </div>
        </CardHeader>
        <CardContent className="relative p-4 pt-2 flex justify-between items-center">
             <div className="flex items-center gap-2">
                 <TaskDescriptionSpeaker task={task} />
                 <span
                    className={cn(
                        "text-xs font-medium min-h-[1.2em]", // min-h to prevent layout shift
                        statusStyles[task.status].text
                    )}
                     style={{ '--caret-color': statusStyles[task.status].color } as React.CSSProperties}
                 >
                    <span className='typing-cursor'>{animatedStatus}</span>
                </span>
            </div>

            <div className="flex items-center gap-2">
                {displayDate && (
                  <Badge variant="outline" className="border-white/20 bg-black/10">
                      {format(displayDate, 'dd/MM/yy')}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-black/20 text-muted-foreground p-1.5 h-auto">
                    <SourceIcon className="w-3.5 h-3.5" />
                </Badge>
            </div>
        </CardContent>
    </Card>
  )

  return (
    <AlertDialog>
        <Dialog open={isConceptDialogOpen} onOpenChange={setIsConceptDialogOpen}>
            <div ref={ref} {...props} onClick={handleCardClick} {...(!isMobile ? { "data-dnd-handle": true } : {})}>
                {cardContent}
            </div>
            {isConceptDialogOpen && <ConceptImageGenerator task={task} />}
        </Dialog>
        <AlertDialogContent className="glass-card max-w-[calc(100vw-2rem)] sm:max-w-md">
            <AlertDialogHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <AlertDialogTitle className="text-center">Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                    Tindakan ini akan menghapus tugas untuk <br/> <span className="font-medium text-foreground">{task.customerName}</span> secara permanen.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row justify-end gap-2 pt-4">
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({variant: 'default'}))}>Lanjutkan</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
});

TaskCard.displayName = "TaskCard";
