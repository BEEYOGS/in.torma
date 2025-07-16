
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { Task, TaskStatus } from '@/types/task';
import { deleteTask } from '@/services/task-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import {utcToZonedTime} from 'date-fns-tz';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

const statusGlow: Record<TaskStatus, string> = {
  'Proses Desain': 'from-primary/50 via-transparent to-secondary/50',
  'Menunggu Konfirmasi': 'from-orange-400/50 via-transparent to-orange-500/20',
  'Selesai': 'from-green-500/50 via-transparent to-green-600/20',
};

const statusBorder: Record<TaskStatus, string> = {
  'Proses Desain': 'border-white/10 hover:border-primary/50',
  'Menunggu Konfirmasi': 'border-orange-400/20 hover:border-orange-400/50',
  'Selesai': 'border-green-500/20 hover:border-green-500/50',
}

export function TaskCard({ task, onEdit, onDragStart, onDragEnd }: TaskCardProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast({
        title: 'Tugas Dihapus',
        description: `Tugas untuk ${task.customerName} telah berhasil dihapus.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal Menghapus Tugas',
        description: 'Terjadi kesalahan saat menghapus tugas.',
      });
    }
  };
  
  const displayDate = task.dueDate ? utcToZonedTime(parseISO(task.dueDate), 'UTC') : null;

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      className={cn("mb-4 bg-black/20 backdrop-blur-lg border transition-all duration-300 group relative p-0 overflow-hidden", statusBorder[task.status])}
    >
      <div className={cn("absolute -inset-px bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg", statusGlow[task.status])}></div>
      <CardHeader className="relative p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <CardTitle className="text-base font-headline mb-1 text-foreground">
              {task.customerName}
            </CardTitle>
            <CardDescription className="text-sm">{task.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-sm">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Hapus</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="relative p-4 pt-0 flex justify-between items-center">
        {displayDate ? (
          <Badge variant="outline">
            {format(displayDate, 'dd MMM yyyy')}
          </Badge>
        ) : <div />}
        <Badge variant="secondary">{task.source}</Badge>
      </CardContent>
    </Card>
  );
}
