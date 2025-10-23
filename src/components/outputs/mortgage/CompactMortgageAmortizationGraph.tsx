import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency, formatShortCurrency } from '@/services/formatting';
import { FC } from 'react';
import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { MortgageAmortizationData } from '@/services/MortgageAmortizationCalculator';

export interface CompactMortgageAmortizationGraphProps {
    data: MortgageAmortizationData | null;
}

export const CompactMortgageAmortizationGraph: FC<CompactMortgageAmortizationGraphProps> = ({ data }) => {
    if (!data || data.months.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p className="text-sm">Please enter mortgage details to see the amortization graph.</p>
            </div>
        );
    }

    // Transform data for the graph - use yearly data points (last month of each year)
    const chartData = data.months
        .filter((month) => month.monthInYear === 12)
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
        <div className="w-full max-w-full h-[180px] sm:h-[220px] overflow-hidden">
            <div className="w-full h-full p-1 sm:p-2">
                <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-center truncate">
                    Mortgage Amortization
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
                                tickLine={true}
                                axisLine={true}
                            />
                            <YAxis
                                tickFormatter={formatShortCurrency}
                                tick={{ fontSize: 8 }}
                                tickLine={true}
                                axisLine={true}
                                width={35}
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
                                strokeWidth={1.5}
                                dot={{ fill: "currentColor", r: 1 }}
                                activeDot={{ fill: "currentColor", r: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="interest"
                                stroke="var(--color-interest)"
                                strokeWidth={1.5}
                                dot={{ fill: "currentColor", r: 1 }}
                                activeDot={{ fill: "currentColor", r: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="balance"
                                stroke="var(--color-balance)"
                                strokeWidth={1.5}
                                dot={{ fill: "currentColor", r: 1 }}
                                activeDot={{ fill: "currentColor", r: 2 }}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default CompactMortgageAmortizationGraph;
