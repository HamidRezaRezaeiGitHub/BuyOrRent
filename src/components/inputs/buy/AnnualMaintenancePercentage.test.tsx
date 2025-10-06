import { fireEvent, render, screen } from '@testing-library/react';
import { AnnualMaintenancePercentageField } from './AnnualMaintenancePercentage';

describe('AnnualMaintenancePercentageField', () => {
    test('AnnualMaintenancePercentageField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        render(<AnnualMaintenancePercentageField value={1.0} onChange={mockOnChange} />);
        expect(screen.getByText('Annual Maintenance')).toBeInTheDocument();
    });

    test('AnnualMaintenancePercentageField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = jest.fn();
        render(<AnnualMaintenancePercentageField value={1.0} onChange={mockOnChange} />);
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '1.5' } });
        expect(mockOnChange).toHaveBeenCalledWith(1.5);
    });
});
