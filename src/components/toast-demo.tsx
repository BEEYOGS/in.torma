'use client';

import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SidebarMenuButton } from './ui/sidebar';

export function ToastDemo() {
  const { toast } = useToast();

  const handleShowToast = () => {
    toast({
      title: 'Notifikasi Baru!',
      description: 'Ini adalah contoh notifikasi toast.',
      action: (
        <a href="#" className="font-bold">
          Lihat
        </a>
      ),
    });
  };

  return (
    <SidebarMenuButton
      onClick={handleShowToast}
      className="w-full justify-start"
      tooltip="Tampilkan Notifikasi"
    >
      <Bell />
      <span className="group-data-[collapsible=icon]:hidden">Notifikasi</span>
    </SidebarMenuButton>
  );
}
