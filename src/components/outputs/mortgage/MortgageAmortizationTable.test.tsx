import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MortgageAmortizationTable } from './MortgageAmortizationTable';
import { MortgageAmortizationData, calculateMortgageAmortization } from '@/services/MortgageAmortizationCalculator';

describe('MortgageAmortizationTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Basic rendering tests
    test('MortgageAmortizationTable_shouldShowMessage_whenDataIsNull', () => {
        render(<MortgageAmortizationTable data={null} />);

        expect(screen.getByText(/please enter mortgage details/i)).toBeInTheDocument();
    });

    test('MortgageAmortizationTable_shouldShowMessage_whenDataIsEmpty', () => {
        const emptyData: MortgageAmortizationData = {
            monthlyPayment: 0,
            totalPrincipalPaid: 0,
            totalInterestPaid: 0,
            totalPaid: 0,
            months: [],
        };
        render(<MortgageAmortizationTable data={emptyData} />);

        expect(screen.getByText(/please enter mortgage details/i)).toBeInTheDocument();
    });

    test('MortgageAmortizationTable_shouldRenderTable_whenValidDataProvided', () => {
        const data = calculateMortgageAmortization(500000, 20, 5.0, 25);
        render(<MortgageAmortizationTable data={data} />);

        // Check for table headers
        expect(screen.getByText('Year')).toBeInTheDocument();
        expect(screen.getByText('Payment')).toBeInTheDocument();
        expect(screen.getByText('Principal')).toBeInTheDocument();
        expect(screen.getByText('Interest')).toBeInTheDocument();
        expect(screen.getByText('Balance')).toBeInTheDocument();
    });

    test('MortgageAmortizationTable_shouldRenderCorrectNumberOfRows', () => {
        const data = calculateMortgageAmortization(500000, 20, 5.0, 10);
        const { container } = render(<MortgageAmortizationTable data={data} />);

        // Should have 10 data rows (one for each year) + 1 header row
        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(10);
    });

    test('MortgageAmortizationTable_shouldDisplayYearNumbers', () => {
        const data = calculateMortgageAmortization(500000, 20, 5.0, 3);
        render(<MortgageAmortizationTable data={data} />);

        // Should show years 1, 2, 3
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('MortgageAmortizationTable_shouldDisplayAllColumnHeaders', () => {
        const data = calculateMortgageAmortization(500000, 20, 5.0, 5);
        render(<MortgageAmortizationTable data={data} />);

        expect(screen.getByText('Year')).toBeInTheDocument();
        expect(screen.getByText('Payment')).toBeInTheDocument();
        expect(screen.getByText('Principal')).toBeInTheDocument();
        expect(screen.getByText('Interest')).toBeInTheDocument();
        expect(screen.getByText('Balance')).toBeInTheDocument();
        expect(screen.getByText('Cumulative Principal')).toBeInTheDocument();
        expect(screen.getByText('Cumulative Interest')).toBeInTheDocument();
    });

    // Data accuracy tests
    test('MortgageAmortizationTable_shouldShowDecreasingBalance', () => {
        const data = calculateMortgageAmortization(100000, 20, 5.0, 5);
        const { container } = render(<MortgageAmortizationTable data={data} />);

        const rows = container.querySelectorAll('tbody tr');
        const balances: number[] = [];

        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            // Balance is the 5th column (index 4)
            const balanceText = cells[4].textContent || '';
            const balance = parseFloat(balanceText.replace(/[$,]/g, ''));
            balances.push(balance);
        });

        // Each subsequent balance should be less than the previous
        for (let i = 1; i < balances.length; i++) {
            expect(balances[i]).toBeLessThan(balances[i - 1]);
        }
    });

    test('MortgageAmortizationTable_shouldShowIncreasingCumulatives', () => {
        const data = calculateMortgageAmortization(100000, 20, 5.0, 5);
        const { container } = render(<MortgageAmortizationTable data={data} />);

        const rows = container.querySelectorAll('tbody tr');
        const cumulativePrincipal: number[] = [];
        const cumulativeInterest: number[] = [];

        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            // Cumulative Principal is the 6th column (index 5)
            // Cumulative Interest is the 7th column (index 6)
            const principalText = cells[5].textContent || '';
            const interestText = cells[6].textContent || '';
            cumulativePrincipal.push(parseFloat(principalText.replace(/[$,]/g, '')));
            cumulativeInterest.push(parseFloat(interestText.replace(/[$,]/g, '')));
        });

        // Each subsequent cumulative should be greater than the previous
        for (let i = 1; i < cumulativePrincipal.length; i++) {
            expect(cumulativePrincipal[i]).toBeGreaterThan(cumulativePrincipal[i - 1]);
            expect(cumulativeInterest[i]).toBeGreaterThan(cumulativeInterest[i - 1]);
        }
    });

    test('MortgageAmortizationTable_shouldHandleZeroInterest', () => {
        const data = calculateMortgageAmortization(100000, 20, 0, 5);
        render(<MortgageAmortizationTable data={data} />);

        // Should still render the table
        expect(screen.getByText('Year')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('MortgageAmortizationTable_shouldHandleLargeAmortization', () => {
        const data = calculateMortgageAmortization(800000, 20, 5.0, 30);
        const { container } = render(<MortgageAmortizationTable data={data} />);

        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(30);
    });

    // Format tests
    test('MortgageAmortizationTable_shouldFormatCurrency_withCommas', () => {
        const data = calculateMortgageAmortization(500000, 20, 5.0, 1);
        render(<MortgageAmortizationTable data={data} />);

        // Should have comma-separated currency values
        const currencyPattern = /\$\d{1,3}(,\d{3})*/;
        const tableElement = screen.getByText('Payment').closest('table');
        expect(tableElement).toBeTruthy();
        if (tableElement) {
            const bodyText = tableElement.textContent || '';
            expect(currencyPattern.test(bodyText)).toBe(true);
        }
    });

    test('MortgageAmortizationTable_shouldFormatCurrency_withoutDecimals', () => {
        const data = calculateMortgageAmortization(100000, 20, 5.0, 1);
        const { container } = render(<MortgageAmortizationTable data={data} />);

        // Currency values should not have decimal places
        const cells = container.querySelectorAll('td');
        cells.forEach((cell) => {
            const text = cell.textContent || '';
            if (text.includes('$')) {
                // Should not contain decimal point
                expect(text).not.toMatch(/\$\d+\.\d+/);
            }
        });
    });

    // Edge cases
    test('MortgageAmortizationTable_shouldHandleSmallLoanValues', () => {
        const data = calculateMortgageAmortization(10000, 20, 5.0, 5);
        render(<MortgageAmortizationTable data={data} />);

        expect(screen.getByText('Year')).toBeInTheDocument();
    });

    test('MortgageAmortizationTable_shouldHandleHighDownPayment', () => {
        const data = calculateMortgageAmortization(500000, 50, 5.0, 25);
        render(<MortgageAmortizationTable data={data} />);

        expect(screen.getByText('Year')).toBeInTheDocument();
    });

    test('MortgageAmortizationTable_shouldHandleHighInterestRate', () => {
        const data = calculateMortgageAmortization(500000, 20, 15.0, 25);
        render(<MortgageAmortizationTable data={data} />);

        expect(screen.getByText('Year')).toBeInTheDocument();
    });

    test('MortgageAmortizationTable_shouldHandleShortAmortization', () => {
        const data = calculateMortgageAmortization(500000, 20, 5.0, 5);
        const { container } = render(<MortgageAmortizationTable data={data} />);

        const rows = container.querySelectorAll('tbody tr');
        expect(rows).toHaveLength(5);
    });
});
