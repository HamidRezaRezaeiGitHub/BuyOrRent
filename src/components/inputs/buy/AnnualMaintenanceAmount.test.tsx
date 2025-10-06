import { fireEvent, render, screen } from '@testing-library/react';
import { AnnualMaintenanceAmountField } from './AnnualMaintenanceAmount';

describe('AnnualMaintenanceAmountField', () => {
    test('AnnualMaintenanceAmountField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        render(<AnnualMaintenanceAmountField value={6000} onChange={mockOnChange} />);
        expect(screen.getByText('Annual Maintenance')).toBeInTheDocument();
    });

    test('AnnualMaintenanceAmountField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = jest.fn();
        render(<AnnualMaintenanceAmountField value={6000} onChange={mockOnChange} />);
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '7000' } });
        expect(mockOnChange).toHaveBeenCalledWith(7000);
    });
});
