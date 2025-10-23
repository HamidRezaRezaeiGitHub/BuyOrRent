import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency, formatShortCurrency } from '@/services/formatting';
import { FC } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { MortgageAmortizationData } from '@/services/MortgageAmortizationCalculator';

export interface MortgageAmortizationGraphProps {
    data: MortgageAmortizationData | null;
}

export const MortgageAmortizationGraph: FC<MortgageAmortizationGraphProps> = ({ data }) => {
    if (!data || data.months.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p className="text-sm">Please enter mortgage details to see the amortization graph.</p>
            </div>
        );
    }

    // Transform data for the graph - use yearly data points
    const chartData = data.months
        .filter((month) => month.monthInYear === 12) // Take the last month of each year
        .map((month) => ({
            year: month.year,
            principal: month.cumulativePrincipal,
            interest: month.cumulativeInterest,
            balance: month.balanceEnd,
        }));

    // Chart configuration for theme-aware colors
    const chartConfig = {
        principal: {
            label: 'Principal Paid',
            color: 'hsl(var(--chart-2))',
        },
        interest: {
            label: 'Interest Paid',
            color: 'hsl(var(--chart-1))',
        },
        balance: {
            label: 'Remaining Balance',
            color: 'hsl(var(--chart-3))',
        },
    };

    return (
        <div className="w-full h-[400px] p-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-center flex-shrink-0">
                Mortgage Amortization Over Time
            </h3>
            <div className="flex-1 min-h-0">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="year"
                            label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                            axisLine={true}
                            tickLine={true}
                        />
                        <YAxis
                            tickFormatter={formatShortCurrency}
                            label={{ value: 'Amount', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                            axisLine={true}
                            tickLine={true}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(label: unknown) => `Year ${label}`}
                                    formatter={(value: unknown, name: string) => [
                                        formatCurrency(value as number),
                                        name === 'principal' ? 'Principal Paid' : 
                                        name === 'interest' ? 'Interest Paid' : 
                                        'Remaining Balance'
                                    ]}
                                />
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="principal"
                            stroke="var(--color-principal)"
                            strokeWidth={2}
                            dot={{ fill: "currentColor", r: 2 }}
                            activeDot={{ fill: "currentColor", r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="interest"
                            stroke="var(--color-interest)"
                            strokeWidth={2}
                            dot={{ fill: "currentColor", r: 2 }}
                            activeDot={{ fill: "currentColor", r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="var(--color-balance)"
                            strokeWidth={2}
                            dot={{ fill: "currentColor", r: 2 }}
                            activeDot={{ fill: "currentColor", r: 4 }}
                        />
                    </LineChart>
                </ChartContainer>
            </div>
            <div className="text-center mt-4 text-sm text-muted-foreground flex-shrink-0">
                <p>
                    Total interest paid: {' '}
                    <span className="font-semibold text-foreground">
                        {formatCurrency(data.totalInterestPaid)}
                    </span>
                    {' '} | Total principal paid: {' '}
                    <span className="font-semibold text-foreground">
                        {formatCurrency(data.totalPrincipalPaid)}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default MortgageAmortizationGraph;
