import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PurchaseQuestions } from './PurchaseQuestions';

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
    useSearchParams: () => [new URLSearchParams('monthlyRent=2400&rentIncrease=2.5'), jest.fn()],
}));

describe('PurchaseQuestions - Use default button behavior', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('PurchaseQuestions_useDefaultButton_shouldNotBeRenderedWhenValueEqualsDefault', async () => {
        render(
            <MemoryRouter>
                <PurchaseQuestions />
            </MemoryRouter>
        );

        // Enter purchase price to advance to step 2
        const purchasePriceInput = screen.getByRole('textbox');
        fireEvent.change(purchasePriceInput, { target: { value: '800000' } });
        fireEvent.blur(purchasePriceInput);

        // Click next to go to step 2
        const buttons = screen.getAllByRole('button');
        const nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton!);

        // Skip the defaults overview by clicking next
        await waitFor(() => {
            expect(screen.getByText(/Use default values/i)).toBeInTheDocument();
        });
        const nextButton2 = screen.getAllByRole('button').find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton2!);

        // Wait for step 3 (down payment) to appear
        await waitFor(() => {
            expect(screen.getByText(/What percentage will you put as a down payment/i)).toBeInTheDocument();
        });

        // The "Use default" button should not be rendered when value equals default (20%)
        expect(screen.queryByText('Use default')).not.toBeInTheDocument();
    });

    test('PurchaseQuestions_useDefaultButton_shouldBeRenderedWhenValueDiffersFromDefault', async () => {
        render(
            <MemoryRouter>
                <PurchaseQuestions />
            </MemoryRouter>
        );

        // Enter purchase price and navigate to step 3
        const purchasePriceInput = screen.getByRole('textbox');
        fireEvent.change(purchasePriceInput, { target: { value: '800000' } });
        fireEvent.blur(purchasePriceInput);

        let buttons = screen.getAllByRole('button');
        let nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton!);

        await waitFor(() => {
            expect(screen.getByText(/Use default values/i)).toBeInTheDocument();
        });

        buttons = screen.getAllByRole('button');
        nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton!);

        await waitFor(() => {
            expect(screen.getByText(/What percentage will you put as a down payment/i)).toBeInTheDocument();
        });

        // Change the down payment value
        const downPaymentInput = screen.getByRole('textbox');
        fireEvent.change(downPaymentInput, { target: { value: '15' } });
        fireEvent.blur(downPaymentInput);

        // The "Use default" button should now be rendered
        await waitFor(() => {
            expect(screen.getByText('Use default')).toBeInTheDocument();
        });
    });

    test('PurchaseQuestions_useDefaultButton_shouldResetValueWithoutNavigating', async () => {
        render(
            <MemoryRouter>
                <PurchaseQuestions />
            </MemoryRouter>
        );

        // Navigate to step 3
        const purchasePriceInput = screen.getByRole('textbox');
        fireEvent.change(purchasePriceInput, { target: { value: '800000' } });
        fireEvent.blur(purchasePriceInput);

        let buttons = screen.getAllByRole('button');
        let nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton!);

        await waitFor(() => {
            expect(screen.getByText(/Use default values/i)).toBeInTheDocument();
        });

        buttons = screen.getAllByRole('button');
        nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton!);

        await waitFor(() => {
            expect(screen.getByText(/What percentage will you put as a down payment/i)).toBeInTheDocument();
        });

        // Change the value
        const downPaymentInput = screen.getByRole('textbox');
        fireEvent.change(downPaymentInput, { target: { value: '15' } });
        fireEvent.blur(downPaymentInput);

        await waitFor(() => {
            expect(downPaymentInput).toHaveValue('15.00');
        });

        // Click the "Use default" button
        const useDefaultButton = screen.getByText('Use default').closest('button');
        fireEvent.click(useDefaultButton!);

        // Verify the value was reset to default (20)
        await waitFor(() => {
            expect(downPaymentInput).toHaveValue('20.00');
        });

        // Verify navigation did NOT happen (we should still be on step 3)
        expect(screen.getByText(/What percentage will you put as a down payment/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('PurchaseQuestions_useDefaultButton_shouldDisappearAfterResettingValue', async () => {
        render(
            <MemoryRouter>
                <PurchaseQuestions />
            </MemoryRouter>
        );

        // Navigate to step 3
        const purchasePriceInput = screen.getByRole('textbox');
        fireEvent.change(purchasePriceInput, { target: { value: '800000' } });
        fireEvent.blur(purchasePriceInput);

        let buttons = screen.getAllByRole('button');
        let nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton!);

        await waitFor(() => {
            expect(screen.getByText(/Use default values/i)).toBeInTheDocument();
        });

        buttons = screen.getAllByRole('button');
        nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton!);

        await waitFor(() => {
            expect(screen.getByText(/What percentage will you put as a down payment/i)).toBeInTheDocument();
        });

        // Change the value
        const downPaymentInput = screen.getByRole('textbox');
        fireEvent.change(downPaymentInput, { target: { value: '15' } });
        fireEvent.blur(downPaymentInput);

        await waitFor(() => {
            expect(downPaymentInput).toHaveValue('15.00');
        });

        // The "Use default" button should be visible
        expect(screen.getByText('Use default')).toBeInTheDocument();

        // Click the "Use default" button
        const useDefaultButton = screen.getByText('Use default').closest('button');
        fireEvent.click(useDefaultButton!);

        // Verify the value was reset to default
        await waitFor(() => {
            expect(downPaymentInput).toHaveValue('20.00');
        });

        // The "Use default" button should now be hidden
        await waitFor(() => {
            expect(screen.queryByText('Use default')).not.toBeInTheDocument();
        });

        // Verify we're still on step 3
        expect(screen.getByText(/What percentage will you put as a down payment/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
