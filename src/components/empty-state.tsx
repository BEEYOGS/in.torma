'use client';

import React, { useState, useRef } from 'react';

interface EmptyStateProps {
  isColumn?: boolean;
}

export function EmptyState({ isColumn = false }: EmptyStateProps) {
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
    const moveX = Math.max(-4, Math.min(4, deltaX * 0.03));
    const moveY = Math.max(-3, Math.min(3, deltaY * 0.03));
    
    setEyePosition({ x: moveX, y: moveY });
  };
  
  const resetEyePosition = () => {
    setEyePosition({ x: 0, y: 0 });
  }

  if (isColumn) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 text-xs text-muted-foreground/50 border-2 border-dashed border-border/20 rounded-lg">
        <p>Seret tugas ke sini</p>
      </div>
    )
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
                    <linearGradient id="hair-grad" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#E0E5F0"/>
                        <stop offset="100%" stopColor="#B8C2D8"/>
                    </linearGradient>
                    <linearGradient id="skin-grad" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#fdece3"/>
                        <stop offset="100%" stopColor="#f8d8c8"/>
                    </linearGradient>
                    <radialGradient id="eye-iris-grad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#89f7fe"/>
                        <stop offset="70%" stopColor="#66a6ff"/>
                        <stop offset="100%" stopColor="#5378c6"/>
                    </radialGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="hsl(var(--primary))" floodOpacity="0.3"/>
                    </filter>
                </defs>

                <g style={{filter: 'url(#subtle-glow)'}}>
                    {/* Head */}
                    <path d="M 60,150 C 60,80 190,80 190,150 Q 180,180 125,185 Q 70,180 60,150 Z" fill="url(#skin-grad)"/>
                    {/* Neck */}
                    <path d="M 105,175 C 105,175 110,195 125,195 C 140,195 145,175 145,175 Z" fill="#f8d8c8" />
                    {/* Collar */}
                    <path d="M 100,185 L 150,185 L 145,200 L 105,200 Z" fill="#2c2c44" />
                    <path d="M 105,188 L 145,188 L 142,198 L 108,198 Z" fill="#434364" />
                    <path d="M 125,188 L 125,198" stroke="hsl(var(--primary))" strokeWidth="2"/>

                    {/* Hair Back */}
                    <path d="M 50,110 C 20,160 50,220 70,200 C 90,180 70,120 50,110 Z" fill="url(#hair-grad)" />
                    <path d="M 200,110 C 230,160 200,220 180,200 C 160,180 180,120 200,110 Z" fill="url(#hair-grad)" />
                    <path d="M 55,90 C 60,40 190,40 195,90 L 170,160 L 80,160 Z" fill="#D3D9E9"/>

                    {/* Face shadow from hair */}
                    <path d="M 75,100 C 90,90 160,90 175,100 Q 125,105 75,100 Z" fill="rgba(0,0,0,0.08)" style={{filter: 'blur(1px)'}} />
                    
                    {/* Eyes */}
                    <g id="eyes">
                        {/* Left eye */}
                        <path d="M 80,125 C 90,115 110,115 120,125 C 110,135 90,135 80,125 Z" fill="#fff"/>
                        {/* Right eye */}
                        <path d="M 130,125 C 140,115 160,115 170,125 C 160,135 140,135 130,125 Z" fill="#fff"/>

                        <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
                            {/* Iris */}
                            <circle cx="100" cy="123" r="8" fill="url(#eye-iris-grad)"/>
                            <circle cx="150" cy="123" r="8" fill="url(#eye-iris-grad)"/>
                            {/* Pupil */}
                            <circle cx="100" cy="123" r="4" fill="#1A2238"/>
                            <circle cx="150" cy="123" r="4" fill="#1A2238"/>
                            {/* Highlight */}
                            <circle cx="103" cy="119" r="2.5" fill="#fff" opacity="0.9"/>
                            <circle cx="153" cy="119" r="2.5" fill="#fff" opacity="0.9"/>
                        </g>
                    </g>
                    
                    {/* Hair Front */}
                    <path d="M 55,90 C 60,40 190,40 195,90 Q 125,70 55,90 Z" fill="url(#hair-grad)"/>
                    {/* Bangs */}
                    <path d="M 70,95 L 100,115 L 125,90 L 110,90 Z" fill="#D3D9E9" transform="rotate(-5, 125, 90)"/>
                    <path d="M 125,90 L 150,115 L 180,95 L 140,90 Z" fill="#D3D9E9" transform="rotate(5, 125, 90)"/>

                    {/* Hair Highlight */}
                    <path d="M 100,55 C 110,50 140,50 150,55 C 140,60 110,60 100,55 Z" fill="rgba(255,255,255,0.7)"/>

                    {/* Mouth */}
                    <path d="M 120,145 Q 125,147 130,145" stroke="#a08c84" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

                     {/* Headphone-like accessory */}
                    <path d="M 45,100 C 35,120 35,150 45,170 L 55,165 C 45,145 45,125 55,105 Z" fill="#2c2c44" />
                    <path d="M 205,100 C 215,120 215,150 205,170 L 195,165 C 205,145 205,125 195,105 Z" fill="#2c2c44" />
                    <path d="M 48,102 C 40,120 40,150 48,168 L 55,165 C 47,145 47,125 55,105 Z" fill="#434364" />
                    <path d="M 202,102 C 210,120 210,150 202,168 L 195,165 C 203,145 203,125 195,105 Z" fill="#434364" />
                    <circle cx="50" cy="135" r="3" fill="hsl(var(--primary))" style={{filter: 'url(#glow)'}} />
                    <circle cx="200" cy="135" r="3" fill="hsl(var(--primary))" style={{filter: 'url(#glow)'}} />

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
