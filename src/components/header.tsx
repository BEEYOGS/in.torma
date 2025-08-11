
'use client';

import React from 'react';
import type { Task } from '@/types/task';
import { DailyBriefing } from '@/components/daily-briefing';
import { TaskAnalytics } from '@/components/task-analytics';
import { AiTaskCreator } from '@/components/ai-task-creator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Ellipsis, AreaChart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

interface HeaderProps {
  tasks: Task[];
  onAiTaskCreate: (data: Partial<Task & { dueDate?: string | Date }>) => void;
  onNewTask: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export function Header({ 
  tasks, 
  onAiTaskCreate, 
  onNewTask,
  searchTerm,
  onSearchTermChange
}: HeaderProps) {
  
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
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <path d="M24.2564 10.4284C24.2564 8.20335 23.3283 6.37963 21.6582 5.25304C19.9881 4.12645 17.854 3.5 14.0001 3.5C10.1462 3.5 8.01208 4.12645 6.342 5.25304C4.67191 6.37963 3.74385 8.20335 3.74385 10.4284V17.5716C3.74385 19.7966 4.67191 21.6204 6.342 22.747C8.01208 23.8735 10.1462 24.5 14.0001 24.5C17.854 24.5 19.9881 23.8735 21.6582 22.747C23.3283 21.6204 24.2564 19.7966 24.2564 17.5716V10.4284Z" fill="#FF0000"/>
        <path d="M12.1523 18.2435L18.441 14L12.1523 9.7565V18.2435Z" fill="white"/>
    </svg>
  );

  const YoutubeMusicIcon = () => (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <circle cx="14" cy="14" r="10.5" fill="#FF0000"/>
        <path d="M12.1523 18.2435L18.441 14L12.1523 9.7565V18.2435Z" fill="white"/>
    </svg>
  );


  return (
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
                <DropdownMenuItem asChild>
                    <TaskAnalytics tasks={tasks}>
                        <button className="w-full flex items-center">
                            <AreaChart className="mr-2 h-4 w-4"/>
                            <span>Dasbor Analitik</span>
                        </button>
                    </TaskAnalytics>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                     <DailyBriefing tasks={tasks}>
                         <button className="w-full flex items-center">
                            <Users className="mr-2 h-4 w-4"/>
                            <span>Rangkuman Harian</span>
                         </button>
                     </DailyBriefing>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Pintasan</DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-1 px-1">
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="w-full cursor-pointer flex items-center justify-center p-2 rounded-md hover:bg-accent">
                        <YoutubeIcon />
                    </a>
                    <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="w-full cursor-pointer flex items-center justify-center p-2 rounded-md hover:bg-accent">
                        <YoutubeMusicIcon/>
                    </a>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>

      </nav>
       <div className="flex items-center gap-1 md:hidden ml-auto">
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
                <DropdownMenuItem asChild>
                    <TaskAnalytics tasks={tasks}>
                        <button className="w-full flex items-center">
                            <AreaChart className="mr-2 h-4 w-4"/>
                            <span>Dasbor Analitik</span>
                        </button>
                    </TaskAnalytics>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                     <DailyBriefing tasks={tasks}>
                         <button className="w-full flex items-center">
                            <Users className="mr-2 h-4 w-4"/>
                            <span>Rangkuman Harian</span>
                         </button>
                     </DailyBriefing>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Pintasan</DropdownMenuLabel>
                 <div className="grid grid-cols-2 gap-1 px-1">
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="w-full cursor-pointer flex items-center justify-center p-2 rounded-md hover:bg-accent">
                        <YoutubeIcon />
                    </a>
                    <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="w-full cursor-pointer flex items-center justify-center p-2 rounded-md hover:bg-accent">
                        <YoutubeMusicIcon />
                    </a>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
       </div>
      
      <Button onClick={onNewTask} className="hidden md:inline-flex">
        <Plus className="mr-2 h-4 w-4" />
        Tambah Tugas
      </Button>
    </header>
  );
}
