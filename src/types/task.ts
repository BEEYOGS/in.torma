export type TaskStatus = 'Proses Desain' | 'Menunggu Konfirmasi' | 'Selesai';
export type TaskSource = 'CECE' | 'CS' | 'Admin';

export interface Task {
  id: string;
  customerName: string;
  description: string;
  status: TaskStatus;
  source: TaskSource;
  dueDate?: string;
}
