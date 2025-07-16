
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

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const statusIndicator: Record<TaskStatus, string> = {
  'Proses Desain': 'bg-primary',
  'Menunggu Konfirmasi': 'bg-orange-400',
  'Selesai': 'bg-green-500',
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toast } = useToast();

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
    // Correct for timezone offset by adding the offset in minutes
    displayDate.setMinutes(displayDate.getMinutes() + displayDate.getTimezoneOffset());
  }


  return (
    <Card className="relative overflow-hidden bg-secondary/10 backdrop-blur-sm border border-border/10 transition-all duration-300 hover:border-border/50 hover:shadow-lg">
      <div className={cn("absolute left-0 top-0 h-full w-1.5", statusIndicator[task.status])}></div>
      <div className="pl-4">
        <CardHeader className="relative p-4 pb-2">
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
                  className="h-8 w-8 flex-shrink-0 -mr-2 -mt-2"
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
        <CardContent className="relative p-4 pt-2 flex justify-between items-center">
          {displayDate ? (
            <Badge variant="outline">
              {format(displayDate, 'dd MMM yyyy')}
            </Badge>
          ) : <div />}
          <Badge variant="secondary">{task.source}</Badge>
        </CardContent>
      </div>
    </Card>
  );
}
