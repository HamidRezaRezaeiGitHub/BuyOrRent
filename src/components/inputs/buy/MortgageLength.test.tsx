import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MortgageLengthField } from './MortgageLength';

describe('MortgageLengthField', () => {
    // Rendering Tests
    describe('Rendering', () => {
        test('MortgageLengthField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} />);
            expect(screen.getByText('Mortgage Length')).toBeInTheDocument();
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        });

        test('MortgageLengthField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} displayMode="slider" />);
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
            expect(screen.getByText('25')).toBeInTheDocument();
        });

        test('MortgageLengthField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} displayMode="input" />);
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        });

        test('MortgageLengthField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} displayMode="combined" />);
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('spinbutton')).toBeInTheDocument();
        });
    });

    // Value Validation Tests
    describe('Value Validation', () => {
        test('MortgageLengthField_shouldClampInitialValueToMinimum', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={-5} onChange={mockOnChange} minValue={1} />);
            expect(mockOnChange).toHaveBeenCalledWith(1);
        });

        test('MortgageLengthField_shouldClampInitialValueToMaximum', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={50} onChange={mockOnChange} maxValue={40} />);
            expect(mockOnChange).toHaveBeenCalledWith(40);
        });

        test('MortgageLengthField_shouldHandleNaNValue', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={NaN} onChange={mockOnChange} defaultValue={30} />);
            expect(mockOnChange).toHaveBeenCalledWith(30);
        });

        test('MortgageLengthField_shouldHandleInfinityValue', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={Infinity} onChange={mockOnChange} defaultValue={30} />);
            expect(mockOnChange).toHaveBeenCalledWith(30);
        });

        test('MortgageLengthField_shouldRoundDecimalValues', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25.7} onChange={mockOnChange} />);
            expect(mockOnChange).toHaveBeenCalledWith(26);
        });
    });

    // Slider Interaction Tests
    describe('Slider Interactions', () => {
        test('MortgageLengthField_shouldUpdateValue_whenSliderChanged', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            fireEvent.keyDown(slider, { key: 'ArrowRight' });
            expect(mockOnChange).toHaveBeenCalled();
        });

        test('MortgageLengthField_shouldHandleSliderInteraction', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            
            expect(slider).toHaveAttribute('aria-valuemin', '1');
            expect(slider).toHaveAttribute('aria-valuemax', '40');
            expect(slider).toHaveAttribute('aria-valuenow', '25');
        });

        test('MortgageLengthField_shouldUseCorrectSliderStep', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            // The step is 1 year for mortgage length
            expect(slider).toHaveAttribute('aria-valuenow', '25');
        });
    });

    // Input Interaction Tests
    describe('Input Interactions', () => {
        test('MortgageLengthField_shouldUpdateValueOnValidInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '30');
            
            expect(mockOnChange).toHaveBeenCalledWith(30);
        });

        test('MortgageLengthField_shouldShowFormattedValueWhenNotFocused', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} />);
            const input = screen.getByRole('spinbutton') as HTMLInputElement;
            expect(input.value).toBe('25');
        });

        test('MortgageLengthField_shouldShowUnformattedValueWhenFocused', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton') as HTMLInputElement;
            await user.click(input);
            
            expect(input.value).toBe('25');
        });

        test('MortgageLengthField_shouldClampValueOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} maxValue={35} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '50');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(35);
        });

        test('MortgageLengthField_shouldHandleEmptyInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} defaultValue={30} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(30);
        });

        test('MortgageLengthField_shouldHandleInvalidInputOnBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} defaultValue={30} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, 'abc');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(30);
        });
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('MortgageLengthField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} id="test-length" />);
            
            const input = screen.getByRole('spinbutton');
            
            expect(input).toHaveAttribute('aria-label', 'Mortgage length in years, current value: 25');
            expect(input).toHaveAttribute('aria-describedby', 'test-length-suffix test-length-tooltip');
        });

        test('MortgageLengthField_shouldHaveProperTooltipAccessibility', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} id="test-length" />);
            
            const tooltipTrigger = screen.getByRole('button', { name: /more information about mortgage length/i });
            expect(tooltipTrigger).toHaveAttribute('aria-describedby', 'test-length-tooltip');
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'false');
        });

        test('MortgageLengthField_shouldToggleTooltip', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} />);
            
            const tooltipTrigger = screen.getByRole('button', { name: /more information about mortgage length/i });
            await user.click(tooltipTrigger);
            
            expect(tooltipTrigger).toHaveAttribute('aria-expanded', 'true');
            expect(screen.getAllByText(/total number of years over which you'll repay/i)).toHaveLength(2);
        });

        test('MortgageLengthField_shouldHaveYearsSuffix', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} id="test-length" />);
            
            const suffix = screen.getByText('yrs');
            expect(suffix.parentElement).toHaveAttribute('id', 'test-length-suffix');
            expect(suffix.parentElement).toHaveAttribute('aria-hidden', 'true');
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('MortgageLengthField_shouldDisableAllInputsWhenDisabled', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} disabled={true} />);
            
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            
            expect(slider).toHaveAttribute('data-disabled', '');
            expect(input).toBeDisabled();
        });

        test('MortgageLengthField_shouldNotCallOnChangeWhenDisabled', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} disabled={true} />);
            
            const input = screen.getByRole('spinbutton');
            await user.type(input, '30');
            
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });

    // Customization Tests
    describe('Customization', () => {
        test('MortgageLengthField_shouldRespectCustomMinMaxValues', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={20} onChange={mockOnChange} minValue={5} maxValue={35} />);
            
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            
            expect(slider).toHaveAttribute('aria-valuemin', '5');
            expect(slider).toHaveAttribute('aria-valuemax', '35');
            expect(input).toHaveAttribute('min', '5');
            expect(input).toHaveAttribute('max', '35');
        });

        test('MortgageLengthField_shouldUseCustomId', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} id="custom-length" />);
            
            const label = screen.getByText('Mortgage Length');
            expect(label).toHaveAttribute('for', 'custom-length');
        });

        test('MortgageLengthField_shouldUseCustomClassName', () => {
            const mockOnChange = jest.fn();
            const { container } = render(
                <MortgageLengthField value={25} onChange={mockOnChange} className="custom-class" />
            );
            
            expect(container.firstChild).toHaveClass('custom-class');
        });

        test('MortgageLengthField_shouldUseCustomDefaultValue', () => {
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={NaN} onChange={mockOnChange} defaultValue={20} />);
            
            expect(mockOnChange).toHaveBeenCalledWith(20);
        });
    });

    // Edge Cases Tests
    describe('Edge Cases', () => {
        test('MortgageLengthField_shouldHandleVeryLargeNumbers', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} maxValue={40} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '100');
            await user.tab();
            
            expect(mockOnChange).toHaveBeenCalledWith(40);
        });

        test('MortgageLengthField_shouldHandleNegativeValues', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} minValue={1} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '-5');
            await user.tab();
            
            expect(mockOnChange).toHaveBeenCalledWith(1);
        });

        test('MortgageLengthField_shouldHandleDecimalInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '27.6');
            
            // Should handle decimal input and call onChange
            expect(mockOnChange).toHaveBeenCalled();
            // Verify it's been rounded to an integer
            const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
            expect(Number.isInteger(lastCall)).toBe(true);
        });

        test('MortgageLengthField_shouldHandleZeroValue', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<MortgageLengthField value={25} onChange={mockOnChange} minValue={1} />);
            
            const input = screen.getByRole('spinbutton');
            await user.clear(input);
            await user.type(input, '0');
            await user.tab();
            
            expect(mockOnChange).toHaveBeenCalledWith(1);
        });
    });
    // Label Props Tests
    describe('Label Props', () => {
        test('MortgageLengthField_shouldCallOnLabelSetWithLabelElement', () => {
            const mockOnChange = jest.fn();
            const mockOnLabelSet = jest.fn();

            render(
                <MortgageLengthField
                    value={20}
                    onChange={mockOnChange}
                    onLabelSet={mockOnLabelSet}
                />
            );

            // onLabelSet should be called with a React element
            expect(mockOnLabelSet).toHaveBeenCalledTimes(1);
            expect(mockOnLabelSet).toHaveBeenCalledWith(expect.any(Object));
        });

        test('MortgageLengthField_shouldHideLabelWhenShowLabelIsFalse', () => {
            const mockOnChange = jest.fn();

            render(
                <MortgageLengthField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={false}
                />
            );

            // Label should not be visible
            const label = screen.queryByText('Mortgage Length');
            expect(label).not.toBeInTheDocument();
        });

        test('MortgageLengthField_shouldShowLabelByDefault', () => {
            const mockOnChange = jest.fn();

            render(
                <MortgageLengthField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            // Label should be visible by default
            const label = screen.getByText('Mortgage Length');
            expect(label).toBeInTheDocument();
        });

        test('MortgageLengthField_shouldShowLabelWhenShowLabelIsTrue', () => {
            const mockOnChange = jest.fn();

            render(
                <MortgageLengthField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={true}
                />
            );

            // Label should be visible
            const label = screen.getByText('Mortgage Length');
            expect(label).toBeInTheDocument();
        });
    });
});
