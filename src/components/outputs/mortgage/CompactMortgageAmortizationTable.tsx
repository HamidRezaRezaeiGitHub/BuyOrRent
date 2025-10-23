import { FC } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { MortgageAmortizationData } from '@/services/MortgageAmortizationCalculator';
import { formatCurrency } from '@/services/formatting';

export interface CompactMortgageAmortizationTableProps {
    data: MortgageAmortizationData | null;
    maxRows?: number;
}

/**
 * Compress mortgage amortization data into a maximum number of rows
 * Groups years together when there are more years than maxRows
 */
const compressMortgageData = (
    data: MortgageAmortizationData,
    maxRows: number
): Array<{
    yearRange: string;
    payment: number;
    principal: number;
    interest: number;
    balanceEnd: number;
    cumulativePrincipal: number;
    cumulativeInterest: number;
}> => {
    // Group months by year
    const yearlyData: { [year: number]: typeof data.months } = {};
    data.months.forEach((month) => {
        if (!yearlyData[month.year]) {
            yearlyData[month.year] = [];
        }
        yearlyData[month.year].push(month);
    });

    const years = Object.keys(yearlyData).map(Number).sort((a, b) => a - b);
    
    if (years.length === 0) return [];
    
    // If we have fewer years than maxRows, show each year individually
    if (maxRows <= 0 || years.length <= maxRows) {
        return years.map((year) => {
            const yearMonths = yearlyData[year];
            const lastMonth = yearMonths[yearMonths.length - 1];
            const yearPayment = yearMonths.reduce((sum, m) => sum + m.payment, 0);
            const yearPrincipal = yearMonths.reduce((sum, m) => sum + m.principal, 0);
            const yearInterest = yearMonths.reduce((sum, m) => sum + m.interest, 0);

            return {
                yearRange: year.toString(),
                payment: yearPayment,
                principal: yearPrincipal,
                interest: yearInterest,
                balanceEnd: lastMonth.balanceEnd,
                cumulativePrincipal: lastMonth.cumulativePrincipal,
                cumulativeInterest: lastMonth.cumulativeInterest,
            };
        });
    }

    // Calculate optimal grouping size
    const yearsPerRow = Math.ceil(years.length / maxRows);
    const compactRows: ReturnType<typeof compressMortgageData> = [];

    for (let i = 0; i < years.length; i += yearsPerRow) {
        const endIndex = Math.min(i + yearsPerRow, years.length);
        const groupYears = years.slice(i, endIndex);
        
        // Create year range string
        const startYear = groupYears[0];
        const endYear = groupYears[groupYears.length - 1];
        const yearRange = startYear === endYear 
            ? startYear.toString() 
            : `${startYear}-${endYear}`;

        // Sum up totals for the group
        let payment = 0;
        let principal = 0;
        let interest = 0;
        
        groupYears.forEach(year => {
            const yearMonths = yearlyData[year];
            payment += yearMonths.reduce((sum, m) => sum + m.payment, 0);
            principal += yearMonths.reduce((sum, m) => sum + m.principal, 0);
            interest += yearMonths.reduce((sum, m) => sum + m.interest, 0);
        });
        
        // Use the last month of the last year in the group for balance and cumulatives
        const lastYearMonths = yearlyData[endYear];
        const lastMonth = lastYearMonths[lastYearMonths.length - 1];

        compactRows.push({
            yearRange,
            payment,
            principal,
            interest,
            balanceEnd: lastMonth.balanceEnd,
            cumulativePrincipal: lastMonth.cumulativePrincipal,
            cumulativeInterest: lastMonth.cumulativeInterest,
        });
    }

    return compactRows;
};

export const CompactMortgageAmortizationTable: FC<CompactMortgageAmortizationTableProps> = ({ 
    data, 
    maxRows = 5 
}) => {
    if (!data || data.months.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
                <p className="text-sm">Please enter mortgage details to see the amortization table.</p>
            </div>
        );
    }

    const compactRows = compressMortgageData(data, maxRows);

    return (
        <div className="w-full max-w-full overflow-hidden">
            <div className="overflow-x-auto">
                <Table className="w-full table-auto">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold px-1 sm:px-2 text-xs sm:text-sm">Year(s)</TableHead>
                            <TableHead className="text-right font-semibold px-1 sm:px-2 text-xs sm:text-sm">Payment</TableHead>
                            <TableHead className="text-right font-semibold px-1 sm:px-2 text-xs sm:text-sm">Principal</TableHead>
                            <TableHead className="text-right font-semibold px-1 sm:px-2 text-xs sm:text-sm">Interest</TableHead>
                            <TableHead className="text-right font-semibold px-1 sm:px-2 text-xs sm:text-sm">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {compactRows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium text-xs sm:text-sm px-1 sm:px-2 truncate">{row.yearRange}</TableCell>
                                <TableCell className="text-right font-medium text-xs sm:text-sm px-1 sm:px-2 truncate">
                                    {formatCurrency(row.payment)}
                                </TableCell>
                                <TableCell className="text-right font-medium text-xs sm:text-sm px-1 sm:px-2 truncate">
                                    {formatCurrency(row.principal)}
                                </TableCell>
                                <TableCell className="text-right font-medium text-xs sm:text-sm px-1 sm:px-2 truncate">
                                    {formatCurrency(row.interest)}
                                </TableCell>
                                <TableCell className="text-right font-medium text-xs sm:text-sm px-1 sm:px-2 truncate">
                                    {formatCurrency(row.balanceEnd)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default CompactMortgageAmortizationTable;
