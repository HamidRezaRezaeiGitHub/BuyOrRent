import { fireEvent, render, screen } from '@testing-library/react';
import { DownPaymentPercentageField } from './DownPaymentPercentage';

describe('DownPaymentPercentageField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        test('DownPaymentPercentageField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            const label = screen.getByText('Down Payment');
            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            expect(label).toBeInTheDocument();
            expect(slider).toBeInTheDocument();
            expect(input).toBeInTheDocument();
        });

        test('DownPaymentPercentageField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
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

    describe('Value Validation', () => {
        test('DownPaymentPercentageField_shouldClampToMinValue', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={-5}
                    onChange={mockOnChange}
                    minValue={0}
                    maxValue={100}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(0);
        });

        test('DownPaymentPercentageField_shouldClampToMaxValue', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={150}
                    onChange={mockOnChange}
                    minValue={0}
                    maxValue={100}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(100);
        });

        test('DownPaymentPercentageField_shouldUseDefaultValue_whenValueIsNaN', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={20}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(20);
        });
    });

    describe('Slider Interaction', () => {
        test('DownPaymentPercentageField_shouldUpdateValue_whenSliderChanged', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');
            fireEvent.keyDown(slider, { key: 'ArrowRight' });

            expect(mockOnChange).toHaveBeenCalled();
        });
    });

    describe('Input Interaction', () => {
        test('DownPaymentPercentageField_shouldUpdateValue_whenInputChanged', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '25' } });

            expect(mockOnChange).toHaveBeenCalledWith(25);
        });

        test('DownPaymentPercentageField_shouldCallOnChange_whenValidInputBlurred', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox') as HTMLInputElement;
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '25.5' } });
            fireEvent.blur(input);

            expect(mockOnChange).toHaveBeenCalledWith(25.5);
        });
    });

    describe('Disabled State', () => {
        test('DownPaymentPercentageField_shouldDisableSlider_whenDisabledPropIsTrue', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toHaveAttribute('data-disabled');
        });
    });
});
