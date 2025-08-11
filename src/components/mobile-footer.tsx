
'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Search, Wand2, AreaChart, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { AiTaskCreator } from './ai-task-creator';
import type { Task } from '@/types/task';
import { DailyBriefing } from './daily-briefing';

interface MobileFooterProps {
    tasks: Task[];
    onNewTask: () => void;
    onAiTaskCreate: (data: Partial<Task & { dueDate?: string | Date }>) => void;
    onAnalyticsOpen: () => void;
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

export function MobileFooter({ 
    tasks,
    onNewTask, 
    onAiTaskCreate, 
    onAnalyticsOpen,
    searchTerm, 
    onSearchTermChange 
}: MobileFooterProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[90vw] max-w-sm">
            <div className="relative animate-in slide-in-from-bottom-10 duration-500">
                
                {/* Floating Action Button */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
                     <Button
                        size="icon"
                        className="h-16 w-16 rounded-full shadow-lg shadow-primary/40"
                        onClick={onNewTask}
                    >
                        <Plus className="h-8 w-8" />
                    </Button>
                </div>
                
                <div className="relative glass-card rounded-full p-2 flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-2 gap-1 text-center">
                        <IconButton label="Cari" onClick={() => setIsSearchOpen(true)}>
                            <Search className="h-6 w-6" />
                        </IconButton>
                        <AiTaskCreator onTaskCreated={onAiTaskCreate}>
                            <Wand2 className="h-6 w-6" />
                            <span className="text-xs font-normal">AI</span>
                        </AiTaskCreator>
                    </div>

                    {/* Spacer to push items to the sides of the FAB */}
                    <div className="w-12" /> 

                    <div className="flex-1 grid grid-cols-2 gap-1 text-center">
                       <IconButton label="Dasbor" onClick={onAnalyticsOpen}>
                          <AreaChart className="h-6 w-6" />
                       </IconButton>
                       <DailyBriefing tasks={tasks}>
                           <IconButton label="Briefing">
                                <Users className="h-6 w-6" />
                           </IconButton>
                       </DailyBriefing>
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
