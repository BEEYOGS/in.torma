

'use client';

export const showSystemNotification = (title: string, body: string) => {
  if (!('Notification' in window)) {
    console.error("Browser tidak mendukung notifikasi desktop.");
    return;
  }

  const doNotify = () => {
    new Notification(title, {
      body: body,
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='hsl(40, 90%25, 60%25)' /%3E%3Cstop offset='100%25' stop-color='hsl(260, 85%25, 65%25)' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23g)' d='M50,5 A45,45 0 1 1 5,50 A45,45 0 0 1 50,5 M50,15 A35,35 0 1 0 85,50 A35,35 0 0 0 50,15z'/%3E%3C/svg%3E",
    });
  }

  if (Notification.permission === "granted") {
    doNotify();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        doNotify();
      }
    });
  }
};
