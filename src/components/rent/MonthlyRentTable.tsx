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
import { calculateMonthlyRentData, MonthlyRentData, YearData } from '@/services/MonthlyRentCalculator';

export interface MonthlyRentTableProps {
    monthlyRent: number;
    analysisYears: number;
    annualRentIncrease: number;
    onDataCalculated?: (data: MonthlyRentData) => void;
}

// Re-export types for backward compatibility
export type { MonthlyRentData, YearData };


export const MonthlyRentTable: FC<MonthlyRentTableProps> = ({
    monthlyRent,
    analysisYears,
    annualRentIncrease,
    onDataCalculated,
}) => {
    useEffect(() => {
        const data = calculateMonthlyRentData(monthlyRent, analysisYears, annualRentIncrease);
        
        if (data && onDataCalculated) {
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

    const data = calculateMonthlyRentData(monthlyRent, analysisYears, annualRentIncrease);
    
    if (!data) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p className="text-sm">Please enter monthly rent and analysis period to see the table.</p>
            </div>
        );
    }

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
                    {data.years.map((yearData, i) => {
                        const yearRent = yearData.months[0]; // All months have the same rent

                        return (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{yearData.year}</TableCell>
                                {months.map((month) => (
                                    <TableCell key={month} className="text-center text-sm">
                                        {formatCurrency(yearRent)}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(yearData.yearTotal)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatCurrency(yearData.cumulativeTotal)}
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
