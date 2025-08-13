
'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Search, Wand2, LayoutDashboard, Presentation, Ellipsis } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { AiTaskCreator } from './ai-task-creator';
import type { Task, TaskStatus } from '@/types/task';
import type { FooterNotificationState } from '@/app/page';
import { DailyBriefing } from './daily-briefing';
import { useSound } from '@/hooks/use-sound';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const playOpenDialogSound = useSound('https://www.myinstants.com/media/sounds/swoosh-1.mp3', 0.5);

    const handleNewTaskClick = () => {
        playOpenDialogSound();
        onNewTask();
    }
        
    const handleSearchOpen = () => {
        playOpenDialogSound();
        setIsSearchOpen(true);
    }

    const handleMenuOpen = () => {
        playOpenDialogSound();
        setIsMenuOpen(true);
    }
    
    const handleMenuAnalyticsOpen = () => {
        setIsMenuOpen(false);
        onAnalyticsOpen();
    }
    
    const handleMenuBriefingOpen = () => {
        setIsMenuOpen(false);
        onBriefingOpen();
    }
    
    const YoutubeIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 20" fill="none" className="h-5 w-auto">
          <path d="M27.4722 3.0625C27.1611 1.85417 26.2306 0.923611 25.0222 0.6125C22.8333 0 14 0 14 0C14 0 5.16667 0 2.97778 0.6125C1.76944 0.923611 0.838889 1.85417 0.527778 3.0625C0 5.25347 0 10 0 10C0 10 0 14.7465 0.527778 16.9375C0.838889 18.1458 1.76944 19.0764 2.97778 19.3875C5.16667 20 14 20 14 20C14 20 22.8333 20 25.0222 19.3875C26.2306 19.0764 27.1611 18.1458 27.4722 16.9375C28 14.7465 28 10 28 10C28 10 28 5.25347 27.4722 3.0625ZM11.2 14.2882V5.71181L18.48 10L11.2 14.2882Z" fill="#FF0000"/>
      </svg>
    );

    const YoutubeMusicIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
        <circle cx="12" cy="12" r="12" fill="#FF0000"/>
        <circle cx="12" cy="12" r="6" fill="transparent" stroke="black" strokeWidth="1"/>
        <path d="M10 15V9L15 12L10 15Z" fill="black"/>
      </svg>
    );

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
                        <IconButton label="Menu" onClick={handleMenuOpen}>
                            <Ellipsis className="h-6 w-6" />
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
            
            {/* Features & Shortcuts Menu Dialog */}
            <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DialogContent className="sm:max-w-md max-w-[90vw] glass-card border-white/10">
                    <DialogHeader>
                        <DialogTitle>Fitur & Pintasan</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-2 py-4">
                       <Button variant="outline" className="justify-start text-base py-6" onClick={handleMenuAnalyticsOpen}>
                           <LayoutDashboard className="mr-3 h-5 w-5 text-primary" />
                           Dasbor Analitik
                       </Button>
                       <DailyBriefing onBriefingOpen={handleMenuBriefingOpen}>
                           <Button variant="outline" className="justify-start text-base py-6 w-full">
                               <Presentation className="mr-3 h-5 w-5 text-primary" />
                               Rangkuman Harian
                           </Button>
                       </DailyBriefing>
                       
                       <Separator className="my-2 bg-white/10"/>

                        <div className="grid grid-cols-2 gap-2">
                           <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="w-full">
                               <Button variant="outline" className="w-full h-16 text-base">
                                   <YoutubeIcon/>
                               </Button>
                           </a>
                           <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="w-full">
                               <Button variant="outline" className="w-full h-16 text-base">
                                   <YoutubeMusicIcon />
                               </Button>
                           </a>
                       </div>
                    </div>
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

    