
'use client';

import React, { useState, useRef } from 'react';

export function EmptyState() {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Center point adjusted for the character's face area
    const centerX = left + width / 2;
    const centerY = top + height * 0.45;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Constrain the movement to within the eye sockets
    const moveX = Math.max(-2.5, Math.min(2.5, deltaX * 0.02));
    const moveY = Math.max(-2, Math.min(2, deltaY * 0.02));
    
    setEyePosition({ x: moveX, y: moveY });
  };
  
  const resetEyePosition = () => {
    setEyePosition({ x: 0, y: 0 });
  }

  return (
    <div 
        ref={containerRef} 
        className="flex flex-col items-center justify-center text-center mt-16 text-muted-foreground"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetEyePosition}
    >
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes shadow-pulse {
            0% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(0.8); opacity: 0.1; }
            100% { transform: scale(1); opacity: 0.2; }
          }
          .animate-shadow-pulse {
            animation: shadow-pulse 6s ease-in-out infinite;
          }
        `}
      </style>
      <div className="relative cursor-pointer">
        <div className="animate-float">
           <svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="ultraman-red" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#ff4d4d"/>
                        <stop offset="100%" stopColor="#d92626"/>
                    </linearGradient>
                    <linearGradient id="ultraman-silver" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#e0e0e0"/>
                        <stop offset="100%" stopColor="#b0b0b0"/>
                    </linearGradient>
                    <radialGradient id="color-timer-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#89f7fe"/>
                        <stop offset="70%" stopColor="#66a6ff"/>
                        <stop offset="100%" stopColor="#5378c6"/>
                    </radialGradient>
                    <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="hsl(var(--primary))" floodOpacity="0.2"/>
                    </filter>
                    <linearGradient id="file-grad" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#ffffff"/>
                        <stop offset="100%" stopColor="#f0f0f0"/>
                    </linearGradient>
                </defs>

                <g style={{filter: 'url(#subtle-glow)'}}>
                    {/* File Icon */}
                    <g transform="translate(25 30) rotate(-10 50 50)">
                        <path d="M 50,70 L 120,70 L 120,170 L 50,170 Z" fill="url(#file-grad)" stroke="#d0d0d0" strokeWidth="2"/>
                        <path d="M 120,70 L 90,70 L 90,100 Z" fill="#d0d0d0" />
                        <path d="M 120,70 L 90,100" stroke="#b0b0b0" strokeWidth="1" />
                        <rect x="65" y="115" width="40" height="5" rx="2" fill="#c0c0c0"/>
                        <rect x="65" y="130" width="40" height="5" rx="2" fill="#c0c0c0"/>
                        <rect x="65" y="145" width="25" height="5" rx="2" fill="#c0c0c0"/>
                    </g>
                
                    {/* Ultraman Body */}
                    <path d="M 125,110 C 100,110 90,180 90,180 L 160,180 C 160,180 150,110 125,110 Z" fill="url(#ultraman-silver)" />
                    <path d="M 125,110 C 115,110 110,180 110,180 L 140,180 C 140,180 135,110 125,110 Z" fill="url(#ultraman-red)" />
                    
                    {/* Ultraman Head */}
                    <path d="M 125,40 C 90,40 80,110 80,110 L 170,110 C 170,110 160,40 125,40 Z" fill="url(#ultraman-silver)" />
                    <path d="M 125,40 C 120,40 120,110 120,110 L 130,110 C 130,110 130,40 125,40 Z" fill="url(#ultraman-red)" />
                    <path d="M 125,30 L 125, 45" stroke="url(#ultraman-red)" strokeWidth="4" />
                    
                    {/* Color Timer */}
                    <circle cx="125" cy="130" r="8" fill="#1A2238"/>
                    <circle cx="125" cy="130" r="6" fill="url(#color-timer-glow)"/>

                    {/* Eyes */}
                    <g id="eyes" transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
                        <path d="M 100,75 C 110,70 120,75 120,85 C 115,90 105,90 100,85 Z" fill="hsl(var(--primary))" opacity="0.9"/>
                        <path d="M 150,75 C 140,70 130,75 130,85 C 135,90 145,90 150,85 Z" fill="hsl(var(--primary))" opacity="0.9"/>
                        <path d="M 101,76 C 110,72 119,76 119,85 C 115,88 105,88 101,84 Z" fill="hsl(var(--primary))" style={{filter: 'brightness(1.2)'}}/>
                        <path d="M 149,76 C 140,72 131,76 131,85 C 135,88 145,88 149,84 Z" fill="hsl(var(--primary))" style={{filter: 'brightness(1.2)'}}/>
                    </g>
                </g>
            </svg>
        </div>
        <div 
          className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-1/2 h-4 bg-black rounded-full filter blur-lg animate-shadow-pulse"
        />
      </div>
      <h3 className="mt-8 text-lg font-semibold text-foreground">Semua tugas selesai!</h3>
      <p className="mt-2 text-sm">
        Papan tugas kosong. Saatnya memulai misi baru.
      </p>
    </div>
  );
}
