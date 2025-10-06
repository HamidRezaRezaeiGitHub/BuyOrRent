import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency, formatShortCurrency } from '@/services/formatting';
import { FC } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { MonthlyRentData } from '@/services/MonthlyRentCalculator';

export interface MonthlyRentGraphProps {
    data: MonthlyRentData | null;
}

export const MonthlyRentGraph: FC<MonthlyRentGraphProps> = ({ data }) => {
    if (!data || data.years.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p className="text-sm">Please enter monthly rent and analysis period to see the graph.</p>
            </div>
        );
    }

    // Transform data for cumulative graph
    const chartData = data.years.map((yearData, index) => {
        // Calculate cumulative total up to this year
        const cumulativeTotal = data.years
            .slice(0, index + 1)
            .reduce((sum, year) => sum + year.yearTotal, 0);

        return {
            year: yearData.year,
            cumulative: cumulativeTotal,
        };
    });

    // Chart configuration for theme-aware colors
    const chartConfig = {
        cumulative: {
            label: 'Cumulative Rent',
            color: 'hsl(var(--chart-1))',
        },
    };

    return (
        <div className="w-full h-[400px] p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
                Cumulative Rent Paid Over Time
            </h3>
            <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="year"
                        label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                        tickFormatter={formatShortCurrency}
                        label={{ value: 'Cumulative Rent Paid', angle: -90, position: 'insideLeft' }}
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
                        strokeWidth={2}
                        dot={{ fill: 'var(--color-cumulative)', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ChartContainer>
            <div className="text-center mt-4 text-sm text-muted-foreground">
                <p>
                    Total rent paid over {data.years.length} years:{' '}
                    <span className="font-semibold text-foreground">
                        {formatCurrency(data.totalPaid)}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default MonthlyRentGraph;
