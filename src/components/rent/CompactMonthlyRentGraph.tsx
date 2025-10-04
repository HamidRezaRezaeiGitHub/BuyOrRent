import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency, formatShortCurrency } from '@/services/formatting';
import { FC } from 'react';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { MonthlyRentData } from './MonthlyRentTable';

export interface CompactMonthlyRentGraphProps {
    data: MonthlyRentData | null;
}

export const CompactMonthlyRentGraph: FC<CompactMonthlyRentGraphProps> = ({ data }) => {
    if (!data || data.years.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p className="text-sm">Please enter monthly rent and analysis period to see the graph.</p>
            </div>
        );
    }

    // Transform data for cumulative graph
    const chartData = data.years.map((yearData) => ({
        year: yearData.year,
        cumulative: yearData.cumulativeTotal,
    }));

    // Chart configuration for theme-aware colors
    const chartConfig = {
        cumulative: {
            label: 'Cumulative Rent',
            color: 'hsl(var(--chart-1))',
        },
    };

    return (
        <div className="w-full max-w-full h-[180px] sm:h-[220px] overflow-hidden">
            <div className="w-full h-full p-1 sm:p-2">
                <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-center truncate">
                    Cumulative Rent
                </h3>
                <div className="w-full h-[calc(100%-1.5rem)] sm:h-[calc(100%-2rem)]">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <LineChart
                            data={chartData}
                            margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                        >
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 8 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                tickFormatter={formatShortCurrency}
                                tick={{ fontSize: 8 }}
                                tickLine={false}
                                axisLine={false}
                                width={35}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(label: any) => `Year ${label}`}
                                        formatter={(value: any) => [formatCurrency(value as number), 'Total Paid']}
                                    />
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="cumulative"
                                stroke="var(--color-cumulative)"
                                strokeWidth={1.5}
                                dot={false}
                                activeDot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default CompactMonthlyRentGraph;
