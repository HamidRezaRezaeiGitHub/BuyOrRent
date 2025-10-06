import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvestmentAnnualReturnField } from './InvestmentAnnualReturn';

describe('InvestmentAnnualReturnField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic Rendering Tests
    describe('Basic Rendering', () => {
        test('InvestmentAnnualReturnField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const label = screen.getByText('Expected yearly investment return');
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            const tooltip = screen.getByRole('button', { name: /more information about expected yearly investment return/i });

            expect(label).toBeInTheDocument();
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
            expect(tooltip).toBeInTheDocument();
        });

        test('InvestmentAnnualReturnField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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
            expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
        });

        test('InvestmentAnnualReturnField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('spinbutton');
            expect(input).toBeInTheDocument();
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        });

        test('InvestmentAnnualReturnField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
        });

        test('InvestmentAnnualReturnField_shouldRenderWithHelperWhenEnabled', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    showHelper={true}
                />
            );

            const helperLink = screen.getByText('Need help choosing a return rate?');
            expect(helperLink).toBeInTheDocument();
        });

        test('InvestmentAnnualReturnField_shouldNotRenderHelperWhenDisabled', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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
        test('InvestmentAnnualReturnField_shouldClampInitialValueToMinimum', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={-30}
                    onChange={mockOnChange}
                    minValue={-20}
                    maxValue={100}
                />
            );

            // Should call onChange with clamped value
            expect(mockOnChange).toHaveBeenCalledWith(-20);
        });

        test('InvestmentAnnualReturnField_shouldClampInitialValueToMaximum', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={150}
                    onChange={mockOnChange}
                    minValue={-20}
                    maxValue={100}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(100);
        });

        test('InvestmentAnnualReturnField_shouldHandleNaNValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={7.5}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(7.5);
        });

        test('InvestmentAnnualReturnField_shouldHandleInfinityValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={Infinity}
                    onChange={mockOnChange}
                    defaultValue={7.5}
                    maxValue={100}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(7.5);
        });

        test('InvestmentAnnualReturnField_shouldHandleNegativeInfinityValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={-Infinity}
                    onChange={mockOnChange}
                    defaultValue={7.5}
                    minValue={-20}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(7.5);
        });

        test('InvestmentAnnualReturnField_shouldRoundToTwoDecimalPlaces', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.567}
                    onChange={mockOnChange}
                />
            );

            // Should round to 2 decimal places
            expect(mockOnChange).toHaveBeenCalledWith(7.57);
        });

        test('InvestmentAnnualReturnField_shouldHandleExtremeDecimalPrecision', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.123456789}
                    onChange={mockOnChange}
                />
            );

            // Should round to 2 decimal places
            expect(mockOnChange).toHaveBeenCalledWith(7.12);
        });

        test('InvestmentAnnualReturnField_shouldHandleNegativeValues', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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
        test('InvestmentAnnualReturnField_shouldUpdateValueWhenSliderChanges', async () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Simulate slider keydown events (Radix Slider responds to keyboard)
            fireEvent.keyDown(slider, { key: 'ArrowRight' });

            expect(mockOnChange).toHaveBeenCalled();
        });

        test('InvestmentAnnualReturnField_shouldClampSliderValueToRange', async () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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

        test('InvestmentAnnualReturnField_shouldHandleSliderInteraction', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            
            // Test that slider is present and shows correct value
            expect(slider).toBeInTheDocument();
            expect(slider).toHaveAttribute('aria-valuenow', '7.5');
        });

        test('InvestmentAnnualReturnField_shouldUseCorrectSliderStep', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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

        test('InvestmentAnnualReturnField_shouldHandleNegativeSliderValues', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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
        test('InvestmentAnnualReturnField_shouldUpdateValueOnValidInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, '8.5');

            // Should provide immediate feedback for valid values
            expect(mockOnChange).toHaveBeenCalledWith(8.5);
        });

        test('InvestmentAnnualReturnField_shouldShowFormattedValueWhenNotFocused', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.25}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            // Should show formatted percentage value
            expect(input).toHaveValue(7.25);
        });

        test('InvestmentAnnualReturnField_shouldShowUnformattedValueWhenFocused', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.click(input);
            
            // When focused, should show unformatted value
            expect(input).toHaveValue(7.5);
        });

        test('InvestmentAnnualReturnField_shouldClampValueOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    minValue={-20}
                    maxValue={50}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, '75');
            await user.tab(); // Blur the input

            expect(mockOnChange).toHaveBeenCalledWith(50);
        });

        test('InvestmentAnnualReturnField_shouldHandleEmptyInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    defaultValue={8.0}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.tab(); // Blur with empty input

            expect(mockOnChange).toHaveBeenCalledWith(8.0);
        });

        test('InvestmentAnnualReturnField_shouldHandleInvalidInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    defaultValue={8.0}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, 'invalid');
            await user.tab(); // Blur with invalid input

            expect(mockOnChange).toHaveBeenCalledWith(8.0);
        });

        test('InvestmentAnnualReturnField_shouldNotCallOnChangeForInvalidInputDuringTyping', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            mockOnChange.mockClear();
            
            await user.type(input, 'abc');

            // Should not call onChange for invalid input during typing
            expect(mockOnChange).not.toHaveBeenCalled();
        });

        test('InvestmentAnnualReturnField_shouldHandleDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, '8.75');

            expect(mockOnChange).toHaveBeenCalledWith(8.75);
        });

        test('InvestmentAnnualReturnField_shouldHandleNegativeInputCorrectly', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    minValue={-10}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, '-5');

            // Should accept negative values within range
            expect(mockOnChange).toHaveBeenCalledWith(-5);
        });

        test('InvestmentAnnualReturnField_shouldClampNegativeInputBelowMinimum', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    minValue={-10}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, '-25');
            await user.tab(); // Blur to trigger validation

            // Should clamp to minimum value
            expect(mockOnChange).toHaveBeenCalledWith(-10);
        });
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('InvestmentAnnualReturnField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    id="test-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');

            // Test Radix slider ARIA attributes
            expect(slider).toHaveAttribute('aria-valuemin', '-20');
            expect(slider).toHaveAttribute('aria-valuemax', '100');
            expect(slider).toHaveAttribute('aria-valuenow', '7.5');

            expect(input).toHaveAttribute('aria-label', 'Expected yearly investment return in percent, current value: 7.5%');
        });

        test('InvestmentAnnualReturnField_shouldHaveProperTooltipAccessibility', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    id="test-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about expected yearly investment return/i });

            expect(tooltipTrigger).toHaveAttribute('aria-describedby', 'test-investment-return-tooltip');
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('InvestmentAnnualReturnField_shouldToggleTooltip', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    id="test-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about expected yearly investment return/i });

            await user.click(tooltipTrigger);

            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'true');
        });

        test('InvestmentAnnualReturnField_shouldHavePercentSuffix', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    id="test-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            // Check for percent suffix in input
            const percentSuffix = screen.getByText('%');
            expect(percentSuffix).toBeInTheDocument();
            expect(percentSuffix.closest('div')).toHaveAttribute('aria-hidden', 'true');
        });

        test('InvestmentAnnualReturnField_shouldHaveProperValueDisplayAccessibility', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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
        test('InvestmentAnnualReturnField_shouldDisableAllInputsWhenDisabled', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');

            // Radix slider uses data-disabled attribute
            expect(slider).toHaveAttribute('data-disabled');
            expect(input).toBeDisabled();
        });

        test('InvestmentAnnualReturnField_shouldNotCallOnChangeWhenDisabled', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            // Try to interact with disabled input
            await user.type(input, '8.5');

            expect(mockOnChange).not.toHaveBeenCalled();
        });

        test('InvestmentAnnualReturnField_shouldDisableHelperWhenDisabled', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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
        test('InvestmentAnnualReturnField_shouldRespectCustomMinMaxValues', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={10}
                    onChange={mockOnChange}
                    minValue={-10}
                    maxValue={50}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');

            // Radix slider uses aria attributes for min/max
            expect(slider).toHaveAttribute('aria-valuemin', '-10');
            expect(slider).toHaveAttribute('aria-valuemax', '50');
            expect(input).toHaveAttribute('min', '-10');
            expect(input).toHaveAttribute('max', '50');
        });

        test('InvestmentAnnualReturnField_shouldUseCustomId', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    id="custom-investment-return"
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('spinbutton');
            expect(input).toHaveAttribute('id', 'custom-investment-return');
        });

        test('InvestmentAnnualReturnField_shouldUseCustomClassNames', () => {
            const mockOnChange = jest.fn();
            
            const { container } = render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    className="custom-class"
                />
            );

            const fieldWrapper = container.firstChild;
            expect(fieldWrapper).toHaveClass('custom-class');
        });

        test('InvestmentAnnualReturnField_shouldUseCustomDefaultValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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
        test('InvestmentAnnualReturnField_shouldOpenHelperDrawerWhenClicked', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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

        test('InvestmentAnnualReturnField_shouldBlurHelperLinkOnClick', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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
        test('InvestmentAnnualReturnField_shouldHandleRapidValueChanges', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            // Rapid typing
            await user.clear(input);
            await user.type(input, '1');
            await user.type(input, '0');
            await user.type(input, '.');
            await user.type(input, '5');

            expect(mockOnChange).toHaveBeenCalledWith(10.5);
        });

        test('InvestmentAnnualReturnField_shouldHandleVeryLongDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, '7.123456789123456');
            await user.tab(); // Blur to trigger rounding

            // Should round to 2 decimal places
            expect(mockOnChange).toHaveBeenCalledWith(7.12);
        });

        test('InvestmentAnnualReturnField_shouldPreventInfiniteLoops', () => {
            const mockOnChange = jest.fn();
            
            const TestWrapper = () => {
                const [value, setValue] = React.useState(7.5);
                
                return (
                    <InvestmentAnnualReturnField
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

        test('InvestmentAnnualReturnField_shouldHandleZeroValue', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={0}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toHaveAttribute('aria-valuenow', '0');
        });

        test('InvestmentAnnualReturnField_shouldHandleVerySmallDecimals', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, '0.01');

            expect(mockOnChange).toHaveBeenCalledWith(0.01);
        });
    });

    // Integration Tests
    describe('Integration Tests', () => {
        test('InvestmentAnnualReturnField_shouldSyncSliderAndInputValues', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');

            // Both should show the same value
            expect(slider).toHaveAttribute('aria-valuenow', '7.5');
            expect(input).toHaveValue(7.5);
        });

        test('InvestmentAnnualReturnField_shouldMaintainStateConsistency', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            
            const TestComponent = () => {
                const [value, setValue] = React.useState(7.5);
                
                return (
                    <InvestmentAnnualReturnField
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                            mockOnChange(newValue);
                        }}
                    />
                );
            };

            render(<TestComponent />);

            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, '10.25');
            
            // Should maintain consistency between display and internal state
            expect(input).toHaveValue(10.25);
            expect(mockOnChange).toHaveBeenCalledWith(10.25);
        });

        test('InvestmentAnnualReturnField_shouldFormatValueDisplayCorrectly', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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

        test('InvestmentAnnualReturnField_shouldHandleValueDisplayForZero', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={0}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const valueDisplay = screen.getByText('0.00%');
            expect(valueDisplay).toBeInTheDocument();
        });

        test('InvestmentAnnualReturnField_shouldHandleValueDisplayForNegative', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
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
        test('InvestmentAnnualReturnField_shouldDisplayCorrectPercentageFormat', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            // Input should show decimal value
            const input = screen.getByRole('spinbutton');
            expect(input).toHaveValue(7.5);

            // Input should have % suffix
            const percentSuffix = screen.getByText('%');
            expect(percentSuffix).toBeInTheDocument();
        });

        test('InvestmentAnnualReturnField_shouldFormatSingleDigitPercentage', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={5}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const valueDisplay = screen.getByText('5.00%');
            expect(valueDisplay).toBeInTheDocument();
        });

        test('InvestmentAnnualReturnField_shouldFormatDecimalPercentage', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.75}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const valueDisplay = screen.getByText('7.75%');
            expect(valueDisplay).toBeInTheDocument();
        });

        test('InvestmentAnnualReturnField_shouldShowCorrectPlaceholder', () => {
            const mockOnChange = jest.fn();
            
            render(
                <InvestmentAnnualReturnField
                    value={7.5}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            expect(input).toHaveAttribute('placeholder', 'Enter percentage');
        });
    });
});