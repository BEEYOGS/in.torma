
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './task-card';
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
  Active,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useSortable } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { updateTaskStatus, setTasksInStorage } from '@/services/task-service';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CSS } from '@dnd-kit/utilities';

const statuses: TaskStatus[] = ['Proses Desain', 'Proses ACC', 'Selesai'];

function MobileEmptyColumn() {
    return (
        <div 
            className="text-center text-muted-foreground pt-12 flex flex-col items-center gap-4"
        >
             <style>
                {`
                @keyframes float-file {
                    0% { transform: translateY(0px) rotate(-3deg); }
                    50% { transform: translateY(-10px) rotate(3deg); }
                    100% { transform: translateY(0px) rotate(-3deg); }
                }
                .animate-float-file {
                    animation: float-file 6s ease-in-out infinite;
                }
                `}
            </style>
            <div className="relative w-[80px] h-[80px] animate-float-file">
                 <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/30">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
            </div>
            <p className="text-sm">Kolom ini kosong.</p>
       </div>
    )
}

function DesktopEmptyColumn() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 text-xs text-muted-foreground/50 border-2 border-dashed border-border/20 rounded-lg min-h-[100px]">
      <p>Seret tugas ke sini</p>
    </div>
  )
}

interface TaskBoardProps {
    tasks: Task[];
    onEditTask: (task: Task) => void;
}

export function TaskBoard({ 
    tasks: initialTasks, 
    onEditTask, 
}: TaskBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

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
    
  const tasksByStatus = useMemo(() => {
    const initialMap: Record<TaskStatus, Task[]> = {
        'Proses Desain': [],
        'Proses ACC': [],
        'Selesai': [],
    };

    return tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
    }, initialMap);
  }, [tasks]);


  const findContainer = (id: string): TaskStatus | undefined => {
    if (statuses.includes(id as TaskStatus)) {
        return id as TaskStatus;
    }
    const task = Object.values(tasksById).find(t => t.id === id);
    if(task) return task.status;
    
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTask(tasksById[active.id as string]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) {
        return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
       const itemsInColumn = tasksByStatus[activeContainer!] || [];
       const oldIndex = itemsInColumn.findIndex((item) => item.id === activeId);
       const newIndex = itemsInColumn.findIndex((item) => item.id === overId);

       if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
           const reorderedInColumn = arrayMove(itemsInColumn, oldIndex, newIndex);
           
           const finalOrderedTasks = statuses.flatMap(status => {
               if (status === activeContainer) {
                   return reorderedInColumn;
               }
               return tasksByStatus[status];
           });
           
           setTasks(finalOrderedTasks);
           setTasksInStorage(finalOrderedTasks);
       }
       return;
    }

    const updatedTasks = tasks.map(t => t.id === activeId ? { ...t, status: overContainer } : t);
    setTasks(updatedTasks);
    updateTaskStatus(activeId, overContainer);
  };

  if (isMobile) {
    return (
        <Tabs defaultValue="Proses Desain" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-card/60 p-1 h-auto backdrop-blur-sm">
                {statuses.map(status => (
                    <TabsTrigger key={status} value={status} className="text-xs data-[state=active]:bg-background/80">
                        {status} ({tasksByStatus[status].length})
                    </TabsTrigger>
                ))}
            </TabsList>
            {statuses.map(status => (
                <TabsContent key={status} value={status}>
                    <div className="flex flex-col gap-4">
                        {tasksByStatus[status].length > 0 ? (
                            tasksByStatus[status].map(task => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onEdit={() => onEditTask(task)}
                                />
                            ))
                        ) : (
                           <MobileEmptyColumn />
                        )}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    )
  }
  
  return (
    <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {statuses.map(status => (
            <Column
                id={status}
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onEditTask={onEditTask}
                activeTask={activeTask}
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
  activeTask: Task | null;
}

const statusStyles: Record<TaskStatus, { indicator: string, glow: string }> = {
    'Proses Desain': { indicator: 'bg-orange-500', glow: 'shadow-orange-500/30' },
    'Proses ACC': { indicator: 'bg-sky-500', glow: 'shadow-sky-500/30' },
    'Selesai': { indicator: 'bg-green-500', glow: 'shadow-green-500/30' },
};

function Column({ id, status, tasks, onEditTask, activeTask }: ColumnProps) {
    const { indicator, glow } = statusStyles[status];
    
    const { setNodeRef } = useSortable({
      id: id,
      data: {
        type: 'Column',
        children: tasks,
      },
    });

    const isColumnEmpty = tasks.length === 0;
    const isDraggingOverEmptyColumn = activeTask && activeTask.status !== status && isColumnEmpty;


    return (
      <div
        ref={setNodeRef}
        className={cn("flex flex-col gap-4 glass-card p-4 min-h-[200px] shadow-lg", glow)}
      >
        <div className="flex items-center gap-3">
            <div className={cn("w-2.5 h-2.5 rounded-full animate-status-pulse", indicator)} />
            <h2 className="font-bold text-lg text-foreground">{status}</h2>
            <span className="ml-auto text-sm text-muted-foreground bg-black/20 px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <SortableContext id={id} items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
            <div className="flex flex-col gap-4 min-h-[100px]">
                {tasks.map(task => (
                    <SortableTaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => onEditTask(task)}
                    />
                ))}
                {isColumnEmpty && !isDraggingOverEmptyColumn && <DesktopEmptyColumn />}
            </div>
        </SortableContext>
      </div>
    );
}

function SortableTaskCard({ task, onEdit }: { task: Task, onEdit: (task: Task) => void }) {
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
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
      };

    return (
        <TaskCard 
            ref={setNodeRef}
            style={style}
            task={task}
            onEdit={onEdit}
            {...attributes}
            {...listeners}
        />
    )
}

    