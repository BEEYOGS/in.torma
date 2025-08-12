
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
          @keyframes eye-glow {
            0% { box-shadow: 0 0 5px 2px hsl(var(--primary) / 0.7); }
            50% { box-shadow: 0 0 15px 5px hsl(var(--primary) / 0.5); }
            100% { box-shadow: 0 0 5px 2px hsl(var(--primary) / 0.7); }
          }
          .animate-eye-glow {
              animation: eye-glow 3s ease-in-out infinite;
          }
        `}
      </style>
      <div className="relative cursor-pointer">
        <div className="animate-float">
          <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-blue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0A3479" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="grad-red" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8C0D26" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
              <linearGradient id="grad-grey" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4A5568" />
                <stop offset="100%" stopColor="#A0AEC0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Chest */}
            <path d="M 70 120 L 130 120 L 140 160 L 60 160 Z" fill="url(#grad-red)" stroke="#1A202C" strokeWidth="2" />
            <path d="M 80 125 L 120 125 L 125 140 L 75 140 Z" fill="url(#grad-grey)" />
            <rect x="95" y="128" width="10" height="10" fill="#FBBF24" />
            
            {/* Head */}
            <path d="M 75 40 L 125 40 L 135 70 L 120 115 L 80 115 L 65 70 Z" fill="url(#grad-blue)" stroke="#1A202C" strokeWidth="2" />
            
            {/* Faceplate */}
            <path d="M 85 80 L 115 80 L 120 100 L 80 100 Z" fill="url(#grad-grey)" />
            <path d="M 88 85 L 112 85 L 115 95 L 85 95 Z" fill="#2D3748" />

            {/* Eyes - glow effect will be applied via div */}
            <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
              <rect x="90" y="65" width="20" height="8" fill="hsl(var(--primary))" className="animate-eye-glow" style={{borderRadius: '2px'}}/>
            </g>

            {/* Antennas */}
            <rect x="68" y="50" width="5" height="20" fill="url(#grad-blue)" transform="rotate(-15 70.5 60)" />
            <rect x="127" y="50" width="5" height="20" fill="url(#grad-blue)" transform="rotate(15 129.5 60)" />

            {/* Forehead Crest */}
            <path d="M 95 42 L 105 42 L 102 55 L 98 55 Z" fill="url(#grad-red)" />

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

