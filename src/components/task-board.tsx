
'use client';

import { useState } from 'react';
import type { Task, TaskStatus } from '@/types/task';
import { updateTaskStatus } from '@/services/task-service';
import { TaskCard } from './task-card';
import { TaskDialog } from './task-dialog';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

const columns: TaskStatus[] = ['Proses Desain', 'Menunggu Konfirmasi', 'Selesai'];

const columnStyles: Record<TaskStatus, string> = {
  'Proses Desain': 'border-primary/50',
  'Menunggu Konfirmasi': 'border-orange-400/50',
  'Selesai': 'border-green-500/50',
};


interface TaskBoardProps {
    tasks: Task[];
    loading: boolean;
}

export function TaskBoard({ tasks, loading }: TaskBoardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };
  
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.currentTarget.style.opacity = '0.5';
  };
  
  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
  }
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if(task && task.status !== newStatus) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-4 md:p-8">
        {columns.map(col => (
          <div key={col} className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 p-4 md:p-8">
        {columns.map((status) => (
          <div
            key={status}
            className="rounded-lg bg-secondary/10 backdrop-blur-sm border border-border/10 p-4 transition-colors duration-300"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
          >
            <h2 className={cn("text-xl font-headline font-semibold text-white mb-6 border-b-2 pb-2 transition-colors", columnStyles[status])}>
              {status}
            </h2>
            <div className="space-y-4 min-h-[200px]">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
      <TaskDialog
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        task={editingTask}
      />
    </>
  );
}
