
'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { TaskDialog } from './task-dialog';
import { AiTaskCreator } from './ai-task-creator';
import { DailyBriefing } from './daily-briefing';
import { TaskAnalytics } from './task-analytics';
import type { Task } from '@/types/task';

interface HeaderProps {
    tasks: Task[];
}

export default function Header({ tasks }: HeaderProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [prefillData, setPrefillData] = useState<Partial<Task> | undefined>(undefined);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleOpenDialogForNewTask = () => {
        setEditingTask(null);
        setPrefillData(undefined);
        setIsDialogOpen(true);
    };

    const handleOpenDialogForEdit = (task: Task) => {
        setEditingTask(task);
        setPrefillData(undefined);
        setIsDialogOpen(true);
    };
    
    const handleAiTaskCreate = (data: Partial<Task>) => {
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
    
    // Pass this handler to TaskBoard, so TaskCard can call it via onEdit
    // This is a placeholder for where you might connect TaskBoard editing
    // For now, we assume TaskBoard manages its own dialog state for edits. If not, this is how you'd connect it.
    // In our current structure, TaskBoard manages its own dialog state for edits.

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-background/60 backdrop-blur-lg border-b border-border/30">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-8 w-8 text-primary animate-logo-pulse"
                        >
                          <path d="M12.383 6.012a2.43 2.43 0 0 0-3.413.568 2.39 2.39 0 0 0 0 3.385l-4.13 4.13a2.39 2.39 0 0 0 0 3.385 2.43 2.43 0 0 0 3.412.568l8.281-8.28a2.39 2.39 0 0 0 0-3.385 2.43 2.43 0 0 0-1.706-1.288z" />
                        </svg>
                        <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">
                            in.torma
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-2">
                            <DailyBriefing />
                            <TaskAnalytics tasks={tasks} />
                            <AiTaskCreator onTaskCreated={handleAiTaskCreate} />
                        </div>
                        <Button onClick={handleOpenDialogForNewTask}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Tugas
                        </Button>
                    </div>
                </div>
            </header>
            <TaskDialog 
                // Use a unique key to force remounting the dialog on open
                key={editingTask?.id || (prefillData ? JSON.stringify(prefillData) : 'new-task')}
                isOpen={isDialogOpen} 
                onOpenChange={handleDialogChange} 
                task={editingTask}
                prefillData={prefillData}
            />
        </>
    );
}
