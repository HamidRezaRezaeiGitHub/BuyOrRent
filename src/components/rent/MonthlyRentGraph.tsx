import { FC } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MonthlyRentData } from './MonthlyRentTable';

export interface MonthlyRentGraphProps {
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

    return (
        <div className="w-full h-[400px] p-4">
            <h3 className="text-lg font-semibold mb-4 text-center">
                Cumulative Rent Paid Over Time
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="year"
                        label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                        className="text-sm"
                    />
                    <YAxis
                        tickFormatter={formatShortCurrency}
                        label={{ value: 'Cumulative Rent Paid', angle: -90, position: 'insideLeft' }}
                        className="text-sm"
                    />
                    <Tooltip
                        formatter={(value: number) => [formatCurrency(value), 'Total Paid']}
                        labelFormatter={(label) => `Year ${label}`}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
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
