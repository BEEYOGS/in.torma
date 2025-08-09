
'use client';

import React from 'react';
import type { Task } from '@/types/task';
import { DailyBriefing } from '@/components/daily-briefing';
import { TaskAnalytics } from '@/components/task-analytics';
import { AiTaskCreator } from '@/components/ai-task-creator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Youtube, Music, Grid3x3, AreaChart, Users } from 'lucide-react';
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
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-8 w-8"
    >
      <defs>
        <linearGradient id="status-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" style={{ stopColor: 'hsl(var(--chart-3))' }} />
           <stop offset="100%" style={{ stopColor: 'hsl(var(--chart-1))' }} />
        </linearGradient>
      </defs>
      <g className="animate-spin-slow" style={{ transformOrigin: 'center', transformBox: 'fill-box' }}>
        <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="hsl(var(--primary) / 0.1)"
            strokeWidth="2"
        />
        <path
            className="animate-draw-circle"
            d="M12,2 a10,10 0 0,1 0,20 a10,10 0 0,1 0,-20"
            fill="none"
            stroke="url(#status-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="62.83"
            strokeDashoffset="62.83"
        />
      </g>
    </svg>
  );

  return (
    <header className={cn("sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-lg sm:px-6", "glass-header border-white/10")}>
      <div className="flex items-center gap-2">
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
                            <Grid3x3 />
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
                 <DropdownMenuLabel>Tautan Eksternal</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="w-full">
                        <Youtube className="mr-2 h-4 w-4"/>
                        <span>Buka YouTube</span>
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                     <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="w-full">
                        <Music className="mr-2 h-4 w-4"/>
                        <span>Buka YouTube Music</span>
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </nav>
      
      <Button onClick={onNewTask} className="hidden md:inline-flex">
        <Plus className="mr-2 h-4 w-4" />
        Tambah Tugas
      </Button>
    </header>
  );
}
