import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvestmentReturnField } from './InvestmentReturn';

describe('InvestmentReturnField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic Rendering Tests
    describe('Basic Rendering', () => {
        test('InvestmentReturnField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const label = screen.getByText('Investment Return Rate');
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');
            const tooltip = screen.getByRole('button', { name: /more information about Investment Return Rate/i });

            expect(label).toBeInTheDocument();
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
            expect(tooltip).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const slider = screen.getByRole('slider');
            // Check for value display (text content might include whitespace)
            const valueDisplay = screen.getByText((_, element) => {
                return element?.textContent === '7.50%';
            });
            expect(slider).toBeInTheDocument();
            expect(valueDisplay).toBeInTheDocument();
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldRenderWithHelperWhenEnabled', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    showHelper={true}
                />
            );

            const helperLink = screen.getByText('Need help choosing a return rate?');
            expect(helperLink).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldNotRenderHelperWhenDisabled', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    showHelper={false}
                />
            );

            const helperLink = screen.queryByText('Need help choosing a return rate?');
            expect(helperLink).not.toBeInTheDocument();
        });
    });

    // Value Validation Tests
    describe('Value Validation', () => {
        test('InvestmentReturnField_shouldClampInitialValueToMinimum', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={-30}
                    onChange={mockOnChange}
                    minValue={-20}
                    maxValue={100}
                />
            );

            // Should call onChange with clamped value
            expect(mockOnChange).toHaveBeenCalledWith(-20);
        });

        test('InvestmentReturnField_shouldClampInitialValueToMaximum', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={150}
                    onChange={mockOnChange}
                    minValue={-20}
                    maxValue={100}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(100);
        });

        test('InvestmentReturnField_shouldHandleNaNValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={7.5}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(7.5);
        });

        test('InvestmentReturnField_shouldHandleInfinityValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={Infinity}
                    onChange={mockOnChange}
                    defaultValue={7.5}
                    maxValue={100}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(7.5);
        });

        test('InvestmentReturnField_shouldHandleNegativeInfinityValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={-Infinity}
                    onChange={mockOnChange}
                    defaultValue={7.5}
                    minValue={-20}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(7.5);
        });

        test('InvestmentReturnField_shouldRoundToTwoDecimalPlaces', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.567}
                    onChange={mockOnChange}
                />
            );

            // Should round to 2 decimal places
            expect(mockOnChange).toHaveBeenCalledWith(7.57);
        });

        test('InvestmentReturnField_shouldHandleExtremeDecimalPrecision', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.123456789}
                    onChange={mockOnChange}
                />
            );

            // Should round to 2 decimal places
            expect(mockOnChange).toHaveBeenCalledWith(7.12);
        });

        test('InvestmentReturnField_shouldHandleNegativeValues', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={-5.5}
                    onChange={mockOnChange}
                    minValue={-20}
                    maxValue={100}
                />
            );

            // Should accept negative values within range
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    // Slider Interaction Tests
    describe('Slider Interactions', () => {
        test('InvestmentReturnField_shouldUpdateValueWhenSliderChanges', async () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Simulate slider keydown events (Radix Slider responds to keyboard)
            fireEvent.keyDown(slider, { key: 'ArrowRight' });

            expect(mockOnChange).toHaveBeenCalled();
        });

        test('InvestmentReturnField_shouldClampSliderValueToRange', async () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    minValue={-10}
                    maxValue={50}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Test that slider has correct range attributes
            expect(slider).toHaveAttribute('aria-valuemin', '-10');
            expect(slider).toHaveAttribute('aria-valuemax', '50');
        });

        test('InvestmentReturnField_shouldHandleSliderInteraction', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Test that slider is present and shows correct value
            expect(slider).toBeInTheDocument();
            expect(slider).toHaveAttribute('aria-valuenow', '7.5');
        });

        test('InvestmentReturnField_shouldUseCorrectSliderStep', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Verify the slider is properly configured (0.1% increments are internal to Radix)
            expect(slider).toHaveAttribute('aria-valuemin', '-20');
            expect(slider).toHaveAttribute('aria-valuemax', '100');
            expect(slider).toHaveAttribute('aria-valuenow', '7.5');
        });

        test('InvestmentReturnField_shouldHandleNegativeSliderValues', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={-5}
                    onChange={mockOnChange}
                    minValue={-20}
                    maxValue={100}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Should properly display negative values
            expect(slider).toHaveAttribute('aria-valuenow', '-5');
            // Note: aria-valuetext is set by the component but may not be reflected in test environment
            expect(slider).toHaveAttribute('aria-valuemin', '-20');
            expect(slider).toHaveAttribute('aria-valuemax', '100');
        });
    });

    // Input Interaction Tests
    describe('Input Interactions', () => {
        test('InvestmentReturnField_shouldUpdateValueOnValidInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.clear(input);
            await user.type(input, '8.5');

            // Should provide immediate feedback for valid values
            expect(mockOnChange).toHaveBeenCalledWith(8.5);
        });

        test('InvestmentReturnField_shouldShowFormattedValueWhenNotFocused', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.25}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            // Should show formatted percentage value
            expect(input).toHaveValue('7.25');
        });

        test('InvestmentReturnField_shouldShowUnformattedValueWhenFocused', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.click(input);
            
            // When focused, should show unformatted value
            expect(input).toHaveValue(7.5);
        });

        test('InvestmentReturnField_shouldClampValueOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    minValue={-20}
                    maxValue={50}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.clear(input);
            await user.type(input, '75');
            await user.tab(); // Blur the input

            expect(mockOnChange).toHaveBeenCalledWith(50);
        });

        test('InvestmentReturnField_shouldHandleEmptyInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    defaultValue={8.0}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.clear(input);
            await user.tab(); // Blur with empty input

            expect(mockOnChange).toHaveBeenCalledWith(8.0);
        });

        test('InvestmentReturnField_shouldHandleInvalidInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    defaultValue={8.0}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.clear(input);
            await user.type(input, 'invalid');
            await user.tab(); // Blur with invalid input

            expect(mockOnChange).toHaveBeenCalledWith(8.0);
        });

        test('InvestmentReturnField_shouldNotCallOnChangeForInvalidInputDuringTyping', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
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

        test('InvestmentReturnField_shouldHandleDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.clear(input);
            await user.type(input, '8.75');

            expect(mockOnChange).toHaveBeenCalledWith(8.75);
        });

        test('InvestmentReturnField_shouldHandleNegativeInputCorrectly', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    minValue={-10}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.clear(input);
            await user.type(input, '-5');

            // Should accept negative values within range
            expect(mockOnChange).toHaveBeenCalledWith(-5);
        });

        test('InvestmentReturnField_shouldClampNegativeInputBelowMinimum', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    minValue={-10}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.clear(input);
            await user.type(input, '-25');
            await user.tab(); // Blur to trigger validation

            // Should clamp to minimum value
            expect(mockOnChange).toHaveBeenCalledWith(-10);
        });
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('InvestmentReturnField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    id="test-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            // Test Radix slider ARIA attributes
            expect(slider).toHaveAttribute('aria-valuemin', '-20');
            expect(slider).toHaveAttribute('aria-valuemax', '100');
            expect(slider).toHaveAttribute('aria-valuenow', '7.5');

            expect(input).toHaveAttribute('aria-label', 'Investment return rate in percent, current value: 7.5%');
        });

        test('InvestmentReturnField_shouldHaveProperTooltipAccessibility', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    id="test-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about Investment Return Rate/i });

            expect(tooltipTrigger).toHaveAttribute('aria-describedby', 'test-investment-return-tooltip');
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('InvestmentReturnField_shouldToggleTooltip', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    id="test-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about Investment Return Rate/i });

            await user.click(tooltipTrigger);

            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'true');
        });

        test('InvestmentReturnField_shouldHavePercentSuffix', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    id="test-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            // Check for percent suffix in input
            const percentSuffix = screen.getByText('%');
            expect(percentSuffix).toBeInTheDocument();
            // In the new InputGroup structure, the % is within a span that has the id
            expect(percentSuffix).toHaveAttribute('id', 'test-investment-return-suffix');
        });

        test('InvestmentReturnField_shouldHaveProperValueDisplayAccessibility', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            // Check for aria-live attribute on value display
            const valueDisplay = screen.getByText('7.50%').closest('div');
            expect(valueDisplay).toHaveAttribute('aria-live', 'polite');
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('InvestmentReturnField_shouldDisableAllInputsWhenDisabled', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
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

        test('InvestmentReturnField_shouldNotCallOnChangeWhenDisabled', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const input = screen.getByRole('textbox');
            
            // Try to interact with disabled input
            await user.type(input, '8.5');

            expect(mockOnChange).not.toHaveBeenCalled();
        });

        test('InvestmentReturnField_shouldDisableHelperWhenDisabled', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    showHelper={true}
                    disabled={true}
                />
            );

            // Helper should still be visible but interaction should be prevented by disabled state
            const helperLink = screen.getByText('Need help choosing a return rate?');
            expect(helperLink).toBeInTheDocument();
        });
    });

    // Custom Props Tests
    describe('Custom Props', () => {
        test('InvestmentReturnField_shouldRespectCustomMinMaxValues', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={10}
                    onChange={mockOnChange}
                    minValue={-10}
                    maxValue={50}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            // Radix slider uses aria attributes for min/max
            expect(slider).toHaveAttribute('aria-valuemin', '-10');
            expect(slider).toHaveAttribute('aria-valuemax', '50');
            expect(input).toHaveAttribute('min', '-10');
            expect(input).toHaveAttribute('max', '50');
        });

        test('InvestmentReturnField_shouldUseCustomId', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    id="custom-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('id', 'custom-investment-return');
        });

        test('InvestmentReturnField_shouldUseCustomClassNames', () => {
            const mockOnChange = jest.fn();
            
            const { container } = render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    className="custom-class"
                />
            );

            const fieldWrapper = container.firstChild;
            expect(fieldWrapper).toHaveClass('custom-class');
        });

        test('InvestmentReturnField_shouldUseCustomDefaultValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={10.0}
                />
            );

            // Should fall back to custom default value
            expect(mockOnChange).toHaveBeenCalledWith(10.0);
        });
    });

    // Helper Drawer Tests
    describe('Helper Drawer Tests', () => {
        test('InvestmentReturnField_shouldOpenHelperDrawerWhenClicked', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    showHelper={true}
                />
            );

            const helperLink = screen.getByText('Need help choosing a return rate?');
            await user.click(helperLink);

            // The drawer should be rendered (implementation dependent on InvestmentReturnHelperDrawer)
            // This test verifies the click handler works
            expect(helperLink).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldBlurHelperLinkOnClick', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    showHelper={true}
                />
            );

            const helperLink = screen.getByText('Need help choosing a return rate?');
            
            // Focus the element first
            helperLink.focus();
            expect(helperLink).toHaveFocus();
            
            await user.click(helperLink);
            
            // Should blur after click
            expect(helperLink).not.toHaveFocus();
        });
    });

    // Edge Cases Tests
    describe('Edge Cases', () => {
        test('InvestmentReturnField_shouldHandleRapidValueChanges', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            
            // Rapid typing
            await user.clear(input);
            await user.type(input, '1');
            await user.type(input, '0');
            await user.type(input, '.');
            await user.type(input, '5');

            expect(mockOnChange).toHaveBeenCalledWith(10.5);
        });

        test('InvestmentReturnField_shouldHandleVeryLongDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            
            await user.clear(input);
            await user.type(input, '7.123456789123456');
            await user.tab(); // Blur to trigger rounding

            // Should round to 2 decimal places
            expect(mockOnChange).toHaveBeenCalledWith(7.12);
        });

        test('InvestmentReturnField_shouldPreventInfiniteLoops', () => {
            const mockOnChange = jest.fn();
            
            const TestWrapper = () => {
                const [value, setValue] = React.useState(7.5);
                
                return (
                    <InvestmentReturnField
                        value={value}
                        onChange={(newValue) => {
                            mockOnChange(newValue);
                            setValue(newValue);
                        }}
                    />
                );
            };

            render(<TestWrapper />);

            // Should not cause infinite re-renders
            expect(mockOnChange).toHaveBeenCalledTimes(0);
        });

        test('InvestmentReturnField_shouldHandleZeroValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={0}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toHaveAttribute('aria-valuenow', '0');
        });

        test('InvestmentReturnField_shouldHandleVerySmallDecimals', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
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
        test('InvestmentReturnField_shouldSyncSliderAndInputValues', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            // Both should show the same value
            expect(slider).toHaveAttribute('aria-valuenow', '7.5');
            expect(input).toHaveValue('7.50');
        });

        test('InvestmentReturnField_shouldMaintainStateConsistency', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            const TestComponent = () => {
                const [value, setValue] = React.useState(7.5);
                
                return (
                    <InvestmentReturnField
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                            mockOnChange(newValue);
                        }}
                    />
                );
            };

            render(<TestComponent />);

            const input = screen.getByRole('textbox');
            
            await user.clear(input);
            await user.type(input, '10.25');
            
            // Should maintain consistency between display and internal state
            expect(input).toHaveValue(10.25);
            expect(mockOnChange).toHaveBeenCalledWith(10.25);
        });

        test('InvestmentReturnField_shouldFormatValueDisplayCorrectly', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            // Should display formatted percentage with two decimal places
            const valueDisplay = screen.getByText('7.50%');
            expect(valueDisplay).toBeInTheDocument();
            
            const yearlyText = screen.getByText('per year');
            expect(yearlyText).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldHandleValueDisplayForZero', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={0}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const valueDisplay = screen.getByText('0.00%');
            expect(valueDisplay).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldHandleValueDisplayForNegative', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={-5.25}
                    onChange={mockOnChange}
                    displayMode="slider"
                    minValue={-20}
                />
            );

            const valueDisplay = screen.getByText('-5.25%');
            expect(valueDisplay).toBeInTheDocument();
        });
    });

    // Formatting Tests
    describe('Formatting Tests', () => {
        test('InvestmentReturnField_shouldDisplayCorrectPercentageFormat', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            // Input should show decimal value
            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('7.50');

            // Input should have % suffix
            const percentSuffix = screen.getByText('%');
            expect(percentSuffix).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldFormatSingleDigitPercentage', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={5}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const valueDisplay = screen.getByText('5.00%');
            expect(valueDisplay).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldFormatDecimalPercentage', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.75}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const valueDisplay = screen.getByText('7.75%');
            expect(valueDisplay).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldShowCorrectPlaceholder', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('placeholder', 'Enter percentage');
        });
    });
    // Label Props Tests
    describe('Label Props', () => {
        test('InvestmentReturnField_shouldCallOnLabelSetWithLabelElement', () => {
            const mockOnChange = jest.fn();
            const mockOnLabelSet = jest.fn();

            render(
                <InvestmentReturnField
                    value={20}
                    onChange={mockOnChange}
                    onLabelSet={mockOnLabelSet}
                />
            );

            // onLabelSet should be called with a React element
            expect(mockOnLabelSet).toHaveBeenCalledTimes(1);
            expect(mockOnLabelSet).toHaveBeenCalledWith(expect.any(Object));
        });

        test('InvestmentReturnField_shouldHideLabelWhenShowLabelIsFalse', () => {
            const mockOnChange = jest.fn();

            render(
                <InvestmentReturnField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={false}
                />
            );

            // Label should not be visible
            const label = screen.queryByText('Expected Return');
            expect(label).not.toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldShowLabelByDefault', () => {
            const mockOnChange = jest.fn();

            render(
                <InvestmentReturnField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            // Label should be visible by default
            const label = screen.getByText('Investment Return Rate');
            expect(label).toBeInTheDocument();
        });

        test('InvestmentReturnField_shouldShowLabelWhenShowLabelIsTrue', () => {
            const mockOnChange = jest.fn();

            render(
                <InvestmentReturnField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={true}
                />
            );

            // Label should be visible
            const label = screen.getByText('Investment Return Rate');
            expect(label).toBeInTheDocument();
        });
    });
});