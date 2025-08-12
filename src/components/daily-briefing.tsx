
'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { useSound } from '@/hooks/use-sound';

interface DailyBriefingProps {
  children: React.ReactElement;
  onBriefingOpen: () => void;
}

export function DailyBriefing({ children, onBriefingOpen }: DailyBriefingProps) {
  const playOpenSound = useSound('https://www.myinstants.com/media/sounds/swoosh-1.mp3', 0.5);

  const handleOpenBriefing = (e: React.MouseEvent) => {
    e.preventDefault();
    playOpenSound();
    onBriefingOpen();
  };
  
  const childProps = {
    onClick: handleOpenBriefing,
  }

  const trigger = React.cloneElement(children, childProps);

  if (React.isValidElement(children)) {
    return trigger;
  }

  // Fallback for non-element children or legacy usage
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenBriefing}
          className="text-muted-foreground hover:text-foreground"
        >
          <Users />
          <span className="sr-only">Rangkuman Harian</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Rangkuman Harian</p>
      </TooltipContent>
    </Tooltip>
  );
}
