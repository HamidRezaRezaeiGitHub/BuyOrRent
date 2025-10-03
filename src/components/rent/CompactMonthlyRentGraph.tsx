import { FC } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MonthlyRentData } from './MonthlyRentTable';

export interface CompactMonthlyRentGraphProps {
    data: MonthlyRentData | null;
}

/**
 * Format a number as Canadian dollar currency
 */
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

/**
 * Format large numbers in short form (e.g., 1.5K, 2.3M)
 */
const formatShortCurrency = (value: number): string => {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
};

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

    return (
        <div className="w-full h-[250px] p-2">
            <h3 className="text-sm font-semibold mb-2 text-center">
                Cumulative Rent
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                    <XAxis
                        dataKey="year"
                        className="text-xs"
                        tick={{ fontSize: 10 }}
                    />
                    <YAxis
                        tickFormatter={formatShortCurrency}
                        className="text-xs"
                        tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                        formatter={(value: number) => [formatCurrency(value), 'Total Paid']}
                        labelFormatter={(label) => `Year ${label}`}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                            fontSize: '12px',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CompactMonthlyRentGraph;
