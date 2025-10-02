import { render, screen } from '@testing-library/react';
import { CompactMonthlyRentTable, compressYearData } from './CompactMonthlyRentTable';
import { MonthlyRentData } from './MonthlyRentTable';

describe('CompactMonthlyRentTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper function to create mock data
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

    // Basic rendering tests
    test('CompactMonthlyRentTable_shouldShowMessage_whenDataIsNull', () => {
        render(<CompactMonthlyRentTable data={null} />);
        expect(screen.getByText(/please enter monthly rent/i)).toBeInTheDocument();
    });

    test('CompactMonthlyRentTable_shouldShowMessage_whenYearsArrayIsEmpty', () => {
        const emptyData: MonthlyRentData = { years: [], totalPaid: 0 };
        render(<CompactMonthlyRentTable data={emptyData} />);
        expect(screen.getByText(/please enter monthly rent/i)).toBeInTheDocument();
    });

    test('CompactMonthlyRentTable_shouldRenderTable_whenValidDataProvided', () => {
        const data = createMockData(3);
        render(<CompactMonthlyRentTable data={data} />);

        expect(screen.getByText('Year(s)')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('Cumulative')).toBeInTheDocument();
    });

    test('CompactMonthlyRentTable_shouldUseDefaultMaxRows_whenNotProvided', () => {
        const data = createMockData(3);
        const { container } = render(<CompactMonthlyRentTable data={data} />);
        
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBeLessThanOrEqual(5); // Default maxRows is 5
    });

    test('CompactMonthlyRentTable_shouldRespectCustomMaxRows', () => {
        const data = createMockData(10);
        const { container } = render(<CompactMonthlyRentTable data={data} maxRows={3} />);
        
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBeLessThanOrEqual(3);
    });

    // Compression algorithm tests
    describe('compressYearData', () => {
        test('compressYearData_shouldReturnEmptyArray_whenInputIsEmpty', () => {
            const result = compressYearData([], 5);
            expect(result).toEqual([]);
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

    // Display formatting tests
    test('CompactMonthlyRentTable_shouldFormatCurrency_correctly', () => {
        const data = createMockData(3);
        render(<CompactMonthlyRentTable data={data} />);

        const tenThousand = screen.getAllByText('$10,000');
        expect(tenThousand.length).toBeGreaterThan(0);
        const thirtyThousand = screen.getAllByText('$30,000');
        expect(thirtyThousand.length).toBeGreaterThan(0); // Cumulative after first year
    });

    test('CompactMonthlyRentTable_shouldShowIndividualYears_whenNoCompressionNeeded', () => {
        const data = createMockData(3);
        render(<CompactMonthlyRentTable data={data} />);

        expect(screen.getByText('2024')).toBeInTheDocument();
        expect(screen.getByText('2025')).toBeInTheDocument();
        expect(screen.getByText('2026')).toBeInTheDocument();
    });

    test('CompactMonthlyRentTable_shouldShowYearRanges_whenCompressionApplied', () => {
        const data = createMockData(10);
        render(<CompactMonthlyRentTable data={data} maxRows={3} />);

        // Should have at least one year range
        const { container } = render(<CompactMonthlyRentTable data={data} maxRows={3} />);
        const cells = container.querySelectorAll('tbody td');
        const hasRange = Array.from(cells).some(cell => 
            cell.textContent?.includes('-')
        );
        expect(hasRange).toBe(true);
    });
});
