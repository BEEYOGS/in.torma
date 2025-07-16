
'use client';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-16 text-muted-foreground">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          @keyframes shadow-pulse {
            0% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(0.8); opacity: 0.1; }
            100% { transform: scale(1); opacity: 0.2; }
          }
          .animate-shadow-pulse {
            animation: shadow-pulse 4s ease-in-out infinite;
          }
        `}
      </style>
      <div className="relative">
        <div className="animate-float">
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Body */}
            <rect x="25" y="50" width="100" height="75" rx="20" fill="hsl(var(--secondary))" />
            {/* Screen */}
            <rect x="40" y="65" width="70" height="45" rx="10" fill="hsl(var(--background))" />
            {/* Eye */}
            <circle cx="75" cy="87.5" r="7" fill="hsl(var(--primary))" />
            {/* Antenna */}
            <line x1="75" y1="50" x2="75" y2="30" stroke="hsl(var(--secondary-foreground))" strokeWidth="4" />
            <circle cx="75" cy="25" r="5" fill="hsl(var(--primary))" />
          </svg>
        </div>
        <div 
          className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black rounded-full filter blur-md animate-shadow-pulse"
        />
      </div>
      <h3 className="mt-8 text-lg font-semibold text-foreground">Semua tugas selesai!</h3>
      <p className="mt-2 text-sm">
        Tidak ada tugas untuk ditampilkan saat ini. Tambahkan tugas baru untuk memulai.
      </p>
    </div>
  );
}
