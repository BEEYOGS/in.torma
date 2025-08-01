'use client';

import { useState, useEffect } from 'react';
import { TaskBoard } from '@/components/task-board';
import { listenToTasks, setTasksInStorage, updateTaskStatus } from '@/services/task-service';
import type { Task, TaskStatus } from '@/types/task';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { TaskDialog } from '@/components/task-dialog';
import { DailyBriefing } from '@/components/daily-briefing';
import { TaskAnalytics } from '@/components/task-analytics';
import { AiTaskCreator } from '@/components/ai-task-creator';
import { Button } from '@/components/ui/button';
import { Music, Plus, Youtube, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ToastDemo } from '@/components/toast-demo';
import { EmptyState } from '@/components/empty-state';

const RacingBike = () => (
    <div className="absolute bottom-4 left-0 w-full overflow-hidden pointer-events-none">
        <div className="relative w-full h-24 animate-race" style={{ animationDelay: '2s' }}>
             <svg
                width="250"
                height="100"
                viewBox="0 0 250 100"
                className="absolute"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="bike-grad-futuristic" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="trail-grad" x1="0" y1="0.5" x2="1" y2="0.5">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                        <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </linearGradient>
                     <filter id="glow-futuristic" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="trail-blur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blurred" />
                    </filter>
                </defs>

                {/* Light Trail */}
                <g style={{filter: 'url(#trail-blur)'}}>
                  <path d="M 0,70 Q 70,65 150,75 L 150,85 Q 70,80 0,75 Z" fill="url(#trail-grad)" />
                  <path d="M 0,72 Q 80,68 170,78 L 170,82 Q 80,74 0,76 Z" fill="url(#trail-grad)" style={{ transform: 'translateY(-5px)' }} opacity="0.6"/>
                  <path d="M 0,74 Q 90,71 190,81 L 190,83 Q 90,77 0,78 Z" fill="url(#trail-grad)" style={{ transform: 'translateY(-10px)' }} opacity="0.3"/>
                </g>

                {/* Rider */}
                <g>
                  <path d="M110,40 C120,25 140,25 150,40 L140,55 L120,55 Z" fill="#0F172A" />
                  <rect x="122" y="30" width="16" height="5" rx="2.5" fill="#3b82f6" style={{filter: 'url(#glow-futuristic)'}} />
                </g>
                
                {/* Bike Body */}
                <g>
                  <path d="M70,70 L110,50 L180,50 L200,60 L150,75 L90,75 Z" fill="url(#bike-grad-futuristic)" />
                  <path d="M90,75 L150,75 L140,80 L95,80 Z" fill="rgba(255,255,255,0.2)" />
                  <path d="M115,52 L170,52 L190,60 L160,65 Z" fill="rgba(0,0,0,0.4)" />
                </g>
                
                {/* Holographic part */}
                <path d="M180,50 L200,60 L210,55 L190,45 Z" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.7)" strokeWidth="1" style={{filter: 'url(#glow-futuristic)'}} />

            </svg>
        </div>
    </div>
);

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<Partial<Task & {dueDate?: string | Date}> | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = listenToTasks((fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenDialogForNewTask = (status?: TaskStatus) => {
    setEditingTask(null);
    setPrefillData({ status: status || 'Proses Desain' });
    setIsDialogOpen(true);
  };
    
  const handleOpenDialogForEdit = (task: Task) => {
    setPrefillData(undefined);
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleAiTaskCreate = (data: Partial<Task & {dueDate?: string | Date}>) => {
    setEditingTask(null);
    setPrefillData(data);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
        setEditingTask(null);
        setPrefillData(undefined);
    }
  }

  const handleTasksReordered = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    setTasksInStorage(reorderedTasks);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTaskStatus(taskId, newStatus);

      let variant: 'default' | 'success' | 'warning' | 'info' = 'info';
      if (newStatus === 'Selesai') variant = 'success';
      if (newStatus === 'Proses ACC') variant = 'warning';

      toast({
        variant: variant,
        title: 'Status Tugas Diperbarui',
        description: `Tugas untuk "${task.customerName}" dipindahkan ke "${newStatus}".`
      })
      setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center justify-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 text-primary animate-logo-pulse"
                >
                    <path d="M12.383 6.012a2.43 2.43 0 0 0-3.413.568 2.39 2.39 0 0 0 0 3.385l-4.13 4.13a2.39 2.39 0 0 0 0 3.385 2.43 2.43 0 0 0 3.412.568l8.281-8.28a2.39 2.39 0 0 0 0-3.385 2.43 2.43 0 0 0-1.706-1.288z" />
                </svg>
                <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight group-data-[collapsible=icon]:hidden">
                    in.torma
                </h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
             <SidebarMenu>
                <SidebarMenuItem>
                    <DailyBriefing tasks={tasks} />
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <TaskAnalytics tasks={tasks} />
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <AiTaskCreator onTaskCreated={handleAiTaskCreate} />
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <ToastDemo />
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-full">
                        <SidebarMenuButton tooltip="YouTube" className="w-full">
                            <Youtube />
                            <span className="group-data-[collapsible=icon]:hidden">YouTube</span>
                        </SidebarMenuButton>
                    </a>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="w-full">
                        <SidebarMenuButton tooltip="YouTube Music" className="w-full">
                            <Music />
                            <span className="group-data-[collapsible=icon]:hidden">YouTube Music</span>
                        </SidebarMenuButton>
                    </a>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen flex flex-col bg-background relative overflow-hidden">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-start gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
              <SidebarTrigger />
          </header>
          <div className="flex-grow p-4 md:p-8">
            {tasks.length === 0 && !loading ? (
              <EmptyState />
            ) : (
              <TaskBoard 
                tasks={tasks} 
                loading={loading} 
                onEditTask={handleOpenDialogForEdit}
                onTasksReordered={handleTasksReordered}
                onAddTask={handleOpenDialogForNewTask}
                onTaskStatusChange={handleTaskStatusChange}
              />
            )}
          </div>
           <div className="absolute bottom-6 left-6 z-20">
                <Button 
                    size="icon" 
                    className="h-14 w-14 rounded-full shadow-lg"
                    onClick={() => handleOpenDialogForNewTask()}
                >
                    <Plus className="h-6 w-6"/>
                </Button>
            </div>
            <RacingBike />
        </main>
      </SidebarInset>
        <TaskDialog 
            key={editingTask?.id || (prefillData ? JSON.stringify(prefillData) : 'new-task')}
            isOpen={isDialogOpen} 
            onOpenChange={handleDialogChange} 
            task={editingTask}
            prefillData={prefillData}
        />
    </SidebarProvider>
  );
}
