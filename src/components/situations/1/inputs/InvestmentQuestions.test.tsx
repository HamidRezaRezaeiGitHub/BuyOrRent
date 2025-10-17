import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { InvestmentQuestions } from './InvestmentQuestions';

// Mock the theme context
const mockSetTheme = jest.fn();
const mockToggleTheme = jest.fn();

jest.mock('@/contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light',
        actualTheme: 'light',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
    }),
}));

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useSearchParams: () => [
        new URLSearchParams(
            'monthlyRent=2400&rentIncrease=2.5&purchasePrice=800000&downPaymentPercentage=20&mortgageRate=5.25&mortgageLength=25&propertyTaxPercentage=0.75&maintenancePercentage=1.0'
        ),
        jest.fn(),
    ],
}));

describe('InvestmentQuestions - Input behavior', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('InvestmentQuestions_shouldRenderWithDefaultValue', async () => {
        render(
            <MemoryRouter>
                <InvestmentQuestions />
            </MemoryRouter>
        );

        // Wait for the investment questions page to load
        await waitFor(() => {
            expect(screen.getByText(/What annual investment return do you want to assume/i)).toBeInTheDocument();
        });

        // Verify the input renders with the default value (8.0%)
        const investmentReturnInput = screen.getByRole('textbox');
        expect(investmentReturnInput).toBeInTheDocument();
        expect(investmentReturnInput).toHaveValue('8.00');
    });

    test('InvestmentQuestions_shouldAllowChangingValue', async () => {
        render(
            <MemoryRouter>
                <InvestmentQuestions />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/What annual investment return do you want to assume/i)).toBeInTheDocument();
        });

        // Change the investment return value
        const investmentReturnInput = screen.getByRole('textbox');
        fireEvent.change(investmentReturnInput, { target: { value: '10' } });
        fireEvent.blur(investmentReturnInput);

        // Verify the value changed
        await waitFor(() => {
            expect(investmentReturnInput).toHaveValue('10.00');
        });
    });

    test('InvestmentQuestions_shouldClampValueToValidRange', async () => {
        render(
            <MemoryRouter>
                <InvestmentQuestions />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/What annual investment return do you want to assume/i)).toBeInTheDocument();
        });

        // Try to set a value above max (30)
        const investmentReturnInput = screen.getByRole('textbox');
        fireEvent.change(investmentReturnInput, { target: { value: '50' } });
        fireEvent.blur(investmentReturnInput);

        // Verify the value was clamped to max
        await waitFor(() => {
            expect(investmentReturnInput).toHaveValue('30.00');
        });

        // Try to set a value below min (-10)
        fireEvent.change(investmentReturnInput, { target: { value: '-20' } });
        fireEvent.blur(investmentReturnInput);

        // Verify the value was clamped to min
        await waitFor(() => {
            expect(investmentReturnInput).toHaveValue('-10.00');
        });
    });

    test('InvestmentQuestions_shouldRenderNavigationButtonsWithProps', async () => {
        render(
            <MemoryRouter>
                <InvestmentQuestions 
                    previousUrl="/previous"
                    nextUrl="/next"
                />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/What annual investment return do you want to assume/i)).toBeInTheDocument();
        });

        // Verify navigation buttons are rendered when props are provided
        const buttons = screen.getAllByRole('button');
        
        // Should have at least 2 buttons (previous and next) plus theme toggle
        expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
});
