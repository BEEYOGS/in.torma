
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
    const moveX = Math.max(-4, Math.min(4, deltaX * 0.02));
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
           <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="alien-skin" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#a3e635" /> 
                        <stop offset="100%" stopColor="#65a30d" /> 
                    </linearGradient>
                    <radialGradient id="eye-gloss" cx="0.4" cy="0.4" r="0.6">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                     <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="hsl(var(--primary))" floodOpacity="0.2"/>
                    </filter>
                </defs>
                
                <g style={{filter: 'url(#subtle-glow)'}}>
                    {/* Body */}
                    <path d="M100 130 C 80 130, 75 150, 75 170 L 125 170 C 125 150, 120 130, 100 130 Z" fill="url(#alien-skin)"/>
                    {/* Head */}
                    <path d="M 50,110 C 50,50 150,50 150,110 C 150,170 120,150 100,150 C 80,150 50,170 50,110 Z" fill="url(#alien-skin)" />
                   
                    {/* Eyes */}
                    <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
                       <ellipse cx="75" cy="100" rx="20" ry="30" fill="#1C1C1C" />
                       <ellipse cx="125" cy="100" rx="20" ry="30" fill="#1C1C1C" />
                       <ellipse cx="75" cy="100" rx="20" ry="30" fill="url(#eye-gloss)" />
                       <ellipse cx="125" cy="100" rx="20" ry="30" fill="url(#eye-gloss)" />
                    </g>
                </g>
            </svg>
        </div>
        <div 
          className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1/2 h-4 bg-black rounded-full filter blur-lg animate-shadow-pulse"
        />
      </div>
      <h3 className="mt-8 text-lg font-semibold text-foreground">Kosmos ini kosong...</h3>
      <p className="mt-2 text-sm">
        Tidak ada tugas yang terdeteksi. Waktunya memulai misi baru!
      </p>
    </div>
  );
}
