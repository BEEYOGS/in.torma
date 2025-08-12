
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
    const moveX = Math.max(-7, Math.min(7, deltaX * 0.03));
    const moveY = Math.max(-5, Math.min(5, deltaY * 0.03));
    
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
          @keyframes eye-glow {
            0% { filter: drop-shadow(0 0 3px hsl(var(--primary) / 0.9)); }
            50% { filter: drop-shadow(0 0 10px hsl(var(--primary) / 0.7)); }
            100% { filter: drop-shadow(0 0 3px hsl(var(--primary) / 0.9)); }
          }
          .animate-eye-glow {
              animation: eye-glow 3s ease-in-out infinite;
          }
           @keyframes wing-flap-1 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-5px, -10px) rotate(-5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
           .animate-wing-flap-1 {
            animation: wing-flap-1 8s ease-in-out infinite;
          }
           @keyframes wing-flap-2 {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(5px, -10px) rotate(5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
           .animate-wing-flap-2 {
            animation: wing-flap-2 8s ease-in-out infinite;
          }
        `}
      </style>
      <div className="relative cursor-pointer">
        <div className="animate-float">
            <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad-wing" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary) / 0.1)" />
                        <stop offset="50%" stopColor="hsl(var(--primary) / 0.5)" />
                        <stop offset="100%" stopColor="hsl(var(--primary) / 0.1)" />
                    </linearGradient>
                    <filter id="glow-wing" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Wings */}
                <g filter="url(#glow-wing)">
                    <path d="M 80 100 C 20 80, 20 120, 80 100 Q 50 50, 20 70 C 40 130, 80 120, 80 100 Z" fill="url(#grad-wing)" className="animate-wing-flap-1" style={{transformOrigin: '80px 100px'}}/>
                    <path d="M 120 100 C 180 80, 180 120, 120 100 Q 150 50, 180 70 C 160 130, 120 120, 120 100 Z" fill="url(#grad-wing)" className="animate-wing-flap-2" style={{transformOrigin: '120px 100px'}}/>
                </g>

                {/* Central Eye */}
                <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`} style={{transition: 'transform 0.2s ease-out'}}>
                    <circle cx="100" cy="100" r="30" fill="#111" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2"/>
                    <circle cx="100" cy="100" r="25" fill="black"/>
                    <circle cx="100" cy="100" r="18" fill="hsl(var(--primary))" className="animate-eye-glow"/>
                    <circle cx="100" cy="100" r="8" fill="white" opacity="0.9"/>
                    <circle cx="100" cy="100" r="4" fill="black" />
                </g>
            </svg>
        </div>
        <div 
          className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black rounded-full filter blur-lg animate-shadow-pulse"
        />
      </div>
      <h3 className="mt-8 text-lg font-semibold text-foreground">Sistem siap...</h3>
      <p className="mt-2 text-sm">
        Belum ada tugas terdeteksi. Menunggu perintah baru.
      </p>
    </div>
  );
}
