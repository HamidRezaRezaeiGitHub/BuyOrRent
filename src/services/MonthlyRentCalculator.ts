/**
 * MonthlyRentCalculator Service
 * 
 * This service handles all calculations related to monthly rent analysis,
 * including rent projections over time and data compression for display.
 * 
 * This is a pure math service with no I/O or region-specific logic.
 * All calculations are deterministic when optional parameters are provided.
 */

// Type Definitions

/**
 * Rounding control for monetary values
 * - 'none': No rounding applied (full floating-point precision)
 * - 'cents': Round to 2 decimal places (typical currency precision)
 */
export type RoundTo = 'none' | 'cents';

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
 * Helper function to round a number based on the roundTo setting
 * @param value - The value to round
 * @param roundTo - The rounding mode
 * @returns The rounded value
 */
const applyRounding = (value: number, roundTo: RoundTo): number => {
    if (roundTo === 'cents') {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
    return value;
};

/**
 * Calculate monthly rent for a given year with annual rent increase
 * 
 * The increase is applied discretely at year boundaries using compound growth:
 * rent(year_i) = baseRent × (1 + annualIncreasePercent/100)^i
 * 
 * @param baseRent - The initial monthly rent amount
 * @param yearIndex - The year index (0 for first year)
 * @param annualIncreasePercent - Annual rent increase percentage (can be negative for deflation)
 * @param roundTo - Optional rounding control ('none' | 'cents')
 * @returns The monthly rent for the specified year
 * 
 * @example
 * // Year 0 (base year)
 * calculateMonthlyRentForYear(1000, 0, 2.5) // Returns 1000
 * 
 * @example
 * // Year 1 with 2.5% increase
 * calculateMonthlyRentForYear(1000, 1, 2.5) // Returns 1025
 * 
 * @example
 * // Year 2 with compound 2.5% increase
 * calculateMonthlyRentForYear(1000, 2, 2.5) // Returns 1050.625
 * 
 * @example
 * // Deflation scenario
 * calculateMonthlyRentForYear(1000, 1, -2.5) // Returns 975
 */
export const calculateMonthlyRentForYear = (
    baseRent: number,
    yearIndex: number,
    annualIncreasePercent: number,
    roundTo: RoundTo = 'none'
): number => {
    if (yearIndex === 0) {
        return applyRounding(baseRent, roundTo);
    }
    const rent = baseRent * Math.pow(1 + annualIncreasePercent / 100, yearIndex);
    return applyRounding(rent, roundTo);
};

/**
 * Calculate monthly rent data for all years in the analysis period
 * 
 * This function generates a complete rent projection with year-by-year breakdown.
 * The rent increase is applied annually at the start of each year by default.
 * 
 * Optional anniversary-month behavior: When increaseMonth is specified (1-12),
 * the rent increase for Year N applies starting in that month:
 * - Months 1 to (increaseMonth-1): use previous year's rate
 * - Months increaseMonth to 12: use current year's rate
 * 
 * @param monthlyRent - The initial monthly rent amount (must be > 0)
 * @param analysisYears - Number of years to analyze (must be 1-120)
 * @param annualRentIncrease - Annual rent increase percentage (can be negative for deflation)
 * @param options - Optional configuration
 * @param options.startYear - Starting year (default: current year from Date)
 * @param options.roundTo - Rounding control: 'none' (default) or 'cents'
 * @param options.increaseMonth - Month (1-12) when annual increase takes effect within each year
 * @returns Complete monthly rent data or null if inputs are invalid
 * 
 * @example
 * // Basic usage with defaults (current year, no rounding)
 * calculateMonthlyRentData(1500, 5, 2.5)
 * 
 * @example
 * // Deterministic with fixed start year
 * calculateMonthlyRentData(1500, 5, 2.5, { startYear: 2024 })
 * 
 * @example
 * // With rounding to cents
 * calculateMonthlyRentData(1500.456, 5, 2.5, { roundTo: 'cents' })
 * 
 * @example
 * // Anniversary increase in July (month 7)
 * calculateMonthlyRentData(1000, 3, 10, { increaseMonth: 7 })
 * // Year 1: months 1-12 all = 1000
 * // Year 2: months 1-6 = 1000, months 7-12 = 1100
 * // Year 3: months 1-6 = 1100, months 7-12 = 1210
 * 
 * @example
 * // Deflation scenario
 * calculateMonthlyRentData(2000, 3, -2.5, { startYear: 2024 })
 */
export const calculateMonthlyRentData = (
    monthlyRent: number,
    analysisYears: number,
    annualRentIncrease: number,
    options?: {
        startYear?: number;
        roundTo?: RoundTo;
        increaseMonth?: number;
    }
): MonthlyRentData | null => {
    // Validation: guard against invalid inputs
    if (Number.isNaN(monthlyRent) || Number.isNaN(analysisYears) || Number.isNaN(annualRentIncrease)) {
        return null;
    }
    
    if (monthlyRent <= 0 || analysisYears <= 0) {
        return null;
    }

    // Enforce analysisYears cap [1, 120]
    if (analysisYears > 120) {
        return null;
    }

    // Extract options with defaults
    const startYear = options?.startYear ?? new Date().getFullYear();
    const roundTo = options?.roundTo ?? 'none';
    const increaseMonth = options?.increaseMonth;

    // Validate increaseMonth if provided
    if (increaseMonth !== undefined && (increaseMonth < 1 || increaseMonth > 12 || !Number.isInteger(increaseMonth))) {
        return null;
    }

    const years: YearData[] = [];
    let totalPaid = 0;

    for (let i = 0; i < analysisYears; i++) {
        let months: number[];
        let yearTotal: number;

        if (increaseMonth === undefined) {
            // Standard behavior: all months in year i use the same rate
            const yearRent = calculateMonthlyRentForYear(monthlyRent, i, annualRentIncrease, roundTo);
            months = Array(12).fill(yearRent);
            yearTotal = applyRounding(yearRent * 12, roundTo);
        } else {
            // Anniversary behavior: rate changes mid-year
            months = [];
            
            if (i === 0) {
                // Year 0: always use base rent for all months
                const baseRentRounded = applyRounding(monthlyRent, roundTo);
                months = Array(12).fill(baseRentRounded);
                yearTotal = applyRounding(baseRentRounded * 12, roundTo);
            } else {
                // Year i (i > 0): months before increaseMonth use year i-1 rate,
                // months from increaseMonth onward use year i rate
                const prevYearRent = calculateMonthlyRentForYear(monthlyRent, i - 1, annualRentIncrease, roundTo);
                const currentYearRent = calculateMonthlyRentForYear(monthlyRent, i, annualRentIncrease, roundTo);
                
                // Months 1 to (increaseMonth - 1) use previous year's rate
                for (let m = 1; m < increaseMonth; m++) {
                    months.push(prevYearRent);
                }
                
                // Months increaseMonth to 12 use current year's rate
                for (let m = increaseMonth; m <= 12; m++) {
                    months.push(currentYearRent);
                }
                
                yearTotal = applyRounding(months.reduce((sum, val) => sum + val, 0), roundTo);
            }
        }

        totalPaid = applyRounding(totalPaid + yearTotal, roundTo);

        years.push({
            year: startYear + i,
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
 * 
 * This algorithm intelligently groups years to fit within maxRows constraint.
 * Guarantees:
 * - Preserves chronological order
 * - Last row's cumulativeTotal equals input's last year cumulativeTotal
 * - Returns at most maxRows rows (or fewer if input is shorter), except when maxRows <= 0, which aggregates all years into a single row
 * - Cumulative totals are strictly increasing
 * 
 * @param years - Array of year data to compress (must be in chronological order)
 * @param maxRows - Maximum number of rows to display
 * @param roundTo - Optional rounding control ('none' | 'cents')
 * @returns Array of compressed row data
 * 
 * @example
 * // No compression needed
 * compressYearData(threeYears, 5) // Returns 3 individual rows
 * 
 * @example
 * // Compression with grouping
 * compressYearData(tenYears, 5) // Returns 5 rows, each covering 2 years
 * 
 * @example
 * // Edge case: aggregate all into one row
 * compressYearData(anyYears, 0) // Returns 1 row with all years combined
 */
export const compressYearData = (
    years: YearData[],
    maxRows: number,
    roundTo: RoundTo = 'none'
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
            total: applyRounding(total, roundTo),
            cumulativeTotal: applyRounding(cumulativeTotal, roundTo),
        }];
    }
    
    if (years.length <= maxRows) {
        // No compression needed, show each year individually
        return years.map((yearData) => ({
            yearRange: yearData.year.toString(),
            total: applyRounding(yearData.yearTotal, roundTo),
            cumulativeTotal: applyRounding(yearData.cumulativeTotal, roundTo),
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
            total: applyRounding(total, roundTo),
            cumulativeTotal: applyRounding(cumulativeTotal, roundTo),
        });
    }

    return compactRows;
};
