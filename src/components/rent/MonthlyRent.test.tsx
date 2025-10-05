import { fireEvent, render, screen } from '@testing-library/react';
import { MonthlyRentField } from './MonthlyRent';

describe('MonthlyRentField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic rendering tests
    test('MonthlyRentField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Monthly Rent');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', '0.00');
        expect(input).toHaveValue('');
    });

    test('MonthlyRentField_shouldRenderWithNumericValue', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value={1500}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('1,500');
    });

    test('MonthlyRentField_shouldDisplayDollarSignIcon', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );

        // Check for the $ prefix in the input
        const dollarPrefix = screen.getByText('$');
        expect(dollarPrefix).toBeInTheDocument();
    });

    test('MonthlyRentField_shouldDisplayInfoIcon', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );

        const infoButton = screen.getByRole('button', { name: /more information/i });
        expect(infoButton).toBeInTheDocument();
    });

    // Change handling tests
    test('MonthlyRentField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1500' } });
        fireEvent.blur(input);

        expect(mockOnChange).toHaveBeenCalledWith(1500);
    });

    test('MonthlyRentField_shouldParseCommaSeparatedInput', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1,500.50' } });
        fireEvent.blur(input);

        expect(mockOnChange).toHaveBeenCalledWith(1500.50);
    });

    test('MonthlyRentField_shouldHandleDecimalInput', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1500.99' } });
        fireEvent.blur(input);

        expect(mockOnChange).toHaveBeenCalledWith(1500.99);
    });

    // Formatting tests
    test('MonthlyRentField_shouldFormatValueOnBlur', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        
        // Enter unformatted value
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '1500' } });
        
        // Update with the new value
        rerender(
            <MonthlyRentField
                value={1500}
                onChange={mockOnChange}
            />
        );
        
        // Blur to trigger formatting
        fireEvent.blur(input);

        // Should be formatted
        expect(input).toHaveValue('1,500');
    });

    test('MonthlyRentField_shouldShowUnformattedValueOnFocus', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value={1500}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        
        // Initially formatted
        expect(input).toHaveValue('1,500');
        
        // Focus should show unformatted
        fireEvent.focus(input);
        expect(input).toHaveValue('1500');
    });

    test('MonthlyRentField_shouldFormatLargeNumbers', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value={12345.67}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('12,345.7');
    });

    test('MonthlyRentField_shouldHandleEmptyValue', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <MonthlyRentField
                value={100}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        expect(mockOnChange).toHaveBeenCalledWith('');
        
        rerender(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );
        
        expect(input).toHaveValue('');
    });

    // Validation tests
    test('MonthlyRentField_shouldNotShowValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
    });

    test('MonthlyRentField_shouldShowRequiredError_whenValidationEnabledAndFieldEmpty', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Monthly rent is required')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenLastCalledWith({ 
            isValid: false, 
            errors: [
                'Monthly rent is required',
                'Monthly rent must be a positive number',
                'Monthly rent must not exceed $10,000'
            ]
        });
    });

    test('MonthlyRentField_shouldShowPositiveError_whenNegativeValue', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);
        mockOnValidationChange.mockClear();

        // Enter negative value
        fireEvent.change(input, { target: { value: '-100' } });
        
        rerender(
            <MonthlyRentField
                value={-100}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.getByText('Monthly rent must be a positive number')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('MonthlyRentField_shouldShowMaxValueError_whenValueTooLarge', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);
        mockOnValidationChange.mockClear();

        // Enter value over max
        fireEvent.change(input, { target: { value: '2000000' } });
        
        rerender(
            <MonthlyRentField
                value={2000000}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.getByText('Monthly rent must not exceed $10,000')).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('MonthlyRentField_shouldPassValidation_whenValidValueProvided', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '1500' } });

        rerender(
            <MonthlyRentField
                value={1500}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        fireEvent.blur(input);

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/positive/)).not.toBeInTheDocument();
        expect(screen.queryByText(/exceed/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('MonthlyRentField_shouldNotValidateBeforeTouch', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
    });

    test('MonthlyRentField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.queryByText(/required/)).not.toBeInTheDocument();
        expect(input).not.toHaveClass('border-red-500');
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    // External errors tests
    test('MonthlyRentField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = jest.fn();
        const errors = ['Custom error message'];

        render(
            <MonthlyRentField
                value={1500}
                onChange={mockOnChange}
                errors={errors}
            />
        );

        const errorText = screen.getByText('Custom error message');
        const input = screen.getByRole('textbox');

        expect(errorText).toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    test('MonthlyRentField_shouldPrioritizeValidationErrors_overExternalErrors', () => {
        const mockOnChange = jest.fn();
        const externalErrors = ['External error message'];

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                errors={externalErrors}
                enableValidation={true}
                validationMode="required"
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Monthly rent is required')).toBeInTheDocument();
        expect(screen.queryByText('External error message')).not.toBeInTheDocument();
        expect(input).toHaveClass('border-red-500');
    });

    // Disabled state tests
    test('MonthlyRentField_shouldBeDisabled_whenDisabledPropTrue', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });

    // Custom placeholder test
    test('MonthlyRentField_shouldUseCustomPlaceholder_whenPlaceholderProvided', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                placeholder="Enter amount"
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('placeholder', 'Enter amount');
    });

    // Required asterisk tests
    test('MonthlyRentField_shouldShowRequiredAsterisk_whenValidationEnabledAndRequired', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        const asterisk = screen.getByText('*');
        expect(asterisk).toBeInTheDocument();
    });

    test('MonthlyRentField_shouldNotShowRequiredAsterisk_whenValidationEnabledButOptional', () => {
        const mockOnChange = jest.fn();

        render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        const asterisk = screen.queryByText('*');
        expect(asterisk).not.toBeInTheDocument();
    });

    // Integration tests combining formatting, validation, and value
    test('MonthlyRentField_shouldFormatAndValidate_whenValidValueEntered', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        
        // Focus and enter value
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '2500.50' } });
        fireEvent.blur(input);
        
        // Value should be parsed
        expect(mockOnChange).toHaveBeenCalledWith(2500.50);
        
        // Update with new value
        rerender(
            <MonthlyRentField
                value={2500.50}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                onValidationChange={mockOnValidationChange}
            />
        );
        
        // Blur should format and validate
        fireEvent.blur(input);
        
        expect(input).toHaveValue('2,500.5');
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        expect(mockOnValidationChange).toHaveBeenCalledWith({ isValid: true, errors: [] });
    });

    test('MonthlyRentField_shouldClearFormatting_whenValueCleared', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <MonthlyRentField
                value={1500}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('1,500');
        
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '' } });
        
        rerender(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );
        
        fireEvent.blur(input);
        
        expect(input).toHaveValue('');
        expect(mockOnChange).toHaveBeenCalledWith('');
    });

    test('MonthlyRentField_shouldHandleMultipleEdits_withFormatting', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        
        // First edit
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '1000' } });
        
        rerender(
            <MonthlyRentField
                value={1000}
                onChange={mockOnChange}
            />
        );
        
        fireEvent.blur(input);
        expect(input).toHaveValue('1,000');
        
        // Second edit
        fireEvent.focus(input);
        expect(input).toHaveValue('1000');
        
        fireEvent.change(input, { target: { value: '2000' } });
        
        rerender(
            <MonthlyRentField
                value={2000}
                onChange={mockOnChange}
            />
        );
        
        fireEvent.blur(input);
        expect(input).toHaveValue('2,000');
    });

    test('MonthlyRentField_shouldValidateOnChange_afterFirstBlur', () => {
        const mockOnChange = jest.fn();
        const mockOnValidationChange = jest.fn();

        const { rerender } = render(
            <MonthlyRentField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        const input = screen.getByRole('textbox');
        
        // First blur to touch field
        fireEvent.focus(input);
        fireEvent.blur(input);
        mockOnValidationChange.mockClear();
        
        // Now change value - should validate immediately
        fireEvent.change(input, { target: { value: '5000000' } });
        
        rerender(
            <MonthlyRentField
                value={5000000}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(screen.getByText('Monthly rent must not exceed $10,000')).toBeInTheDocument();
    });

    // Display Mode Tests
    describe('Display Modes', () => {
        test('MonthlyRentField_shouldRenderSliderMode', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={1500}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            // Should have slider
            expect(screen.getByRole('slider')).toBeInTheDocument();
            
            // Should show value display
            expect(screen.getByText('$1,500')).toBeInTheDocument();
            expect(screen.getByText('per month')).toBeInTheDocument();
            
            // Should not have input field
            expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
        });

        test('MonthlyRentField_shouldRenderInputMode', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={1500}
                    onChange={mockOnChange}
                    displayMode="input"
                />
            );

            // Should have input field
            expect(screen.getByRole('textbox')).toBeInTheDocument();
            
            // Should not have slider
            expect(screen.queryByRole('slider')).not.toBeInTheDocument();
            
            // Should not have value display
            expect(screen.queryByText('per month')).not.toBeInTheDocument();
        });

        test('MonthlyRentField_shouldRenderCombinedMode', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={1500}
                    onChange={mockOnChange}
                    displayMode="combined"
                />
            );

            // Should have both slider and input
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('textbox')).toBeInTheDocument();
            
            // Should not have value display (combined mode doesn't show it)
            expect(screen.queryByText('per month')).not.toBeInTheDocument();
        });

        test('MonthlyRentField_shouldDefaultToCombinedMode', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={1500}
                    onChange={mockOnChange}
                />
            );

            // Should have both slider and input (combined is default)
            expect(screen.getByRole('slider')).toBeInTheDocument();
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        test('MonthlyRentField_shouldHandleSliderChange', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={1500}
                    onChange={mockOnChange}
                    displayMode="slider"
                />
            );

            const slider = screen.getByRole('slider');
            
            // Verify slider properties and functionality
            expect(slider).toBeInTheDocument();
            expect(slider).toHaveAttribute('aria-valuenow', '1500');
            expect(slider).toHaveAttribute('aria-valuemin', '0');
            expect(slider).toHaveAttribute('aria-valuemax', '10000');
            
            // Verify that the slider is enabled
            expect(slider).not.toHaveAttribute('aria-disabled', 'true');
        });

        test('MonthlyRentField_shouldRespectMinMaxValues', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value={1500}
                    onChange={mockOnChange}
                    displayMode="slider"
                    minValue={500}
                    maxValue={5000}
                />
            );

            const slider = screen.getByRole('slider');
            
            expect(slider).toHaveAttribute('aria-valuemin', '500');
            expect(slider).toHaveAttribute('aria-valuemax', '5000');
        });

        test('MonthlyRentField_shouldUseDefaultValue_whenEmptyInRequiredMode', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value=""
                    onChange={mockOnChange}
                    defaultValue={2500}
                    enableValidation={true}
                    validationMode="required"
                />
            );

            const input = screen.getByRole('textbox');
            
            // Focus and blur empty field
            fireEvent.focus(input);
            fireEvent.blur(input);

            // Should call onChange with default value
            expect(mockOnChange).toHaveBeenCalledWith(2500);
        });

        test('MonthlyRentField_shouldClampValues_toMinMax', () => {
            const mockOnChange = jest.fn();

            render(
                <MonthlyRentField
                    value=""
                    onChange={mockOnChange}
                    minValue={1000}
                    maxValue={5000}
                />
            );

            const input = screen.getByRole('textbox');
            
            // Enter value below min
            fireEvent.change(input, { target: { value: '500' } });
            fireEvent.blur(input);

            expect(mockOnChange).toHaveBeenCalledWith(1000);

            mockOnChange.mockClear();

            // Enter value above max
            fireEvent.change(input, { target: { value: '10000' } });
            fireEvent.blur(input);

            expect(mockOnChange).toHaveBeenCalledWith(5000);
        });
    });
});
