import { render, screen } from '@testing-library/react';
import { MonthlyRentTable, MonthlyRentData } from './MonthlyRentTable';

describe('MonthlyRentTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic rendering tests
    test('MonthlyRentTable_shouldShowMessage_whenMonthlyRentIsZero', () => {
        render(
            <MonthlyRentTable
                monthlyRent={0}
                analysisYears={5}
                annualRentIncrease={2.5}
            />
        );

        expect(screen.getByText(/please enter monthly rent/i)).toBeInTheDocument();
    });

    test('MonthlyRentTable_shouldShowMessage_whenAnalysisYearsIsZero', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1500}
                analysisYears={0}
                annualRentIncrease={2.5}
            />
        );

        expect(screen.getByText(/please enter monthly rent/i)).toBeInTheDocument();
    });

    test('MonthlyRentTable_shouldRenderTable_whenValidInputsProvided', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1500}
                analysisYears={3}
                annualRentIncrease={2.5}
            />
        );

        // Check for table headers
        expect(screen.getByText('Year')).toBeInTheDocument();
        expect(screen.getByText('Jan')).toBeInTheDocument();
        expect(screen.getByText('Dec')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
    });

    test('MonthlyRentTable_shouldRenderCorrectNumberOfRows', () => {
        const { container } = render(
            <MonthlyRentTable
                monthlyRent={1500}
                analysisYears={5}
                annualRentIncrease={2.5}
            />
        );

        // Should have 5 data rows (one for each year) + 1 header row
        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(5);
    });

    test('MonthlyRentTable_shouldDisplayCurrentYearAsFirstYear', () => {
        const currentYear = new Date().getFullYear();

        render(
            <MonthlyRentTable
                monthlyRent={1500}
                analysisYears={3}
                annualRentIncrease={2.5}
            />
        );

        expect(screen.getByText(currentYear.toString())).toBeInTheDocument();
    });

    test('MonthlyRentTable_shouldDisplayAllMonthHeaders', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1500}
                analysisYears={2}
                annualRentIncrease={2.5}
            />
        );

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        months.forEach(month => {
            expect(screen.getByText(month)).toBeInTheDocument();
        });
    });

    // Calculation tests
    test('MonthlyRentTable_shouldShowCorrectRent_forFirstYear', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1500}
                analysisYears={2}
                annualRentIncrease={2.5}
            />
        );

        // First year rent should be $1,500
        const firstYearCells = screen.getAllByText('$1,500');
        // Should appear 12 times (once per month) in the first year
        expect(firstYearCells.length).toBeGreaterThanOrEqual(12);
    });

    test('MonthlyRentTable_shouldCalculateIncreasedRent_forSecondYear', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1000}
                analysisYears={2}
                annualRentIncrease={10}
            />
        );

        // First year: $1,000
        const firstYearCells = screen.getAllByText('$1,000');
        expect(firstYearCells.length).toBeGreaterThanOrEqual(12);

        // Second year: $1,100 (10% increase)
        const secondYearCells = screen.getAllByText('$1,100');
        expect(secondYearCells.length).toBeGreaterThanOrEqual(12);
    });

    test('MonthlyRentTable_shouldCalculateYearTotal_correctly', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1000}
                analysisYears={1}
                annualRentIncrease={0}
            />
        );

        // Year total should be 1000 * 12 = 12,000
        expect(screen.getByText('$12,000')).toBeInTheDocument();
    });

    test('MonthlyRentTable_shouldHandleZeroIncrease', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1500}
                analysisYears={3}
                annualRentIncrease={0}
            />
        );

        // All years should show the same rent
        const rentCells = screen.getAllByText('$1,500');
        // 3 years * 12 months = 36 cells
        expect(rentCells.length).toBeGreaterThanOrEqual(36);
    });

    test('MonthlyRentTable_shouldHandleDecimalIncrease', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1000}
                analysisYears={2}
                annualRentIncrease={2.5}
            />
        );

        // First year: $1,000
        expect(screen.getAllByText('$1,000').length).toBeGreaterThanOrEqual(12);
        
        // Second year: $1,025 (2.5% increase)
        expect(screen.getAllByText('$1,025').length).toBeGreaterThanOrEqual(12);
    });

    // Callback tests
    test('MonthlyRentTable_shouldCallCallback_whenDataCalculated', () => {
        const mockCallback = jest.fn();

        render(
            <MonthlyRentTable
                monthlyRent={1000}
                analysisYears={2}
                annualRentIncrease={10}
                onDataCalculated={mockCallback}
            />
        );

        expect(mockCallback).toHaveBeenCalled();
    });

    test('MonthlyRentTable_shouldProvideCorrectData_toCallback', () => {
        const mockCallback = jest.fn();

        render(
            <MonthlyRentTable
                monthlyRent={1000}
                analysisYears={2}
                annualRentIncrease={10}
                onDataCalculated={mockCallback}
            />
        );

        expect(mockCallback).toHaveBeenCalledWith(
            expect.objectContaining({
                years: expect.arrayContaining([
                    expect.objectContaining({
                        year: expect.any(Number),
                        months: expect.any(Array),
                        yearTotal: expect.any(Number),
                    }),
                ]),
                totalPaid: expect.any(Number),
            })
        );
    });

    test('MonthlyRentTable_shouldCalculateCorrectTotalPaid_inCallback', () => {
        let capturedData: MonthlyRentData | undefined;
        const mockCallback = jest.fn((data: MonthlyRentData) => {
            capturedData = data;
        });

        render(
            <MonthlyRentTable
                monthlyRent={1000}
                analysisYears={2}
                annualRentIncrease={0}
                onDataCalculated={mockCallback}
            />
        );

        expect(capturedData).toBeDefined();
        // Total for 2 years: 1000 * 12 * 2 = 24,000
        expect(capturedData?.totalPaid).toBe(24000);
    });

    test('MonthlyRentTable_shouldUpdateCallback_whenPropsChange', () => {
        const mockCallback = jest.fn();

        const { rerender } = render(
            <MonthlyRentTable
                monthlyRent={1000}
                analysisYears={2}
                annualRentIncrease={0}
                onDataCalculated={mockCallback}
            />
        );

        expect(mockCallback).toHaveBeenCalledTimes(1);

        // Change monthly rent
        rerender(
            <MonthlyRentTable
                monthlyRent={1500}
                analysisYears={2}
                annualRentIncrease={0}
                onDataCalculated={mockCallback}
            />
        );

        expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    test('MonthlyRentTable_shouldNotCallCallback_whenRentIsZero', () => {
        const mockCallback = jest.fn();

        render(
            <MonthlyRentTable
                monthlyRent={0}
                analysisYears={2}
                annualRentIncrease={2.5}
                onDataCalculated={mockCallback}
            />
        );

        expect(mockCallback).not.toHaveBeenCalled();
    });

    // Format tests
    test('MonthlyRentTable_shouldFormatCurrency_withoutDecimals', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1234.56}
                analysisYears={1}
                annualRentIncrease={0}
            />
        );

        // Should round to nearest dollar
        expect(screen.getAllByText('$1,235').length).toBeGreaterThan(0);
    });

    test('MonthlyRentTable_shouldFormatLargeNumbers_withCommas', () => {
        render(
            <MonthlyRentTable
                monthlyRent={10000}
                analysisYears={1}
                annualRentIncrease={0}
            />
        );

        expect(screen.getAllByText('$10,000').length).toBeGreaterThan(0);
        expect(screen.getByText('$120,000')).toBeInTheDocument();
    });

    // Edge cases
    test('MonthlyRentTable_shouldHandleSmallRentValues', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1}
                analysisYears={1}
                annualRentIncrease={0}
            />
        );

        expect(screen.getAllByText('$1').length).toBeGreaterThan(0);
    });

    test('MonthlyRentTable_shouldHandleLargeAnalysisYears', () => {
        const { container } = render(
            <MonthlyRentTable
                monthlyRent={1000}
                analysisYears={30}
                annualRentIncrease={2.5}
            />
        );

        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(30);
    });

    test('MonthlyRentTable_shouldHandleHighRentIncrease', () => {
        render(
            <MonthlyRentTable
                monthlyRent={1000}
                analysisYears={2}
                annualRentIncrease={50}
            />
        );

        // First year: $1,000
        expect(screen.getAllByText('$1,000').length).toBeGreaterThanOrEqual(12);
        
        // Second year: $1,500 (50% increase)
        expect(screen.getAllByText('$1,500').length).toBeGreaterThanOrEqual(12);
    });
});
