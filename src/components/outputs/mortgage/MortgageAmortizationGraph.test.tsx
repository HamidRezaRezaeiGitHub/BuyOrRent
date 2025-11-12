import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { MortgageAmortizationGraph } from './MortgageAmortizationGraph';
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

describe('MortgageAmortizationGraph', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockData: MortgageAmortizationData = {
        monthlyPayment: 2000,
        totalPrincipalPaid: 400000,
        totalInterestPaid: 200000,
        totalPaid: 600000,
        months: [
            {
                index: 1,
                year: 1,
                monthInYear: 1,
                payment: 2000,
                interest: 1000,
                principal: 1000,
                balanceStart: 400000,
                balanceEnd: 399000,
                cumulativePrincipal: 1000,
                cumulativeInterest: 1000,
            },
            {
                index: 12,
                year: 1,
                monthInYear: 12,
                payment: 2000,
                interest: 990,
                principal: 1010,
                balanceStart: 390000,
                balanceEnd: 388990,
                cumulativePrincipal: 11010,
                cumulativeInterest: 11990,
            },
            {
                index: 24,
                year: 2,
                monthInYear: 12,
                payment: 2000,
                interest: 980,
                principal: 1020,
                balanceStart: 380000,
                balanceEnd: 378980,
                cumulativePrincipal: 21020,
                cumulativeInterest: 22980,
            },
        ],
    };

    // Basic rendering tests
    test('MortgageAmortizationGraph_shouldShowMessage_whenDataIsNull', () => {
        render(<MortgageAmortizationGraph data={null} />);

        expect(screen.getByText(/please enter mortgage details/i)).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldShowMessage_whenDataIsEmpty', () => {
        const emptyData: MortgageAmortizationData = {
            monthlyPayment: 0,
            totalPrincipalPaid: 0,
            totalInterestPaid: 0,
            totalPaid: 0,
            months: [],
        };

        render(<MortgageAmortizationGraph data={emptyData} />);

        expect(screen.getByText(/please enter mortgage details/i)).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldRenderGraph_whenValidDataProvided', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldDisplayTitle', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        expect(screen.getByText('Mortgage Amortization Over Time')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldDisplayTotals', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        expect(screen.getByText(/total interest paid/i)).toBeInTheDocument();
        expect(screen.getByText(/total principal paid/i)).toBeInTheDocument();
        expect(screen.getByText('$200,000')).toBeInTheDocument();
        expect(screen.getByText('$400,000')).toBeInTheDocument();
    });

    // Graph components tests
    test('MortgageAmortizationGraph_shouldRenderLineChart', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldRenderMultipleLines', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        // Should have 3 lines (principal, interest, balance)
        const lines = screen.getAllByTestId('line');
        expect(lines).toHaveLength(3);
    });

    test('MortgageAmortizationGraph_shouldRenderXAxis', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldRenderYAxis', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldRenderTooltip', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldRenderCartesianGrid', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    });

    // Data handling tests
    test('MortgageAmortizationGraph_shouldHandleSingleYearData', () => {
        const singleYearData: MortgageAmortizationData = {
            monthlyPayment: 2000,
            totalPrincipalPaid: 20000,
            totalInterestPaid: 4000,
            totalPaid: 24000,
            months: Array.from({ length: 12 }, (_, i) => ({
                index: i + 1,
                year: 1,
                monthInYear: i + 1,
                payment: 2000,
                interest: 333,
                principal: 1667,
                balanceStart: 100000 - i * 1667,
                balanceEnd: 100000 - (i + 1) * 1667,
                cumulativePrincipal: (i + 1) * 1667,
                cumulativeInterest: (i + 1) * 333,
            })),
        };

        render(<MortgageAmortizationGraph data={singleYearData} />);

        expect(screen.getByText('$4,000')).toBeInTheDocument();
        expect(screen.getByText('$20,000')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldHandleMultipleYearsData', () => {
        const multiYearData: MortgageAmortizationData = {
            monthlyPayment: 2000,
            totalPrincipalPaid: 200000,
            totalInterestPaid: 100000,
            totalPaid: 300000,
            months: Array.from({ length: 120 }, (_, i) => ({
                index: i + 1,
                year: Math.floor(i / 12) + 1,
                monthInYear: (i % 12) + 1,
                payment: 2000,
                interest: 1000 - i * 5,
                principal: 1000 + i * 5,
                balanceStart: 200000 - i * 1667,
                balanceEnd: 200000 - (i + 1) * 1667,
                cumulativePrincipal: (i + 1) * 1667,
                cumulativeInterest: (i + 1) * 333,
            })),
        };

        render(<MortgageAmortizationGraph data={multiYearData} />);

        expect(screen.getByText('$100,000')).toBeInTheDocument();
        expect(screen.getByText('$200,000')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldHandleLargeTotals', () => {
        const largeData: MortgageAmortizationData = {
            monthlyPayment: 4000,
            totalPrincipalPaid: 800000,
            totalInterestPaid: 400000,
            totalPaid: 1200000,
            months: Array.from({ length: 300 }, (_, i) => ({
                index: i + 1,
                year: Math.floor(i / 12) + 1,
                monthInYear: (i % 12) + 1,
                payment: 4000,
                interest: 2000 - i * 5,
                principal: 2000 + i * 5,
                balanceStart: 800000 - i * 2667,
                balanceEnd: 800000 - (i + 1) * 2667,
                cumulativePrincipal: (i + 1) * 2667,
                cumulativeInterest: (i + 1) * 1333,
            })),
        };

        render(<MortgageAmortizationGraph data={largeData} />);

        expect(screen.getByText('$400,000')).toBeInTheDocument();
        expect(screen.getByText('$800,000')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldHandleSmallTotals', () => {
        const smallData: MortgageAmortizationData = {
            monthlyPayment: 500,
            totalPrincipalPaid: 5000,
            totalInterestPaid: 1000,
            totalPaid: 6000,
            months: Array.from({ length: 12 }, (_, i) => ({
                index: i + 1,
                year: 1,
                monthInYear: i + 1,
                payment: 500,
                interest: 83,
                principal: 417,
                balanceStart: 5000 - i * 417,
                balanceEnd: 5000 - (i + 1) * 417,
                cumulativePrincipal: (i + 1) * 417,
                cumulativeInterest: (i + 1) * 83,
            })),
        };

        render(<MortgageAmortizationGraph data={smallData} />);

        expect(screen.getByText('$1,000')).toBeInTheDocument();
        expect(screen.getByText('$5,000')).toBeInTheDocument();
    });

    // Format tests
    test('MortgageAmortizationGraph_shouldFormatCurrency_withCommas', () => {
        const data: MortgageAmortizationData = {
            monthlyPayment: 3000,
            totalPrincipalPaid: 500000,
            totalInterestPaid: 250000,
            totalPaid: 750000,
            months: Array.from({ length: 12 }, (_, i) => ({
                index: i + 1,
                year: 1,
                monthInYear: i + 1,
                payment: 3000,
                interest: 1250,
                principal: 1750,
                balanceStart: 500000 - i * 1750,
                balanceEnd: 500000 - (i + 1) * 1750,
                cumulativePrincipal: (i + 1) * 1750,
                cumulativeInterest: (i + 1) * 1250,
            })),
        };

        render(<MortgageAmortizationGraph data={data} />);

        expect(screen.getByText('$250,000')).toBeInTheDocument();
        expect(screen.getByText('$500,000')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldFormatCurrency_withoutDecimals', () => {
        const data: MortgageAmortizationData = {
            monthlyPayment: 2000,
            totalPrincipalPaid: 123456.78,
            totalInterestPaid: 54321.12,
            totalPaid: 177777.90,
            months: Array.from({ length: 12 }, (_, i) => ({
                index: i + 1,
                year: 1,
                monthInYear: i + 1,
                payment: 2000,
                interest: 500,
                principal: 1500,
                balanceStart: 123456 - i * 1500,
                balanceEnd: 123456 - (i + 1) * 1500,
                cumulativePrincipal: (i + 1) * 1500,
                cumulativeInterest: (i + 1) * 500,
            })),
        };

        render(<MortgageAmortizationGraph data={data} />);

        // Should round to nearest dollar
        expect(screen.getByText('$54,321')).toBeInTheDocument();
        expect(screen.getByText('$123,457')).toBeInTheDocument();
    });

    // Edge cases
    test('MortgageAmortizationGraph_shouldHandleZeroInterest', () => {
        const zeroInterestData: MortgageAmortizationData = {
            monthlyPayment: 1000,
            totalPrincipalPaid: 12000,
            totalInterestPaid: 0,
            totalPaid: 12000,
            months: Array.from({ length: 12 }, (_, i) => ({
                index: i + 1,
                year: 1,
                monthInYear: i + 1,
                payment: 1000,
                interest: 0,
                principal: 1000,
                balanceStart: 12000 - i * 1000,
                balanceEnd: 12000 - (i + 1) * 1000,
                cumulativePrincipal: (i + 1) * 1000,
                cumulativeInterest: 0,
            })),
        };

        render(<MortgageAmortizationGraph data={zeroInterestData} />);

        expect(screen.getByText('$0')).toBeInTheDocument();
        expect(screen.getByText('$12,000')).toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldUpdateGraph_whenDataChanges', () => {
        const { rerender } = render(<MortgageAmortizationGraph data={mockData} />);

        expect(screen.getByText('$200,000')).toBeInTheDocument();

        const newData: MortgageAmortizationData = {
            monthlyPayment: 3000,
            totalPrincipalPaid: 600000,
            totalInterestPaid: 300000,
            totalPaid: 900000,
            months: Array.from({ length: 12 }, (_, i) => ({
                index: i + 1,
                year: 1,
                monthInYear: i + 1,
                payment: 3000,
                interest: 1500,
                principal: 1500,
                balanceStart: 600000 - i * 1500,
                balanceEnd: 600000 - (i + 1) * 1500,
                cumulativePrincipal: (i + 1) * 1500,
                cumulativeInterest: (i + 1) * 1500,
            })),
        };

        rerender(<MortgageAmortizationGraph data={newData} />);

        expect(screen.getByText('$300,000')).toBeInTheDocument();
        expect(screen.getByText('$600,000')).toBeInTheDocument();
        expect(screen.queryByText('$200,000')).not.toBeInTheDocument();
    });

    test('MortgageAmortizationGraph_shouldRenderResponsiveContainer', () => {
        render(<MortgageAmortizationGraph data={mockData} />);

        const container = screen.getByTestId('responsive-container');
        expect(container).toBeInTheDocument();
    });
});
