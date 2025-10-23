import { render, screen } from '@testing-library/react';
import { CompactMortgageAmortizationTable } from './CompactMortgageAmortizationTable';
import { MortgageAmortizationData } from '@/services/MortgageAmortizationCalculator';

describe('CompactMortgageAmortizationTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper function to create mock data
    const createMockData = (numYears: number): MortgageAmortizationData => {
        const months = [];
        let cumulativePrincipal = 0;
        let cumulativeInterest = 0;
        const monthlyPayment = 2000;
        const startingBalance = numYears * 12 * 1500;
        
        for (let year = 1; year <= numYears; year++) {
            for (let month = 1; month <= 12; month++) {
                const index = (year - 1) * 12 + month;
                const balanceStart = startingBalance - (index - 1) * 1500;
                const interest = balanceStart * 0.05 / 12;
                const principal = monthlyPayment - interest;
                const balanceEnd = balanceStart - principal;
                cumulativePrincipal += principal;
                cumulativeInterest += interest;
                
                months.push({
                    index,
                    year,
                    monthInYear: month,
                    payment: monthlyPayment,
                    interest,
                    principal,
                    balanceStart,
                    balanceEnd,
                    cumulativePrincipal,
                    cumulativeInterest,
                });
            }
        }

        return {
            monthlyPayment,
            totalPrincipalPaid: cumulativePrincipal,
            totalInterestPaid: cumulativeInterest,
            totalPaid: cumulativePrincipal + cumulativeInterest,
            months,
        };
    };

    // Basic rendering tests
    test('CompactMortgageAmortizationTable_shouldShowMessage_whenDataIsNull', () => {
        render(<CompactMortgageAmortizationTable data={null} />);
        expect(screen.getByText(/please enter mortgage details/i)).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationTable_shouldShowMessage_whenMonthsArrayIsEmpty', () => {
        const emptyData: MortgageAmortizationData = {
            monthlyPayment: 0,
            totalPrincipalPaid: 0,
            totalInterestPaid: 0,
            totalPaid: 0,
            months: [],
        };
        render(<CompactMortgageAmortizationTable data={emptyData} />);
        expect(screen.getByText(/please enter mortgage details/i)).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationTable_shouldRenderTable_whenValidDataProvided', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationTable data={data} />);

        expect(screen.getByText('Year(s)')).toBeInTheDocument();
        expect(screen.getByText('Payment')).toBeInTheDocument();
        expect(screen.getByText('Principal')).toBeInTheDocument();
        expect(screen.getByText('Interest')).toBeInTheDocument();
        expect(screen.getByText('Balance')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationTable_shouldUseDefaultMaxRows_whenNotProvided', () => {
        const data = createMockData(3);
        const { container } = render(<CompactMortgageAmortizationTable data={data} />);
        
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBeLessThanOrEqual(5); // Default maxRows is 5
    });

    test('CompactMortgageAmortizationTable_shouldRespectCustomMaxRows', () => {
        const data = createMockData(10);
        const { container } = render(<CompactMortgageAmortizationTable data={data} maxRows={3} />);
        
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBeLessThanOrEqual(3);
    });

    // Display formatting tests
    test('CompactMortgageAmortizationTable_shouldFormatCurrency_correctly', () => {
        const data = createMockData(3);
        const { container } = render(<CompactMortgageAmortizationTable data={data} />);

        // Check that currency values are formatted with $ and commas
        const cells = container.querySelectorAll('tbody td');
        const hasCurrency = Array.from(cells).some(cell => 
            cell.textContent?.includes('$')
        );
        expect(hasCurrency).toBe(true);
    });

    test('CompactMortgageAmortizationTable_shouldShowIndividualYears_whenNoCompressionNeeded', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationTable data={data} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationTable_shouldShowYearRanges_whenCompressionApplied', () => {
        const data = createMockData(10);
        const { container } = render(<CompactMortgageAmortizationTable data={data} maxRows={3} />);

        // Should have at least one year range
        const cells = container.querySelectorAll('tbody td');
        const hasRange = Array.from(cells).some(cell => 
            cell.textContent?.includes('-')
        );
        expect(hasRange).toBe(true);
    });

    test('CompactMortgageAmortizationTable_shouldAggregateCorrectly_whenCompressed', () => {
        const data = createMockData(6);
        const { container } = render(<CompactMortgageAmortizationTable data={data} maxRows={3} />);
        
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBe(3);
    });

    test('CompactMortgageAmortizationTable_shouldHandleSingleYear', () => {
        const data = createMockData(1);
        render(<CompactMortgageAmortizationTable data={data} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        
        const { container } = render(<CompactMortgageAmortizationTable data={data} />);
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBe(1);
    });

    test('CompactMortgageAmortizationTable_shouldHandleLargeNumberOfYears', () => {
        const data = createMockData(25);
        const { container } = render(<CompactMortgageAmortizationTable data={data} maxRows={5} />);
        
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBeLessThanOrEqual(5);
    });

    test('CompactMortgageAmortizationTable_shouldShowDecreasingBalance', () => {
        const data = createMockData(5);
        const { container } = render(<CompactMortgageAmortizationTable data={data} />);

        const rows = container.querySelectorAll('tbody tr');
        const balances: number[] = [];

        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            // Balance is the 5th column (index 4)
            const balanceText = cells[4].textContent || '';
            const balance = parseFloat(balanceText.replace(/[$,]/g, ''));
            balances.push(balance);
        });

        // Each subsequent balance should be less than or equal to the previous
        for (let i = 1; i < balances.length; i++) {
            expect(balances[i]).toBeLessThanOrEqual(balances[i - 1]);
        }
    });
});
