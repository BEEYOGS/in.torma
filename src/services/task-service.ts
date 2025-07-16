import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, onSnapshot, DocumentData } from 'firebase/firestore';
import type { Task, TaskStatus } from '@/types/task';

const tasksCollection = collection(db, 'tasks');

export const getTasks = async (): Promise<Task[]> => {
    const snapshot = await getDocs(tasksCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

export const listenToTasks = (callback: (tasks: Task[]) => void) => {
    const q = query(tasksCollection);
    return onSnapshot(q, (querySnapshot) => {
        const tasks: Task[] = [];
        querySnapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() } as Task);
        });
        callback(tasks);
    });
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<string> => {
    const docRef = await addDoc(tasksCollection, task);
    return docRef.id;
};

export const updateTask = async (id: string, updates: Partial<Omit<Task, 'id'>>): Promise<void> => {
    const taskDoc = doc(db, 'tasks', id);
    await updateDoc(taskDoc, updates);
};

export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<void> => {
    const taskDoc = doc(db, 'tasks', id);
    await updateDoc(taskDoc, { status });
};

export const deleteTask = async (id: string): Promise<void> => {
    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);
};
