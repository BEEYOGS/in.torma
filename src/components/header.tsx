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

    const handleOpenDialog = () => {
        setPrefillData(undefined); // Hapus data prefill untuk tugas baru
        setIsDialogOpen(true);
    };

    const handleAiTaskCreate = (data: Partial<Task>) => {
        setPrefillData(data);
        setIsDialogOpen(true);
    };

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            // Hapus prefillData ketika dialog ditutup
            setPrefillData(undefined);
        }
    }

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-background/60 backdrop-blur-lg border-b border-border/30">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                    <h1 className="text-2xl font-bold font-headline text-foreground tracking-tight">
                        KerjaSini
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-2">
                            <DailyBriefing />
                            <TaskAnalytics tasks={tasks} />
                            <AiTaskCreator onTaskCreated={handleAiTaskCreate} />
                        </div>
                        <Button onClick={handleOpenDialog}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Tugas
                        </Button>
                    </div>
                </div>
            </header>
            <TaskDialog 
                isOpen={isDialogOpen} 
                onOpenChange={handleDialogChange} 
                prefillData={prefillData}
                // Gunakan key unik untuk memaksa pembuatan ulang komponen saat prefillData berubah,
                // ini memastikan state form direset dengan benar.
                key={prefillData ? JSON.stringify(prefillData) : 'new-task'} 
            />
        </>
    );
}
