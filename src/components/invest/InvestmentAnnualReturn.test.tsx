import { fireEvent, render, screen } from '@testing-library/react';
import { InvestmentAnnualReturnField } from './InvestmentAnnualReturn';

describe('InvestmentAnnualReturnField', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Basic rendering tests
    test('InvestmentAnnualReturnField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value={7.5}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByDisplayValue('7.50');
        expect(input).toBeTruthy();

        const label = screen.getByText(/Expected Return/i);
        expect(label).toBeTruthy();
    });

    test('InvestmentAnnualReturnField_shouldRenderWithRequiredIndicator_whenValidationRequired', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value={7.5}
                onChange={mockOnChange}
                enableValidation={true}
                validationMode="required"
            />
        );

        const requiredIndicator = screen.getByText('*');
        expect(requiredIndicator).toBeTruthy();
    });

    test('InvestmentAnnualReturnField_shouldRenderInputOnly_whenDisplayModeIsInput', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value={7.5}
                onChange={mockOnChange}
                displayMode="input"
            />
        );

        const input = screen.getByDisplayValue('7.50');
        expect(input).toBeTruthy();

        const slider = screen.queryByRole('slider');
        expect(slider).toBeFalsy();
    });

    test('InvestmentAnnualReturnField_shouldRenderSliderOnly_whenDisplayModeIsSlider', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value={7.5}
                onChange={mockOnChange}
                displayMode="slider"
            />
        );

        const slider = screen.getByRole('slider');
        expect(slider).toBeTruthy();

        const valueDisplay = screen.getByText('7.50%');
        expect(valueDisplay).toBeTruthy();
    });

    test('InvestmentAnnualReturnField_shouldRenderBothInputAndSlider_whenDisplayModeIsCombined', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value={7.5}
                onChange={mockOnChange}
                displayMode="combined"
            />
        );

        const input = screen.getByDisplayValue('7.50');
        expect(input).toBeTruthy();

        const slider = screen.getByRole('slider');
        expect(slider).toBeTruthy();
    });

    test('InvestmentAnnualReturnField_shouldHandleInputChange', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '8.5' } });

        expect(mockOnChange).toHaveBeenCalledWith(8.5);
    });

    test('InvestmentAnnualReturnField_shouldRespectDisabledState', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value={7.5}
                onChange={mockOnChange}
                disabled={true}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input.hasAttribute('disabled')).toBe(true);
    });

    test('InvestmentAnnualReturnField_shouldRenderSlider', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value={7.5}
                onChange={mockOnChange}
            />
        );

        const slider = screen.getByRole('slider');
        expect(slider).toBeTruthy();
    });

    test('InvestmentAnnualReturnField_shouldHandleEmptyValue', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByRole('textbox');
        expect(input.getAttribute('value')).toBe('');
    });

    test('InvestmentAnnualReturnField_shouldHandleNegativeNumbers', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value={-10.5}
                onChange={mockOnChange}
            />
        );

        const input = screen.getByDisplayValue('-10.50');
        expect(input).toBeTruthy();
    });

    test('InvestmentAnnualReturnField_shouldShowHelperButton_whenShowHelperIsTrue', () => {
        const mockOnChange = jest.fn();

        render(
            <InvestmentAnnualReturnField
                value={7.5}
                onChange={mockOnChange}
                showHelper={true}
            />
        );

        const helperButton = screen.getByText("You're not sure?");
        expect(helperButton).toBeTruthy();
    });
});