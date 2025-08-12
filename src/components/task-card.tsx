
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Sparkles, Trash2, MoreVertical, AlertCircle } from 'lucide-react';
import type { Task, TaskSource, TaskStatus } from '@/types/task';
import { deleteTask } from '@/services/task-service';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { ConceptImageGenerator } from './concept-image-generator';
import { TaskDescriptionSpeaker } from './task-description-speaker';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useState, useRef, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogTrigger } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeviceOrientation } from '@/hooks/use-device-orientation';
import { useSound } from '@/hooks/use-sound';


interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task;
  onEdit?: (task: Task) => void;
  isOverlay?: boolean;
}

const statusStyles: Record<TaskStatus, { text: string; color: string, gradFrom: string, gradTo: string, glow: string, caretColor: string }> = {
  'Proses Desain': {
    text: 'text-orange-400',
    color: 'hsl(24, 95%, 53%)',
    gradFrom: 'from-orange-500/80',
    gradTo: 'to-orange-500/0',
    glow: 'hover:shadow-[0_0_20px_0] hover:shadow-orange-500/30',
    caretColor: 'hsl(24, 95%, 53%)',
  },
  'Proses ACC': {
    text: 'text-sky-400',
    color: 'hsl(204, 90%, 53%)',
    gradFrom: 'from-sky-500/80',
    gradTo: 'to-sky-500/0',
    glow: 'hover:shadow-[0_0_20px_0] hover:shadow-sky-500/30',
    caretColor: 'hsl(204, 90%, 53%)',
  },
  'Selesai': {
    text: 'text-green-400',
    color: 'hsl(142, 71%, 45%)',
    gradFrom: 'from-green-500/80',
    gradTo: 'to-green-500/0',
    glow: 'hover:shadow-[0_0_20px_0] hover:shadow-green-500/30',
    caretColor: 'hsl(142, 71%, 45%)',
  },
};

const sourceDisplayMap: Record<TaskSource, string> = {
    'N': 'N',
    'CS': 'CS',
    'Admin': 'Admin',
    'G': 'Group'
};

const useTypingAnimation = (text: string) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
      setDisplayText('');
      setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    const typingSpeed = 100;
    const delayBeforeReset = 1500;

    if (currentIndex < text.length) {
        const timeoutId = setTimeout(() => {
            setDisplayText((prev) => prev + text[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
        }, typingSpeed);
        return () => clearTimeout(timeoutId);
    } else {
        const timeoutId = setTimeout(() => {
            setDisplayText('');
            setCurrentIndex(0);
        }, delayBeforeReset);
        return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, text]);

  return displayText;
};


export const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onEdit, isOverlay, ...props }, ref) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const orientation = useDeviceOrientation();
  const [isConceptDialogOpen, setIsConceptDialogOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const playDeleteSound = useSound('https://www.myinstants.com/media/sounds/wind-whoosh-2.mp3', 0.3);
  const playOpenDialogSound = useSound('https://www.myinstants.com/media/sounds/swoosh-1.mp3', 0.5);

  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: '50%', y: '50%', opacity: 0 });
  
  const animatedStatusText = useTypingAnimation(task.status);

  useEffect(() => {
    if (isMobile && orientation.gamma !== null && orientation.beta !== null) {
      const rotateX = orientation.beta * -0.3;  // Tilt forward/backward
      const rotateY = orientation.gamma * 0.3; // Tilt left/right
      setRotate({ x: rotateX, y: rotateY });
    }
  }, [isMobile, orientation]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current || isOverlay) return;

    const rect = cardRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    const rotateX = (y / height - 0.5) * -15; // Invert for natural feel
    const rotateY = (x / width - 0.5) * 15;

    setRotate({ x: rotateX, y: rotateY });
    setGlow({ x: `${(x / width) * 100}%`, y: `${(y / height) * 100}%`, opacity: 1 });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setRotate({ x: 0, y: 0 });
    setGlow({ x: '50%', y: '50%', opacity: 0 });
  };


  const handleDelete = async () => {
    try {
      playDeleteSound();
      await deleteTask(task.id);
      toast({
        title: 'Tugas Dihapus',
        description: `Tugas untuk ${task.customerName} telah berhasil dihapus.`,
      });
    } catch (error)
      {
      toast({
        variant: 'destructive',
        title: 'Gagal Menghapus Tugas',
        description: 'Terjadi kesalahan saat menghapus tugas.',
      });
    }
  };
  
  const displayDate = task.dueDate ? new Date(`${task.dueDate}T00:00:00`) : null;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; 
    if (targetIsAction(e.target as HTMLElement)) return;
    if (onEdit) {
      playOpenDialogSound();
      onEdit(task);
    }
  };

  const handleHeaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile && !targetIsAction(e.target as HTMLElement)) {
          if (onEdit) {
            playOpenDialogSound();
            onEdit(task);
          }
      }
  }

  const targetIsAction = (target: HTMLElement) => {
    return target.closest('button, [role="menuitem"], [role="dialog"], [data-dnd-handle]');
  }
  
  const handleEditClick = () => {
      if (onEdit) {
        playOpenDialogSound();
        onEdit(task);
      }
  }
  
  const handleConceptClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      playOpenDialogSound();
      setIsConceptDialogOpen(true);
  }

  const ActionsMenu = (
    <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => {e.stopPropagation()}} onPointerDown={(e) => e.stopPropagation()}>
             <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground flex-shrink-0"
             >
                <MoreVertical className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
            align="end"
            className="bg-popover/80 backdrop-blur-lg border-white/10"
        >
            <DropdownMenuItem onSelect={handleEditClick}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit/Lihat Detail</span>
            </DropdownMenuItem>
            
            <DialogTrigger asChild>
                <DropdownMenuItem 
                    onSelect={handleConceptClick}
                >
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    <span>Konsep Visual AI</span>
                </DropdownMenuItem>
            </DialogTrigger>

            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Hapus</span>
                </DropdownMenuItem>
            </AlertDialogTrigger>
        </DropdownMenuContent>
    </DropdownMenu>
  );
  
  const cardStyle: React.CSSProperties = isOverlay ? {} : {
    '--glow-x': glow.x,
    '--glow-y': glow.y,
    '--glow-opacity': glow.opacity,
    '--rotate-x': `${rotate.x}deg`,
    '--rotate-y': `${rotate.y}deg`,
    '--status-color': statusStyles[task.status].color,
    '--caret-color': statusStyles[task.status].caretColor,
    transform: `perspective(1000px) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))`,
    transition: 'transform 0.1s ease-out',
  } as React.CSSProperties;

  const cardContent = (
    <Card 
        ref={cardRef}
        style={cardStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
        "relative group overflow-hidden glass-card transition-all duration-300",
        !isMobile && "cursor-pointer",
        isOverlay && "ring-2 ring-primary shadow-2xl shadow-primary/50",
    )}>
       {!isOverlay && !isMobile && (
          <>
            <div 
              className="absolute inset-0 z-0 opacity-[var(--glow-opacity)] transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at var(--glow-x) var(--glow-y), var(--status-color), transparent 40%)`,
              }}
            />
            <div className="absolute inset-0 z-0 bg-card/60" />
          </>
        )}
      <div className="relative z-10 flex flex-col h-full">
        <div className={cn("absolute left-0 top-0 h-full w-1 bg-gradient-to-b", statusStyles[task.status].gradFrom, statusStyles[task.status].gradTo)} />
        <CardHeader className="relative p-4 pb-2" onClick={handleHeaderClick} data-dnd-handle={!isMobile}>
            <div className="flex justify-between items-start gap-2">
                <div className="flex-grow min-w-0">
                    <CardTitle className="text-base font-headline mb-1 text-foreground truncate">
                        {task.customerName}
                    </CardTitle>
                    <CardDescription className="text-sm truncate">{task.description}</CardDescription>
                </div>
                <div className='flex-shrink-0'>
                    {ActionsMenu}
                </div>
            </div>
        </CardHeader>
        <CardContent className="relative p-4 pt-2 mt-auto flex justify-between items-center">
             <div className="flex items-center gap-2">
                 <TaskDescriptionSpeaker task={task} />
                 <span
                    className={cn(
                        "text-xs font-medium h-4 typing-cursor",
                        statusStyles[task.status].text
                    )}
                 >
                    {animatedStatusText}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {displayDate && (
                  <Badge variant="outline" className="border-white/20 bg-black/10">
                      {format(displayDate, 'dd/MM/yy')}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-black/20 text-muted-foreground px-2 py-1 h-auto font-mono text-xs">
                    {sourceDisplayMap[task.source]}
                </Badge>
            </div>
        </CardContent>
      </div>
    </Card>
  )

  return (
    <AlertDialog>
        <Dialog open={isConceptDialogOpen} onOpenChange={setIsConceptDialogOpen}>
            <div ref={ref} {...props} onClick={handleCardClick} data-dnd-handle={!isMobile}>
                {cardContent}
            </div>
            {isConceptDialogOpen && <ConceptImageGenerator task={task} />}
        </Dialog>
        <AlertDialogContent className="glass-card max-w-[calc(100vw-2rem)] sm:max-w-md">
            <AlertDialogHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <AlertDialogTitle className="text-center">Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                    Tindakan ini akan menghapus tugas untuk <br/> <span className="font-medium text-foreground">{task.customerName}</span> secara permanen.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row items-center justify-center gap-2 pt-4">
                <AlertDialogCancel className="mt-0">Batal</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    Lanjutkan
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
});

TaskCard.displayName = "TaskCard";
