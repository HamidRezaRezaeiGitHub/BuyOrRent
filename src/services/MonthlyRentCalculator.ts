/**
 * MonthlyRentCalculator Service
 * 
 * This service handles all calculations related to monthly rent analysis,
 * including rent projections over time and data compression for display.
 */

// Type Definitions
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

export interface CompactRow {
    yearRange: string;
    total: number;
    cumulativeTotal: number;
}

/**
 * Calculate monthly rent for a given year with annual rent increase
 * @param baseRent - The initial monthly rent amount
 * @param yearIndex - The year index (0 for first year)
 * @param annualIncreasePercent - Annual rent increase percentage
 * @returns The monthly rent for the specified year
 */
export const calculateMonthlyRentForYear = (
    baseRent: number,
    yearIndex: number,
    annualIncreasePercent: number
): number => {
    if (yearIndex === 0) return baseRent;
    return baseRent * Math.pow(1 + annualIncreasePercent / 100, yearIndex);
};

/**
 * Calculate monthly rent data for all years in the analysis period
 * @param monthlyRent - The initial monthly rent amount
 * @param analysisYears - Number of years to analyze
 * @param annualRentIncrease - Annual rent increase percentage
 * @returns Complete monthly rent data including year-by-year breakdown
 */
export const calculateMonthlyRentData = (
    monthlyRent: number,
    analysisYears: number,
    annualRentIncrease: number
): MonthlyRentData | null => {
    if (monthlyRent <= 0 || analysisYears <= 0) {
        return null;
    }

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

    return {
        years,
        totalPaid,
    };
};

/**
 * Compress year data into a maximum number of rows
 * Algorithm intelligently groups years to fit within maxRows constraint
 * @param years - Array of year data to compress
 * @param maxRows - Maximum number of rows to display
 * @returns Array of compressed row data
 */
export const compressYearData = (
    years: YearData[],
    maxRows: number
): CompactRow[] => {
    if (years.length === 0) return [];
    
    // Guard against invalid maxRows values
    if (maxRows <= 0) {
        // Return all data in a single aggregated row
        const startYear = years[0].year;
        const endYear = years[years.length - 1].year;
        const yearRange = startYear === endYear 
            ? startYear.toString() 
            : `${startYear}-${endYear}`;
        const total = years.reduce((sum, y) => sum + y.yearTotal, 0);
        const cumulativeTotal = years[years.length - 1].cumulativeTotal;
        
        return [{
            yearRange,
            total,
            cumulativeTotal,
        }];
    }
    
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
