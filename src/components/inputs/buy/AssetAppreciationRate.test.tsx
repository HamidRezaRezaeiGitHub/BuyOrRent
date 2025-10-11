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

        test('AssetAppreciationRateField_shouldHideLabel_whenShowLabelIsFalse', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} showLabel={false} />);
            expect(screen.queryByText('Property Appreciation')).not.toBeInTheDocument();
        });

        test('AssetAppreciationRateField_shouldHideDescription_whenShowDescriptionIsFalse', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} showDescription={false} />);
            expect(screen.queryByText('Annual property value appreciation rate')).not.toBeInTheDocument();
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

        test('AssetAppreciationRateField_shouldAcceptNegativeValues', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={-2.5} onChange={mockOnChange} minValue={-5} />);
            expect(mockOnChange).not.toHaveBeenCalled(); // Value is valid
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
            expect(slider).toHaveAttribute('aria-valuenow', '3');
        });
    });

    // Input Interaction Tests
    describe('Input Interactions', () => {
        test('AssetAppreciationRateField_shouldUpdateValue_whenInputChanged', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            const input = screen.getByRole('spinbutton');
            
            await user.clear(input);
            await user.type(input, '5');
            
            expect(mockOnChange).toHaveBeenCalled();
        });

        test('AssetAppreciationRateField_shouldFormatValue_onBlur', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            const input = screen.getByRole('spinbutton');
            
            await user.click(input);
            await user.clear(input);
            await user.type(input, '5.5');
            await user.tab(); // Blur the input
            
            // After blur, onChange should have been called with the new value
            expect(mockOnChange).toHaveBeenCalledWith(5.5);
        });

        test('AssetAppreciationRateField_shouldClampValue_onBlur_whenBelowMin', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} minValue={-5} />);
            const input = screen.getByRole('spinbutton');
            
            await user.click(input);
            await user.clear(input);
            await user.type(input, '-10');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(-5);
        });

        test('AssetAppreciationRateField_shouldClampValue_onBlur_whenAboveMax', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} maxValue={20} />);
            const input = screen.getByRole('spinbutton');
            
            await user.click(input);
            await user.clear(input);
            await user.type(input, '25');
            await user.tab(); // Blur the input
            
            expect(mockOnChange).toHaveBeenCalledWith(20);
        });

        test('AssetAppreciationRateField_shouldUseDefaultValue_onBlur_whenInvalid', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} defaultValue={3.0} />);
            const input = screen.getByRole('spinbutton');
            
            await user.click(input);
            await user.clear(input);
            await user.tab(); // Blur with empty input
            
            expect(mockOnChange).toHaveBeenCalledWith(3.0);
        });

        test('AssetAppreciationRateField_shouldShowUnformattedValue_onFocus', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.5} onChange={mockOnChange} />);
            const input = screen.getByRole('spinbutton');
            
            await user.click(input);
            
            expect(input).toHaveValue(3.5);
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('AssetAppreciationRateField_shouldDisableSlider_whenDisabled', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} disabled />);
            const slider = screen.getByRole('slider');
            // Check for the data-disabled attribute which is used by radix-ui
            expect(slider).toHaveAttribute('data-disabled');
        });

        test('AssetAppreciationRateField_shouldDisableInput_whenDisabled', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} disabled />);
            const input = screen.getByRole('spinbutton');
            expect(input).toBeDisabled();
        });
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('AssetAppreciationRateField_shouldHaveProperAriaLabels', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            
            // Check for proper aria attributes
            expect(slider).toHaveAttribute('aria-valuenow');
            expect(input).toHaveAttribute('aria-describedby');
        });

        test('AssetAppreciationRateField_shouldHaveTooltip', async () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            
            const infoButton = screen.getByLabelText('More information about Property Appreciation Rate');
            expect(infoButton).toBeInTheDocument();
        });
    });

    // Custom Range Tests
    describe('Custom Range', () => {
        test('AssetAppreciationRateField_shouldAcceptCustomMinMax', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={5} onChange={mockOnChange} minValue={0} maxValue={10} />);
            const slider = screen.getByRole('slider');
            
            expect(slider).toHaveAttribute('aria-valuemin', '0');
            expect(slider).toHaveAttribute('aria-valuemax', '10');
        });

        test('AssetAppreciationRateField_shouldUseCustomDefaultValue', () => {
            const mockOnChange = jest.fn();
            render(<AssetAppreciationRateField value={NaN} onChange={mockOnChange} defaultValue={5.0} />);
            expect(mockOnChange).toHaveBeenCalledWith(5.0);
        });
    });

    // Integration Tests
    describe('Integration', () => {
        test('AssetAppreciationRateField_shouldMaintainSync_betweenSliderAndInput', async () => {
            const user = userEvent.setup();
            const mockOnChange = jest.fn();
            const { rerender } = render(<AssetAppreciationRateField value={3.0} onChange={mockOnChange} />);
            
            const input = screen.getByRole('spinbutton');
            await user.click(input);
            await user.clear(input);
            await user.type(input, '7');
            
            // Simulate parent component updating the value prop
            rerender(<AssetAppreciationRateField value={7.0} onChange={mockOnChange} />);
            
            expect(input).toHaveValue(7);
        });
    });
});
