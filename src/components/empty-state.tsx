
'use client';

import React, { useState, useRef } from 'react';

export function EmptyState() {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Center point of the container
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Constrain the movement for a subtle effect
    const moveX = Math.max(-5, Math.min(5, deltaX * 0.02));
    const moveY = Math.max(-3, Math.min(3, deltaY * 0.02));
    
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
           <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="robot-body" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#9ca3af" />
                        <stop offset="100%" stopColor="#4b5563" />
                    </linearGradient>
                    <radialGradient id="robot-eye-glow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </radialGradient>
                    <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="hsl(var(--primary))" floodOpacity="0.2"/>
                    </filter>
                </defs>
                
                <g style={{filter: 'url(#subtle-glow)'}}>
                    {/* Main Body */}
                    <circle cx="100" cy="100" r="60" fill="url(#robot-body)"/>
                    <path d="M 60 150 L 140 150 A 20 20 0 0 1 140 150 L 60 150 Z" fill="#374151" />

                    {/* Eye */}
                    <circle cx="100" cy="100" r="35" fill="#111827"/>
                    <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
                       <circle cx="100" cy="100" r="38" fill="url(#robot-eye-glow)" opacity="0.5"/>
                       <circle cx="100" cy="100" r="15" fill="hsl(var(--primary))"/>
                       <circle cx="100" cy="100" r="5" fill="white" opacity="0.8"/>
                    </g>

                     {/* Antenna */}
                    <line x1="100" y1="40" x2="100" y2="20" stroke="#9ca3af" strokeWidth="3"/>
                    <circle cx="100" cy="20" r="5" fill="hsl(var(--primary))"/>
                </g>
            </svg>
        </div>
        <div 
          className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1/2 h-4 bg-black rounded-full filter blur-lg animate-shadow-pulse"
        />
      </div>
      <h3 className="mt-8 text-lg font-semibold text-foreground">Sistem siap...</h3>
      <p className="mt-2 text-sm">
        Belum ada tugas terdeteksi. Menunggu perintah baru.
      </p>
    </div>
  );
}
