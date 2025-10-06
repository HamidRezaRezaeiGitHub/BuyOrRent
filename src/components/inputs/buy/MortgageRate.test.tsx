import { fireEvent, render, screen } from '@testing-library/react';
import { MortgageRateField } from './MortgageRate';

describe('MortgageRateField', () => {
    test('MortgageRateField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
        expect(screen.getByText('Mortgage Rate')).toBeInTheDocument();
    });

    test('MortgageRateField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = jest.fn();
        render(<MortgageRateField value={5.5} onChange={mockOnChange} />);
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '6.5' } });
        expect(mockOnChange).toHaveBeenCalledWith(6.5);
    });
});
