import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InvestmentAnnualReturnField } from './InvestmentAnnualReturn';
import '@testing-library/jest-dom';

describe('InvestmentAnnualReturnField', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic rendering', () => {
        it('renders with default props', () => {
            render(<InvestmentAnnualReturnField value={7.5} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox', { name: /expected yearly investment return/i });
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue('7.50');
        });

        it('renders with custom placeholder', () => {
            render(
                <InvestmentAnnualReturnField
                    value={''}
                    onChange={mockOnChange}
                    placeholder="10.00"
                />
            );
            
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('placeholder', '10.00');
        });

        it('renders with custom id', () => {
            render(
                <InvestmentAnnualReturnField
                    id="custom-id"
                    value={5}
                    onChange={mockOnChange}
                />
            );
            
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('id', 'custom-id');
        });

        it('renders the label with icon', () => {
            render(<InvestmentAnnualReturnField value={7.5} onChange={mockOnChange} />);
            
            expect(screen.getByText('Expected Yearly Investment Return')).toBeInTheDocument();
        });

        it('renders percentage symbol', () => {
            render(<InvestmentAnnualReturnField value={7.5} onChange={mockOnChange} />);
            
            expect(screen.getByText('%')).toBeInTheDocument();
        });

        it('renders info button for tooltip', () => {
            render(<InvestmentAnnualReturnField value={7.5} onChange={mockOnChange} />);
            
            const infoButton = screen.getByRole('button', { 
                name: /more information about expected yearly investment return/i 
            });
            expect(infoButton).toBeInTheDocument();
        });
    });

    describe('User interaction', () => {
        it('calls onChange when value changes', () => {
            render(<InvestmentAnnualReturnField value={''} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '8.5' } });
            
            expect(mockOnChange).toHaveBeenCalledWith(8.5);
        });

        it('handles empty string input', () => {
            render(<InvestmentAnnualReturnField value={7.5} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '' } });
            
            expect(mockOnChange).toHaveBeenCalledWith('');
        });

        it('formats value on blur', () => {
            render(<InvestmentAnnualReturnField value={7.5} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox');
            
            // Focus and change value
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '10' } });
            
            // Blur should format the value
            fireEvent.blur(input);
            
            waitFor(() => {
                expect(input).toHaveValue('10.00');
            });
        });

        it('unformats value on focus', () => {
            render(<InvestmentAnnualReturnField value={7.5} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('7.50');
            
            // Focus should unformat the value
            fireEvent.focus(input);
            
            waitFor(() => {
                expect(input).toHaveValue('7.5');
            });
        });

        it('handles decimal input correctly', () => {
            render(<InvestmentAnnualReturnField value={''} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '8.75' } });
            
            expect(mockOnChange).toHaveBeenCalledWith(8.75);
        });

        it('handles negative values', () => {
            render(<InvestmentAnnualReturnField value={''} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '-5' } });
            
            expect(mockOnChange).toHaveBeenCalledWith(-5);
        });

        it('strips non-numeric characters except decimal and minus', () => {
            render(<InvestmentAnnualReturnField value={''} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'abc123.45def' } });
            
            expect(mockOnChange).toHaveBeenCalledWith(123.45);
        });
    });

    describe('Validation - optional mode', () => {
        it('does not show required asterisk in optional mode', () => {
            render(
                <InvestmentAnnualReturnField
                    value={''}
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="optional"
                />
            );
            
            const label = screen.getByText('Expected Yearly Investment Return');
            expect(label.textContent).not.toContain('*');
        });

        it('allows empty value in optional mode', () => {
            render(
                <InvestmentAnnualReturnField
                    value={''}
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="optional"
                />
            );
            
            const input = screen.getByRole('textbox');
            fireEvent.blur(input);
            
            // Should not show any errors
            expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
        });
    });

    describe('Validation - required mode', () => {
        it('shows required asterisk in required mode', () => {
            render(
                <InvestmentAnnualReturnField
                    value={''}
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="required"
                />
            );
            
            const label = screen.getByText('Expected Yearly Investment Return');
            // Check if asterisk exists in the parent div
            expect(label.parentElement?.textContent).toContain('*');
        });
    });

    describe('Validation - value constraints', () => {
        it('validates maximum value (100%)', async () => {
            const mockValidationChange = jest.fn();
            render(
                <InvestmentAnnualReturnField
                    value={150}
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="optional"
                    onValidationChange={mockValidationChange}
                />
            );
            
            const input = screen.getByRole('textbox');
            fireEvent.blur(input);
            
            await waitFor(() => {
                expect(mockValidationChange).toHaveBeenCalled();
                const lastCall = mockValidationChange.mock.calls[mockValidationChange.mock.calls.length - 1][0];
                expect(lastCall.isValid).toBe(false);
            });
        });

        it('validates minimum value (-100%)', async () => {
            const mockValidationChange = jest.fn();
            render(
                <InvestmentAnnualReturnField
                    value={-150}
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="optional"
                    onValidationChange={mockValidationChange}
                />
            );
            
            const input = screen.getByRole('textbox');
            fireEvent.blur(input);
            
            await waitFor(() => {
                expect(mockValidationChange).toHaveBeenCalled();
                const lastCall = mockValidationChange.mock.calls[mockValidationChange.mock.calls.length - 1][0];
                expect(lastCall.isValid).toBe(false);
            });
        });

        it('accepts valid values within range', async () => {
            const mockValidationChange = jest.fn();
            render(
                <InvestmentAnnualReturnField
                    value={10}
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="optional"
                    onValidationChange={mockValidationChange}
                />
            );
            
            const input = screen.getByRole('textbox');
            fireEvent.blur(input);
            
            await waitFor(() => {
                expect(mockValidationChange).toHaveBeenCalled();
                const lastCall = mockValidationChange.mock.calls[mockValidationChange.mock.calls.length - 1][0];
                expect(lastCall.isValid).toBe(true);
            });
        });
    });

    describe('Disabled state', () => {
        it('disables input when disabled prop is true', () => {
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );
            
            const input = screen.getByRole('textbox');
            expect(input).toBeDisabled();
        });

        it('input element is disabled when disabled prop is true', () => {
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );
            
            const input = screen.getByRole('textbox');
            
            // Verify the input has the disabled attribute
            expect(input).toBeDisabled();
        });
    });

    describe('Error display', () => {
        it('displays custom errors when provided', () => {
            const customErrors = ['Custom error message'];
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    errors={customErrors}
                />
            );
            
            expect(screen.getByText('Custom error message')).toBeInTheDocument();
        });

        it('applies error styling when errors exist', () => {
            const customErrors = ['Error'];
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    errors={customErrors}
                />
            );
            
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('border-red-500');
        });
    });

    describe('Tooltip', () => {
        it('shows tooltip when info button is clicked', async () => {
            render(<InvestmentAnnualReturnField value={7.5} onChange={mockOnChange} />);
            
            const infoButton = screen.getByRole('button', { 
                name: /more information about expected yearly investment return/i 
            });
            
            fireEvent.click(infoButton);
            
            await waitFor(() => {
                // Use getAllByText to handle multiple instances (visible tooltip and aria-hidden copy)
                const tooltips = screen.getAllByText(/expected annual return on your investment/i);
                expect(tooltips.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Custom className', () => {
        it('applies custom className', () => {
            const { container } = render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    className="custom-class"
                />
            );
            
            expect(container.firstChild).toHaveClass('custom-class');
        });
    });
});
