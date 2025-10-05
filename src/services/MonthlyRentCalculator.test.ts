import { 
    calculateMonthlyRentForYear, 
    calculateMonthlyRentData,
    compressYearData,
    MonthlyRentData 
} from './MonthlyRentCalculator';

describe('MonthlyRentCalculator Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper function to create mock data for compression tests
    const createMockData = (numYears: number): MonthlyRentData => {
        const currentYear = 2024;
        const years = [];
        let cumulativeTotal = 0;

        for (let i = 0; i < numYears; i++) {
            const yearTotal = (i + 1) * 10000; // Varying totals for testing
            cumulativeTotal += yearTotal;
            years.push({
                year: currentYear + i,
                months: Array(12).fill((i + 1) * 1000),
                yearTotal,
                cumulativeTotal,
            });
        }

        return {
            years,
            totalPaid: cumulativeTotal,
        };
    };

    describe('calculateMonthlyRentForYear', () => {
        test('calculateMonthlyRentForYear_shouldReturnBaseRent_forFirstYear', () => {
            const result = calculateMonthlyRentForYear(1500, 0, 2.5);
            expect(result).toBe(1500);
        });

        test('calculateMonthlyRentForYear_shouldCalculateCorrectRent_withIncrease', () => {
            // 10% increase: 1000 * 1.1 = 1100
            const result = calculateMonthlyRentForYear(1000, 1, 10);
            expect(result).toBe(1100);
        });

        test('calculateMonthlyRentForYear_shouldHandleDecimalIncrease', () => {
            // 2.5% increase: 1000 * 1.025 = 1025
            const result = calculateMonthlyRentForYear(1000, 1, 2.5);
            expect(result).toBe(1025);
        });

        test('calculateMonthlyRentForYear_shouldHandleZeroIncrease', () => {
            const result = calculateMonthlyRentForYear(1500, 5, 0);
            expect(result).toBe(1500);
        });

        test('calculateMonthlyRentForYear_shouldCalculateCompoundIncrease_overMultipleYears', () => {
            // Year 2 with 10% increase: 1000 * 1.1^2 = 1210
            const result = calculateMonthlyRentForYear(1000, 2, 10);
            expect(result).toBeCloseTo(1210, 5);
        });

        test('calculateMonthlyRentForYear_shouldHandleHighIncrease', () => {
            // 50% increase: 1000 * 1.5 = 1500
            const result = calculateMonthlyRentForYear(1000, 1, 50);
            expect(result).toBe(1500);
        });
    });

    describe('calculateMonthlyRentData', () => {
        test('calculateMonthlyRentData_shouldReturnNull_whenMonthlyRentIsZero', () => {
            const result = calculateMonthlyRentData(0, 5, 2.5);
            expect(result).toBeNull();
        });

        test('calculateMonthlyRentData_shouldReturnNull_whenMonthlyRentIsNegative', () => {
            const result = calculateMonthlyRentData(-100, 5, 2.5);
            expect(result).toBeNull();
        });

        test('calculateMonthlyRentData_shouldReturnNull_whenAnalysisYearsIsZero', () => {
            const result = calculateMonthlyRentData(1500, 0, 2.5);
            expect(result).toBeNull();
        });

        test('calculateMonthlyRentData_shouldReturnNull_whenAnalysisYearsIsNegative', () => {
            const result = calculateMonthlyRentData(1500, -5, 2.5);
            expect(result).toBeNull();
        });

        test('calculateMonthlyRentData_shouldCalculateCorrectData_forValidInputs', () => {
            const result = calculateMonthlyRentData(1000, 2, 10);
            
            expect(result).not.toBeNull();
            expect(result?.years).toHaveLength(2);
            expect(result?.totalPaid).toBe(25200); // Year 1: 12000, Year 2: 13200
        });

        test('calculateMonthlyRentData_shouldIncludeCorrectYearNumbers', () => {
            const currentYear = new Date().getFullYear();
            const result = calculateMonthlyRentData(1500, 3, 2.5);
            
            expect(result?.years[0].year).toBe(currentYear);
            expect(result?.years[1].year).toBe(currentYear + 1);
            expect(result?.years[2].year).toBe(currentYear + 2);
        });

        test('calculateMonthlyRentData_shouldCalculateCorrectMonthlyRent_forEachYear', () => {
            const result = calculateMonthlyRentData(1000, 2, 10);
            
            // Year 1: all months should be 1000
            expect(result?.years[0].months).toEqual(Array(12).fill(1000));
            
            // Year 2: all months should be 1100
            expect(result?.years[1].months).toEqual(Array(12).fill(1100));
        });

        test('calculateMonthlyRentData_shouldCalculateCorrectYearTotal', () => {
            const result = calculateMonthlyRentData(1000, 2, 10);
            
            expect(result?.years[0].yearTotal).toBe(12000); // 1000 * 12
            expect(result?.years[1].yearTotal).toBe(13200); // 1100 * 12
        });

        test('calculateMonthlyRentData_shouldCalculateCorrectCumulativeTotal', () => {
            const result = calculateMonthlyRentData(1000, 3, 10);
            
            expect(result?.years[0].cumulativeTotal).toBe(12000);
            expect(result?.years[1].cumulativeTotal).toBe(25200); // 12000 + 13200
            expect(result?.years[2].cumulativeTotal).toBe(39720); // 25200 + 14520
        });

        test('calculateMonthlyRentData_shouldCalculateCorrectTotalPaid', () => {
            const result = calculateMonthlyRentData(1000, 2, 0);
            
            // Total for 2 years: 1000 * 12 * 2 = 24,000
            expect(result?.totalPaid).toBe(24000);
        });

        test('calculateMonthlyRentData_shouldHandleZeroIncrease', () => {
            const result = calculateMonthlyRentData(1500, 3, 0);
            
            // All years should have the same rent
            expect(result?.years[0].yearTotal).toBe(18000);
            expect(result?.years[1].yearTotal).toBe(18000);
            expect(result?.years[2].yearTotal).toBe(18000);
            expect(result?.totalPaid).toBe(54000);
        });

        test('calculateMonthlyRentData_shouldHandleDecimalIncrease', () => {
            const result = calculateMonthlyRentData(1000, 2, 2.5);
            
            expect(result?.years[0].yearTotal).toBe(12000);
            expect(result?.years[1].yearTotal).toBe(12300); // 1025 * 12
        });

        test('calculateMonthlyRentData_shouldHandleSingleYear', () => {
            const result = calculateMonthlyRentData(1500, 1, 2.5);
            
            expect(result?.years).toHaveLength(1);
            expect(result?.totalPaid).toBe(18000);
        });

        test('calculateMonthlyRentData_shouldHandleLargeNumberOfYears', () => {
            const result = calculateMonthlyRentData(1000, 30, 2.5);
            
            expect(result?.years).toHaveLength(30);
            expect(result?.totalPaid).toBeGreaterThan(0);
        });

        test('calculateMonthlyRentData_shouldHandleHighIncrease', () => {
            const result = calculateMonthlyRentData(1000, 2, 50);
            
            expect(result?.years[0].yearTotal).toBe(12000);
            expect(result?.years[1].yearTotal).toBe(18000); // 1500 * 12
        });
    });

    describe('compressYearData', () => {
        test('compressYearData_shouldReturnEmptyArray_whenInputIsEmpty', () => {
            const result = compressYearData([], 5);
            expect(result).toEqual([]);
        });

        test('compressYearData_shouldReturnSingleAggregatedRow_whenMaxRowsIsZero', () => {
            const data = createMockData(10);
            const result = compressYearData(data.years, 0);
            
            expect(result).toHaveLength(1);
            expect(result[0].yearRange).toBe('2024-2033');
            
            // Total should be sum of all years
            const expectedTotal = data.years.reduce((sum, y) => sum + y.yearTotal, 0);
            expect(result[0].total).toBe(expectedTotal);
            
            // Cumulative should be the last year's cumulative
            expect(result[0].cumulativeTotal).toBe(data.years[data.years.length - 1].cumulativeTotal);
        });

        test('compressYearData_shouldReturnSingleAggregatedRow_whenMaxRowsIsNegative', () => {
            const data = createMockData(5);
            const result = compressYearData(data.years, -1);
            
            expect(result).toHaveLength(1);
            expect(result[0].yearRange).toBe('2024-2028');
            
            // Total should be sum of all years
            const expectedTotal = data.years.reduce((sum, y) => sum + y.yearTotal, 0);
            expect(result[0].total).toBe(expectedTotal);
        });

        test('compressYearData_shouldNotCompress_whenYearsLessThanMaxRows', () => {
            const data = createMockData(3);
            const result = compressYearData(data.years, 5);
            
            expect(result).toHaveLength(3);
            expect(result[0].yearRange).toBe('2024');
            expect(result[1].yearRange).toBe('2025');
            expect(result[2].yearRange).toBe('2026');
        });

        test('compressYearData_shouldNotCompress_whenYearsEqualMaxRows', () => {
            const data = createMockData(5);
            const result = compressYearData(data.years, 5);
            
            expect(result).toHaveLength(5);
            result.forEach((row, index) => {
                expect(row.yearRange).toBe((2024 + index).toString());
            });
        });

        test('compressYearData_shouldCompress_whenYearsExceedMaxRows', () => {
            const data = createMockData(10);
            const result = compressYearData(data.years, 5);
            
            expect(result.length).toBeLessThanOrEqual(5);
            expect(result.length).toBeGreaterThan(0);
        });

        test('compressYearData_shouldCreateYearRanges_whenCompressing', () => {
            const data = createMockData(10);
            const result = compressYearData(data.years, 5);
            
            // First row should be a range
            expect(result[0].yearRange).toContain('-');
        });

        test('compressYearData_shouldCalculateCorrectTotals_forCompressedRows', () => {
            const data = createMockData(6);
            const result = compressYearData(data.years, 3);
            
            // With 6 years and maxRows=3, should group 2 years per row
            expect(result).toHaveLength(3);
            
            // First group (years 0-1): 10000 + 20000 = 30000
            expect(result[0].total).toBe(30000);
            // Second group (years 2-3): 30000 + 40000 = 70000
            expect(result[1].total).toBe(70000);
            // Third group (years 4-5): 50000 + 60000 = 110000
            expect(result[2].total).toBe(110000);
        });

        test('compressYearData_shouldUseCumulativeTotalFromLastYearInGroup', () => {
            const data = createMockData(6);
            const result = compressYearData(data.years, 3);
            
            // First group ends at year index 1: cumulative = 10000 + 20000 = 30000
            expect(result[0].cumulativeTotal).toBe(30000);
            // Second group ends at year index 3: cumulative = 10000 + 20000 + 30000 + 40000 = 100000
            expect(result[1].cumulativeTotal).toBe(100000);
            // Third group ends at year index 5: cumulative = sum of all = 210000
            expect(result[2].cumulativeTotal).toBe(210000);
        });

        test('compressYearData_shouldHandleUnevenDistribution', () => {
            const data = createMockData(10);
            const result = compressYearData(data.years, 3);
            
            // With 10 years and maxRows=3, should group 4, 3, 3 or similar
            expect(result.length).toBeLessThanOrEqual(3);
            
            // Verify all years are accounted for
            const totalYears = result.reduce((sum, row) => {
                const range = row.yearRange.split('-');
                if (range.length === 1) return sum + 1;
                const start = parseInt(range[0]);
                const end = parseInt(range[1]);
                return sum + (end - start + 1);
            }, 0);
            expect(totalYears).toBe(10);
        });

        test('compressYearData_shouldHandleSingleYearGroups_atEnd', () => {
            const data = createMockData(7);
            const result = compressYearData(data.years, 3);
            
            expect(result.length).toBeLessThanOrEqual(3);
            // All rows should have valid year ranges
            result.forEach(row => {
                expect(row.yearRange).toBeTruthy();
                expect(row.total).toBeGreaterThan(0);
                expect(row.cumulativeTotal).toBeGreaterThan(0);
            });
        });

        test('compressYearData_shouldHandleLargeNumberOfYears', () => {
            const data = createMockData(30);
            const result = compressYearData(data.years, 5);
            
            expect(result.length).toBeLessThanOrEqual(5);
            expect(result.length).toBeGreaterThan(0);
            
            // Verify cumulative totals are monotonically increasing
            for (let i = 1; i < result.length; i++) {
                expect(result[i].cumulativeTotal).toBeGreaterThan(result[i - 1].cumulativeTotal);
            }
        });

        test('compressYearData_shouldHandleMaxRowsOfOne', () => {
            const data = createMockData(10);
            const result = compressYearData(data.years, 1);
            
            expect(result).toHaveLength(1);
            expect(result[0].yearRange).toBe('2024-2033');
            
            // Total should be sum of all years
            const expectedTotal = data.years.reduce((sum, y) => sum + y.yearTotal, 0);
            expect(result[0].total).toBe(expectedTotal);
            
            // Cumulative should be the last year's cumulative
            expect(result[0].cumulativeTotal).toBe(data.years[data.years.length - 1].cumulativeTotal);
        });

        test('compressYearData_shouldHandleSingleYear', () => {
            const data = createMockData(1);
            const result = compressYearData(data.years, 5);
            
            expect(result).toHaveLength(1);
            expect(result[0].yearRange).toBe('2024');
            expect(result[0].total).toBe(10000);
            expect(result[0].cumulativeTotal).toBe(10000);
        });

        test('compressYearData_shouldMaintainDataIntegrity_afterCompression', () => {
            const data = createMockData(15);
            const result = compressYearData(data.years, 5);
            
            // Sum of all totals in compressed rows should equal sum of original
            const compressedSum = result.reduce((sum, row) => sum + row.total, 0);
            const originalSum = data.years.reduce((sum, year) => sum + year.yearTotal, 0);
            
            expect(compressedSum).toBe(originalSum);
            
            // Last cumulative should match original last cumulative
            expect(result[result.length - 1].cumulativeTotal).toBe(
                data.years[data.years.length - 1].cumulativeTotal
            );
        });

        test('compressYearData_shouldCreateCorrectYearRanges', () => {
            const data = createMockData(8);
            const result = compressYearData(data.years, 4);
            
            // With 8 years and maxRows=4, should group 2 years per row
            expect(result).toHaveLength(4);
            expect(result[0].yearRange).toBe('2024-2025');
            expect(result[1].yearRange).toBe('2026-2027');
            expect(result[2].yearRange).toBe('2028-2029');
            expect(result[3].yearRange).toBe('2030-2031');
        });

        test('compressYearData_shouldHandleEdgeCase_withTwoYears', () => {
            const data = createMockData(2);
            const result = compressYearData(data.years, 1);
            
            expect(result).toHaveLength(1);
            expect(result[0].yearRange).toBe('2024-2025');
            expect(result[0].total).toBe(30000); // 10000 + 20000
        });
    });
});
