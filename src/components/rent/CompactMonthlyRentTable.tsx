import { FC } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MonthlyRentData, compressYearData } from '@/services/MonthlyRentCalculator';
import { formatCurrency } from '@/services/formatting';

export interface CompactMonthlyRentTableProps {
    data: MonthlyRentData | null;
    maxRows?: number;
}

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
        <div className="w-full max-w-full overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold w-[25%] px-1 sm:px-2">Year(s)</TableHead>
                            <TableHead className="text-right font-semibold w-[37.5%] px-1 sm:px-2">Total</TableHead>
                            <TableHead className="text-right font-semibold w-[37.5%] px-1 sm:px-2">Cumulative</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {compactRows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium text-xs sm:text-sm px-1 sm:px-2 truncate">{row.yearRange}</TableCell>
                                <TableCell className="text-right font-medium text-xs sm:text-sm px-1 sm:px-2 truncate">
                                    {formatCurrency(row.total)}
                                </TableCell>
                                <TableCell className="text-right font-medium text-xs sm:text-sm px-1 sm:px-2 truncate">
                                    {formatCurrency(row.cumulativeTotal)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default CompactMonthlyRentTable;
