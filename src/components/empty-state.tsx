
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
    const centerY = top + height * 0.4;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Constrain the movement to within the eye sockets
    const moveX = Math.max(-3, Math.min(3, deltaX * 0.03));
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
           @keyframes beam-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
           }
          .animate-beam-pulse {
            animation: beam-pulse 3s ease-in-out infinite;
          }
        `}
      </style>
      <div className="relative cursor-pointer">
        <div className="animate-float">
           <svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <linearGradient id="ufo-metal" x1="0.5" y1="0" x2="0.5" y2="1">
                      <stop offset="0%" stopColor="#c0c5d1"/>
                      <stop offset="100%" stopColor="#8e94a1"/>
                  </linearGradient>
                  <radialGradient id="ufo-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0"/>
                  </radialGradient>
                  <linearGradient id="alien-skin" x1="0.5" y1="0" x2="0.5" y2="1">
                      <stop offset="0%" stopColor="#a7e8a1"/>
                      <stop offset="100%" stopColor="#6fbc68"/>
                  </linearGradient>
                   <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="hsl(var(--primary))" floodOpacity="0.2"/>
                    </filter>
              </defs>
              
              <g style={{filter: 'url(#subtle-glow)'}}>
                  {/* Tractor Beam */}
                  <polygon points="100,150 150,150 180,220 70,220" fill="url(#ufo-glow)" className="animate-beam-pulse"/>
                  
                  {/* UFO Main Body */}
                  <path d="M 50,120 Q 125,70 200,120 L 180,150 L 70,150 Z" fill="url(#ufo-metal)"/>
                  <ellipse cx="125" cy="120" rx="75" ry="30" fill="url(#ufo-metal)" />
                  
                  {/* UFO Cockpit */}
                  <path d="M 90,120 Q 125,90 160,120" fill="rgba(230, 245, 255, 0.4)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>

                  {/* UFO Lights */}
                  <circle cx="85" cy="145" r="5" fill="hsl(var(--primary))" className="animate-pulse"/>
                  <circle cx="125" cy="150" r="5" fill="hsl(var(--primary))" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
                  <circle cx="165" cy="145" r="5" fill="hsl(var(--primary))" className="animate-pulse" style={{animationDelay: '1s'}}/>

                  {/* Alien */}
                  <g transform="translate(0, 5)">
                      <path d="M 125, 90 a 15,20 0 1,1 0.1,0" fill="url(#alien-skin)" />
                      <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
                          <circle cx="118" cy="100" r="4" fill="black"/>
                          <circle cx="132" cy="100" r="4" fill="black"/>
                          <circle cx="117" cy="99" r="1.5" fill="white"/>
                          <circle cx="131" cy="99" r="1.5" fill="white"/>
                      </g>
                  </g>
              </g>
          </svg>
        </div>
        <div 
          className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-1/2 h-4 bg-black rounded-full filter blur-lg animate-shadow-pulse"
        />
      </div>
      <h3 className="mt-8 text-lg font-semibold text-foreground">Kosmos ini kosong...</h3>
      <p className="mt-2 text-sm">
        Tidak ada tugas yang terdeteksi. Waktunya memulai misi baru!
      </p>
    </div>
  );
}
