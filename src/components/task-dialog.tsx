
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import type { Task, TaskSource, TaskStatus } from '@/types/task';
import { addTask, updateTask } from '@/services/task-service';
import { useToast } from '@/hooks/use-toast';

const taskSchema = z.object({
  customerName: z.string().min(1, 'Nama konsumen wajib diisi.'),
  description: z.string().min(1, 'Deskripsi wajib diisi.'),
  status: z.enum(['Proses Desain', 'Proses ACC', 'Selesai']),
  source: z.enum(['N', 'CS', 'Admin']),
  dueDate: z.date().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  prefillData?: Partial<TaskFormValues & { dueDate?: string | Date }>;
}

export function TaskDialog({ isOpen, onOpenChange, task, prefillData }: TaskDialogProps) {
  const { toast } = useToast();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const getDefaultValues = () => {
    if (task) {
      return { ...task, dueDate: task.dueDate ? parseISO(task.dueDate) : undefined };
    }
    if (prefillData) {
      return {
        customerName: prefillData.customerName || '',
        description: prefillData.description || '',
        status: prefillData.status || 'Proses Desain',
        source: prefillData.source || 'CS',
        dueDate: prefillData.dueDate
          ? typeof prefillData.dueDate === 'string'
            ? parseISO(prefillData.dueDate)
            : prefillData.dueDate
          : undefined,
      };
    }
    return {
      customerName: '',
      description: '',
      status: 'Proses Desain' as TaskStatus,
      source: 'CS' as TaskSource,
      dueDate: undefined,
    };
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (isOpen) {
        form.reset(getDefaultValues());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, task, prefillData]);

  const onSubmit = async (data: TaskFormValues) => {
    const toYYYYMMDD = (date: Date | undefined) => {
        if (!date) return undefined;
        // This will format the date in the local timezone, but to YYYY-MM-DD format.
        // The issue was in parsing it back.
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    };

    const taskData = {
      ...data,
      dueDate: toYYYYMMDD(data.dueDate),
    };

    try {
      if (task) {
        await updateTask(task.id, taskData);
        toast({ title: 'Tugas Diperbarui', description: `Tugas untuk ${data.customerName} telah diperbarui.` });
      } else {
        await addTask(taskData as Omit<Task, 'id'>);
        toast({ title: 'Tugas Ditambahkan', description: `Tugas baru untuk ${data.customerName} telah ditambahkan.` });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal Menyimpan Tugas',
        description: 'Terjadi kesalahan saat menyimpan tugas.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm max-w-[90vw] glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="font-headline">{task ? 'Edit Tugas' : 'Tambah Tugas Baru'}</DialogTitle>
          <DialogDescription>
            {task ? 'Perbarui detail tugas di bawah ini.' : 'Isi detail tugas baru di bawah ini.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Konsumen</FormLabel>
                  <FormControl>
                    <Input placeholder="cth: Rinan Corp" {...field} className="bg-secondary/50 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="cth: Desain ulang spanduk" {...field} className="bg-secondary/50 border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Status Desain</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {(['Proses Desain', 'Proses ACC', 'Selesai'] as TaskStatus[]).map(status => (
                        <FormItem key={status} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={status} />
                          </FormControl>
                          <FormLabel className="font-normal">{status}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sumber Tugas</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-secondary/50 border-white/10">
                        <SelectValue placeholder="Pilih sumber tugas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover/80 backdrop-blur-lg border-white/10">
                      {(['N', 'CS', 'Admin'] as TaskSource[]).map(source => (
                          <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Batas Waktu</FormLabel>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal bg-secondary/50 border-white/10",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 glass-card" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(date) => {
                                field.onChange(date);
                                setIsCalendarOpen(false);
                            }}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <DialogFooter>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
