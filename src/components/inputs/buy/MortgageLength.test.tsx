import { fireEvent, render, screen } from '@testing-library/react';
import { MortgageLengthField } from './MortgageLength';

describe('MortgageLengthField', () => {
    test('MortgageLengthField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        render(<MortgageLengthField value={25} onChange={mockOnChange} />);
        expect(screen.getByText('Mortgage Length')).toBeInTheDocument();
    });

    test('MortgageLengthField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = jest.fn();
        render(<MortgageLengthField value={25} onChange={mockOnChange} />);
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '30' } });
        expect(mockOnChange).toHaveBeenCalledWith(30);
    });
});
