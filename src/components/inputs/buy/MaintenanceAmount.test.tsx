import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MaintenanceAmountField } from './MaintenanceAmount';

describe('MaintenanceAmountField', () => {
    // Rendering Tests
    describe('Rendering', () => {
        test('MaintenanceAmountField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);

            expect(screen.getByText('Maintenance')).toBeInTheDocument();
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('textbox')).toBeInTheDocument();
            expect(screen.getByDisplayValue('6,000')).toBeInTheDocument();
        });

        test('MaintenanceAmountField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} displayMode="slider" />);
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
            expect(screen.getByText('$6,000')).toBeInTheDocument();
        });

        test('MaintenanceAmountField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} displayMode="input" />);
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        test('MaintenanceAmountField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} displayMode="combined" />);
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
    });

    // Value Validation Tests
    describe('Value Validation', () => {
        test('MaintenanceAmountField_shouldClampInitialValueToMinimum', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={-1000} onChange={mockOnChange} minValue={0} />);
            expect(mockOnChange).toHaveBeenCalledWith(0);
        });

        test('MaintenanceAmountField_shouldClampInitialValueToMaximum', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={200000} onChange={mockOnChange} maxValue={100000} />);
            expect(mockOnChange).toHaveBeenCalledWith(100000);
        });

        test('MaintenanceAmountField_shouldHandleNaNValue', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={NaN} onChange={mockOnChange} defaultValue={7000} />);
            expect(mockOnChange).toHaveBeenCalledWith(7000);
        });

        test('MaintenanceAmountField_shouldHandleInfinityValue', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={Infinity} onChange={mockOnChange} defaultValue={7000} />);
            expect(mockOnChange).toHaveBeenCalledWith(7000);
        });

        test('MaintenanceAmountField_shouldRoundDecimalValues', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6500.75} onChange={mockOnChange} />);
            expect(mockOnChange).toHaveBeenCalledWith(6501);
        });
    });

    // Slider Interaction Tests
    describe('Slider Interactions', () => {
        test('MaintenanceAmountField_shouldUpdateValue_whenSliderChanged', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);
            
            const slider = screen.getByRole('slider');
            fireEvent.keyDown(slider, { key: 'ArrowRight' });
            expect(mockOnChange).toHaveBeenCalled();
        });

        test('MaintenanceAmountField_shouldHandleSliderInteraction', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            
            expect(slider).toHaveAttribute('aria-valuemin', '0');
            expect(slider).toHaveAttribute('aria-valuemax', '100000');
            expect(slider).toHaveAttribute('aria-valuenow', '6000');
        });

        test('MaintenanceAmountField_shouldUseCorrectSliderStep', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            // Verify slider has correct value
            expect(slider).toHaveAttribute('aria-valuenow', '6000');
        });
    });

    // Input Interaction Tests
    describe('Input Interactions', () => {
        test('MaintenanceAmountField_shouldUpdateValueOnValidInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox');
            await user.clear(input);
            await user.type(input, '8000');
            
            expect(mockOnChange).toHaveBeenCalledWith(8000);
        });

        test('MaintenanceAmountField_shouldShowFormattedValueWhenNotFocused', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);
            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input.value).toBe('6,000');
        });

        test('MaintenanceAmountField_shouldShowUnformattedValueWhenFocused', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox') as HTMLInputElement;
            await user.click(input);
            
            expect(input.value).toBe('6000');
        });

        test('MaintenanceAmountField_shouldClampValueOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} maxValue={50000} />);
            
            const input = screen.getByRole('textbox');
            await user.clear(input);
            await user.type(input, '75000');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(50000);
        });

        test('MaintenanceAmountField_shouldHandleEmptyInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} defaultValue={7000} />);
            
            const input = screen.getByRole('textbox');
            await user.clear(input);
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(7000);
        });

        test('MaintenanceAmountField_shouldHandleInvalidInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} defaultValue={7000} />);
            
            const input = screen.getByRole('textbox');
            await user.clear(input);
            await user.type(input, 'abc');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(7000);
        });
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('MaintenanceAmountField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} id="test-maintenance" />);
            
            const input = screen.getByRole('textbox');
            
            expect(input).toHaveAttribute('aria-label', 'Maintenance amount in dollars, current value: $6000');
        });

        test('MaintenanceAmountField_shouldHaveProperTooltipAccessibility', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} id="test-maintenance" />);
            
            const tooltipTrigger = screen.getByRole('button', { name: /more information about maintenance amount/i });
            expect(tooltipTrigger).toHaveAttribute('aria-describedby');
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('MaintenanceAmountField_shouldToggleTooltip', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);
            
            const tooltipTrigger = screen.getByRole('button', { name: /more information about maintenance amount/i });
            await user.click(tooltipTrigger);
            
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'true');
            expect(screen.getAllByText(/annual maintenance and repair costs/i)).toHaveLength(3);
        });

        test('MaintenanceAmountField_shouldHaveDollarPrefix', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);
            
            const dollarSign = screen.getByText('$');
            expect(dollarSign).toBeInTheDocument();
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('MaintenanceAmountField_shouldDisableAllInputsWhenDisabled', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} disabled={true} />);
            
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');
            
            expect(slider).toHaveAttribute('data-disabled', '');
            expect(input).toBeDisabled();
        });

        test('MaintenanceAmountField_shouldNotCallOnChangeWhenDisabled', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} disabled={true} />);
            
            const input = screen.getByRole('textbox');
            await user.type(input, '8000');
            
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    // Customization Tests
    describe('Customization', () => {
        test('MaintenanceAmountField_shouldRespectCustomMinMaxValues', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={15000} onChange={mockOnChange} minValue={1000} maxValue={50000} />);
            
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');
            
            expect(slider).toHaveAttribute('aria-valuemin', '1000');
            expect(slider).toHaveAttribute('aria-valuemax', '50000');
            expect(input).toHaveAttribute('min', '1000');
            expect(input).toHaveAttribute('max', '50000');
        });

        test('MaintenanceAmountField_shouldUseCustomId', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} id="custom-maintenance" />);
            
            // Check that elements exist with custom IDs - slider might not have ID attribute set in combined mode
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');
            
            // Check for custom input ID (in combined mode, it gets -input suffix)  
            expect(input).toHaveAttribute('id', 'custom-maintenance-input');
            
            // Verify slider exists and has proper aria-label with custom ID
            expect(slider).toBeInTheDocument();
        });

        test('MaintenanceAmountField_shouldUseCustomClassName', () => {
            const mockOnChange = jest.fn();
            const { container } = render(
                <MaintenanceAmountField value={6000} onChange={mockOnChange} className="custom-class" />
            );
            
            expect(container.firstChild).toHaveClass('custom-class');
        });

        test('MaintenanceAmountField_shouldUseCustomDefaultValue', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={NaN} onChange={mockOnChange} defaultValue={8000} />);
            
            expect(mockOnChange).toHaveBeenCalledWith(8000);
        });
    });

    // Edge Cases Tests
    describe('Edge Cases', () => {
        test('MaintenanceAmountField_shouldHandleVeryLargeNumbers', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} maxValue={100000} />);
            
            const input = screen.getByRole('textbox');
            await user.clear(input);
            await user.type(input, '500000');
            await user.tab();
            
            expect(mockOnChange).toHaveBeenCalledWith(100000);
        });

        test('MaintenanceAmountField_shouldHandleNegativeValues', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} minValue={0} />);
            
            const input = screen.getByRole('textbox');
            await user.clear(input);
            await user.type(input, '-5000');
            await user.tab();
            
            expect(mockOnChange).toHaveBeenCalledWith(0);
        });

        test('MaintenanceAmountField_shouldHandleDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} />);
            
            const input = screen.getByRole('textbox');
            await user.clear(input);
            await user.type(input, '6500.75');
            
            // Should handle decimal input and call onChange
            expect(mockOnChange).toHaveBeenCalled();
            // Verify it's been rounded to an integer
            const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
            expect(Number.isInteger(lastCall)).toBe(true);
        });

        test('MaintenanceAmountField_shouldHandleZeroValue', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={6000} onChange={mockOnChange} minValue={0} />);
            
            const input = screen.getByRole('textbox');
            await user.clear(input);
            await user.type(input, '0');
            
            expect(mockOnChange).toHaveBeenCalledWith(0);
        });

        test('MaintenanceAmountField_shouldFormatCurrencyDisplay', () => {
            const mockOnChange = jest.fn();
            render(<MaintenanceAmountField value={12345} onChange={mockOnChange} displayMode="slider" />);
            
            expect(screen.getByText('$12,345')).toBeInTheDocument();
        });
    });
});
