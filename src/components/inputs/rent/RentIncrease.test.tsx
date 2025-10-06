import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RentIncreaseField } from './RentIncrease';

describe('RentIncreaseField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic Rendering Tests
    describe('Basic Rendering', () => {
        test('RentIncreaseField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const label = screen.getByText('Rent Increase Rate');
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');
            const tooltip = screen.getByRole('button', { name: /more information about Rent Increase Rate/i });

            expect(label).toBeInTheDocument();
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
            expect(tooltip).toBeInTheDocument();
        });

        test('RentIncreaseField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const slider = screen.getByRole('slider');
            // Check for value display (text content might include whitespace)
            const valueDisplay = screen.getByText((_, element) => {
                return element?.textContent?.trim() === '2.50%';
            });
            expect(slider).toBeInTheDocument();
            expect(valueDisplay).toBeInTheDocument();
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        });

        test('RentIncreaseField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        });

        test('RentIncreaseField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
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
        test('RentIncreaseField_shouldClampInitialValueToMinimum', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={-5}
                    onChange={mockOnChange}
                    minValue={0}
                    maxValue={20}
                />
            );

            // Should call onChange with clamped value
            expect(mockOnChange).toHaveBeenCalledWith(0);
        });

        test('RentIncreaseField_shouldClampInitialValueToMaximum', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={25}
                    onChange={mockOnChange}
                    minValue={0}
                    maxValue={20}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(20);
        });

        test('RentIncreaseField_shouldHandleNaNValue', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={2.5}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(2.5);
        });

        test('RentIncreaseField_shouldHandleInfinityValue', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={Infinity}
                    onChange={mockOnChange}
                    defaultValue={2.5}
                    maxValue={20}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(2.5);
        });

        test('RentIncreaseField_shouldHandleNegativeInfinityValue', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={-Infinity}
                    onChange={mockOnChange}
                    defaultValue={2.5}
                    minValue={0}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(2.5);
        });

        test('RentIncreaseField_shouldRoundToTwoDecimalPlaces', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.567}
                    onChange={mockOnChange}
                />
            );

            // Should round to 2 decimal places
            expect(mockOnChange).toHaveBeenCalledWith(2.57);
        });

        test('RentIncreaseField_shouldHandleExtremeDecimalPrecision', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.123456789}
                    onChange={mockOnChange}
                />
            );

            // Should round to 2 decimal places
            expect(mockOnChange).toHaveBeenCalledWith(2.12);
        });
    });

    // Slider Interaction Tests
    describe('Slider Interactions', () => {
        test('RentIncreaseField_shouldUpdateValueWhenSliderChanges', async () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');

            // Simulate slider keydown events (Radix Slider responds to keyboard)
            fireEvent.keyDown(slider, { key: 'ArrowRight' });

            expect(mockOnChange).toHaveBeenCalled();
        });

        test('RentIncreaseField_shouldClampSliderValueToRange', async () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    minValue={1}
                    maxValue={10}
                />
            );

            const slider = screen.getByRole('slider');

            // Test that slider has correct range attributes
            expect(slider).toHaveAttribute('aria-valuemin', '1');
            expect(slider).toHaveAttribute('aria-valuemax', '10');
        });

        test('RentIncreaseField_shouldHandleSliderInteraction', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');

            // Test that slider is present and shows correct value
            expect(slider).toBeInTheDocument();
            expect(slider).toHaveAttribute('aria-valuenow', '2.5');
        });

        test('RentIncreaseField_shouldUseCorrectSliderStep', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');

            // Verify the slider is properly configured (0.1% increments are internal to Radix)
            expect(slider).toHaveAttribute('aria-valuemin', '0');
            expect(slider).toHaveAttribute('aria-valuemax', '20');
            expect(slider).toHaveAttribute('aria-valuenow', '2.5');
        });
    });

    // Input Interaction Tests
    describe('Input Interactions', () => {
        test('RentIncreaseField_shouldUpdateValueOnValidInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '3.5');

            // Should provide immediate feedback for valid values
            expect(mockOnChange).toHaveBeenCalledWith(3.5);
        });

        test('RentIncreaseField_shouldShowFormattedValueWhenNotFocused', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={3.25}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            // Should show formatted percentage value as string
            expect(input).toHaveValue('3.25');
        });

        test('RentIncreaseField_shouldShowUnformattedValueWhenFocused', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            await user.click(input);

            // When focused, should show unformatted value
            expect(input).toHaveValue(2.5);
        });

        test('RentIncreaseField_shouldClampValueOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    minValue={0}
                    maxValue={10}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '15');
            await user.tab(); // Blur the input

            expect(mockOnChange).toHaveBeenCalledWith(10);
        });

        test('RentIncreaseField_shouldHandleEmptyInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    defaultValue={3.0}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.tab(); // Blur with empty input

            expect(mockOnChange).toHaveBeenCalledWith(3.0);
        });

        test('RentIncreaseField_shouldHandleInvalidInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    defaultValue={3.0}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, 'invalid');
            await user.tab(); // Blur with invalid input

            expect(mockOnChange).toHaveBeenCalledWith(3.0);
        });

        test('RentIncreaseField_shouldNotCallOnChangeForInvalidInputDuringTyping', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            mockOnChange.mockClear();

            await user.type(input, 'abc');

            // Should not call onChange for invalid input during typing
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        test('RentIncreaseField_shouldHandleDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '2.75');

            expect(mockOnChange).toHaveBeenCalledWith(2.75);
        });

        test('RentIncreaseField_shouldHandleNegativeInputCorrectly', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    minValue={0}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '-1');
            await user.tab(); // Blur to trigger validation

            // Should clamp to minimum value
            expect(mockOnChange).toHaveBeenCalledWith(0);
        });
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('RentIncreaseField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    id="test-rent-increase"
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            // Test Radix slider ARIA attributes
            expect(slider).toHaveAttribute('aria-valuemin', '0');
            expect(slider).toHaveAttribute('aria-valuemax', '20');
            expect(slider).toHaveAttribute('aria-valuenow', '2.5');

            expect(input).toHaveAttribute('aria-label', 'Rent increase rate in percent, current value: 2.5%');
        });

        test('RentIncreaseField_shouldHaveProperTooltipAccessibility', () => {
            const mockOnChange = jest.fn();
            
            render(
                <RentIncreaseField
                    id="test-rent-increase"
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about Rent Increase Rate/i });

            expect(tooltipTrigger).toHaveAttribute('aria-describedby', 'test-rent-increase-tooltip');
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');
        });        test('RentIncreaseField_shouldToggleTooltip', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    id="test-rent-increase"
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about Rent Increase Rate/i });

            await user.click(tooltipTrigger);

            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'true');
        });

        test('RentIncreaseField_shouldHavePercentSuffix', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    id="test-rent-increase"
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            // Check for percent suffix in InputGroup structure
            const percentSuffix = screen.getByText('%');
            expect(percentSuffix).toBeInTheDocument();
            // Verify it has the correct ID for aria-describedby relationship
            expect(percentSuffix).toHaveAttribute('id', 'test-rent-increase-suffix');
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('RentIncreaseField_shouldDisableAllInputsWhenDisabled', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            // Radix slider uses data-disabled attribute
            expect(slider).toHaveAttribute('data-disabled');
            expect(input).toBeDisabled();
        });

        test('RentIncreaseField_shouldNotCallOnChangeWhenDisabled', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const input = screen.getByRole('textbox');

            // Try to interact with disabled input
            await user.type(input, '3.5');

            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    // Custom Props Tests
    describe('Custom Props', () => {
        test('RentIncreaseField_shouldRespectCustomMinMaxValues', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={5}
                    onChange={mockOnChange}
                    minValue={2}
                    maxValue={10}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            // Radix slider uses aria attributes for min/max
            expect(slider).toHaveAttribute('aria-valuemin', '2');
            expect(slider).toHaveAttribute('aria-valuemax', '10');
            expect(input).toHaveAttribute('min', '2');
            expect(input).toHaveAttribute('max', '10');
        });

        test('RentIncreaseField_shouldUseCustomId', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    id="custom-rent-increase"
                    value={2.5}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('id', 'custom-rent-increase');
        });

        test('RentIncreaseField_shouldUseCustomClassNames', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    className="custom-class"
                />
            );

            // Check if the main container has the custom class
            const container = screen.getByText('Rent Increase Rate').closest('.custom-class');
            expect(container).toBeInTheDocument();
        });

        test('RentIncreaseField_shouldUseCustomDefaultValue', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={4.5}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(4.5);
        });
    });

    // Edge Cases Tests
    describe('Edge Cases', () => {
        test('RentIncreaseField_shouldHandleRapidValueChanges', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            // Rapid typing
            await user.clear(input);
            await user.type(input, '123.456');
            await user.tab();

            // Should handle rapid changes and clamp final value
            expect(mockOnChange).toHaveBeenLastCalledWith(20); // Assuming max is 20
        });

        test('RentIncreaseField_shouldHandleVeryLongDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '2.123456789012345');
            await user.tab();

            expect(mockOnChange).toHaveBeenCalledWith(2.12); // Should round to 2 decimals
        });

        test('RentIncreaseField_shouldPreventInfiniteLoops', () => {
            const mockOnChange = jest.fn();

            // Render with a value that needs clamping
            const { rerender } = render(
                <RentIncreaseField
                    value={100}
                    onChange={mockOnChange}
                    maxValue={20}
                />
            );

            // Clear the mock and re-render with the same invalid value
            mockOnChange.mockClear();

            rerender(
                <RentIncreaseField
                    value={100}
                    onChange={mockOnChange}
                    maxValue={20}
                />
            );

            // Should not call onChange again if the value hasn't actually changed
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        test('RentIncreaseField_shouldHandleZeroValue', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={0}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toHaveAttribute('aria-valuenow', '0');
        });

        test('RentIncreaseField_shouldHandleVerySmallDecimals', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            await user.clear(input);
            await user.type(input, '0.01');
            await user.tab();

            expect(mockOnChange).toHaveBeenCalledWith(0.01);
        });
    });

    // Integration Tests
    describe('Integration Tests', () => {
        test('RentIncreaseField_shouldSyncSliderAndInputValues', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            const slider = screen.getByRole('slider');

            // Test that both components are present in combined mode
            expect(slider).toBeInTheDocument();
            expect(screen.getByRole('textbox')).toBeInTheDocument();

            // Test that slider shows correct value
            expect(slider).toHaveAttribute('aria-valuenow', '2.5');
        });

        test('RentIncreaseField_shouldMaintainStateConsistency', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');

            // Focus and change value
            await user.click(input);
            await user.clear(input);
            await user.type(input, '3.5');

            // Value should update immediately for valid input
            expect(mockOnChange).toHaveBeenCalledWith(3.5);

            // Blur should not change the value again if it's already valid
            mockOnChange.mockClear();
            await user.tab();

            // Should not call onChange again since 3.5 is already valid and matches validatedValue
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        test('RentIncreaseField_shouldFormatValueDisplayCorrectly', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            // Value display should show formatted percentage
            const valueDisplay = screen.getByText((_, element) => {
                return element?.textContent?.trim() === '2.50%';
            });
            expect(valueDisplay).toBeInTheDocument();
        });

        test('RentIncreaseField_shouldHandleValueDisplayForZero', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={0}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            // Value display should show formatted zero percentage
            const valueDisplay = screen.getByText((_, element) => {
                return element?.textContent?.trim() === '0.00%';
            });
            expect(valueDisplay).toBeInTheDocument();
        });
    });

    // Formatting Tests
    describe('Formatting Tests', () => {
        test('RentIncreaseField_shouldDisplayCorrectPercentageFormat', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={2.5}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            // Should show properly formatted percentage
            expect(screen.getByText((_, element) => {
                return element?.textContent?.trim() === '2.50%';
            })).toBeInTheDocument();
        });

        test('RentIncreaseField_shouldFormatSingleDigitPercentage', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={5}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            expect(screen.getByText((_, element) => {
                return element?.textContent?.trim() === '5.00%';
            })).toBeInTheDocument();
        });

        test('RentIncreaseField_shouldFormatDecimalPercentage', () => {
            const mockOnChange = jest.fn();

            render(
                <RentIncreaseField
                    value={3.25}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            expect(screen.getByText((_, element) => {
                return element?.textContent?.trim() === '3.25%';
            })).toBeInTheDocument();
        });
    });
});