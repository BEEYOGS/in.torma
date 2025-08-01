'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, GripVertical, Sparkles, Trash2 } from 'lucide-react';
import type { Task, TaskStatus } from '@/types/task';
import { deleteTask } from '@/services/task-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { ConceptImageGenerator } from './concept-image-generator';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskDescriptionSpeaker } from './task-description-speaker';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  isOverlay?: boolean;
}

const statusStyles: Record<TaskStatus, { indicator: string, text: string }> = {
  'Proses Desain': { indicator: 'bg-primary', text: 'text-primary' },
  'Proses ACC': { indicator: 'bg-orange-400', text: 'text-orange-400' },
  'Selesai': { indicator: 'bg-green-500', text: 'text-green-500' },
};

export function TaskCard({ task, onEdit, isOverlay }: TaskCardProps) {
  const { toast } = useToast();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging && !isOverlay ? 0.3 : 1,
  };

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
  
  const displayDate = task.dueDate ? parseISO(task.dueDate) : null;
  
  if (displayDate) {
    displayDate.setMinutes(displayDate.getMinutes() + displayDate.getTimezoneOffset());
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
        <Card className={cn(
          "relative group overflow-hidden bg-secondary/30 backdrop-blur-sm border border-border/20 transition-all duration-300 hover:border-border/50 hover:shadow-lg",
          isOverlay && "ring-2 ring-primary"
        )}>
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div>
            <CardHeader className="relative p-4 pb-2">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-grow">
                <CardTitle className="text-base font-headline mb-1 text-foreground">
                    {task.customerName}
                </CardTitle>
                <CardDescription className="text-sm">{task.description}</CardDescription>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TaskDescriptionSpeaker task={task} />
                    <ConceptImageGenerator task={task}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary/80 hover:text-primary">
                        <Sparkles className="h-4 w-4" />
                        </Button>
                    </ConceptImageGenerator>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit?.(task)}
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
            </div>
            </CardHeader>
            <CardContent className="relative p-4 pt-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <button {...listeners} className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                </button>
                <span className={cn("text-xs font-medium animate-status-pulse", statusStyles[task.status].text)}>{task.status}</span>
            </div>
            <div className="flex items-center gap-2">
                {displayDate ? (
                <Badge variant="outline">
                    {format(displayDate, 'dd MMM yyyy')}
                </Badge>
                ) : <div />}
                <Badge variant="secondary">{task.source}</Badge>
            </div>
            </CardContent>
        </div>
        </Card>
    </div>
  );
}
