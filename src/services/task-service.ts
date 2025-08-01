'use client';

import type { Task, TaskStatus } from '@/types/task';

const TASKS_STORAGE_KEY = 'in.torma.tasks';

// Helper to get tasks from localStorage
const getTasksFromStorage = (): Task[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Failed to parse tasks from localStorage", error);
    return [];
  }
};

// Helper to save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
        // Dispatch a custom event to notify other parts of the app that tasks have changed.
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
    }
};

// This function can be used to explicitly set the entire task list, e.g., after reordering.
export const setTasksInStorage = (tasks: Task[]) => {
    saveTasksToStorage(tasks);
}

export const getTasks = async (): Promise<Task[]> => {
  // Simulate async operation to maintain consistency with the previous API
  return Promise.resolve(getTasksFromStorage());
};

export const listenToTasks = (callback: (tasks: Task[]) => void): (() => void) => {
    // Initial call
    callback(getTasksFromStorage());

    const handleStorageChange = () => {
        callback(getTasksFromStorage());
    };

    if (typeof window !== 'undefined') {
        // Listen for our custom 'storage' event or the standard 'storage' event for cross-tab sync
        window.addEventListener('storage', handleStorageChange);
    }

    // Return an unsubscribe function
    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('storage', handleStorageChange);
        }
    };
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  const tasks = getTasksFromStorage();
  const newId = new Date().getTime().toString(); // Simple unique ID
  const newTask: Task = { id: newId, ...task };
  const updatedTasks = [...tasks, newTask];
  saveTasksToStorage(updatedTasks);
  return Promise.resolve(newId);
};

export const updateTask = async (id: string, updates: Partial<Omit<Task, 'id'>>): Promise<void> => {
  const tasks = getTasksFromStorage();
  const updatedTasks = tasks.map(task => 
    task.id === id ? { ...task, ...updates } : task
  );
  saveTasksToStorage(updatedTasks);
  return Promise.resolve();
};

export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<void> => {
  return updateTask(id, { status });
};

export const deleteTask = async (id: string): Promise<void> => {
  const tasks = getTasksFromStorage();
  const updatedTasks = tasks.filter(task => task.id !== id);
  saveTasksToStorage(updatedTasks);
  return Promise.resolve();
};
