import { FC, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/services/formatting';

export interface MonthlyRentTableProps {
    monthlyRent: number;
    analysisYears: number;
    annualRentIncrease: number;
    onDataCalculated?: (data: MonthlyRentData) => void;
}

export interface MonthlyRentData {
    years: YearData[];
    totalPaid: number;
}

export interface YearData {
    year: number;
    months: number[];
    yearTotal: number;
    cumulativeTotal: number;
}

/**
 * Calculate monthly rent for a given year with annual rent increase
 */
const calculateMonthlyRentForYear = (
    baseRent: number,
    yearIndex: number,
    annualIncreasePercent: number
): number => {
    if (yearIndex === 0) return baseRent;
    return baseRent * Math.pow(1 + annualIncreasePercent / 100, yearIndex);
};

export const MonthlyRentTable: FC<MonthlyRentTableProps> = ({
    monthlyRent,
    analysisYears,
    annualRentIncrease,
    onDataCalculated,
}) => {
    useEffect(() => {
        if (monthlyRent <= 0 || analysisYears <= 0) {
            return;
        }

        // Calculate rent data for all years
        const currentYear = new Date().getFullYear();
        const years: YearData[] = [];
        let totalPaid = 0;

        for (let i = 0; i < analysisYears; i++) {
            const yearRent = calculateMonthlyRentForYear(monthlyRent, i, annualRentIncrease);
            const months = Array(12).fill(yearRent);
            const yearTotal = yearRent * 12;
            totalPaid += yearTotal;

            years.push({
                year: currentYear + i,
                months,
                yearTotal,
                cumulativeTotal: totalPaid,
            });
        }

        const data: MonthlyRentData = {
            years,
            totalPaid,
        };

        if (onDataCalculated) {
            onDataCalculated(data);
        }
    }, [monthlyRent, analysisYears, annualRentIncrease, onDataCalculated]);

    if (monthlyRent <= 0 || analysisYears <= 0) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p className="text-sm">Please enter monthly rent and analysis period to see the table.</p>
            </div>
        );
    }

    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold">Year</TableHead>
                        {months.map((month) => (
                            <TableHead key={month} className="text-center">
                                {month}
                            </TableHead>
                        ))}
                        <TableHead className="text-right font-semibold">Total</TableHead>
                        <TableHead className="text-right font-semibold">Cumulative</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: analysisYears }, (_, i) => {
                        const yearRent = calculateMonthlyRentForYear(monthlyRent, i, annualRentIncrease);
                        const yearTotal = yearRent * 12;
                        // Calculate cumulative total up to this year
                        const cumulativeTotal = Array.from({ length: i + 1 }, (_, j) => {
                            const rent = calculateMonthlyRentForYear(monthlyRent, j, annualRentIncrease);
                            return rent * 12;
                        }).reduce((sum, total) => sum + total, 0);

                        return (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{currentYear + i}</TableCell>
                                {months.map((month) => (
                                    <TableCell key={month} className="text-center text-sm">
                                        {formatCurrency(yearRent)}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(yearTotal)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(cumulativeTotal)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default MonthlyRentTable;
