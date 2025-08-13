
'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Search, Wand2, LayoutDashboard, Presentation } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { AiTaskCreator } from './ai-task-creator';
import type { Task, TaskStatus } from '@/types/task';
import type { FooterNotificationState } from '@/app/page';
import { useSound } from '@/hooks/use-sound';
import { cn } from '@/lib/utils';

interface MobileFooterProps {
    tasks: Task[];
    onNewTask: () => void;
    onAiTaskCreate: (data: Partial<Task & { dueDate?: string | Date }>) => void;
    onAnalyticsOpen: () => void;
    onBriefingOpen: () => void;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
    notification: FooterNotificationState | null;
}

const statusStyles: Record<TaskStatus, { bg: string, text: string }> = {
    'Proses Desain': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
    'Proses ACC': { bg: 'bg-sky-500/20', text: 'text-sky-400' },
    'Selesai': { bg: 'bg-green-500/20', text: 'text-green-400' },
};

const FooterNotification = ({ notification }: { notification: FooterNotificationState | null }) => {
    if (!notification) {
      return <div className="w-1/4" />; // Spacer
    }
  
    const { message, status } = notification;
    const style = statusStyles[status];
  
    return (
      <div className="w-1/4 flex items-center justify-center">
        <div
            className={cn(
            'px-2 py-1 rounded-md text-xs font-medium animate-in fade-in-50 slide-in-from-bottom-2',
            style.bg,
            style.text
            )}
        >
            {message}
        </div>
      </div>
    );
};
  
export function MobileFooter({ 
    tasks,
    onNewTask, 
    onAiTaskCreate, 
    onAnalyticsOpen,
    onBriefingOpen,
    searchTerm, 
    onSearchTermChange,
    notification,
}: MobileFooterProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const playOpenDialogSound = useSound('https://www.myinstants.com/media/sounds/swoosh-1.mp3', 0.5);

    const handleNewTaskClick = () => {
        playOpenDialogSound();
        onNewTask();
    }
        
    const handleSearchOpen = () => {
        playOpenDialogSound();
        setIsSearchOpen(true);
    }
    
    return (
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[90vw] max-w-sm">
            <div className="relative animate-in slide-in-from-bottom-10 duration-500">
                
                {/* Floating Action Button */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
                     <Button
                        size="icon"
                        className="h-16 w-16 rounded-full shadow-lg shadow-primary/40"
                        onClick={handleNewTaskClick}
                    >
                        <Plus className="h-8 w-8" />
                    </Button>
                </div>
                
                <div className="relative glass-card rounded-full p-2 flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-2 gap-1 text-center">
                        <IconButton label="Cari" onClick={handleSearchOpen}>
                            <Search className="h-6 w-6" />
                        </IconButton>
                        <AiTaskCreator onTaskCreated={onAiTaskCreate}>
                            <Wand2 className="h-6 w-6" />
                            <span className="text-xs font-normal">AI</span>
                        </AiTaskCreator>
                    </div>

                    {/* Spacer for FAB, containing the notification */}
                    <div className="w-20 flex items-center justify-center">
                        <FooterNotification notification={notification} />
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-1 text-center">
                         <IconButton label="Briefing" onClick={onBriefingOpen}>
                            <Presentation className="h-6 w-6" />
                        </IconButton>
                         <IconButton label="Dasbor" onClick={onAnalyticsOpen}>
                            <LayoutDashboard className="h-6 w-6" />
                        </IconButton>
                    </div>
                </div>
            </div>

            {/* Search Dialog */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogContent className="sm:max-w-md max-w-[90vw] glass-card border-white/10">
                    <DialogHeader>
                        <DialogTitle>Cari Tugas</DialogTitle>
                        <DialogDescription>
                            Ketik nama konsumen atau deskripsi untuk mencari tugas.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Cari tugas..."
                        value={searchTerm}
                        onChange={(e) => onSearchTermChange(e.target.value)}
                        className="w-full rounded-lg bg-secondary/50 pl-8 border-white/10 focus:ring-primary/80"
                        />
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={() => setIsSearchOpen(false)} className="w-full">Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

// A small helper component for the navigation buttons to reduce repetition
const IconButton = React.forwardRef<
    HTMLButtonElement,
    { children: React.ReactNode; label?: string } & React.ComponentProps<typeof Button>
>(({ children, label, ...props }, ref) => (
    <Button 
        ref={ref}
        variant="ghost" 
        size="icon" 
        className="flex flex-col h-auto w-full gap-1 text-muted-foreground hover:text-foreground p-2" 
        {...props}
    >
        {children}
        {label && <span className="text-xs font-normal">{label}</span>}
    </Button>
));
IconButton.displayName = 'IconButton';
