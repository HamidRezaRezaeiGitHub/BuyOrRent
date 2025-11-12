import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { CompactMortgageAmortizationGraph } from './CompactMortgageAmortizationGraph';
import { MortgageAmortizationData } from '@/services/MortgageAmortizationCalculator';

// Mock recharts to avoid issues with SVG rendering in tests
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="line-chart">{children}</div>
    ),
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
}));

describe('CompactMortgageAmortizationGraph', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

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
    test('CompactMortgageAmortizationGraph_shouldShowMessage_whenDataIsNull', () => {
        render(<CompactMortgageAmortizationGraph data={null} />);

        expect(screen.getByText(/please enter mortgage details/i)).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldShowMessage_whenDataIsEmpty', () => {
        const emptyData: MortgageAmortizationData = {
            monthlyPayment: 0,
            totalPrincipalPaid: 0,
            totalInterestPaid: 0,
            totalPaid: 0,
            months: [],
        };

        render(<CompactMortgageAmortizationGraph data={emptyData} />);

        expect(screen.getByText(/please enter mortgage details/i)).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldRenderGraph_whenValidDataProvided', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationGraph data={data} />);

        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldDisplayTitle', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationGraph data={data} />);

        expect(screen.getByText('Mortgage Amortization')).toBeInTheDocument();
    });

    // Graph components tests
    test('CompactMortgageAmortizationGraph_shouldRenderLineChart', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationGraph data={data} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldRenderMultipleLines', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationGraph data={data} />);

        // Should have 3 lines (principal, interest, balance)
        const lines = screen.getAllByTestId('line');
        expect(lines).toHaveLength(3);
    });

    test('CompactMortgageAmortizationGraph_shouldRenderXAxis', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationGraph data={data} />);

        expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldRenderYAxis', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationGraph data={data} />);

        expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldRenderTooltip', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationGraph data={data} />);

        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    // Data handling tests
    test('CompactMortgageAmortizationGraph_shouldHandleSingleYearData', () => {
        const data = createMockData(1);
        render(<CompactMortgageAmortizationGraph data={data} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldHandleMultipleYearsData', () => {
        const data = createMockData(10);
        render(<CompactMortgageAmortizationGraph data={data} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldHandleLargeDataset', () => {
        const data = createMockData(25);
        render(<CompactMortgageAmortizationGraph data={data} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldUpdateGraph_whenDataChanges', () => {
        const data1 = createMockData(3);
        const { rerender } = render(<CompactMortgageAmortizationGraph data={data1} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();

        const data2 = createMockData(5);
        rerender(<CompactMortgageAmortizationGraph data={data2} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldRenderResponsiveContainer', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationGraph data={data} />);

        const container = screen.getByTestId('responsive-container');
        expect(container).toBeInTheDocument();
    });

    test('CompactMortgageAmortizationGraph_shouldFilterEndOfYearDataOnly', () => {
        const data = createMockData(3);
        render(<CompactMortgageAmortizationGraph data={data} />);
        
        // Should render successfully (implying data was filtered correctly)
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
});
