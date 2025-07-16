export type TaskStatus = 'Proses Desain' | 'Proses ACC' | 'Selesai';
export type TaskSource = 'N' | 'CS' | 'Admin';

export interface Task {
  id: string;
  customerName: string;
  description: string;
  status: TaskStatus;
  source: TaskSource;
  dueDate?: string;
}
