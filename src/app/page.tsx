'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { TaskBoard } from '@/components/task-board';
import { listenToTasks } from '@/services/task-service';
import type { Task } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToTasks((fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Header tasks={tasks} />
      <div className="flex-grow">
        <TaskBoard tasks={tasks} loading={loading} />
      </div>
    </main>
  );
}
