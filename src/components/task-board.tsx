
'use client';

import { useState } from 'react';
import type { Task } from '@/types/task';
import { TaskCard } from './task-card';
import { TaskDialog } from './task-dialog';
import { Skeleton } from './ui/skeleton';

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

  if (loading) {
    return (
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
      <TaskDialog
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        task={editingTask}
      />
    </>
  );
}
