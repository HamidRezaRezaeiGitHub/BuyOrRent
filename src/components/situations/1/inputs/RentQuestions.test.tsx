import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RentQuestions } from './RentQuestions';

// Mock the theme context
const mockSetTheme = vi.fn();
const mockToggleTheme = vi.fn();

vi.mock('@/contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'light',
        actualTheme: 'light',
        setTheme: mockSetTheme,
        toggleTheme: mockToggleTheme,
    }),
}));

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams(), vi.fn()],
    };
});

describe('RentQuestions - Use default button behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('RentQuestions_useDefaultButton_shouldNotBeRenderedWhenValueEqualsDefault', async () => {
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

        // The "Use default" button should not be rendered when value equals default (2.5)
        expect(screen.queryByText('Use default')).not.toBeInTheDocument();
    });

    test('RentQuestions_useDefaultButton_shouldBeRenderedWhenValueDiffersFromDefault', async () => {
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

        // The "Use default" button should now be rendered
        await waitFor(() => {
            const useDefaultButton = screen.queryByText('Use default');
            expect(useDefaultButton).toBeInTheDocument();
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

    test('RentQuestions_useDefaultButton_shouldDisappearAfterResettingValue', async () => {
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

        // The "Use default" button should be visible
        expect(screen.getByText('Use default')).toBeInTheDocument();

        // Click the "Use default" button
        const useDefaultButton = screen.getByText('Use default').closest('button');
        fireEvent.click(useDefaultButton!);

        // Verify the value was reset to default (2.5)
        await waitFor(() => {
            expect(rentIncreaseInput).toHaveValue('2.50');
        });

        // The "Use default" button should now be hidden
        await waitFor(() => {
            expect(screen.queryByText('Use default')).not.toBeInTheDocument();
        });

        // Verify we're still on step 2
        expect(screen.getByText(/How much might your rent increase each year/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
