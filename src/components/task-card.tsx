
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Pencil, Sparkles, Trash2, MoreVertical, AlertCircle } from 'lucide-react';
import type { Task, TaskStatus } from '@/types/task';
import { deleteTask } from '@/services/task-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { ConceptImageGenerator } from './concept-image-generator';
import { TaskDescriptionSpeaker } from './task-description-speaker';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useState } from 'react';
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
    color: 'hsl(24, 95%, 53%)', // orange-500
  },
  'Proses ACC': {
    text: 'text-sky-500',
    hoverOutline: 'hover:outline-sky-500/50',
    color: 'hsl(204, 90%, 53%)', // sky-500
  },
  'Selesai': {
    text: 'text-green-500',
    hoverOutline: 'hover:outline-green-500/50',
    color: 'hsl(142, 71%, 45%)', // green-500
  },
};

export const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, isOverlay, ...props }, ref) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
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
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const target = e.target as HTMLElement;
    if (target.closest('button, [role="menu"], [role="menuitem"]')) {
      return;
    }
    onEdit?.(task);
  };
  
  const HeaderContent = () => (
    <div 
        className={cn("flex-grow min-w-0", isMobile && "cursor-pointer")}
        onClick={() => { if(isMobile) onEdit?.(task) }}
    >
        <CardTitle className="text-base font-headline mb-1 text-foreground truncate">
            {task.customerName}
        </CardTitle>
        <CardDescription className="text-sm truncate">{task.description}</CardDescription>
    </div>
  )

  const MobileActions = () => (
    <div className="flex-shrink-0">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
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
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
        className={cn(
        "relative group overflow-hidden bg-card/20 border border-white/10 transition-all duration-300 outline outline-1 outline-transparent",
        !isMobile && "cursor-pointer",
        statusStyles[task.status].hoverOutline,
        isOverlay && "ring-2 ring-primary"
    )}>
        <CardHeader className="relative p-4 pb-2">
            <div className="flex justify-between items-start gap-2">
                <HeaderContent />
                {isMobile && <MobileActions />}
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
                 <TaskDescriptionSpeaker task={task} />
                 <span
                    className={cn(
                        "text-xs font-medium",
                        statusStyles[task.status].text
                    )}
                 >
                    {task.status}
                </span>
            </div>
        </CardContent>
    </Card>
  )

  return (
    <AlertDialog>
        <Dialog open={isConceptDialogOpen} onOpenChange={setIsConceptDialogOpen}>
            <div ref={ref} {...props} onClick={handleCardClick}>
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
