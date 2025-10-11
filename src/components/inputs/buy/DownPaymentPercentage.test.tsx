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
    // Label Props Tests
    describe('Label Props', () => {
        test('DownPaymentPercentageField_shouldCallOnLabelSetWithLabelElement', () => {
            const mockOnChange = jest.fn();
            const mockOnLabelSet = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                    onLabelSet={mockOnLabelSet}
                />
            );

            // onLabelSet should be called with a React element
            expect(mockOnLabelSet).toHaveBeenCalledTimes(1);
            expect(mockOnLabelSet).toHaveBeenCalledWith(expect.any(Object));
        });

        test('DownPaymentPercentageField_shouldHideLabelWhenShowLabelIsFalse', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={false}
                />
            );

            // Label should not be visible
            const label = screen.queryByText('Down Payment');
            expect(label).not.toBeInTheDocument();
        });

        test('DownPaymentPercentageField_shouldShowLabelByDefault', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            // Label should be visible by default
            const label = screen.getByText('Down Payment');
            expect(label).toBeInTheDocument();
        });

        test('DownPaymentPercentageField_shouldShowLabelWhenShowLabelIsTrue', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={true}
                />
            );

            // Label should be visible
            const label = screen.getByText('Down Payment');
            expect(label).toBeInTheDocument();
        });

        test('DownPaymentPercentageField_shouldShowDescriptionByDefault', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            // Description should be visible by default
            const description = screen.getByText('Upfront payment percentage to reduce mortgage amount');
            expect(description).toBeInTheDocument();
        });

        test('DownPaymentPercentageField_shouldHideDescriptionWhenShowDescriptionIsFalse', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                    showDescription={false}
                />
            );

            // Description should not be visible
            const description = screen.queryByText('Upfront payment percentage to reduce mortgage amount');
            expect(description).not.toBeInTheDocument();
        });

        test('DownPaymentPercentageField_shouldShowDescriptionWhenShowDescriptionIsTrue', () => {
            const mockOnChange = jest.fn();

            render(
                <DownPaymentPercentageField
                    value={20}
                    onChange={mockOnChange}
                    showDescription={true}
                />
            );

            // Description should be visible
            const description = screen.getByText('Upfront payment percentage to reduce mortgage amount');
            expect(description).toBeInTheDocument();
        });
    });
});
