
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Button } from './ui/button';
import { AreaChart, Check, ListTodo, Sun } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import type { Task, TaskSource } from '@/types/task';
import { subDays, format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from './ui/chart';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { ScrollArea } from './ui/scroll-area';

interface TaskAnalyticsProps {
    tasks: Task[];
    children?: React.ReactNode;
}

export function TaskAnalytics({ tasks, children }: TaskAnalyticsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
                if (!task.dueDate) return false;
                const taskDate = parseISO(task.dueDate);
                taskDate.setMinutes(taskDate.getMinutes() + taskDate.getTimezoneOffset());
                return format(taskDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
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
        { title: "Total Tugas", value: analyticsData.totalTasks, icon: <ListTodo className="h-8 w-8 text-muted-foreground" /> },
        { title: "Tugas Aktif", value: analyticsData.activeTasks, icon: <Sun className="h-8 w-8 text-primary" /> },
        { title: "Tugas Selesai", value: analyticsData.completedTasks, icon: <Check className="h-8 w-8 text-green-500" /> }
    ];
    
    const renderCharts = () => {
        if (!isClient) {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[350px]">
                  <div className="w-full h-full animate-pulse rounded-md bg-muted/50" />
                  <div className="w-full h-full animate-pulse rounded-md bg-muted/50" />
                </div>
            )
        }
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/20 border-white/10">
                    <CardHeader>
                        <CardTitle>Tugas Selesai (7 Hari Terakhir)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
                            <BarChart accessibilityLayer data={analyticsData.completedLast7Days} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
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
                                <Bar dataKey="Tugas Selesai" fill="hsl(var(--chart-1))" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card/20 border-white/10">
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
        )
    }
    
    const DialogLayout = (
        <DialogContent className="max-w-5xl h-[90vh] glass-card border-white/10 flex flex-col">
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Dasbor Analitik Tugas</DialogTitle>
                <DialogDescription>
                    Visualisasi data dan metrik penting dari tugas Anda.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow">
                <div className="space-y-6 py-4 pr-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {kpiCards.map(card => (
                            <Card key={card.title} className="bg-card/20 border-white/10">
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
                    {renderCharts()}
                </div>
            </ScrollArea>
        </DialogContent>
    )
    
    if (children) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild onClick={(e) => { e.preventDefault() }}>
                     <div onClick={() => setIsOpen(true)} className="w-full">
                        {children}
                    </div>
                </DialogTrigger>
                {DialogLayout}
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                            <AreaChart/>
                            <span className="sr-only">Dasbor Analitik</span>
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Dasbor Analitik</p>
                </TooltipContent>
            </Tooltip>
            {DialogLayout}
        </Dialog>
    );
}
