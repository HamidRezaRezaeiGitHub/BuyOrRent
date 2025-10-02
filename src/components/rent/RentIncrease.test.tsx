import { fireEvent, render, screen } from '@testing-library/react';
import { RentIncreaseField } from './RentIncrease';

describe('RentIncreaseField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic rendering tests
    test('RentIncreaseField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        const label = screen.getByText('Annual Rent Increase');

        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', '2.50');
        expect(input).toHaveValue('');
    });

    test('RentIncreaseField_shouldRenderWithNumericValue', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value={2.5}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('2.50');
    });

    test('RentIncreaseField_shouldDisplayPercentIcon', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );

        // Check for the % suffix in the input
        const percentSuffix = screen.getByText('%');
        expect(percentSuffix).toBeInTheDocument();
    });

    test('RentIncreaseField_shouldDisplayInfoIcon', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );

        const infoButton = screen.getByRole('button', { name: /more information/i });
        expect(infoButton).toBeInTheDocument();
    });

    // Change handling tests
    test('RentIncreaseField_shouldCallOnChange_whenValueChanges', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '2.5' } });

        expect(mockOnChange).toHaveBeenCalledWith(2.5);
    });

    test('RentIncreaseField_shouldHandleDecimalInput', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '3.75' } });

        expect(mockOnChange).toHaveBeenCalledWith(3.75);
    });

    test('RentIncreaseField_shouldHandleIntegerInput', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '5' } });

        expect(mockOnChange).toHaveBeenCalledWith(5);
    });

    // Formatting tests
    test('RentIncreaseField_shouldFormatValueOnBlur', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        
        // Enter unformatted value
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '2.5' } });
        
        // Update with the new value
        rerender(
            <RentIncreaseField
                value={2.5}
                onChange={mockOnChange}
            />
        );
        
        // Blur to trigger formatting
        fireEvent.blur(input);

        // Should be formatted to 2 decimal places
        expect(input).toHaveValue('2.50');
    });

    test('RentIncreaseField_shouldShowUnformattedValueOnFocus', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value={2.5}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        
        // Initially should show formatted value
        expect(input).toHaveValue('2.50');
        
        // Focus should show unformatted value
        fireEvent.focus(input);
        expect(input).toHaveValue('2.5');
    });

    test('RentIncreaseField_shouldHandleEmptyValue', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <RentIncreaseField
                value={2.5}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '' } });

        expect(mockOnChange).toHaveBeenCalledWith('');
        
        rerender(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );
        
        fireEvent.blur(input);
        expect(input).toHaveValue('');
    });

    // Validation tests
    test('RentIncreaseField_shouldNotShowValidationErrors_whenValidationDisabled', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={false}
                validationMode="required"
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.blur(input);

        expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });

    test('RentIncreaseField_shouldShowRequiredError_whenValidationEnabledAndFieldEmpty', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Annual rent increase is required')).toBeInTheDocument();
    });

    test('RentIncreaseField_shouldShowNonNegativeError_whenNegativeValue', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '-5' } });
        
        rerender(
            <RentIncreaseField
                value={-5}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );
        
        fireEvent.blur(input);

        expect(screen.getByText('Annual rent increase must be a non-negative number')).toBeInTheDocument();
    });

    test('RentIncreaseField_shouldShowMaxValueError_whenValueTooLarge', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '150' } });
        
        rerender(
            <RentIncreaseField
                value={150}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );
        
        fireEvent.blur(input);

        expect(screen.getByText('Annual rent increase must not exceed 100%')).toBeInTheDocument();
    });

    test('RentIncreaseField_shouldPassValidation_whenValidValueProvided', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '2.5' } });
        
        rerender(
            <RentIncreaseField
                value={2.5}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );
        
        fireEvent.blur(input);

        expect(screen.queryByText(/must/i)).not.toBeInTheDocument();
    });

    test('RentIncreaseField_shouldHandleEmptyValueInOptionalMode', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });

    // External errors tests
    test('RentIncreaseField_shouldDisplayExternalErrors_whenErrorsProvided', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                errors={['External error message']}
            />
        );

        expect(screen.getByText('External error message')).toBeInTheDocument();
    });

    test('RentIncreaseField_shouldPrioritizeValidationErrors_overExternalErrors', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
                errors={['External error message']}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.focus(input);
        fireEvent.blur(input);

        expect(screen.getByText('Annual rent increase is required')).toBeInTheDocument();
        expect(screen.queryByText('External error message')).not.toBeInTheDocument();
    });

    // Disabled state test
    test('RentIncreaseField_shouldBeDisabled_whenDisabledPropTrue', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });

    // Custom placeholder test
    test('RentIncreaseField_shouldUseCustomPlaceholder_whenPlaceholderProvided', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                placeholder="5.00"
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('placeholder', '5.00');
    });

    // Required asterisk tests
    test('RentIncreaseField_shouldShowRequiredAsterisk_whenValidationEnabledAndRequired', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        const label = screen.getByText('Annual Rent Increase');
        expect(label.parentElement?.textContent).toContain('*');
    });

    test('RentIncreaseField_shouldNotShowRequiredAsterisk_whenValidationEnabledButOptional', () => {
        const mockOnChange = jest.fn();

        render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        const label = screen.getByText('Annual Rent Increase');
        expect(label.parentElement?.textContent).not.toContain('*');
    });

    // Integration tests
    test('RentIncreaseField_shouldFormatAndValidate_whenValidValueEntered', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );

        const input = screen.getByRole('textbox');
        
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '3.5' } });
        
        rerender(
            <RentIncreaseField
                value={3.5}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="optional"
            />
        );
        
        fireEvent.blur(input);

        expect(input).toHaveValue('3.50');
        expect(screen.queryByText(/must/i)).not.toBeInTheDocument();
    });

    test('RentIncreaseField_shouldClearFormatting_whenValueCleared', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <RentIncreaseField
                value={2.5}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input).toHaveValue('2.50');

        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '' } });
        
        rerender(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );
        
        fireEvent.blur(input);

        expect(input).toHaveValue('');
    });

    test('RentIncreaseField_shouldHandleMultipleEdits_withFormatting', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');

        // First edit
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '2' } });
        rerender(<RentIncreaseField value={2} onChange={mockOnChange} />);
        fireEvent.blur(input);
        expect(input).toHaveValue('2.00');

        // Second edit
        fireEvent.focus(input);
        expect(input).toHaveValue('2');
        fireEvent.change(input, { target: { value: '5.5' } });
        rerender(<RentIncreaseField value={5.5} onChange={mockOnChange} />);
        fireEvent.blur(input);
        expect(input).toHaveValue('5.50');
    });

    test('RentIncreaseField_shouldValidateOnChange_afterFirstBlur', () => {
        const mockOnChange = jest.fn();

        const { rerender } = render(
            <RentIncreaseField
                value=""
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        const input = screen.getByRole('textbox');

        // First blur without value
        fireEvent.focus(input);
        fireEvent.blur(input);
        expect(screen.getByText('Annual rent increase is required')).toBeInTheDocument();

        // Now type a value - validation should update on change
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '2.5' } });
        rerender(
            <RentIncreaseField
                value={2.5}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        expect(screen.queryByText('Annual rent increase is required')).not.toBeInTheDocument();
    });
});
