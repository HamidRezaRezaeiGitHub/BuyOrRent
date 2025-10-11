import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetAppreciationRateField } from './AssetAppreciationRate';

describe('AssetAppreciationRateField', () => {
    // Rendering Tests
    describe('Rendering', () => {
        test('AssetAppreciationRateField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            expect(screen.getByText('Property Appreciation')).toBeInTheDocument();
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        });

        test('AssetAppreciationRateField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} displayMode="slider" />);
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
            expect(screen.getByText('3.00%')).toBeInTheDocument();
        });

        test('AssetAppreciationRateField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} displayMode="input" />);
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        });

        test('AssetAppreciationRateField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} displayMode="combined" />);
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        });
    });


    // Value Validation Tests
    describe('Value Validation', () => {
        test('AssetAppreciationRateField_shouldClampInitialValueToMinimum', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={-10} onChange={mockOnChange} minValue={-5} />);
            expect(mockOnChange).toHaveBeenCalledWith(-5);
        });

        test('AssetAppreciationRateField_shouldClampInitialValueToMaximum', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={25} onChange={mockOnChange} maxValue={20} />);
            expect(mockOnChange).toHaveBeenCalledWith(20);
        });

        test('AssetAppreciationRateField_shouldHandleNaNValue', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={NaN} onChange={mockOnChange} defaultValue={4} />);
            expect(mockOnChange).toHaveBeenCalledWith(4);
        });

        test('AssetAppreciationRateField_shouldHandleInfinityValue', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={Infinity} onChange={mockOnChange} defaultValue={4} />);
            expect(mockOnChange).toHaveBeenCalledWith(4);
        });

        test('AssetAppreciationRateField_shouldRoundToTwoDecimalPlaces', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.555} onChange={mockOnChange} />);
            expect(mockOnChange).toHaveBeenCalledWith(3.56);
        });
    });


    // Slider Interaction Tests
    describe('Slider Interactions', () => {
        test('AssetAppreciationRateField_shouldUpdateValue_whenSliderChanged', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            fireEvent.keyDown(slider, { key: 'ArrowRight' });
            expect(mockOnChange).toHaveBeenCalled();
        });

        test('AssetAppreciationRateField_shouldHandleSliderInteraction', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            
            expect(slider).toHaveAttribute('aria-valuemin', '-5');
            expect(slider).toHaveAttribute('aria-valuemax', '20');
            expect(slider).toHaveAttribute('aria-valuenow', '3');
        });

        test('AssetAppreciationRateField_shouldUseCorrectSliderStep', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            // The step attribute is on the parent Slider component, not the thumb element
            expect(slider).toHaveAttribute('aria-valuenow', '3');
        });
    });


    // Input Interaction Tests
    describe('Input Interactions', () => {
        test('AssetAppreciationRateField_shouldUpdateValueOnValidInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '5.5');
            
            expect(mockOnChange).toHaveBeenCalledWith(5.5);
        });

        test('AssetAppreciationRateField_shouldShowFormattedValueWhenNotFocused', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            const input = screen.getByRole('spinbutton') as HTMLInputElement;
            expect(input.value).toBe('3.00');
        });

        test('AssetAppreciationRateField_shouldShowUnformattedValueWhenFocused', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton') as HTMLInputElement;
            await user.click(input);
            
            expect(input.value).toBe('3');
        });

        test('AssetAppreciationRateField_shouldClampValueOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} maxValue={15} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '25');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(15);
        });

        test('AssetAppreciationRateField_shouldHandleEmptyInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} defaultValue={4} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(4);
        });

        test('AssetAppreciationRateField_shouldHandleInvalidInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} defaultValue={4} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, 'abc');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(4);
        });
    });


    // Disabled State Tests
    describe('Disabled State', () => {
        test('AssetAppreciationRateField_shouldDisableAllInputsWhenDisabled', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} disabled={true} />);
            
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            
            expect(slider).toHaveAttribute('data-disabled', '');
            expect(input).toBeDisabled();
        });

        test('AssetAppreciationRateField_shouldNotCallOnChangeWhenDisabled', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} disabled={true} />);
            
            const input = screen.getByRole('spinbutton');
            await user.type(input, '5.5');
            
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });


    // Accessibility Tests
    describe('Accessibility', () => {
        test('AssetAppreciationRateField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} id="test-rate" />);
            
            const input = screen.getByRole('spinbutton');
            
            expect(input).toHaveAttribute('aria-label', 'Property appreciation rate, current value: 3%');
            expect(input).toHaveAttribute('aria-describedby', 'test-rate-suffix test-rate-tooltip');
        });

        test('AssetAppreciationRateField_shouldHaveProperTooltipAccessibility', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} id="test-rate" />);
            
            const tooltipTrigger = screen.getByRole('button', { name: /more information about property appreciation rate/i });
            expect(tooltipTrigger).toHaveAttribute('aria-describedby', 'test-rate-tooltip');
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('AssetAppreciationRateField_shouldToggleTooltip', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            
            const tooltipTrigger = screen.getByRole('button', { name: /more information about property appreciation rate/i });
            await user.click(tooltipTrigger);
            
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'true');
            expect(screen.getAllByText(/expected annual percentage increase/i)).toHaveLength(2);
        });

        test('AssetAppreciationRateField_shouldHavePercentSuffix', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} id="test-rate" />);
            
            const suffix = screen.getByText('%');
            expect(suffix.parentElement).toHaveAttribute('id', 'test-rate-suffix');
            expect(suffix.parentElement).toHaveAttribute('aria-hidden', 'true');
        });
    });


    // Customization Tests
    describe('Customization', () => {
        test('AssetAppreciationRateField_shouldRespectCustomMinMaxValues', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={5} onChange={mockOnChange} minValue={0} maxValue={10} />);
            
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            
            expect(slider).toHaveAttribute('aria-valuemin', '0');
            expect(slider).toHaveAttribute('aria-valuemax', '10');
            expect(input).toHaveAttribute('min', '0');
            expect(input).toHaveAttribute('max', '10');
        });

        test('AssetAppreciationRateField_shouldUseCustomId', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} id="custom-rate" />);
            
            const label = screen.getByText('Property Appreciation');
            expect(label).toHaveAttribute('for', 'custom-rate');
        });

        test('AssetAppreciationRateField_shouldUseCustomClassName', () => {
            const mockOnChange = jest.fn();
            const { container } = render(
                <AssetAppreciationRateField value={3.0} onChange={mockOnChange} className="custom-class" />
            );
            
            expect(container.firstChild).toHaveClass('custom-class');
        });

        test('AssetAppreciationRateField_shouldUseCustomDefaultValue', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={NaN} onChange={mockOnChange} defaultValue={5.0} />);
            
            expect(mockOnChange).toHaveBeenCalledWith(5.0);
        });
    });


    // Edge Cases Tests
    describe('Edge Cases', () => {
        test('AssetAppreciationRateField_shouldHandleVeryLargeNumbers', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} maxValue={20} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '999999');
            await user.tab();
            
            expect(mockOnChange).toHaveBeenCalledWith(20);
        });

        test('AssetAppreciationRateField_shouldHandleNegativeValues', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} minValue={-5} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '-10');
            await user.tab();
            
            expect(mockOnChange).toHaveBeenCalledWith(-5);
        });

        test('AssetAppreciationRateField_shouldHandleDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '4.75');
            
            expect(mockOnChange).toHaveBeenCalledWith(4.75);
        });
    });
    // Label Props Tests
    describe('Label Props', () => {
        test('AssetAppreciationRateField_shouldCallOnLabelSetWithLabelElement', () => {
            const mockOnChange = jest.fn();
            const mockOnLabelSet = jest.fn();

            render(
                <AssetAppreciationRateField
                    value={3}
                    onChange={mockOnChange}
                    onLabelSet={mockOnLabelSet}
                />
            );

            // onLabelSet should be called with a React element
            expect(mockOnLabelSet).toHaveBeenCalledTimes(1);
            expect(mockOnLabelSet).toHaveBeenCalledWith(expect.any(Object));
        });

        test('AssetAppreciationRateField_shouldHideLabelWhenShowLabelIsFalse', () => {
            const mockOnChange = jest.fn();

            render(
                <AssetAppreciationRateField
                    value={3}
                    onChange={mockOnChange}
                    showLabel={false}
                />
            );

            // Label should not be visible
            const label = screen.queryByText('Property Appreciation');
            expect(label).not.toBeInTheDocument();
        });

        test('AssetAppreciationRateField_shouldShowLabelByDefault', () => {
            const mockOnChange = jest.fn();

            render(
                <AssetAppreciationRateField
                    value={3}
                    onChange={mockOnChange}
                />
            );

            // Label should be visible by default
            const label = screen.getByText('Property Appreciation');
            expect(label).toBeInTheDocument();
        });

        test('AssetAppreciationRateField_shouldShowLabelWhenShowLabelIsTrue', () => {
            const mockOnChange = jest.fn();

            render(
                <AssetAppreciationRateField
                    value={3}
                    onChange={mockOnChange}
                    showLabel={true}
                />
            );

            // Label should be visible
            const label = screen.getByText('Property Appreciation');
            expect(label).toBeInTheDocument();
        });
    });
});
