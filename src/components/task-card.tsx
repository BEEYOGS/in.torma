
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

const statusStyles: Record<TaskStatus, { text: string; hoverOutline: string, color: string }> = {
  'Proses Desain': {
    text: 'text-orange-500',
    hoverOutline: 'hover:outline-orange-500/50',
    color: 'rgb(249 115 22)', // orange-500
  },
  'Proses ACC': {
    text: 'text-sky-500',
    hoverOutline: 'hover:outline-sky-500/50',
    color: 'rgb(14 165 233)', // sky-500
  },
  'Selesai': {
    text: 'text-green-500',
    hoverOutline: 'hover:outline-green-500/50',
    color: 'rgb(34 197 94)', // green-500
  },
};

const useTypingAnimation = (text: string) => {
    const [displayedText, setDisplayedText] = useState('');
    
    // Simple implementation: just show the full text.
    // The animation was causing issues with re-renders.
    useEffect(() => {
      setDisplayedText(text);
    }, [text]);

    return displayedText;
}

export const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, isOverlay, ...props }, ref) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const animatedStatus = useTypingAnimation(task.status);
  const [isConceptDialogOpen, setIsConceptDialogOpen] = useState(false);

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

  const DesktopActions = () => (
    <div className={cn(
        "absolute top-2 right-2 flex items-center gap-1 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"
    )}>
        <DialogTrigger asChild>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary/80 hover:text-primary pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <Sparkles className="h-4 w-4" />
            </Button>
        </DialogTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 pointer-events-auto"
          onClick={(e) => {
              e.stopPropagation();
              onEdit?.(task)
          }}
        >
            <Pencil className="h-4 w-4" />
        </Button>
        <AlertDialogTrigger asChild>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive/70 hover:text-destructive pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </AlertDialogTrigger>
    </div>
  )

  const MobileActions = () => (
    <div className="flex-shrink-0">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
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
                
                <DropdownMenuItem 
                    onSelect={(e) => { 
                        e.preventDefault(); 
                        setIsConceptDialogOpen(true); 
                    }}
                >
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    <span>Konsep Visual AI</span>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Hapus</span>
                    </DropdownMenuItem>
                </AlertDialogTrigger>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )

  const cardContent = (
    <Card 
        onClick={() => !isMobile && onEdit?.(task)}
        className={cn(
        "relative group overflow-hidden bg-card/20 border border-white/10 transition-all duration-300 outline outline-1 outline-transparent cursor-pointer",
        statusStyles[task.status].hoverOutline,
        isOverlay && "ring-2 ring-primary"
    )}>
        <CardHeader className="relative p-4 pb-2">
            <div className="flex justify-between items-start gap-2">
                <div className="flex-grow min-w-0" onClick={(e) => { isMobile && e.stopPropagation(); onEdit?.(task); }}>
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
                      {format(displayDate, 'dd/MM/yyyy')}
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
                    "text-xs font-medium min-w-[80px] text-left transition-opacity duration-300",
                    statusStyles[task.status].text,
                    !isOverlay && "typing-cursor"
                 )}>
                    {animatedStatus || ''}
                </span>
            </div>
        </CardContent>
    </Card>
  )

  return (
    <AlertDialog>
        <Dialog open={isConceptDialogOpen} onOpenChange={setIsConceptDialogOpen}>
            <div ref={ref} {...props}>
                {cardContent}
            </div>
            {isConceptDialogOpen && <ConceptImageGenerator task={task} />}
        </Dialog>
        <AlertDialogContent className="glass-card">
            <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus tugas secara permanen dari penyimpanan.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Lanjutkan</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
});

TaskCard.displayName = "TaskCard";
