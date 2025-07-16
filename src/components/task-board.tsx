
'use client';

import { useState, useMemo } from 'react';
import type { Task } from '@/types/task';
import { TaskCard } from './task-card';
import { TaskDialog } from './task-dialog';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ArrowUpDown } from 'lucide-react';
import { parseISO } from 'date-fns';

interface TaskBoardProps {
    tasks: Task[];
    loading: boolean;
}

export function TaskBoard({ tasks, loading }: TaskBoardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sortOption, setSortOption] = useState('default');
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const sortedTasks = useMemo(() => {
    const statusOrder: Record<string, number> = {
      'Proses Desain': 1,
      'Proses ACC': 2,
      'Selesai': 3,
    };
    
    return [...tasks].sort((a, b) => {
        switch (sortOption) {
            case 'dueDateAsc':
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime();
            case 'dueDateDesc':
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return parseISO(b.dueDate).getTime() - parseISO(a.dueDate).getTime();
            case 'customerNameAsc':
                return a.customerName.localeCompare(b.customerName);
            case 'customerNameDesc':
                return b.customerName.localeCompare(a.customerName);
            case 'status':
                return statusOrder[a.status] - statusOrder[b.status];
            default:
                // The default order is whatever Firebase returns, which is often by creation time.
                // We don't need to do anything extra.
                return 0;
        }
    });
  }, [tasks, sortOption]);

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
        <div className="flex justify-end mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="sr-only">Urutkan</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Urutkan berdasarkan</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                  <DropdownMenuRadioItem value="default">Urutan Awal</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dueDateAsc">Jatuh Tempo (Terdekat)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dueDateDesc">Jatuh Tempo (Terjauh)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="customerNameAsc">Konsumen (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="customerNameDesc">Konsumen (Z-A)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              taskNumber={index + 1}
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
