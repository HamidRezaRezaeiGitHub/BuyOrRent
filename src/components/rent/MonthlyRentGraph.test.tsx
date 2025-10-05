import { render, screen } from '@testing-library/react';
import { MonthlyRentGraph } from './MonthlyRentGraph';
import { MonthlyRentData } from '@/services/MonthlyRentCalculator';

// Mock recharts to avoid issues with SVG rendering in tests
jest.mock('recharts', () => ({
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

describe('MonthlyRentGraph', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockData: MonthlyRentData = {
        years: [
            {
                year: 2024,
                months: Array(12).fill(1000),
                yearTotal: 12000,
                cumulativeTotal: 12000,
            },
            {
                year: 2025,
                months: Array(12).fill(1025),
                yearTotal: 12300,
                cumulativeTotal: 24300,
            },
            {
                year: 2026,
                months: Array(12).fill(1051),
                yearTotal: 12612,
                cumulativeTotal: 36912,
            },
        ],
        totalPaid: 36912,
    };

    // Basic rendering tests
    test('MonthlyRentGraph_shouldShowMessage_whenDataIsNull', () => {
        render(<MonthlyRentGraph data={null} />);

        expect(screen.getByText(/please enter monthly rent/i)).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldShowMessage_whenDataIsEmpty', () => {
        const emptyData: MonthlyRentData = {
            years: [],
            totalPaid: 0,
        };

        render(<MonthlyRentGraph data={emptyData} />);

        expect(screen.getByText(/please enter monthly rent/i)).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldRenderGraph_whenValidDataProvided', () => {
        render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldDisplayTitle', () => {
        render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByText('Cumulative Rent Paid Over Time')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldDisplayTotalPaid', () => {
        render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByText(/total rent paid over 3 years/i)).toBeInTheDocument();
        expect(screen.getByText('$36,912')).toBeInTheDocument();
    });

    // Graph components tests
    test('MonthlyRentGraph_shouldRenderLineChart', () => {
        render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldRenderLine', () => {
        render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByTestId('line')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldRenderXAxis', () => {
        render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldRenderYAxis', () => {
        render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldRenderTooltip', () => {
        render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldRenderCartesianGrid', () => {
        render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    });

    // Data handling tests
    test('MonthlyRentGraph_shouldHandleSingleYearData', () => {
        const singleYearData: MonthlyRentData = {
            years: [
                {
                    year: 2024,
                    months: Array(12).fill(1500),
                    yearTotal: 18000,
                    cumulativeTotal: 18000,
                },
            ],
            totalPaid: 18000,
        };

        render(<MonthlyRentGraph data={singleYearData} />);

        expect(screen.getByText(/total rent paid over 1 years/i)).toBeInTheDocument();
        expect(screen.getByText('$18,000')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldHandleMultipleYearsData', () => {
        const multiYearData: MonthlyRentData = {
            years: Array.from({ length: 10 }, (_, i) => {
                const yearTotal = (1000 + i * 50) * 12;
                const cumulativeTotal = Array.from({ length: i + 1 }, (_, j) => (1000 + j * 50) * 12).reduce((sum, v) => sum + v, 0);
                return {
                    year: 2024 + i,
                    months: Array(12).fill(1000 + i * 50),
                    yearTotal,
                    cumulativeTotal,
                };
            }),
            totalPaid: 135000,
        };

        render(<MonthlyRentGraph data={multiYearData} />);

        expect(screen.getByText(/total rent paid over 10 years/i)).toBeInTheDocument();
        expect(screen.getByText('$135,000')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldHandleLargeTotalPaid', () => {
        const largeData: MonthlyRentData = {
            years: Array.from({ length: 30 }, (_, i) => ({
                year: 2024 + i,
                months: Array(12).fill(2000),
                yearTotal: 24000,
                cumulativeTotal: 24000 * (i + 1),
            })),
            totalPaid: 720000,
        };

        render(<MonthlyRentGraph data={largeData} />);

        expect(screen.getByText('$720,000')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldHandleSmallTotalPaid', () => {
        const smallData: MonthlyRentData = {
            years: [
                {
                    year: 2024,
                    months: Array(12).fill(100),
                    yearTotal: 1200,
                    cumulativeTotal: 1200,
                },
            ],
            totalPaid: 1200,
        };

        render(<MonthlyRentGraph data={smallData} />);

        expect(screen.getByText('$1,200')).toBeInTheDocument();
    });

    // Format tests
    test('MonthlyRentGraph_shouldFormatCurrency_withCommas', () => {
        const data: MonthlyRentData = {
            years: [
                {
                    year: 2024,
                    months: Array(12).fill(5000),
                    yearTotal: 60000,
                    cumulativeTotal: 60000,
                },
            ],
            totalPaid: 60000,
        };

        render(<MonthlyRentGraph data={data} />);

        expect(screen.getByText('$60,000')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldFormatCurrency_withoutDecimals', () => {
        const data: MonthlyRentData = {
            years: [
                {
                    year: 2024,
                    months: Array(12).fill(1234.56),
                    yearTotal: 14814.72,
                    cumulativeTotal: 14814.72,
                },
            ],
            totalPaid: 14814.72,
        };

        render(<MonthlyRentGraph data={data} />);

        // Should round to nearest dollar
        expect(screen.getByText('$14,815')).toBeInTheDocument();
    });

    // Edge cases
    test('MonthlyRentGraph_shouldHandleZeroTotalPaid', () => {
        const zeroData: MonthlyRentData = {
            years: [
                {
                    year: 2024,
                    months: Array(12).fill(0),
                    yearTotal: 0,
                    cumulativeTotal: 0,
                },
            ],
            totalPaid: 0,
        };

        render(<MonthlyRentGraph data={zeroData} />);

        expect(screen.getByText('$0')).toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldUpdateGraph_whenDataChanges', () => {
        const { rerender } = render(<MonthlyRentGraph data={mockData} />);

        expect(screen.getByText('$36,912')).toBeInTheDocument();

        const newData: MonthlyRentData = {
            years: [
                {
                    year: 2024,
                    months: Array(12).fill(2000),
                    yearTotal: 24000,
                    cumulativeTotal: 24000,
                },
            ],
            totalPaid: 24000,
        };

        rerender(<MonthlyRentGraph data={newData} />);

        expect(screen.getByText('$24,000')).toBeInTheDocument();
        expect(screen.queryByText('$36,912')).not.toBeInTheDocument();
    });

    test('MonthlyRentGraph_shouldRenderResponsiveContainer', () => {
        render(<MonthlyRentGraph data={mockData} />);

        const container = screen.getByTestId('responsive-container');
        expect(container).toBeInTheDocument();
    });
});
