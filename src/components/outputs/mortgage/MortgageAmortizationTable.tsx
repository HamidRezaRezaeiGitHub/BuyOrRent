import { FC } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/services/formatting';
import { MortgageAmortizationData, AmortizationMonth } from '@/services/MortgageAmortizationCalculator';

export interface MortgageAmortizationTableProps {
    data: MortgageAmortizationData | null;
}

// Re-export types for consumer convenience
export type { MortgageAmortizationData, AmortizationMonth };

export const MortgageAmortizationTable: FC<MortgageAmortizationTableProps> = ({ data }) => {
    if (!data || data.months.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p className="text-sm">Please enter mortgage details to see the amortization table.</p>
            </div>
        );
    }

    // Group months by year for display
    const yearlyData: { [year: number]: AmortizationMonth[] } = {};
    data.months.forEach((month) => {
        if (!yearlyData[month.year]) {
            yearlyData[month.year] = [];
        }
        yearlyData[month.year].push(month);
    });

    const years = Object.keys(yearlyData).map(Number).sort((a, b) => a - b);

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold">Year</TableHead>
                        <TableHead className="text-right">Payment</TableHead>
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Interest</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead className="text-right font-semibold">Cumulative Principal</TableHead>
                        <TableHead className="text-right font-semibold">Cumulative Interest</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {years.map((year) => {
                        const yearMonths = yearlyData[year];
                        // Use the last month of the year for totals
                        const lastMonth = yearMonths[yearMonths.length - 1];
                        
                        // Calculate year totals
                        const yearPayment = yearMonths.reduce((sum, m) => sum + m.payment, 0);
                        const yearPrincipal = yearMonths.reduce((sum, m) => sum + m.principal, 0);
                        const yearInterest = yearMonths.reduce((sum, m) => sum + m.interest, 0);

                        return (
                            <TableRow key={year}>
                                <TableCell className="font-medium">{year}</TableCell>
                                <TableCell className="text-right text-sm">
                                    {formatCurrency(yearPayment)}
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                    {formatCurrency(yearPrincipal)}
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                    {formatCurrency(yearInterest)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(lastMonth.balanceEnd)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(lastMonth.cumulativePrincipal)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(lastMonth.cumulativeInterest)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default MortgageAmortizationTable;
