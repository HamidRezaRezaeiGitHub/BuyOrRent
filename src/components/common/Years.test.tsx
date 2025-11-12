import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YearsField } from './Years';

describe('YearsField', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // Basic Rendering Tests
    describe('Basic Rendering', () => {
        test('YearsField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const label = screen.getByText('Analysis Period');
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            const tooltip = screen.getByRole('button', { name: /more information about analysis period/i });

            expect(label).toBeInTheDocument();
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
            expect(tooltip).toBeInTheDocument();
        });

        test('YearsField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const slider = screen.getByRole('slider');
            const valueDisplay = screen.getByText('25');
            expect(slider).toBeInTheDocument();
            expect(valueDisplay).toBeInTheDocument();
            expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
        });

        test('YearsField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('spinbutton');
            expect(input).toBeInTheDocument();
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        });

        test('YearsField_shouldRenderCombinedMode', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
        });
    });

    // Value Validation Tests
    describe('Value Validation', () => {
        test('YearsField_shouldClampInitialValueToMinimum', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={-5}
                    onChange={mockOnChange}
                    minValue={1}
                    maxValue={50}
                />
            );

            // Should call onChange with clamped value
            expect(mockOnChange).toHaveBeenCalledWith(1);
        });

        test('YearsField_shouldClampInitialValueToMaximum', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={100}
                    onChange={mockOnChange}
                    minValue={1}
                    maxValue={50}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(50);
        });

        test('YearsField_shouldHandleNaNValue', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={25}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(25);
        });

        test('YearsField_shouldHandleInfinityValue', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={Infinity}
                    onChange={mockOnChange}
                    defaultValue={25}
                    maxValue={50}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(25);
        });

        test('YearsField_shouldHandleNegativeInfinityValue', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={-Infinity}
                    onChange={mockOnChange}
                    defaultValue={25}
                    minValue={1}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(25);
        });

        test('YearsField_shouldRoundDecimalValues', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25.7}
                    onChange={mockOnChange}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(26);
        });
    });

    // Slider Interaction Tests
    describe('Slider Interactions', () => {
        test('YearsField_shouldUpdateValueWhenSliderChanges', async () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');

            // Simulate slider keydown events (Radix Slider responds to keyboard)
            fireEvent.keyDown(slider, { key: 'ArrowRight' });

            expect(mockOnChange).toHaveBeenCalled();
        });

        test('YearsField_shouldClampSliderValueToRange', async () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    minValue={10}
                    maxValue={40}
                />
            );

            const slider = screen.getByRole('slider');

            // Test that slider has correct range attributes
            expect(slider).toHaveAttribute('aria-valuemin', '10');
            expect(slider).toHaveAttribute('aria-valuemax', '40');
        });

        test('YearsField_shouldHandleSliderInteraction', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');

            // Test that slider is present and interactive
            expect(slider).toBeInTheDocument();
            expect(slider).toHaveAttribute('aria-valuenow', '25');
        });
    });

    // Input Interaction Tests
    describe('Input Interactions', () => {
        test('YearsField_shouldUpdateValueOnValidInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');

            await user.clear(input);
            await user.type(input, '30');

            // Should provide immediate feedback for valid values
            expect(mockOnChange).toHaveBeenCalledWith(30);
        });

        test('YearsField_shouldShowFormattedValueWhenNotFocused', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={30}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            expect(input).toHaveValue(30); // Should show the validated value
        });

        test('YearsField_shouldShowUnformattedValueWhenFocused', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');

            await user.click(input);

            // When focused, should show unformatted value
            expect(input).toHaveValue(25);
        });

        test('YearsField_shouldClampValueOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    minValue={1}
                    maxValue={50}
                />
            );

            const input = screen.getByRole('spinbutton');

            await user.clear(input);
            await user.type(input, '100');
            await user.tab(); // Blur the input

            expect(mockOnChange).toHaveBeenCalledWith(50);
        });

        test('YearsField_shouldHandleEmptyInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    defaultValue={30}
                />
            );

            const input = screen.getByRole('spinbutton');

            await user.clear(input);
            await user.tab(); // Blur with empty input

            expect(mockOnChange).toHaveBeenCalledWith(30);
        });

        test('YearsField_shouldHandleInvalidInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    defaultValue={30}
                />
            );

            const input = screen.getByRole('spinbutton');

            await user.clear(input);
            await user.type(input, 'invalid');
            await user.tab(); // Blur with invalid input

            expect(mockOnChange).toHaveBeenCalledWith(30);
        });

        test('YearsField_shouldNotCallOnChangeForInvalidInputDuringTyping', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
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
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('YearsField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    id="test-years"
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');

            // Test Radix slider ARIA attributes (these are automatically set by Radix)
            expect(slider).toHaveAttribute('aria-valuemin', '1');
            expect(slider).toHaveAttribute('aria-valuemax', '50');
            expect(slider).toHaveAttribute('aria-valuenow', '25');

            expect(input).toHaveAttribute('aria-label', 'Analysis period in years, current value: 25');
        });

        test('YearsField_shouldHaveProperTooltipAccessibility', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    id="test-years"
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about analysis period/i });

            expect(tooltipTrigger).toHaveAttribute('aria-describedby', 'test-years-tooltip');
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('YearsField_shouldToggleTooltip', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    id="test-years"
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const tooltipTrigger = screen.getByRole('button', { name: /more information about analysis period/i });

            await user.click(tooltipTrigger);

            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'true');
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('YearsField_shouldDisableAllInputsWhenDisabled', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
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

        test('YearsField_shouldNotCallOnChangeWhenDisabled', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const input = screen.getByRole('spinbutton');

            // Try to interact with disabled input
            await user.type(input, '30');

            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    // Custom Props Tests
    describe('Custom Props', () => {
        test('YearsField_shouldRespectCustomMinMaxValues', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={15}
                    onChange={mockOnChange}
                    minValue={10}
                    maxValue={20}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');

            // Radix slider uses aria attributes for min/max
            expect(slider).toHaveAttribute('aria-valuemin', '10');
            expect(slider).toHaveAttribute('aria-valuemax', '20');
            expect(input).toHaveAttribute('min', '10');
            expect(input).toHaveAttribute('max', '20');
        });

        test('YearsField_shouldUseCustomId', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    id="custom-years"
                    value={25}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('spinbutton');
            expect(input).toHaveAttribute('id', 'custom-years');
        });

        test('YearsField_shouldUseCustomClassNames', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    className="custom-class"
                />
            );

            // Check if the main container has the custom class
            const container = screen.getByText('Analysis Period').closest('.custom-class');
            expect(container).toBeInTheDocument();
        });
    });

    // Edge Cases Tests
    describe('Edge Cases', () => {
        test('YearsField_shouldHandleRapidValueChanges', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');

            // Rapid typing
            await user.clear(input);
            await user.type(input, '123456');
            await user.tab();

            // Should handle rapid changes and clamp final value
            expect(mockOnChange).toHaveBeenLastCalledWith(50); // Assuming max is 50
        });

        test('YearsField_shouldHandleDecimalInputs', async () => {
            const user = userEvent.setup();
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');

            await user.clear(input);
            await user.type(input, '25.7');
            await user.tab();

            expect(mockOnChange).toHaveBeenCalledWith(26); // Should round
        });

        test('YearsField_shouldPreventInfiniteLoops', () => {
            const mockOnChange = vi.fn();

            // Render with a value that needs clamping
            const { rerender } = render(
                <YearsField
                    value={100}
                    onChange={mockOnChange}
                    maxValue={50}
                />
            );

            // Clear the mock and re-render with the same invalid value
            mockOnChange.mockClear();

            rerender(
                <YearsField
                    value={100}
                    onChange={mockOnChange}
                    maxValue={50}
                />
            );

            // Should not call onChange again if the value hasn't actually changed
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    // Integration Tests
    describe('Integration Tests', () => {
        test('YearsField_shouldSyncSliderAndInputValues', () => {
            const mockOnChange = vi.fn();

            render(
                <YearsField
                    value={25}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            const slider = screen.getByRole('slider');

            // Test that both components are present in combined mode
            expect(slider).toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();

            // Test that slider shows correct value
            expect(slider).toHaveAttribute('aria-valuenow', '25');
        });

        test('YearsField_shouldMaintainStateConsistency', async () => {
            const user = userEvent.setup();
            let currentValue = 25;
            const mockOnChange = vi.fn((newValue) => {
                currentValue = newValue; // Simulate parent updating value
            });

            const { rerender } = render(
                <YearsField
                    value={currentValue}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');

            // Focus and change value
            await user.click(input);
            await user.clear(input);
            await user.type(input, '30');

            // Value should update immediately for valid input
            expect(mockOnChange).toHaveBeenCalledWith(30);

            // Simulate parent re-render with new value
            rerender(
                <YearsField
                    value={currentValue}
                    onChange={mockOnChange}
                />
            );

            // Blur should not change the value again if it's already valid
            mockOnChange.mockClear();
            await user.tab();

            // Should not call onChange again since 30 is already valid and matches validatedValue
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });
});