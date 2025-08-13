
'use client';

import React from 'react';
import type { Task } from '@/types/task';
import { DailyBriefing } from '@/components/daily-briefing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Ellipsis, LayoutDashboard, Presentation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AiTaskCreator } from './ai-task-creator';
import { useSound } from '@/hooks/use-sound';
import { SystemNotificationDemo } from './toast-demo';

interface HeaderProps {
  tasks: Task[];
  onAiTaskCreate: (data: Partial<Task & { dueDate?: string | Date }>) => void;
  onNewTask: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  isAnalyticsOpen: boolean;
  onAnalyticsOpenChange: (open: boolean) => void;
  onBriefingOpen: () => void;
}

export function Header({ 
  tasks, 
  onAiTaskCreate, 
  onNewTask,
  searchTerm,
  onSearchTermChange,
  isAnalyticsOpen,
  onAnalyticsOpenChange,
  onBriefingOpen
}: HeaderProps) {
  const playOpenDialogSound = useSound('https://www.myinstants.com/media/sounds/swoosh-1.mp3', 0.5);

  const handleNewTaskClick = () => {
    playOpenDialogSound();
    onNewTask();
  }

  const handleAnalyticsOpen = () => {
    playOpenDialogSound();
    onAnalyticsOpenChange(true);
  }

  const Logo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-primary"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(260 85% 65%)" />
        </linearGradient>
      </defs>
      <path
        d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4ZM16 25C11.0294 25 7 20.9706 7 16C7 11.0294 11.0294 7 16 7C20.9706 7 25 11.0294 25 16C25 20.9706 20.9706 25 16 25Z"
        fill="url(#grad1)"
        opacity="0.4"
      />
      <path
        d="M16 9C12.134 9 9 12.134 9 16C9 19.866 12.134 23 16 23C19.866 23 23 19.866 23 16C23 12.134 19.866 9 16 9ZM16 20C13.7909 20 12 18.2091 12 16C12 13.7909 13.7909 12 16 12C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20Z"
        fill="url(#grad1)"
      />
    </svg>
  );

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

  const MainMenu = () => (
    <DropdownMenu>
        <Tooltip>
            <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="App Menu"
                    >
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
                <p>Menu Lainnya</p>
            </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="bg-popover/80 backdrop-blur-lg border-white/10 w-56">
            <DropdownMenuLabel>Fitur</DropdownMenuLabel>
            <DropdownMenuItem onSelect={handleAnalyticsOpen}>
                <LayoutDashboard className="mr-2 h-4 w-4"/>
                <span>Dasbor Analitik</span>
            </DropdownMenuItem>
            <DailyBriefing onBriefingOpen={onBriefingOpen}>
                <DropdownMenuItem>
                    <Presentation className="mr-2 h-4 w-4"/>
                    <span>Rangkuman Harian</span>
                </DropdownMenuItem>
            </DailyBriefing>
            <SystemNotificationDemo />
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Pintasan</DropdownMenuLabel>
            <div className="grid grid-cols-2 gap-1 px-1">
                <DropdownMenuItem asChild className="p-0 justify-center">
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 rounded-md hover:bg-accent w-full h-full">
                        <YoutubeIcon />
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="p-0 justify-center">
                    <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-2 rounded-md hover:bg-accent w-full h-full">
                        <YoutubeMusicIcon/>
                    </a>
                </DropdownMenuItem>
            </div>
        </DropdownMenuContent>
    </DropdownMenu>
  );


  return (
    <>
    <header className={cn("sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-lg sm:px-6", "glass-header border-white/10")}>
      <div className="flex items-center gap-3">
        <Logo />
        <h1 className="text-xl font-bold font-headline text-foreground tracking-tight">
          in.torma
        </h1>
      </div>
      
      <div className="relative ml-auto hidden flex-1 md:flex md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari tugas..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full rounded-lg bg-secondary/50 pl-8 md:w-[200px] lg:w-[320px] border-white/10 focus:ring-primary/80"
        />
      </div>

      <nav className="hidden items-center gap-1 md:flex">
        <AiTaskCreator onTaskCreated={onAiTaskCreate} />
        <MainMenu />
      </nav>
       <div className="flex items-center gap-1 md:hidden ml-auto">
         <MainMenu />
       </div>
      
      <Button onClick={handleNewTaskClick} className="hidden md:inline-flex">
        <Plus className="mr-2 h-4 w-4" />
        Tambah Tugas
      </Button>
    </header>
    </>
  );
}
