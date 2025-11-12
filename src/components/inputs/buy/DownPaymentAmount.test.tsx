import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { DownPaymentAmountField } from './DownPaymentAmount';

describe('DownPaymentAmountField', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        test('DownPaymentAmountField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = vi.fn();

            render(
                <DownPaymentAmountField
                    value={120000}
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

        test('DownPaymentAmountField_shouldRenderCombinedMode', () => {
            const mockOnChange = vi.fn();

            render(
                <DownPaymentAmountField
                    value={120000}
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
        test('DownPaymentAmountField_shouldClampToMinValue', () => {
            const mockOnChange = vi.fn();

            render(
                <DownPaymentAmountField
                    value={-5000}
                    onChange={mockOnChange}
                    minValue={0}
                    maxValue={3000000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(0);
        });

        test('DownPaymentAmountField_shouldClampToMaxValue', () => {
            const mockOnChange = vi.fn();

            render(
                <DownPaymentAmountField
                    value={5000000}
                    onChange={mockOnChange}
                    minValue={0}
                    maxValue={3000000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(3000000);
        });

        test('DownPaymentAmountField_shouldUseDefaultValue_whenValueIsNaN', () => {
            const mockOnChange = vi.fn();

            render(
                <DownPaymentAmountField
                    value={NaN}
                    onChange={mockOnChange}
                    defaultValue={120000}
                />
            );

            expect(mockOnChange).toHaveBeenCalledWith(120000);
        });
    });

    describe('Slider Interaction', () => {
        test('DownPaymentAmountField_shouldUpdateValue_whenSliderChanged', () => {
            const mockOnChange = vi.fn();

            render(
                <DownPaymentAmountField
                    value={120000}
                    onChange={mockOnChange}
                />
            );

            const slider = screen.getByRole('slider');

            // Simulate slider keydown events (Radix Slider responds to keyboard)
            fireEvent.keyDown(slider, { key: 'ArrowRight' });

            expect(mockOnChange).toHaveBeenCalled();
        });
    });

    describe('Input Interaction', () => {
        test('DownPaymentAmountField_shouldUpdateValue_whenInputChanged', () => {
            const mockOnChange = vi.fn();

            render(
                <DownPaymentAmountField
                    value={120000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '150000' } });

            expect(mockOnChange).toHaveBeenCalledWith(150000);
        });

        test('DownPaymentAmountField_shouldUpdateValue_whenBlurred', () => {
            const mockOnChange = vi.fn();

            render(
                <DownPaymentAmountField
                    value={120000}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox') as HTMLInputElement;
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '150000' } });
            fireEvent.blur(input);

            expect(mockOnChange).toHaveBeenCalledWith(150000);
        });
    });

    describe('Disabled State', () => {
        test('DownPaymentAmountField_shouldDisableSlider_whenDisabledPropIsTrue', () => {
            const mockOnChange = vi.fn();

            render(
                <DownPaymentAmountField
                    value={120000}
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const slider = screen.getByRole('slider');
            const input = screen.getByRole('textbox');

            expect(slider).toHaveAttribute('data-disabled');
            expect(input).toBeDisabled();
        });
    });
});
