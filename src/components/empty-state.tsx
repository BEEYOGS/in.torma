
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
           @keyframes float-piece-1 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-2px, -4px); }
            100% { transform: translate(0, 0); }
          }
           .animate-float-piece-1 {
            animation: float-piece-1 8s ease-in-out infinite;
          }
           @keyframes float-piece-2 {
            0% { transform: translate(0, 0); }
            50% { transform: translate(2px, 4px); }
            100% { transform: translate(0, 0); }
          }
           .animate-float-piece-2 {
            animation: float-piece-2 8s ease-in-out infinite;
          }
        `}
      </style>
      <div className="relative cursor-pointer">
        <div className="animate-float">
          <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-metal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B7280" />
                <stop offset="50%" stopColor="#D1D5DB" />
                <stop offset="100%" stopColor="#4B5563" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Main Body */}
            <g>
                {/* Back pieces */}
                <path d="M 80 80 Q 70 100 80 120 L 50 110 Q 40 100 50 90 Z" fill="url(#grad-metal)" className="animate-float-piece-1" style={{transition: 'transform 0.2s ease-out'}}/>
                <path d="M 120 80 Q 130 100 120 120 L 150 110 Q 160 100 150 90 Z" fill="url(#grad-metal)" className="animate-float-piece-2" style={{transition: 'transform 0.2s ease-out'}}/>

                {/* Central Sphere */}
                <circle cx="100" cy="100" r="40" fill="#2D3748" stroke="#1A202C" strokeWidth="2"/>
                <circle cx="100" cy="100" r="35" fill="url(#grad-metal)"/>
                
                {/* Glowing Eye */}
                <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`} style={{transition: 'transform 0.2s ease-out'}}>
                    <circle cx="100" cy="100" r="20" fill="#111"/>
                    <circle cx="100" cy="100" r="15" fill="hsl(var(--primary))" className="animate-eye-glow"/>
                    <circle cx="100" cy="100" r="5" fill="white" opacity="0.8"/>
                </g>
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
