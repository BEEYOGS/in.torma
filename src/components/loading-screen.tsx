
'use client';

import { cn } from "@/lib/utils";

const Logo = () => (
    <svg
      width="80"
      height="80"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-20 w-20 text-primary"
    >
      <defs>
        <linearGradient id="grad-loader" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(260 85% 65%)" />
        </linearGradient>
      </defs>
      <path
        d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4ZM16 25C11.0294 25 7 20.9706 7 16C7 11.0294 11.0294 7 16 7C20.9706 7 25 11.0294 25 16C25 20.9706 20.9706 25 16 25Z"
        fill="url(#grad-loader)"
        opacity="0.4"
      />
      <path
        d="M16 9C12.134 9 9 12.134 9 16C9 19.866 12.134 23 16 23C19.866 23 23 19.866 23 16C23 12.134 19.866 9 16 9ZM16 20C13.7909 20 12 18.2091 12 16C12 13.7909 13.7909 12 16 12C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20Z"
        fill="url(#grad-loader)"
      />
    </svg>
  );

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background animate-in fade-in duration-500">
            <style>
                {`
                @keyframes pulsate-glow {
                    0%, 100% { 
                        transform: scale(1);
                        filter: drop-shadow(0 0 10px hsl(var(--primary) / 0.4));
                    }
                    50% { 
                        transform: scale(1.05);
                        filter: drop-shadow(0 0 25px hsl(var(--primary) / 0.6));
                    }
                }
                .animate-pulsate-glow {
                    animation: pulsate-glow 2.5s ease-in-out infinite;
                }
                `}
            </style>
            <div className="animate-pulsate-glow">
                <Logo />
            </div>
            <p className="mt-4 text-muted-foreground animate-pulse">Memuat...</p>
        </div>
    );
}
