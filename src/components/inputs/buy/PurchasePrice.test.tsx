import { fireEvent, render, screen } from '@testing-library/react';
import { PurchasePriceField } from './PurchasePrice';

describe('PurchasePriceField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic Rendering Tests
    describe('Basic Rendering', () => {
        test('PurchasePriceField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                />
            );

            const label = screen.getByText('Purchase Price');
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('spinbutton');
            const tooltip = screen.getByRole('button', { name: /more information about purchase price/i });

            expect(label).toBeInTheDocument();
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
            expect(tooltip).toBeInTheDocument();
        });

        test('PurchasePriceField_shouldRenderSliderOnlyMode', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const slider = screen.getByRole('slider');
            const valueDisplay = screen.getByText((_, element) => {
                return element?.textContent?.includes('$600,000') ?? false;
            });
            expect(slider).toBeInTheDocument();
            expect(valueDisplay).toBeInTheDocument();
            expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
        });

        test('PurchasePriceField_shouldRenderInputOnlyMode', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            const input = screen.getByRole('spinbutton');
            expect(input).toBeInTheDocument();
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
        });

        test('PurchasePriceField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
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
        test('PurchasePriceField_shouldClampToMinValue', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={50000}
                    onChange={mockOnChange}
                    minValue={100000}
                    maxValue={3000000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(100000);
        });

        test('PurchasePriceField_shouldClampToMaxValue', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={5000000}
                    onChange={mockOnChange}
                    minValue={100000}
                    maxValue={3000000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(3000000);
        });

        test('PurchasePriceField_shouldUseDefaultValue_whenValueIsNaN', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={600000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(600000);
        });

        test('PurchasePriceField_shouldUseDefaultValue_whenValueIsInfinity', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={Infinity}
                    onChange={mockOnChange}
                    defaultValue={600000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(600000);
        });
    });

    // Slider Interaction Tests
    describe('Slider Interaction', () => {
        test('PurchasePriceField_shouldUpdateValue_whenSliderChanged', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                    minValue={100000}
                    maxValue={3000000}
                />
            );

            const slider = screen.getByRole('slider');
            fireEvent.change(slider, { target: { value: '800000' } });

            expect(mockOnChange).toHaveBeenCalledWith(800000);
        });
    });

    // Input Interaction Tests
    describe('Input Interaction', () => {
        test('PurchasePriceField_shouldUpdateValue_whenInputChanged', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '750000' } });

            expect(mockOnChange).toHaveBeenCalledWith(750000);
        });

        test('PurchasePriceField_shouldShowUnformattedValue_whenFocused', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton') as HTMLInputElement;
            fireEvent.focus(input);

            expect(input.value).toBe('600000');
        });

        test('PurchasePriceField_shouldFormatValue_whenBlurred', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton') as HTMLInputElement;
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '750000' } });
            fireEvent.blur(input);

            expect(input.value).toBe('750,000');
        });

        test('PurchasePriceField_shouldUseDefaultValue_whenBlurredWithEmptyInput', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                    defaultValue={600000}
                />
            );

            const input = screen.getByRole('spinbutton');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.blur(input);

            expect(mockOnChange).toHaveBeenCalledWith(600000);
        });

        test('PurchasePriceField_shouldClampValue_whenBlurredWithOutOfRangeValue', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                    minValue={100000}
                    maxValue={3000000}
                />
            );

            const input = screen.getByRole('spinbutton');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '5000000' } });
            fireEvent.blur(input);

            expect(mockOnChange).toHaveBeenCalledWith(3000000);
        });

        test('PurchasePriceField_shouldHandleFormattedInput_whenBlurred', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('spinbutton');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '$750,000' } });
            fireEvent.blur(input);

            expect(mockOnChange).toHaveBeenCalledWith(750000);
        });
    });

    // Disabled State Tests
    describe('Disabled State', () => {
        test('PurchasePriceField_shouldDisableSlider_whenDisabledPropIsTrue', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toBeDisabled();
        });

        test('PurchasePriceField_shouldDisableInput_whenDisabledPropIsTrue', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const input = screen.getByRole('spinbutton');
            expect(input).toBeDisabled();
        });
    });

    // Custom Props Tests
    describe('Custom Props', () => {
        test('PurchasePriceField_shouldRenderWithCustomId', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    id="customPrice"
                    value={600000}
                    onChange={mockOnChange}
                />
            );

            expect(document.querySelector('#customPrice-slider')).toBeInTheDocument();
            expect(document.querySelector('#customPrice-input')).toBeInTheDocument();
        });

        test('PurchasePriceField_shouldRenderWithCustomClassName', () => {
            const mockOnChange = jest.fn();

            const { container } = render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                    className="custom-class"
                />
            );

            expect(container.querySelector('.custom-class')).toBeInTheDocument();
        });

        test('PurchasePriceField_shouldRenderWithCustomRange', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={500000}
                    onChange={mockOnChange}
                    minValue={200000}
                    maxValue={2000000}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toHaveAttribute('aria-valuemin', '200000');
            expect(slider).toHaveAttribute('aria-valuemax', '2000000');
        });
    });

    // Tooltip Tests
    describe('Tooltip', () => {
        test('PurchasePriceField_shouldShowTooltip_whenInfoButtonClicked', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000}
                    onChange={mockOnChange}
                />
            );

            const tooltipButton = screen.getByRole('button', { name: /more information about purchase price/i });
            fireEvent.click(tooltipButton);

            const tooltipContent = screen.getByText(/the total price of the property/i);
            expect(tooltipContent).toBeInTheDocument();
        });
    });

    // Edge Cases Tests
    describe('Edge Cases', () => {
        test('PurchasePriceField_shouldHandleVeryLargeNumbers', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={2500000}
                    onChange={mockOnChange}
                    minValue={100000}
                    maxValue={3000000}
                />
            );

            const input = screen.getByRole('spinbutton') as HTMLInputElement;
            fireEvent.blur(input);

            expect(input.value).toBe('2,500,000');
        });

        test('PurchasePriceField_shouldRoundToNearestInteger', () => {
            const mockOnChange = jest.fn();

            render(
                <PurchasePriceField
                    value={600000.7}
                    onChange={mockOnChange}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(600001);
        });
    });
});
