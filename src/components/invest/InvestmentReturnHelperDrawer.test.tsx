import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InvestmentReturnHelperDrawer } from './InvestmentReturnHelperDrawer';

describe('InvestmentReturnHelperDrawer', () => {
    const mockOnOpenChange = jest.fn();
    const mockOnSelectReturn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic rendering', () => {
        it('renders when open', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('Investment Return Examples')).toBeInTheDocument();
            expect(screen.getByText('Select a common investment type to autofill the expected return rate')).toBeInTheDocument();
        });

        it('does not render when closed', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={false}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('renders all investment options', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            expect(screen.getByText('High Interest Savings Account')).toBeInTheDocument();
            expect(screen.getByText('Global Market Index ETFs (e.g., VEQT)')).toBeInTheDocument();
            expect(screen.getByText('US Market Index ETFs (e.g., S&P 500)')).toBeInTheDocument();
        });

        it('renders other section with custom input and slider', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            expect(screen.getByText('Other')).toBeInTheDocument();
            expect(screen.getByText('Custom Return Rate')).toBeInTheDocument();
            expect(screen.getByRole('textbox')).toBeInTheDocument();
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByText('Apply Custom Rate')).toBeInTheDocument();
            expect(screen.getByText('US Market Index ETFs (e.g., S&P 500)')).toBeInTheDocument();
        });

        it('renders risk levels for all options', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            expect(screen.getByText('Low Risk')).toBeInTheDocument();
            expect(screen.getByText('Moderate Risk')).toBeInTheDocument();
            expect(screen.getByText('Higher Risk')).toBeInTheDocument();
        });

        it('renders cancel button', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        });
    });

    describe('User interaction', () => {
        it('calls onSelectReturn and closes drawer when High Interest Savings Account is clicked', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const highInterestButton = screen.getByText('High Interest Savings Account').closest('button');
            expect(highInterestButton).toBeInTheDocument();

            fireEvent.click(highInterestButton!);

            await waitFor(() => {
                expect(mockOnSelectReturn).toHaveBeenCalledWith(3);
                expect(mockOnOpenChange).toHaveBeenCalledWith(false);
            });
        });

        it('calls onSelectReturn and closes drawer when Global Market Index ETFs is clicked', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const globalMarketButton = screen.getByText('Global Market Index ETFs (e.g., VEQT)').closest('button');
            expect(globalMarketButton).toBeInTheDocument();

            fireEvent.click(globalMarketButton!);

            await waitFor(() => {
                expect(mockOnSelectReturn).toHaveBeenCalledWith(7);
                expect(mockOnOpenChange).toHaveBeenCalledWith(false);
            });
        });

        it('calls onSelectReturn and closes drawer when US Market Index ETFs is clicked', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const usMarketButton = screen.getByText('US Market Index ETFs (e.g., S&P 500)').closest('button');
            expect(usMarketButton).toBeInTheDocument();

            fireEvent.click(usMarketButton!);

            await waitFor(() => {
                expect(mockOnSelectReturn).toHaveBeenCalledWith(15);
                expect(mockOnOpenChange).toHaveBeenCalledWith(false);
            });
        });

        it('does not call onSelectReturn when cancel button is clicked', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            fireEvent.click(cancelButton);

            expect(mockOnSelectReturn).not.toHaveBeenCalled();
        });
    });

    describe('Current value highlighting', () => {
        it('highlights the option matching current value', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                    currentValue={7}
                />
            );

            const globalMarketButton = screen.getByText('Global Market Index ETFs (e.g., VEQT)').closest('button');
            expect(globalMarketButton).toHaveClass('ring-2', 'ring-primary');
        });

        it('does not highlight any option when current value does not match', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                    currentValue={10}
                />
            );

            const highInterestButton = screen.getByText('High Interest Savings Account').closest('button');
            const globalMarketButton = screen.getByText('Global Market Index ETFs (e.g., VEQT)').closest('button');
            const usMarketButton = screen.getByText('US Market Index ETFs (e.g., S&P 500)').closest('button');

            expect(highInterestButton).not.toHaveClass('ring-2', 'ring-primary');
            expect(globalMarketButton).not.toHaveClass('ring-2', 'ring-primary');
            expect(usMarketButton).not.toHaveClass('ring-2', 'ring-primary');
        });
    });

    describe('Descriptions and details', () => {
        it('displays correct descriptions for all options', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            expect(screen.getByText('Low risk, stable returns with guaranteed capital protection')).toBeInTheDocument();
            expect(screen.getByText('Diversified portfolio with moderate risk and long-term growth')).toBeInTheDocument();
            expect(screen.getByText('Higher growth potential with increased market volatility')).toBeInTheDocument();
        });

        it('displays correct percentage values for all options', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const dialog = screen.getByRole('dialog');
            expect(dialog).toHaveTextContent('3');
            expect(dialog).toHaveTextContent('7');
            expect(dialog).toHaveTextContent('15');
        });
    });

    describe('Custom input section', () => {
        it('renders custom input with default value', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const customInput = screen.getByRole('textbox');
            expect(customInput).toHaveValue('10.00');
            expect(customInput).toHaveAttribute('placeholder', '10.00');

            const slider = screen.getByRole('slider');
            expect(slider).toHaveValue(10);

            expect(screen.getByText('10.00%')).toBeInTheDocument();
        });

        it('handles custom input change', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const customInput = screen.getByRole('textbox');
            fireEvent.change(customInput, { target: { value: '12.5' } });

            // Value should be updated in the display
            await waitFor(() => {
                expect(screen.getByText('12.50%')).toBeInTheDocument();
            });
        });

        it('handles custom slider change', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const slider = screen.getByRole('slider');
            // Simulate slider value change using mouse events
            fireEvent.mouseDown(slider);
            fireEvent.mouseUp(slider);

            // Value should be updated in the display
            await waitFor(() => {
                expect(screen.getByText('15.00%')).toBeInTheDocument();
            });
        });

        it('handles focus and blur behavior for formatting', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const customInput = screen.getByRole('textbox');

            // Focus should unformat the value
            fireEvent.focus(customInput);
            await waitFor(() => {
                expect(customInput).toHaveValue('10');
            });

            // Blur should reformat the value
            fireEvent.blur(customInput);
            await waitFor(() => {
                expect(customInput).toHaveValue('10.00');
            });
        });

        it('applies custom rate when button is clicked', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const customInput = screen.getByRole('textbox');
            fireEvent.change(customInput, { target: { value: '8.5' } });

            const applyButton = screen.getByRole('button', { name: 'Apply Custom Rate' });
            fireEvent.click(applyButton);

            await waitFor(() => {
                expect(mockOnSelectReturn).toHaveBeenCalledWith(8.5);
                expect(mockOnOpenChange).toHaveBeenCalledWith(false);
            });
        });

        it('disables apply button when input is empty', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const customInput = screen.getByRole('textbox');
            fireEvent.change(customInput, { target: { value: '' } });

            const applyButton = screen.getByRole('button', { name: 'Apply Custom Rate' });

            await waitFor(() => {
                expect(applyButton).toBeDisabled();
            });
        });

        it('handles invalid input gracefully', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const customInput = screen.getByRole('textbox');
            fireEvent.change(customInput, { target: { value: 'abc' } });

            // Should display default value when invalid input is provided
            await waitFor(() => {
                expect(screen.getByText('10.00%')).toBeInTheDocument();
            });
        });

        it('strips non-numeric characters from input', async () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const customInput = screen.getByRole('textbox');
            fireEvent.change(customInput, { target: { value: 'abc12.5def' } });

            // Should parse and display only the numeric value
            await waitFor(() => {
                expect(screen.getByText('12.50%')).toBeInTheDocument();
            });
        });

        it('has consistent input width matching other components', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const customInput = screen.getByRole('textbox');
            expect(customInput).toHaveClass('w-32');
        });

        it('has proper accessibility attributes', () => {
            render(
                <InvestmentReturnHelperDrawer
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSelectReturn={mockOnSelectReturn}
                />
            );

            const customInput = screen.getByRole('textbox');
            expect(customInput).toHaveAttribute('id', 'otherReturnRate');
            expect(customInput).toHaveAttribute('inputMode', 'decimal');

            const slider = screen.getByRole('slider');
            // Slider id is handled by Radix UI internally, just verify it exists
            expect(slider).toBeInTheDocument();
        });
    });
});
