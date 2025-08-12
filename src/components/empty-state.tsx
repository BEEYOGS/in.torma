
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
    const moveX = Math.max(-5, Math.min(5, deltaX * 0.03));
    const moveY = Math.max(-3, Math.min(3, deltaY * 0.03));
    
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
                        <stop offset="0%" stopColor="#84cc16" /> 
                        <stop offset="100%" stopColor="#4d7c0f" /> 
                    </linearGradient>
                    <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="hsl(var(--primary))" floodOpacity="0.2"/>
                    </filter>
                </defs>
                
                <g style={{filter: 'url(#subtle-glow)'}}>
                    {/* Alien Body */}
                    <path d="M 100,20 C 60,20 40,70 40,110 C 40,160 70,180 100,180 C 130,180 160,160 160,110 C 160,70 140,20 100,20 Z" fill="url(#alien-skin)"/>
                    
                    {/* Antenna */}
                    <path d="M 100,20 Q 100,0 110,10" stroke="#4d7c0f" strokeWidth="4" fill="none" strokeLinecap="round"/>
                    <circle cx="112" cy="8" r="6" fill="#facc15" />

                    {/* Eyes */}
                    <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
                        <ellipse cx="80" cy="90" rx="20" ry="25" fill="white" />
                        <ellipse cx="120" cy="90" rx="20" ry="25" fill="white" />
                        <circle cx="80" cy="90" r="10" fill="black"/>
                        <circle cx="120" cy="90" r="10" fill="black"/>
                        <circle cx="76" cy="86" r="3" fill="white"/>
                        <circle cx="116" cy="86" r="3" fill="white"/>
                    </g>

                    {/* Mouth */}
                    <path d="M 90,135 Q 100,145 110,135" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round"/>
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
