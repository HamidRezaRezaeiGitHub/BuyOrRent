import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { CompactMonthlyRentTable } from './CompactMonthlyRentTable';
import { MonthlyRentData } from '@/services/MonthlyRentCalculator';

describe('CompactMonthlyRentTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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

    // Compression algorithm tests are now in MonthlyRentCalculator.test.ts
    // These tests focus on component rendering behavior

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
