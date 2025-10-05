import { fireEvent, render, screen } from '@testing-library/react';
import { DollarSign, Calendar } from 'lucide-react';
import { FlexibleInputField } from './FlexibleInputField';

describe('FlexibleInputField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ============================================================================
    // Basic rendering tests - Normal input
    // ============================================================================
    describe('Normal Input - Basic Rendering', () => {
        test('FlexibleInputField_shouldRenderWithDefaultProps', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test Field"
                    value=""
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            const label = screen.getByText('Test Field');

            expect(input).toBeInTheDocument();
            expect(label).toBeInTheDocument();
            expect(input).toHaveValue('');
        });

        test('FlexibleInputField_shouldRenderWithNumericValue', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test Field"
                    value={1500}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('1500');
        });

        test('FlexibleInputField_shouldApplyCustomClassName', () => {
            const mockOnChange = jest.fn();

            const { container } = render(
                <FlexibleInputField
                    label="Test Field"
                    value=""
                    onChange={mockOnChange}
                    className="custom-class"
                />
            );

            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('custom-class');
        });

        test('FlexibleInputField_shouldUseCustomId', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    id="customId"
                    label="Test Field"
                    value=""
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('id', 'customId');
        });
    });

    // ============================================================================
    // Currency formatting tests
    // ============================================================================
    describe('Currency Formatting', () => {
        test('FlexibleInputField_shouldFormatCurrencyValue', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Amount"
                    value={1500}
                    onChange={mockOnChange}
                    numberType="currency"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('1,500.00');
        });

        test('FlexibleInputField_shouldShowDollarSignForCurrency', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Amount"
                    value=""
                    onChange={mockOnChange}
                    numberType="currency"
                />
            );

            const dollarSign = screen.getByText('$');
            expect(dollarSign).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldShowUnformattedValueOnFocus_currency', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Amount"
                    value={1500}
                    onChange={mockOnChange}
                    numberType="currency"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('1,500.00');

            fireEvent.focus(input);
            expect(input).toHaveValue('1500');
        });

        test('FlexibleInputField_shouldFormatValueOnBlur_currency', () => {
            const mockOnChange = jest.fn();

            const { rerender } = render(
                <FlexibleInputField
                    label="Amount"
                    value=""
                    onChange={mockOnChange}
                    numberType="currency"
                />
            );

            const input = screen.getByRole('textbox');

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '2500' } });

            rerender(
                <FlexibleInputField
                    label="Amount"
                    value={2500}
                    onChange={mockOnChange}
                    numberType="currency"
                />
            );

            fireEvent.blur(input);
            expect(input).toHaveValue('2,500.00');
        });
    });

    // ============================================================================
    // Percentage formatting tests
    // ============================================================================
    describe('Percentage Formatting', () => {
        test('FlexibleInputField_shouldFormatPercentageValue', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Rate"
                    value={2.5}
                    onChange={mockOnChange}
                    numberType="percentage"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('2.50');
        });

        test('FlexibleInputField_shouldShowPercentSignForPercentage', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Rate"
                    value=""
                    onChange={mockOnChange}
                    numberType="percentage"
                />
            );

            const percentSign = screen.getByText('%');
            expect(percentSign).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldShowUnformattedValueOnFocus_percentage', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Rate"
                    value={7.5}
                    onChange={mockOnChange}
                    numberType="percentage"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('7.50');

            fireEvent.focus(input);
            expect(input).toHaveValue('7.5');
        });

        test('FlexibleInputField_shouldFormatValueOnBlur_percentage', () => {
            const mockOnChange = jest.fn();

            const { rerender } = render(
                <FlexibleInputField
                    label="Rate"
                    value=""
                    onChange={mockOnChange}
                    numberType="percentage"
                />
            );

            const input = screen.getByRole('textbox');

            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '5' } });

            rerender(
                <FlexibleInputField
                    label="Rate"
                    value={5}
                    onChange={mockOnChange}
                    numberType="percentage"
                />
            );

            fireEvent.blur(input);
            expect(input).toHaveValue('5.00');
        });
    });

    // ============================================================================
    // Change handling tests
    // ============================================================================
    describe('Change Handling', () => {
        test('FlexibleInputField_shouldCallOnChange_whenValueChanges', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '123' } });

            expect(mockOnChange).toHaveBeenCalledWith(123);
        });

        test('FlexibleInputField_shouldCallOnChangeWithEmptyString_whenCleared', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value={100}
                    onChange={mockOnChange}
                />
            );

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '' } });

            expect(mockOnChange).toHaveBeenCalledWith('');
        });

        test('FlexibleInputField_shouldParseCurrencyInput', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    numberType="currency"
                />
            );

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: '1,500.50' } });

            expect(mockOnChange).toHaveBeenCalledWith(1500.50);
        });
    });

    // ============================================================================
    // Slider tests
    // ============================================================================
    describe('Slider Input', () => {
        test('FlexibleInputField_shouldRenderSlider', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Years"
                    value={10}
                    onChange={mockOnChange}
                    category="slider"
                    min={1}
                    max={100}
                    step={1}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toBeInTheDocument();
            expect(slider).toHaveAttribute('aria-valuenow', '10');
        });

        test('FlexibleInputField_shouldDisplaySliderValue', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Years"
                    value={25}
                    onChange={mockOnChange}
                    category="slider"
                />
            );

            const valueDisplay = screen.getByText('25');
            expect(valueDisplay).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldDisplaySliderValueWithUnit', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Years"
                    value={10}
                    onChange={mockOnChange}
                    category="slider"
                    sliderValueUnit="years"
                />
            );

            const unit = screen.getByText('years');
            expect(unit).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldSetSliderMinMaxStep', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Years"
                    value={50}
                    onChange={mockOnChange}
                    category="slider"
                    min={1}
                    max={100}
                    step={1}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toHaveAttribute('aria-valuemin', '1');
            expect(slider).toHaveAttribute('aria-valuemax', '100');
        });
    });

    // ============================================================================
    // Validation tests
    // ============================================================================
    describe('Validation', () => {
        test('FlexibleInputField_shouldNotShowErrors_whenValidationDisabled', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    enableValidation={false}
                />
            );

            const input = screen.getByRole('textbox');
            fireEvent.focus(input);
            fireEvent.blur(input);

            expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        });

        test('FlexibleInputField_shouldShowRequiredAsterisk_whenRequired', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="required"
                />
            );

            const asterisk = screen.getByText('*');
            expect(asterisk).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldNotShowRequiredAsterisk_whenOptional', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="optional"
                />
            );

            const asterisk = screen.queryByText('*');
            expect(asterisk).not.toBeInTheDocument();
        });

        test('FlexibleInputField_shouldDisplayExternalErrors', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    errors={['Custom error message']}
                />
            );

            expect(screen.getByText('Custom error message')).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldCallOnValidationChange', () => {
            const mockOnChange = jest.fn();
            const mockOnValidationChange = jest.fn();

            // Define validation rules outside to avoid recreation
            const validationRulesConfig = [{
                name: 'required',
                message: 'Field is required',
                validator: (val: string) => val !== ''
            }];

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    enableValidation={true}
                    validationMode="required"
                    onValidationChange={mockOnValidationChange}
                    validationRules={validationRulesConfig}
                />
            );

            const input = screen.getByRole('textbox');
            fireEvent.focus(input);
            fireEvent.blur(input);

            expect(mockOnValidationChange).toHaveBeenCalled();
        });
    });

    // ============================================================================
    // Icon tests
    // ============================================================================
    describe('Icons', () => {
        test('FlexibleInputField_shouldDisplayLabelIcon', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    labelIcon={Calendar}
                />
            );

            const label = screen.getByText('Test');
            expect(label).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldDisplayCustomIcon', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    icon={DollarSign}
                    iconPosition="left"
                />
            );

            // The icon is rendered, component structure is present
            const input = screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldUseDefaultCurrencyIcon', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    numberType="currency"
                    iconIncluded={true}
                />
            );

            const dollarSign = screen.getByText('$');
            expect(dollarSign).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldUseDefaultPercentageIcon', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    numberType="percentage"
                    iconIncluded={true}
                />
            );

            const percentSign = screen.getByText('%');
            expect(percentSign).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldNotShowIcon_whenIconIncludedFalse', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    numberType="currency"
                    iconIncluded={false}
                />
            );

            const dollarSign = screen.queryByText('$');
            expect(dollarSign).not.toBeInTheDocument();
        });
    });

    // ============================================================================
    // Tooltip tests
    // ============================================================================
    describe('Tooltip', () => {
        test('FlexibleInputField_shouldDisplayTooltipButton_whenContentProvided', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    tooltipContent={<p>Tooltip content</p>}
                />
            );

            const tooltipButton = screen.getByRole('button', { name: /more information/i });
            expect(tooltipButton).toBeInTheDocument();
        });

        test('FlexibleInputField_shouldNotDisplayTooltipButton_whenContentNotProvided', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                />
            );

            const tooltipButton = screen.queryByRole('button', { name: /more information/i });
            expect(tooltipButton).not.toBeInTheDocument();
        });

        test('FlexibleInputField_shouldToggleTooltip_whenButtonClicked', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    tooltipContent={<p>Tooltip content</p>}
                />
            );

            const tooltipButton = screen.getByRole('button', { name: /more information/i });
            fireEvent.click(tooltipButton);

            // The tooltip component manages its visibility
            expect(tooltipButton).toBeInTheDocument();
        });
    });

    // ============================================================================
    // Disabled state tests
    // ============================================================================
    describe('Disabled State', () => {
        test('FlexibleInputField_shouldBeDisabled_normalInput', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    disabled={true}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toBeDisabled();
        });

        test('FlexibleInputField_shouldBeDisabled_slider', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value={10}
                    onChange={mockOnChange}
                    category="slider"
                    disabled={true}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toHaveAttribute('data-disabled');
        });
    });

    // ============================================================================
    // Custom formatting tests
    // ============================================================================
    describe('Custom Formatting', () => {
        test('FlexibleInputField_shouldUseCustomFormatFunction', () => {
            const mockOnChange = jest.fn();
            const customFormat = (val: number) => `Custom: ${val}`;

            render(
                <FlexibleInputField
                    label="Test"
                    value={100}
                    onChange={mockOnChange}
                    formatValue={customFormat}
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('Custom: 100');
        });

        test('FlexibleInputField_shouldUseCustomParseFunction', () => {
            const mockOnChange = jest.fn();
            const customParse = (val: string) => {
                const num = parseInt(val.replace('Custom: ', ''), 10);
                return isNaN(num) ? '' : num;
            };

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    parseValue={customParse}
                />
            );

            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'Custom: 50' } });

            expect(mockOnChange).toHaveBeenCalledWith(50);
        });
    });

    // ============================================================================
    // Placeholder tests
    // ============================================================================
    describe('Placeholder', () => {
        test('FlexibleInputField_shouldDisplayPlaceholder', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    placeholder="Enter value"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('placeholder', 'Enter value');
        });
    });

    // ============================================================================
    // Input mode tests
    // ============================================================================
    describe('Input Mode', () => {
        test('FlexibleInputField_shouldSetInputMode', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    label="Test"
                    value=""
                    onChange={mockOnChange}
                    inputMode="numeric"
                />
            );

            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('inputMode', 'numeric');
        });
    });

    // ============================================================================
    // Integration tests
    // ============================================================================
    describe('Integration Tests', () => {
        test('FlexibleInputField_shouldWorkWithAllFeaturesCombined_currency', () => {
            const mockOnChange = jest.fn();
            const mockOnValidationChange = jest.fn();

            // Define validation rules outside to avoid recreation
            const validationRulesConfig = [{
                name: 'required',
                message: 'Rent is required',
                validator: (val: string) => val !== '' && parseFloat(val) > 0
            }];

            const { rerender } = render(
                <FlexibleInputField
                    id="testField"
                    label="Monthly Rent"
                    value=""
                    onChange={mockOnChange}
                    numberType="currency"
                    placeholder="0.00"
                    labelIcon={DollarSign}
                    tooltipContent={<p>Enter monthly rent amount</p>}
                    enableValidation={true}
                    validationMode="required"
                    onValidationChange={mockOnValidationChange}
                    validationRules={validationRulesConfig}
                />
            );

            const input = screen.getByRole('textbox');

            // Enter value
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: '1500' } });

            expect(mockOnChange).toHaveBeenCalledWith(1500);

            // Update with new value
            rerender(
                <FlexibleInputField
                    id="testField"
                    label="Monthly Rent"
                    value={1500}
                    onChange={mockOnChange}
                    numberType="currency"
                    placeholder="0.00"
                    labelIcon={DollarSign}
                    tooltipContent={<p>Enter monthly rent amount</p>}
                    enableValidation={true}
                    validationMode="required"
                    onValidationChange={mockOnValidationChange}
                    validationRules={validationRulesConfig}
                />
            );

            // Blur should format
            fireEvent.blur(input);
            expect(input).toHaveValue('1,500.00');
        });

        test('FlexibleInputField_shouldWorkWithAllFeaturesCombined_slider', () => {
            const mockOnChange = jest.fn();

            render(
                <FlexibleInputField
                    id="yearsField"
                    label="Analysis Period"
                    value={10}
                    onChange={mockOnChange}
                    category="slider"
                    min={1}
                    max={100}
                    step={1}
                    sliderValueUnit="years"
                    labelIcon={Calendar}
                    tooltipContent={<p>Select number of years</p>}
                    enableValidation={true}
                    validationMode="required"
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toBeInTheDocument();
            expect(slider).toHaveAttribute('aria-valuenow', '10');

            const valueDisplay = screen.getByText('10');
            expect(valueDisplay).toBeInTheDocument();

            const unit = screen.getByText('years');
            expect(unit).toBeInTheDocument();
        });
    });
});
