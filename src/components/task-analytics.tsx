'use client';

import { useState, useMemo } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button';
import { AreaChart } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import type { Task, TaskSource } from '@/types/task';
import { subDays, format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from './ui/chart';

interface TaskAnalyticsProps {
    tasks: Task[];
}

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
            fill: `hsl(var(--chart-${Object.keys(sourceCounts).indexOf(name) + 1}))`
        }));
        
        return { completedLast7Days, sourceDistribution };

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
                    <Card className="bg-transparent border-border/50">
                        <CardHeader>
                            <CardTitle>Tugas Selesai (7 Hari Terakhir)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={barChartConfig} className="min-h-[200px] w-full">
                                <BarChart accessibilityLayer data={analyticsData.completedLast7Days}>
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                    <Bar dataKey="Tugas Selesai" fill="var(--color-Tugas Selesai)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card className="bg-transparent border-border/50">
                        <CardHeader>
                            <CardTitle>Distribusi Sumber Tugas</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
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
            </DialogContent>
        </Dialog>
    );
}
