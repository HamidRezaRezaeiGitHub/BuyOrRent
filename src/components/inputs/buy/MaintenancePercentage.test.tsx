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
    // Label Props Tests
    describe('Label Props', () => {
        test('MaintenancePercentageField_shouldCallOnLabelSetWithLabelElement', () => {
            const mockOnChange = jest.fn();
            const mockOnLabelSet = jest.fn();

            render(
                <MaintenancePercentageField
                    value={20}
                    onChange={mockOnChange}
                    onLabelSet={mockOnLabelSet}
                />
            );

            // onLabelSet should be called with a React element
            expect(mockOnLabelSet).toHaveBeenCalledTimes(1);
            expect(mockOnLabelSet).toHaveBeenCalledWith(expect.any(Object));
        });

        test('MaintenancePercentageField_shouldHideLabelWhenShowLabelIsFalse', () => {
            const mockOnChange = jest.fn();

            render(
                <MaintenancePercentageField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={false}
                />
            );

            // Label should not be visible
            const label = screen.queryByText('Maintenance');
            expect(label).not.toBeInTheDocument();
        });

        test('MaintenancePercentageField_shouldShowLabelByDefault', () => {
            const mockOnChange = jest.fn();

            render(
                <MaintenancePercentageField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            // Label should be visible by default
            const label = screen.getByText('Maintenance');
            expect(label).toBeInTheDocument();
        });

        test('MaintenancePercentageField_shouldShowLabelWhenShowLabelIsTrue', () => {
            const mockOnChange = jest.fn();

            render(
                <MaintenancePercentageField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={true}
                />
            );

            // Label should be visible
            const label = screen.getByText('Maintenance');
            expect(label).toBeInTheDocument();
        });
    });
});
