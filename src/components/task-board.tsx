'use client';

import { useState, useMemo } from 'react';
import type { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './task-card';
import { Skeleton } from './ui/skeleton';
import { EmptyState } from './empty-state';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { Plus, Search } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { useSortable } from '@dnd-kit/sortable';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';


interface TaskBoardProps {
    tasks: Task[];
    loading: boolean;
    onEditTask: (task: Task) => void;
    onTasksReordered: (tasks: Task[]) => void;
    onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onAddTask: (status: TaskStatus) => void;
}

const statuses: TaskStatus[] = ['Proses Desain', 'Proses ACC', 'Selesai'];

export function TaskBoard({ 
    tasks, 
    loading, 
    onEditTask, 
    onTasksReordered, 
    onTaskStatusChange,
    onAddTask
}: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksById = useMemo(() => {
    return tasks.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
    }, {} as Record<string, Task>);
  }, [tasks]);

  const filteredTasks = useMemo(() => 
    tasks.filter(task => 
        task.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [tasks, searchTerm]);
    
  const tasksByStatus = useMemo(() => {
    const initialMap: Record<TaskStatus, Task[]> = {
        'Proses Desain': [],
        'Proses ACC': [],
        'Selesai': [],
    };

    return filteredTasks.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
    }, initialMap);
  }, [filteredTasks]);


  const findContainer = (id: string): TaskStatus | undefined => {
    if (statuses.includes(id as TaskStatus)) {
        return id as TaskStatus;
    }
    const task = Object.values(tasksById).find(t => t.id === id);
    return task?.status;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTask(tasksById[active.id as string]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
        setActiveTask(null);
        return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
        setActiveTask(null);
        return;
    }

    if (activeContainer !== overContainer) {
        // Handle drop in a different container
        onTaskStatusChange(activeId, overContainer);
    } else {
       // Handle reordering within the same container
       const itemsInColumn = tasksByStatus[activeContainer] || [];
       const oldIndex = itemsInColumn.findIndex((item) => item.id === activeId);
       const newIndex = itemsInColumn.findIndex((item) => item.id === overId);

       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
           const reorderedInColumn = arrayMove(itemsInColumn, oldIndex, newIndex);
           
           const newTasksOrder = tasks.map(task => {
                if (task.status === activeContainer) {
                    const reorderedTask = reorderedInColumn.find(t => t.id === task.id);
                    return reorderedTask || task;
                }
                return task;
           });

           // Create a map of the reordered tasks for quick lookup
           const orderedMap = new Map(reorderedInColumn.map((t, i) => [t.id, i]));

           // Sort the original tasks array based on the new order
           const reorderedFullList = [...tasks].sort((a, b) => {
               if (a.status !== activeContainer || b.status !== activeContainer) return 0;
               const posA = orderedMap.get(a.id);
               const posB = orderedMap.get(b.id);
               if (posA !== undefined && posB !== undefined) return posA - posB;
               if (posA !== undefined) return -1;
               if (posB !== undefined) return 1;
               return 0;
           });

           onTasksReordered(reorderedFullList);
       }
    }


    setActiveTask(null);
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }
  
  return (
    <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
    >
       <div className="flex justify-end items-center mb-6">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                  placeholder="Cari tugas..."
                  className="pl-10 w-64"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
              />
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {statuses.map(status => (
            <Column
                id={status}
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onEditTask={onEditTask}
                onAddTask={() => onAddTask(status)}
            />
        ))}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

interface ColumnProps {
  id: TaskStatus;
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onAddTask: () => void;
}

const statusStyles: Record<TaskStatus, { indicator: string, glow: string }> = {
    'Proses Desain': { indicator: 'bg-primary', glow: 'shadow-[0_0_12px_hsl(var(--primary))]' },
    'Proses ACC': { indicator: 'bg-orange-400', glow: 'shadow-[0_0_12px_#fb923c]' },
    'Selesai': { indicator: 'bg-green-500', glow: 'shadow-[0_0_12px_#22c55e]' },
};

function Column({ id, status, tasks, onEditTask, onAddTask }: ColumnProps) {
    const { indicator, glow } = statusStyles[status];
    
    const { setNodeRef } = useSortable({
      id: id,
      data: {
        type: 'Column',
        children: tasks,
      },
    });

    return (
      <SortableContext id={id} items={tasks.map(t => t.id)}>
        <div
            ref={setNodeRef}
            className="flex flex-col gap-4 bg-black/20 backdrop-blur-sm border border-white/10 p-4 rounded-lg"
        >
             <div className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full animate-status-pulse", indicator, glow)} />
                <h2 className="font-bold text-foreground">{status}</h2>
                <span className="text-sm text-muted-foreground">{tasks.length}</span>
            </div>
            <div className="flex flex-col gap-4 min-h-[100px]">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => onEditTask(task)}
                    />
                ))}
                {tasks.length === 0 && <EmptyState isColumn />}
            </div>
        </div>
        </SortableContext>
    );
}
