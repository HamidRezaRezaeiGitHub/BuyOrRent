import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RentQuestions } from './RentQuestions';

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
    useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

describe('RentQuestions - Use default button behavior', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('RentQuestions_useDefaultButton_shouldBeDisabledWhenValueEqualsDefault', async () => {
        render(
            <MemoryRouter>
                <RentQuestions />
            </MemoryRouter>
        );

        // The initial step shows monthly rent
        expect(screen.getByText(/How much rent do you pay each month/i)).toBeInTheDocument();

        // Navigate to step 2 by clicking the icon button (ArrowRight)
        const buttons = screen.getAllByRole('button');
        const nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        expect(nextButton).toBeDefined();
        fireEvent.click(nextButton!);

        // Wait for step 2 to appear
        await waitFor(() => {
            expect(screen.getByText(/How much might your rent increase each year/i)).toBeInTheDocument();
        });

        // Find the "Use default" button
        const useDefaultButton = screen.getByText('Use default').closest('button');
        expect(useDefaultButton).toBeDefined();

        // The button should be disabled when value equals default (2.5)
        expect(useDefaultButton).toBeDisabled();
    });

    test('RentQuestions_useDefaultButton_shouldBeEnabledWhenValueDiffersFromDefault', async () => {
        render(
            <MemoryRouter>
                <RentQuestions />
            </MemoryRouter>
        );

        // Navigate to step 2
        const buttons = screen.getAllByRole('button');
        const nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton!);

        await waitFor(() => {
            expect(screen.getByText(/How much might your rent increase each year/i)).toBeInTheDocument();
        });

        // Change the value
        const rentIncreaseInput = screen.getByRole('textbox');
        fireEvent.change(rentIncreaseInput, { target: { value: '3.5' } });
        fireEvent.blur(rentIncreaseInput);

        // The "Use default" button should now be enabled
        await waitFor(() => {
            const useDefaultButton = screen.getByText('Use default').closest('button');
            expect(useDefaultButton).not.toBeDisabled();
        });
    });

    test('RentQuestions_useDefaultButton_shouldResetValueWithoutNavigating', async () => {
        render(
            <MemoryRouter>
                <RentQuestions />
            </MemoryRouter>
        );

        // Navigate to step 2
        const buttons = screen.getAllByRole('button');
        const nextButton = buttons.find((btn) => btn.querySelector('.lucide-arrow-right'));
        fireEvent.click(nextButton!);

        await waitFor(() => {
            expect(screen.getByText(/How much might your rent increase each year/i)).toBeInTheDocument();
        });

        // Change the value
        const rentIncreaseInput = screen.getByRole('textbox');
        fireEvent.change(rentIncreaseInput, { target: { value: '5.0' } });
        fireEvent.blur(rentIncreaseInput);

        await waitFor(() => {
            expect(rentIncreaseInput).toHaveValue('5.00');
        });

        // Click the "Use default" button
        const useDefaultButton = screen.getByText('Use default').closest('button');
        fireEvent.click(useDefaultButton!);

        // Verify the value was reset to default (2.5)
        await waitFor(() => {
            expect(rentIncreaseInput).toHaveValue('2.50');
        });

        // Verify navigation did NOT happen (we should still be on step 2)
        expect(screen.getByText(/How much might your rent increase each year/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
