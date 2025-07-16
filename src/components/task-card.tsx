
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import type { Task, TaskStatus } from '@/types/task';
import { deleteTask } from '@/services/task-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  taskNumber: number;
}

const statusStyles: Record<TaskStatus, { indicator: string, text: string }> = {
  'Proses Desain': { indicator: 'bg-primary', text: 'text-primary' },
  'Proses ACC': { indicator: 'bg-orange-400', text: 'text-orange-400' },
  'Selesai': { indicator: 'bg-green-500', text: 'text-green-500' },
};

export function TaskCard({ task, onEdit, taskNumber }: TaskCardProps) {
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
  
  // By parsing the date string and adding the timezone offset, we treat the date as local
  // instead of converting it to UTC, which avoids the "off-by-one-day" bug.
  const displayDate = task.dueDate ? parseISO(task.dueDate) : null;
  
  if (displayDate) {
    displayDate.setMinutes(displayDate.getMinutes() + displayDate.getTimezoneOffset());
  }

  return (
    <Card className="relative group overflow-hidden bg-secondary/10 backdrop-blur-sm border border-border/10 transition-all duration-300 hover:border-border/50 hover:shadow-lg">
      <div className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(task)}
                >
                  <Eye className="h-4 w-4" />
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
             <span className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                statusStyles[task.status].indicator
             )}>
                {taskNumber}
             </span>
             <span className={cn("text-xs font-medium", statusStyles[task.status].text)}>{task.status}</span>
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
  );
}
