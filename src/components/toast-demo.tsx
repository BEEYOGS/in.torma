
'use client';

import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenuItem } from './ui/dropdown-menu';

export function ToastDemo() {
  const { toast } = useToast();

  const handleShowToast = () => {
    toast({
      variant: 'default',
      title: 'Sistem Notifikasi',
      description: 'Ini adalah notifikasi dari sistem.',
    });
  };

  return (
    <DropdownMenuItem onSelect={handleShowToast}>
      <Bell className="mr-2 h-4 w-4" />
      <span>Notifikasi Sistem</span>
    </DropdownMenuItem>
  );
}
