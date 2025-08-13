
'use client';

import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenuItem } from './ui/dropdown-menu';

export function SystemNotificationDemo() {
  const { toast } = useToast();

  const handleShowSystemNotification = () => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      toast({
        variant: "destructive",
        title: "Browser Tidak Mendukung",
        description: "Browser Anda tidak mendukung notifikasi desktop.",
      });
      return;
    }

    // Check the current permission status
    if (Notification.permission === "granted") {
      // If it's granted, create the notification
      new Notification("Sistem Notifikasi", {
        body: "Ini adalah notifikasi dari sistem.",
        icon: "/favicon.ico", // Optional: add an icon
      });
    } else if (Notification.permission !== "denied") {
      // If permission is not denied, ask for it
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Sistem Notifikasi", {
            body: "Terima kasih! Anda akan menerima pembaruan.",
            icon: "/favicon.ico",
          });
        }
      });
    } else {
        // If permission is denied, inform the user
        toast({
            variant: 'warning',
            title: 'Notifikasi Diblokir',
            description: 'Anda telah memblokir notifikasi. Aktifkan di pengaturan browser Anda.',
          });
    }
  };

  return (
    <DropdownMenuItem onSelect={handleShowSystemNotification}>
      <Bell className="mr-2 h-4 w-4" />
      <span>Notifikasi Sistem</span>
    </DropdownMenuItem>
  );
}
