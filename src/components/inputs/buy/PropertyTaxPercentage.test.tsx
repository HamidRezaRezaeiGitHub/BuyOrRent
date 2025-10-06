import { fireEvent, render, screen } from '@testing-library/react';
import { PropertyTaxPercentageField } from './PropertyTaxPercentage';

describe('PropertyTaxPercentageField', () => {
    test('PropertyTaxPercentageField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        render(<PropertyTaxPercentageField value={0.75} onChange={mockOnChange} />);
        expect(screen.getByText('Property Tax')).toBeInTheDocument();
    });

    test('PropertyTaxPercentageField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = jest.fn();
        render(<PropertyTaxPercentageField value={0.75} onChange={mockOnChange} />);
        const slider = screen.getByRole('slider');
        fireEvent.keyDown(slider, { key: 'ArrowRight' });
        expect(mockOnChange).toHaveBeenCalled();
    });
});
