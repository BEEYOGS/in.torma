
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Space_Grotesk } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'in.torma: Collaborative Task Board',
  description: 'A collaborative task board for teams.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'in.torma',
  },
};

export const viewport: Viewport = {
  themeColor: '#101116',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
       <head>
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='hsl(40, 90%25, 60%25)' /%3E%3Cstop offset='100%25' stop-color='hsl(260, 85%25, 65%25)' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23g)' d='M50,5 A45,45 0 1 1 5,50 A45,45 0 0 1 50,5 M50,15 A35,35 0 1 0 85,50 A35,35 0 0 0 50,15z'/%3E%3C/svg%3E" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
