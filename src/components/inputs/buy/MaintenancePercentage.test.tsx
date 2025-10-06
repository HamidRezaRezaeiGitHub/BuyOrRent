import { render, fireEvent, screen } from '@testing-library/react';
import { MaintenancePercentageField } from './MaintenancePercentage';

describe('MaintenancePercentageField', () => {
    test('MaintenancePercentageField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = jest.fn();
        render(<MaintenancePercentageField value={1.0} onChange={mockOnChange} />);

        expect(screen.getByText('Maintenance')).toBeInTheDocument();
    });

    test('MaintenancePercentageField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = jest.fn();
        render(<MaintenancePercentageField value={1.0} onChange={mockOnChange} />);
        
        const slider = screen.getByRole('slider');
        fireEvent.keyDown(slider, { key: 'ArrowRight' });
        expect(mockOnChange).toHaveBeenCalled();
    });
});
