
'use client';

import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Button } from './ui/button';
import { AreaChart, CheckCircle, ListTodo, Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import type { Task, TaskSource } from '@/types/task';
import { subDays, format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from './ui/chart';

interface TaskAnalyticsProps {
    tasks: Task[];
}

export function TaskAnalytics({ tasks }: TaskAnalyticsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const analyticsData = useMemo(() => {
        if (!tasks.length) return {
            completedLast7Days: [],
            sourceDistribution: [],
            totalTasks: 0,
            activeTasks: 0,
            completedTasks: 0,
        };

        const totalTasks = tasks.length;
        const activeTasks = tasks.filter(task => task.status === 'Proses Desain' || task.status === 'Proses ACC').length;
        const completedTasksCount = tasks.filter(task => task.status === 'Selesai').length;

        // Bar chart data: completed tasks per day for last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
        const completedTasks = tasks.filter(task => task.status === 'Selesai' && task.dueDate);

        const completedLast7Days = last7Days.map(day => {
            const count = completedTasks.filter(task => {
                // By parsing the date string and adding the timezone offset, we treat the date as local
                // instead of converting it to UTC, which avoids the "off-by-one-day" bug.
                const taskDate = parseISO(task.dueDate!);
                if (taskDate) {
                  taskDate.setMinutes(taskDate.getMinutes() + taskDate.getTimezoneOffset());
                  return format(taskDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                }
                return false;
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
            fill: `hsl(var(--chart-${Object.keys(sourceCounts).indexOf(name) + 1}))`
        }));
        
        return {
            completedLast7Days,
            sourceDistribution,
            totalTasks,
            activeTasks,
            completedTasks: completedTasksCount,
        };

    }, [tasks]);

    const barChartConfig = {
        "Tugas Selesai": {
          label: "Tugas Selesai",
          color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    const pieChartConfig = useMemo(() => {
        const config: ChartConfig = {};
        analyticsData.sourceDistribution.forEach((entry, index) => {
          config[entry.name] = {
            label: entry.name,
            color: `hsl(var(--chart-${index + 1}))`,
          };
        });
        return config;
      }, [analyticsData.sourceDistribution]);

    const kpiCards = [
        { title: "Total Tugas", value: analyticsData.totalTasks, icon: <ListTodo className="h-8 w-8 text-primary" /> },
        { title: "Tugas Aktif", value: analyticsData.activeTasks, icon: <Loader className="h-8 w-8 text-orange-400" /> },
        { title: "Tugas Selesai", value: analyticsData.completedTasks, icon: <CheckCircle className="h-8 w-8 text-green-500" /> }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <AreaChart className="mr-2 h-4 w-4" />
                    Dasbor
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[90vh] bg-background/80 backdrop-blur-lg flex flex-col">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Dasbor Analitik Tugas</DialogTitle>
                    <DialogDescription>
                        Visualisasi data dan metrik penting dari tugas Anda.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow space-y-6 py-4 overflow-y-auto pr-4">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {kpiCards.map(card => (
                            <Card key={card.title} className="bg-black/20 backdrop-blur-lg border border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                                    {card.icon}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold">{card.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
                            <CardHeader>
                                <CardTitle>Tugas Selesai (7 Hari Terakhir)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
                                    <BarChart accessibilityLayer data={analyticsData.completedLast7Days} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                        />
                                         <YAxis
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            allowDecimals={false}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="dot" />}
                                        />
                                        <Bar dataKey="Tugas Selesai" fill="var(--color-Tugas-Selesai)" radius={8} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
                            <CardHeader>
                                <CardTitle>Distribusi Sumber Tugas</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center pt-6">
                                <ChartContainer
                                    config={pieChartConfig}
                                    className="mx-auto aspect-square h-[250px]"
                                >
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Pie
                                            data={analyticsData.sourceDistribution}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            strokeWidth={5}
                                        />
                                        <ChartLegend
                                            content={<ChartLegendContent nameKey="name" />}
                                            className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                                        />
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
