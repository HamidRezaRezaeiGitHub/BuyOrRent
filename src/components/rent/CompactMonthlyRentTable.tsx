import { FC } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MonthlyRentData } from './MonthlyRentTable';

export interface CompactMonthlyRentTableProps {
    data: MonthlyRentData | null;
    maxRows?: number;
}

interface CompactRow {
    yearRange: string;
    total: number;
    cumulativeTotal: number;
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
 * Compress year data into a maximum number of rows
 * Algorithm intelligently groups years to fit within maxRows constraint
 */
export const compressYearData = (
    years: MonthlyRentData['years'],
    maxRows: number
): CompactRow[] => {
    if (years.length === 0) return [];
    if (years.length <= maxRows) {
        // No compression needed, show each year individually
        return years.map((yearData) => ({
            yearRange: yearData.year.toString(),
            total: yearData.yearTotal,
            cumulativeTotal: yearData.cumulativeTotal,
        }));
    }

    // Calculate optimal grouping size
    const yearsPerRow = Math.ceil(years.length / maxRows);
    const compactRows: CompactRow[] = [];

    for (let i = 0; i < years.length; i += yearsPerRow) {
        const endIndex = Math.min(i + yearsPerRow, years.length);
        const groupYears = years.slice(i, endIndex);
        
        // Create year range string
        const startYear = groupYears[0].year;
        const endYear = groupYears[groupYears.length - 1].year;
        const yearRange = startYear === endYear 
            ? startYear.toString() 
            : `${startYear}-${endYear}`;

        // Sum up totals for the group
        const total = groupYears.reduce((sum, y) => sum + y.yearTotal, 0);
        
        // Use the cumulative total of the last year in the group
        const cumulativeTotal = groupYears[groupYears.length - 1].cumulativeTotal;

        compactRows.push({
            yearRange,
            total,
            cumulativeTotal,
        });
    }

    return compactRows;
};

export const CompactMonthlyRentTable: FC<CompactMonthlyRentTableProps> = ({ 
    data, 
    maxRows = 5 
}) => {
    if (!data || data.years.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p className="text-sm">Please enter monthly rent and analysis period to see the table.</p>
            </div>
        );
    }

    const compactRows = compressYearData(data.years, maxRows);

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold">Year(s)</TableHead>
                        <TableHead className="text-right font-semibold">Total</TableHead>
                        <TableHead className="text-right font-semibold">Cumulative</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {compactRows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{row.yearRange}</TableCell>
                            <TableCell className="text-right font-medium">
                                {formatCurrency(row.total)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatCurrency(row.cumulativeTotal)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompactMonthlyRentTable;
