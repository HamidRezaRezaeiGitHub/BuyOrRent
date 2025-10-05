import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InvestmentReturnHelperDrawer } from './InvestmentReturnHelperDrawer';
import '@testing-library/jest-dom';

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
});
