'use client';

import { useState, useMemo } from 'react';
import { BarChart, PieChart as RechartsPieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Button } from './ui/button';
import { AreaChart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import type { Task, TaskSource } from '@/types/task';
import { subDays, format, parseISO } from 'date-fns';

interface TaskAnalyticsProps {
    tasks: Task[];
}

const COLORS: Record<TaskSource, string> = {
    'CECE': 'hsl(var(--chart-1))',
    'CS': 'hsl(var(--chart-2))',
    'Admin': 'hsl(var(--chart-3))',
};

export function TaskAnalytics({ tasks }: TaskAnalyticsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const analyticsData = useMemo(() => {
        if (!tasks.length) return { completedLast7Days: [], sourceDistribution: [] };

        // Bar chart data: completed tasks per day for last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
        const completedTasks = tasks.filter(task => task.status === 'Selesai' && task.dueDate);

        const completedLast7Days = last7Days.map(day => {
            const count = completedTasks.filter(task => {
                try {
                    return format(parseISO(task.dueDate!), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                } catch (e) {
                    return false;
                }
            }).length;
            return {
                name: format(day, 'dd/MM'),
                "Tugas Selesai": count,
            };
        });

        // Pie chart data: task distribution by source
        const sourceCounts = tasks.reduce((acc, task) => {
            acc[task.source] = (acc[task.source] || 0) + 1;
            return acc;
        }, {} as Record<TaskSource, number>);

        const sourceDistribution = Object.entries(sourceCounts).map(([name, value]) => ({
            name: name as TaskSource,
            value,
        }));

        return { completedLast7Days, sourceDistribution };

    }, [tasks]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <AreaChart className="mr-2 h-4 w-4" />
                    Dasbor
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] bg-background/80 backdrop-blur-sm flex flex-col">
                <DialogHeader>
                    <DialogTitle className="font-headline">Dasbor Analitik Tugas</DialogTitle>
                    <DialogDescription>
                        Visualisasi data tugas Anda.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 py-4 overflow-y-auto">
                    <div className="p-4 rounded-lg bg-black/20">
                        <h3 className="font-headline text-lg mb-4">Tugas Selesai (7 Hari Terakhir)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analyticsData.completedLast7Days}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                    }}
                                />
                                <Bar dataKey="Tugas Selesai" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20">
                        <h3 className="font-headline text-lg mb-4">Distribusi Sumber Tugas</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsPieChart>
                                <Pie
                                    data={analyticsData.sourceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {analyticsData.sourceDistribution.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                    }}
                                />
                                <Legend />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
