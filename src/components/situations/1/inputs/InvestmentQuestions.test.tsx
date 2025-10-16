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

describe('InvestmentQuestions - Use default button behavior', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('InvestmentQuestions_useDefaultButton_shouldNotBeRenderedWhenValueEqualsDefault', async () => {
        render(
            <MemoryRouter>
                <InvestmentQuestions />
            </MemoryRouter>
        );

        // Wait for the investment questions page to load
        await waitFor(() => {
            expect(screen.getByText(/What annual investment return do you want to assume/i)).toBeInTheDocument();
        });

        // The "Use default" button should not be rendered when value equals default (6.0%)
        expect(screen.queryByText('Use default')).not.toBeInTheDocument();
    });

    test('InvestmentQuestions_useDefaultButton_shouldBeRenderedWhenValueDiffersFromDefault', async () => {
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
        fireEvent.change(investmentReturnInput, { target: { value: '8' } });
        fireEvent.blur(investmentReturnInput);

        // The "Use default" button should now be rendered
        await waitFor(() => {
            expect(screen.getByText('Use default')).toBeInTheDocument();
        });
    });

    test('InvestmentQuestions_useDefaultButton_shouldResetValueWithoutNavigating', async () => {
        render(
            <MemoryRouter>
                <InvestmentQuestions />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/What annual investment return do you want to assume/i)).toBeInTheDocument();
        });

        // Change the value
        const investmentReturnInput = screen.getByRole('textbox');
        fireEvent.change(investmentReturnInput, { target: { value: '8' } });
        fireEvent.blur(investmentReturnInput);

        await waitFor(() => {
            expect(investmentReturnInput).toHaveValue('8.00');
        });

        // Click the "Use default" button
        const useDefaultButton = screen.getByText('Use default').closest('button');
        fireEvent.click(useDefaultButton!);

        // Verify the value was reset to default (6.0)
        await waitFor(() => {
            expect(investmentReturnInput).toHaveValue('6.00');
        });

        // Verify navigation did NOT happen
        expect(screen.getByText(/What annual investment return do you want to assume/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('InvestmentQuestions_useDefaultButton_shouldDisappearAfterResettingValue', async () => {
        render(
            <MemoryRouter>
                <InvestmentQuestions />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/What annual investment return do you want to assume/i)).toBeInTheDocument();
        });

        // Change the value
        const investmentReturnInput = screen.getByRole('textbox');
        fireEvent.change(investmentReturnInput, { target: { value: '8' } });
        fireEvent.blur(investmentReturnInput);

        await waitFor(() => {
            expect(investmentReturnInput).toHaveValue('8.00');
        });

        // The "Use default" button should be visible
        expect(screen.getByText('Use default')).toBeInTheDocument();

        // Click the "Use default" button
        const useDefaultButton = screen.getByText('Use default').closest('button');
        fireEvent.click(useDefaultButton!);

        // Verify the value was reset to default
        await waitFor(() => {
            expect(investmentReturnInput).toHaveValue('6.00');
        });

        // The "Use default" button should now be hidden
        await waitFor(() => {
            expect(screen.queryByText('Use default')).not.toBeInTheDocument();
        });

        // Verify we're still on the investment questions page
        expect(screen.getByText(/What annual investment return do you want to assume/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
