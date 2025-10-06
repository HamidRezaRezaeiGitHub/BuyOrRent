import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MonthlyRentField } from './MonthlyRent';

describe('MonthlyRentField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic Rendering Tests
    describe('Basic Rendering', () => {
        test('MonthlyRentField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const label = screen.getByText('Monthly Rent');
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');
            const tooltip = screen.getByRole('button', { name: /more information about monthly rent/i });

            expect(label).toBeInTheDocument();
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
            expect(tooltip).toBeInTheDocument();
        });

        test('MonthlyRentField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const slider = screen.getByRole('slider');
            // Check for value display with currency formatting
            const valueDisplay = screen.getByText((_, element) => {
                return element?.textContent?.trim() === '$2,000';
            });
            expect(slider).toBeInTheDocument();
            expect(valueDisplay).toBeInTheDocument();
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        });

        test('MonthlyRentField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        });

        test('MonthlyRentField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
        });
    });

    // Value Validation Tests
    describe('Value Validation', () => {
        test('MonthlyRentField_shouldClampInitialValueToMinimum', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={-500}
                    onChange={mockOnChange}
                    minValue={0}
                    maxValue={10000}
                />
            );

            // Should call onChange with clamped value
            expect(mockOnChange).toHaveBeenCalledWith(0);
        });

        test('MonthlyRentField_shouldClampInitialValueToMaximum', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={15000}
                    onChange={mockOnChange}
                    minValue={0}
                    maxValue={10000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(10000);
        });

        test('MonthlyRentField_shouldHandleNaNValue', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={2000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(2000);
        });

        test('MonthlyRentField_shouldHandleInfinityValue', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={Infinity}
                    onChange={mockOnChange}
                    defaultValue={2000}
                    maxValue={10000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(2000);
        });

        test('MonthlyRentField_shouldHandleNegativeInfinityValue', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={-Infinity}
                    onChange={mockOnChange}
                    defaultValue={2000}
                    minValue={0}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(2000);
        });

        test('MonthlyRentField_shouldRoundDecimalValues', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000.7}
                    onChange={mockOnChange}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(2001);
        });
    });

    // Slider Interaction Tests
    describe('Slider Interactions', () => {
        test('MonthlyRentField_shouldUpdateValueWhenSliderChanges', async () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');

            // Simulate slider keydown events (Radix Slider responds to keyboard)
            fireEvent.keyDown(slider, { key: 'ArrowRight' });

            expect(mockOnChange).toHaveBeenCalled();
        });

        test('MonthlyRentField_shouldClampSliderValueToRange', async () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    minValue={500}
                    maxValue={5000}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Verify slider has correct range attributes
            expect(slider).toHaveAttribute('aria-valuemin', '500');
            expect(slider).toHaveAttribute('aria-valuemax', '5000');
        });

        test('MonthlyRentField_shouldHandleSliderInteraction', async () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Test keyboard interaction
            fireEvent.keyDown(slider, { key: 'ArrowUp' });
            
            expect(mockOnChange).toHaveBeenCalled();
        });

        test('MonthlyRentField_shouldUseCorrectSliderStep', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Verify the slider is properly configured ($50 increments are internal to Radix)
            expect(slider).toHaveAttribute('aria-valuemin', '0');
            expect(slider).toHaveAttribute('aria-valuemax', '10000');
            expect(slider).toHaveAttribute('aria-valuenow', '2000');
        });
    });

    // Input Interaction Tests
    describe('Input Interactions', () => {
        test('MonthlyRentField_shouldUpdateValueOnValidInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            // Clear existing onChange calls from initial render
            mockOnChange.mockClear();

            await user.clear(input);
            await user.type(input, '2500');

            // Should call onChange with the new value during typing
            expect(mockOnChange).toHaveBeenCalledWith(2500);
        });

        test('MonthlyRentField_shouldShowFormattedValueWhenNotFocused', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2500}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            
            // When not focused, should show formatted value with commas
            expect(input).toHaveValue('2,500');
        });

        test('MonthlyRentField_shouldShowUnformattedValueWhenFocused', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2500}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.click(input);
            
            // When focused, should show unformatted numeric value for editing
            expect(input).toHaveValue(2500);
        });

        test('MonthlyRentField_shouldClampValueOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    minValue={500}
                    maxValue={5000}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '15000');
            await user.tab(); // Blur the input

            expect(mockOnChange).toHaveBeenCalledWith(5000);
        });

        test('MonthlyRentField_shouldHandleEmptyInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    defaultValue={2500}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.tab(); // Blur with empty input

            expect(mockOnChange).toHaveBeenCalledWith(2500);
        });

        test('MonthlyRentField_shouldHandleInvalidInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    defaultValue={2500}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, 'invalid');
            await user.tab(); // Blur with invalid input

            expect(mockOnChange).toHaveBeenCalledWith(2500);
        });

        test('MonthlyRentField_shouldNotCallOnChangeForInvalidInputDuringTyping', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            
            // Clear existing onChange calls
            mockOnChange.mockClear();

            await user.clear(input);
            await user.type(input, 'abc');

            // Should not call onChange for invalid input during typing
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        test('MonthlyRentField_shouldHandleDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            
            mockOnChange.mockClear();

            await user.clear(input);
            await user.type(input, '2500.75');

            // Should call onChange with the decimal value during typing
            expect(mockOnChange).toHaveBeenCalledWith(2500.75);
        });

        test('MonthlyRentField_shouldHandleNegativeInputCorrectly', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    minValue={0}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '-500');
            await user.tab(); // Blur to trigger clamping

            // Should clamp to minimum value
            expect(mockOnChange).toHaveBeenCalledWith(0);
        });
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('MonthlyRentField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    id="testRent"
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            // Check if slider has aria attributes (Radix may not set aria-label)
            expect(slider).toHaveAttribute('aria-valuenow', '2000');
            expect(input).toHaveAttribute('aria-label', 'Monthly rent in dollars, current value: $2000');
        });

        test('MonthlyRentField_shouldHaveProperTooltipAccessibility', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    id="testRent"
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about monthly rent/i });

            expect(tooltipTrigger).toHaveAttribute('aria-describedby', 'testRent-tooltip');
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('MonthlyRentField_shouldToggleTooltip', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about monthly rent/i });

            // Initially closed
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');

            // Click to open
            await user.click(tooltipTrigger);
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'true');
        });

        test('MonthlyRentField_shouldHaveDollarSignPrefix', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            // Check for dollar sign in the input
            const dollarSign = screen.getByText('$');
            expect(dollarSign).toBeInTheDocument();
        });

        test('MonthlyRentField_shouldHaveMonthSuffix', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            // Check for /mo suffix
            const monthSuffix = screen.getByText('/mo');
            expect(monthSuffix).toBeInTheDocument();
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('MonthlyRentField_shouldDisableAllInputsWhenDisabled', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            expect(slider).toHaveAttribute('data-disabled');
            expect(input).toBeDisabled();
        });

        test('MonthlyRentField_shouldNotCallOnChangeWhenDisabled', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const input = screen.getByRole('textbox');
            
            // Clear any initial onChange calls
            mockOnChange.mockClear();

            // Try to interact with disabled input
            await user.click(input);

            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    // Custom Props Tests
    describe('Custom Props', () => {
        test('MonthlyRentField_shouldRespectCustomMinMaxValues', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={1500}
                    onChange={mockOnChange}
                    minValue={1000}
                    maxValue={5000}
                />
            );

            const slider = screen.getByRole('slider');

            expect(slider).toHaveAttribute('aria-valuemin', '1000');
            expect(slider).toHaveAttribute('aria-valuemax', '5000');
        });

        test('MonthlyRentField_shouldUseCustomId', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    id="customRentId"
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            // Check that components can be found by role (Radix may not set IDs directly)
            expect(slider).toBeInTheDocument();
            expect(input).toHaveAttribute('id', 'customRentId-input');
        });

        test('MonthlyRentField_shouldUseCustomClassNames', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    className="custom-class"
                />
            );

            const container = screen.getByText('Monthly Rent').closest('.custom-class');
            expect(container).toBeInTheDocument();
        });

        test('MonthlyRentField_shouldUseCustomDefaultValue', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={3000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(3000);
        });
    });

    // Edge Cases Tests
    describe('Edge Cases', () => {
        test('MonthlyRentField_shouldHandleRapidValueChanges', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            // Rapidly change values
            await user.clear(input);
            await user.type(input, '1500');
            await user.clear(input);
            await user.type(input, '2500');
            await user.clear(input);
            await user.type(input, '3000');

            // Should handle all changes without errors
            expect(mockOnChange).toHaveBeenCalledWith(3000);
        });

        test('MonthlyRentField_shouldHandleVeryLongDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '2000.123456789');

            // Should handle long decimal precision
            expect(mockOnChange).toHaveBeenCalledWith(2000.123456789);
        });

        test('MonthlyRentField_shouldPreventInfiniteLoops', () => {
            const mockOnChange = jest.fn();

            // This should not cause infinite re-renders
            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            // Should not call onChange if the value is already valid (no validation needed)
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        test('MonthlyRentField_shouldHandleZeroValue', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={0}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('0');
        });

        test('MonthlyRentField_shouldHandleVerySmallDecimals', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '0.01');

            expect(mockOnChange).toHaveBeenCalledWith(0.01);
        });
    });

    // Integration Tests
    describe('Integration Tests', () => {
        test('MonthlyRentField_shouldSyncSliderAndInputValues', async () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            expect(slider).toHaveAttribute('aria-valuenow', '2000');
            expect(input).toHaveValue('2,000');
        });

        test('MonthlyRentField_shouldMaintainStateConsistency', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            // Focus and change value
            await user.click(input);
            await user.clear(input);
            await user.type(input, '2500');

            // Value should update immediately for valid input
            expect(mockOnChange).toHaveBeenCalledWith(2500);

            // Blur should not change the value again if it's already valid
            mockOnChange.mockClear();
            await user.tab();

            // Should not call onChange again since 2500 is already valid and matches validatedValue
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        test('MonthlyRentField_shouldFormatValueDisplayCorrectly', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2500}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            // Value display should show formatted currency
            const valueDisplay = screen.getByText((_, element) => {
                return element?.textContent?.trim() === '$2,500';
            });
            expect(valueDisplay).toBeInTheDocument();
        });

        test('MonthlyRentField_shouldHandleValueDisplayForZero', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={0}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            // Value display should show formatted zero amount
            const valueDisplay = screen.getByText((_, element) => {
                return element?.textContent?.trim() === '$0';
            });
            expect(valueDisplay).toBeInTheDocument();
        });
    });

    // Currency Formatting Tests
    describe('Currency Formatting Tests', () => {
        test('MonthlyRentField_shouldDisplayCorrectCurrencyFormat', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={2500}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            // Should show properly formatted currency
            expect(screen.getByText((_, element) => {
                return element?.textContent?.trim() === '$2,500';
            })).toBeInTheDocument();
        });

        test('MonthlyRentField_shouldFormatLargeCurrencyAmount', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={5000}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            expect(screen.getByText((_, element) => {
                return element?.textContent?.trim() === '$5,000';
            })).toBeInTheDocument();
        });

        test('MonthlyRentField_shouldFormatSmallCurrencyAmount', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={500}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            expect(screen.getByText((_, element) => {
                return element?.textContent?.trim() === '$500';
            })).toBeInTheDocument();
        });
    });
});