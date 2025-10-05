import { render, screen } from '@testing-library/react';
import { MonthlyRentTable } from './MonthlyRentTable';
import { MonthlyRentData, calculateMonthlyRentData } from '@/services/MonthlyRentCalculator';

describe('MonthlyRentTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Component rendering tests
    // Calculation logic tests have been moved to MonthlyRentCalculator.test.ts

    // Basic rendering tests
    test('MonthlyRentTable_shouldShowMessage_whenDataIsNull', () => {
        render(<MonthlyRentTable data={null} />);

        expect(screen.getByText(/please enter monthly rent/i)).toBeInTheDocument();
    });

    test('MonthlyRentTable_shouldShowMessage_whenDataIsEmpty', () => {
        const emptyData: MonthlyRentData = {
            years: [],
            totalPaid: 0,
        };
        render(<MonthlyRentTable data={emptyData} />);

        expect(screen.getByText(/please enter monthly rent/i)).toBeInTheDocument();
    });

    test('MonthlyRentTable_shouldRenderTable_whenValidDataProvided', () => {
        const data = calculateMonthlyRentData(1500, 3, 2.5);
        render(<MonthlyRentTable data={data} />);

        // Check for table headers
        expect(screen.getByText('Year')).toBeInTheDocument();
        expect(screen.getByText('Jan')).toBeInTheDocument();
        expect(screen.getByText('Dec')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
    });

    test('MonthlyRentTable_shouldRenderCorrectNumberOfRows', () => {
        const data = calculateMonthlyRentData(1500, 5, 2.5);
        const { container } = render(<MonthlyRentTable data={data} />);

        // Should have 5 data rows (one for each year) + 1 header row
        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(5);
    });

    test('MonthlyRentTable_shouldDisplayCurrentYearAsFirstYear', () => {
        const currentYear = new Date().getFullYear();
        const data = calculateMonthlyRentData(1500, 3, 2.5);
        render(<MonthlyRentTable data={data} />);

        expect(screen.getByText(currentYear.toString())).toBeInTheDocument();
    });

    test('MonthlyRentTable_shouldDisplayAllMonthHeaders', () => {
        const data = calculateMonthlyRentData(1500, 2, 2.5);
        render(<MonthlyRentTable data={data} />);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        months.forEach(month => {
            expect(screen.getByText(month)).toBeInTheDocument();
        });
    });

    // Calculation tests
    test('MonthlyRentTable_shouldShowCorrectRent_forFirstYear', () => {
        const data = calculateMonthlyRentData(1500, 2, 2.5);
        render(<MonthlyRentTable data={data} />);

        // First year rent should be $1,500
        const firstYearCells = screen.getAllByText('$1,500');
        // Should appear 12 times (once per month) in the first year
        expect(firstYearCells.length).toBeGreaterThanOrEqual(12);
    });

    test('MonthlyRentTable_shouldCalculateIncreasedRent_forSecondYear', () => {
        const data = calculateMonthlyRentData(1000, 2, 10);
        render(<MonthlyRentTable data={data} />);

        // First year: $1,000
        const firstYearCells = screen.getAllByText('$1,000');
        expect(firstYearCells.length).toBeGreaterThanOrEqual(12);

        // Second year: $1,100 (10% increase)
        const secondYearCells = screen.getAllByText('$1,100');
        expect(secondYearCells.length).toBeGreaterThanOrEqual(12);
    });

    test('MonthlyRentTable_shouldCalculateYearTotal_correctly', () => {
        const data = calculateMonthlyRentData(1000, 1, 0);
        render(<MonthlyRentTable data={data} />);

        // Year total should be 1000 * 12 = 12,000
        // This appears in both Total and Cumulative columns
        expect(screen.getAllByText('$12,000').length).toBeGreaterThan(0);
    });

    test('MonthlyRentTable_shouldHandleZeroIncrease', () => {
        const data = calculateMonthlyRentData(1500, 3, 0);
        render(<MonthlyRentTable data={data} />);

        // All years should show the same rent
        const rentCells = screen.getAllByText('$1,500');
        // 3 years * 12 months = 36 cells
        expect(rentCells.length).toBeGreaterThanOrEqual(36);
    });

    test('MonthlyRentTable_shouldHandleDecimalIncrease', () => {
        const data = calculateMonthlyRentData(1000, 2, 2.5);
        render(<MonthlyRentTable data={data} />);

        // First year: $1,000
        expect(screen.getAllByText('$1,000').length).toBeGreaterThanOrEqual(12);
        
        // Second year: $1,025 (2.5% increase)
        expect(screen.getAllByText('$1,025').length).toBeGreaterThanOrEqual(12);
    });

    // Format tests
    test('MonthlyRentTable_shouldFormatCurrency_withoutDecimals', () => {
        const data = calculateMonthlyRentData(1234.56, 1, 0);
        render(<MonthlyRentTable data={data} />);

        // Should round to nearest dollar
        expect(screen.getAllByText('$1,235').length).toBeGreaterThan(0);
    });

    test('MonthlyRentTable_shouldFormatLargeNumbers_withCommas', () => {
        const data = calculateMonthlyRentData(10000, 1, 0);
        render(<MonthlyRentTable data={data} />);

        expect(screen.getAllByText('$10,000').length).toBeGreaterThan(0);
        // Cumulative total is also $120,000, so use getAllByText
        expect(screen.getAllByText('$120,000').length).toBeGreaterThan(0);
    });

    // Edge cases
    test('MonthlyRentTable_shouldHandleSmallRentValues', () => {
        const data = calculateMonthlyRentData(1, 1, 0);
        render(<MonthlyRentTable data={data} />);

        expect(screen.getAllByText('$1').length).toBeGreaterThan(0);
    });

    test('MonthlyRentTable_shouldHandleLargeAnalysisYears', () => {
        const data = calculateMonthlyRentData(1000, 30, 2.5);
        const { container } = render(<MonthlyRentTable data={data} />);

        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(30);
    });

    test('MonthlyRentTable_shouldHandleHighRentIncrease', () => {
        const data = calculateMonthlyRentData(1000, 2, 50);
        render(<MonthlyRentTable data={data} />);

        // First year: $1,000
        expect(screen.getAllByText('$1,000').length).toBeGreaterThanOrEqual(12);
        
        // Second year: $1,500 (50% increase)
        expect(screen.getAllByText('$1,500').length).toBeGreaterThanOrEqual(12);
    });
});
