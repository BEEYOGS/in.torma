
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/header';
import { TaskBoard } from '@/components/task-board';
import { listenToTasks } from '@/services/task-service';
import type { Task, TaskStatus } from '@/types/task';
import { TaskDialog } from '@/components/task-dialog';
import { EmptyState } from '@/components/empty-state';
import { MobileFooter } from '@/components/mobile-footer';
import { TaskAnalytics } from '@/components/task-analytics';
import { DailyBriefingDialog } from '@/components/briefing-dialog';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface FooterNotificationState {
  message: string;
  status: TaskStatus;
}

const statusIcons: Record<TaskStatus, React.ReactNode> = {
    'Proses Desain': <AlertTriangle className="h-3 w-3" />,
    'Proses ACC': <Info className="h-3 w-3" />,
    'Selesai': <CheckCircle2 className="h-3 w-3" />,
};

const statusColors: Record<TaskStatus, string> = {
  'Proses Desain': 'bg-orange-900/70 border-orange-600/50 text-orange-200',
  'Proses ACC': 'bg-sky-900/70 border-sky-600/50 text-sky-200',
  'Selesai': 'bg-green-900/70 border-green-600/50 text-green-200',
}

function DynamicIslandNotification({ notification }: { notification: FooterNotificationState | null }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000); // Notification stays for 3 seconds
            return () => clearTimeout(timer);
        }
    }, [notification]);

    if (!notification) return null;

    const icon = statusIcons[notification.status];
    const colors = statusColors[notification.status];

    return (
        <div className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 z-50 md:hidden",
            "transition-all duration-300 ease-in-out",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 -translate-y-4"
        )}>
            <div className={cn(
                "flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full shadow-lg text-xs font-medium border backdrop-blur-md",
                colors
            )}>
                {icon}
                <span className="font-semibold">{notification.message}</span>
            </div>
        </div>
    );
}


export default function Home() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<Partial<Task & {dueDate?: string | Date}> | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTaskId, setNewTaskId] = useState<string | null>(null);
  const [footerNotification, setFooterNotification] = useState<FooterNotificationState | null>(null);


  useEffect(() => {
    // Request notification permission on initial load
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = listenToTasks((fetchedTasks) => {
      setAllTasks(fetchedTasks);
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

  const handleNewTaskAdded = (id: string) => {
    setNewTaskId(id);
    setTimeout(() => {
      setNewTaskId(null);
    }, 1200);
  }

  const handleShowFooterNotification = (message: string, status: TaskStatus) => {
    // Use a unique key to re-trigger the notification even if the message is the same
    setFooterNotification({ message, status });
  };
  
  // Memoize the filtered tasks to avoid re-calculating on every render
  const filteredTasks = useMemo(() => {
    if (searchTerm === '') {
      return allTasks;
    }
    return allTasks.filter(task => 
      task.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allTasks, searchTerm]);


  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header 
        tasks={allTasks}
        onAiTaskCreate={handleAiTaskCreate}
        onNewTask={() => handleOpenDialogForNewTask()}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        isAnalyticsOpen={isAnalyticsOpen}
        onAnalyticsOpenChange={setIsAnalyticsOpen}
        onBriefingOpen={() => setIsBriefingOpen(true)}
      />
       <DynamicIslandNotification notification={footerNotification} />
      <main className="flex-grow p-4 md:p-8 pb-24 md:pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="h-[500px] w-full animate-pulse rounded-md bg-muted/50" />
            <div className="h-[500px] w-full animate-pulse rounded-md bg-muted/50" />
            <div className="h-[500px] w-full animate-pulse rounded-md bg-muted/50" />
          </div>
        ) : filteredTasks.length === 0 && searchTerm ? (
            <div className="text-center mt-16 text-muted-foreground">
                <h3 className="text-lg font-semibold">Tidak ada hasil</h3>
                <p>Coba kata kunci pencarian yang lain.</p>
            </div>
        ) : allTasks.length === 0 ? (
          <EmptyState onAddTask={() => handleOpenDialogForNewTask()} />
        ) : (
          <TaskBoard 
            tasks={filteredTasks} 
            onEditTask={handleOpenDialogForEdit}
            newTaskId={newTaskId}
            onShowNotification={handleShowFooterNotification}
          />
        )}
      </main>
      <TaskDialog 
          key={editingTask?.id || (prefillData ? JSON.stringify(prefillData) : 'new-task')}
          isOpen={isDialogOpen} 
          onOpenChange={handleDialogChange} 
          task={editingTask}
          prefillData={prefillData}
          onTaskAdded={handleNewTaskAdded}
      />
      <TaskAnalytics tasks={allTasks} isOpen={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen} />
      <DailyBriefingDialog tasks={allTasks} isOpen={isBriefingOpen} onOpenChange={setIsBriefingOpen} />
      <MobileFooter
        onNewTask={() => handleOpenDialogForNewTask()}
        onAiTaskCreate={handleAiTaskCreate}
        onAnalyticsOpen={() => setIsAnalyticsOpen(true)}
        onBriefingOpen={() => setIsBriefingOpen(true)}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
    </div>
  );
}
