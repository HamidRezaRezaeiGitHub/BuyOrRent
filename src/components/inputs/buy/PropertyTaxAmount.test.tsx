import { fireEvent, render, screen } from '@testing-library/react';
import { PropertyTaxAmountField } from './PropertyTaxAmount';

describe('PropertyTaxAmountField', () => {
    test('PropertyTaxAmountField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        render(<PropertyTaxAmountField value={4500} onChange={mockOnChange} />);
        expect(screen.getByText('Property Tax')).toBeInTheDocument();
    });

    test('PropertyTaxAmountField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = jest.fn();
        render(<PropertyTaxAmountField value={4500} onChange={mockOnChange} />);
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '5000' } });
        expect(mockOnChange).toHaveBeenCalledWith(5000);
    });
});
