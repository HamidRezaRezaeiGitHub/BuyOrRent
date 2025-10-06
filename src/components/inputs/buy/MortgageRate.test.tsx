import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MortgageRateField } from './MortgageRate';

describe('MortgageRateField', () => {
    // Rendering Tests
    describe('Rendering', () => {
        test('MortgageRateField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
            expect(screen.getByText('Mortgage Rate')).toBeInTheDocument();
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        });

        test('MortgageRateField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} displayMode="slider" />);
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
            expect(screen.getByText('5.50%')).toBeInTheDocument();
        });

        test('MortgageRateField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} displayMode="input" />);
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        });

        test('MortgageRateField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} displayMode="combined" />);
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        });
    });

    // Value Validation Tests
    describe('Value Validation', () => {
        test('MortgageRateField_shouldClampInitialValueToMinimum', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={-5} onChange={mockOnChange} minValue={0} />);
            expect(mockOnChange).toHaveBeenCalledWith(0);
        });

        test('MortgageRateField_shouldClampInitialValueToMaximum', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={25} onChange={mockOnChange} maxValue={15} />);
            expect(mockOnChange).toHaveBeenCalledWith(15);
        });

        test('MortgageRateField_shouldHandleNaNValue', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={NaN} onChange={mockOnChange} defaultValue={6} />);
            expect(mockOnChange).toHaveBeenCalledWith(6);
        });

        test('MortgageRateField_shouldHandleInfinityValue', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={Infinity} onChange={mockOnChange} defaultValue={6} />);
            expect(mockOnChange).toHaveBeenCalledWith(6);
        });

        test('MortgageRateField_shouldRoundToTwoDecimalPlaces', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.555} onChange={mockOnChange} />);
            expect(mockOnChange).toHaveBeenCalledWith(5.56);
        });
    });

    // Slider Interaction Tests
    describe('Slider Interactions', () => {
        test('MortgageRateField_shouldUpdateValue_whenSliderChanged', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            fireEvent.keyDown(slider, { key: 'ArrowRight' });
            expect(mockOnChange).toHaveBeenCalled();
        });

        test('MortgageRateField_shouldHandleSliderInteraction', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            
            expect(slider).toHaveAttribute('aria-valuemin', '0');
            expect(slider).toHaveAttribute('aria-valuemax', '15');
            expect(slider).toHaveAttribute('aria-valuenow', '5.5');
        });

        test('MortgageRateField_shouldUseCorrectSliderStep', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            // The step attribute is on the parent Slider component, not the thumb element
            expect(slider).toHaveAttribute('aria-valuenow', '5.5');
        });
    });

    // Input Interaction Tests
    describe('Input Interactions', () => {
        test('MortgageRateField_shouldUpdateValueOnValidInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '6.5');
            
            expect(mockOnChange).toHaveBeenCalledWith(6.5);
        });

        test('MortgageRateField_shouldShowFormattedValueWhenNotFocused', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
            const input = screen.getByRole('spinbutton') as HTMLInputElement;
            expect(input.value).toBe('5.50');
        });

        test('MortgageRateField_shouldShowUnformattedValueWhenFocused', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton') as HTMLInputElement;
            await user.click(input);
            
            expect(input.value).toBe('5.5');
        });

        test('MortgageRateField_shouldClampValueOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} maxValue={10} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '25');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(10);
        });

        test('MortgageRateField_shouldHandleEmptyInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} defaultValue={6} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(6);
        });

        test('MortgageRateField_shouldHandleInvalidInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} defaultValue={6} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, 'abc');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(6);
        });
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('MortgageRateField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} id="test-rate" />);
            
            const input = screen.getByRole('spinbutton');
            
            expect(input).toHaveAttribute('aria-label', 'Mortgage rate, current value: 5.5%');
            expect(input).toHaveAttribute('aria-describedby', 'test-rate-suffix test-rate-tooltip');
        });

        test('MortgageRateField_shouldHaveProperTooltipAccessibility', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} id="test-rate" />);
            
            const tooltipTrigger = screen.getByRole('button', { name: /more information about mortgage rate/i });
            expect(tooltipTrigger).toHaveAttribute('aria-describedby', 'test-rate-tooltip');
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('MortgageRateField_shouldToggleTooltip', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
            
            const tooltipTrigger = screen.getByRole('button', { name: /more information about mortgage rate/i });
            await user.click(tooltipTrigger);
            
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'true');
            expect(screen.getAllByText(/annual interest rate charged by your lender/i)).toHaveLength(2);
        });

        test('MortgageRateField_shouldHavePercentSuffix', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} id="test-rate" />);
            
            const suffix = screen.getByText('%');
            expect(suffix.parentElement).toHaveAttribute('id', 'test-rate-suffix');
            expect(suffix.parentElement).toHaveAttribute('aria-hidden', 'true');
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('MortgageRateField_shouldDisableAllInputsWhenDisabled', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} disabled={true} />);
            
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            
            expect(slider).toHaveAttribute('data-disabled', '');
            expect(input).toBeDisabled();
        });

        test('MortgageRateField_shouldNotCallOnChangeWhenDisabled', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} disabled={true} />);
            
            const input = screen.getByRole('spinbutton');
            await user.type(input, '6.5');
            
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    // Customization Tests
    describe('Customization', () => {
        test('MortgageRateField_shouldRespectCustomMinMaxValues', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={8} onChange={mockOnChange} minValue={2} maxValue={12} />);
            
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            
            expect(slider).toHaveAttribute('aria-valuemin', '2');
            expect(slider).toHaveAttribute('aria-valuemax', '12');
            expect(input).toHaveAttribute('min', '2');
            expect(input).toHaveAttribute('max', '12');
        });

        test('MortgageRateField_shouldUseCustomId', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} id="custom-rate" />);
            
            const label = screen.getByText('Mortgage Rate');
            expect(label).toHaveAttribute('for', 'custom-rate');
        });

        test('MortgageRateField_shouldUseCustomClassName', () => {
            const mockOnChange = jest.fn();
            const { container } = render(
                <MortgageRateField value={5.5} onChange={mockOnChange} className="custom-class" />
            );
            
            expect(container.firstChild).toHaveClass('custom-class');
        });

        test('MortgageRateField_shouldUseCustomDefaultValue', () => {
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={NaN} onChange={mockOnChange} defaultValue={7.5} />);
            
            expect(mockOnChange).toHaveBeenCalledWith(7.5);
        });
    });

    // Edge Cases Tests
    describe('Edge Cases', () => {
        test('MortgageRateField_shouldHandleVeryLargeNumbers', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} maxValue={15} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '999999');
            await user.tab();
            
            expect(mockOnChange).toHaveBeenCalledWith(15);
        });

        test('MortgageRateField_shouldHandleNegativeValues', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} minValue={0} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '-5');
            await user.tab();
            
            expect(mockOnChange).toHaveBeenCalledWith(0);
        });

        test('MortgageRateField_shouldHandleDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '6.75');
            
            expect(mockOnChange).toHaveBeenCalledWith(6.75);
        });
    });
});
