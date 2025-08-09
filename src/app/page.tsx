
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { TaskBoard } from '@/components/task-board';
import { listenToTasks } from '@/services/task-service';
import type { Task, TaskStatus } from '@/types/task';
import { TaskDialog } from '@/components/task-dialog';
import { EmptyState } from '@/components/empty-state';
import { MobileFooter } from '@/components/mobile-footer';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<Partial<Task & {dueDate?: string | Date}> | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredTasks = tasks.filter(task => 
    task.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header 
        tasks={tasks}
        onAiTaskCreate={handleAiTaskCreate}
        onNewTask={() => handleOpenDialogForNewTask()}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
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
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskBoard 
            tasks={filteredTasks} 
            onEditTask={handleOpenDialogForEdit}
          />
        )}
      </main>
      <TaskDialog 
          key={editingTask?.id || (prefillData ? JSON.stringify(prefillData) : 'new-task')}
          isOpen={isDialogOpen} 
          onOpenChange={handleDialogChange} 
          task={editingTask}
          prefillData={prefillData}
      />
      <MobileFooter
        tasks={tasks}
        onNewTask={() => handleOpenDialogForNewTask()}
        onAiTaskCreate={handleAiTaskCreate}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
    </div>
  );
}
