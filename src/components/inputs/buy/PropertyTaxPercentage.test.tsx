import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { PropertyTaxPercentageField } from './PropertyTaxPercentage';

describe('PropertyTaxPercentageField', () => {
    test('PropertyTaxPercentageField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = vi.fn();
        render(<PropertyTaxPercentageField value={0.75} onChange={mockOnChange} />);
        expect(screen.getByText('Property Tax')).toBeInTheDocument();
    });

    test('PropertyTaxPercentageField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = vi.fn();
        render(<PropertyTaxPercentageField value={0.75} onChange={mockOnChange} />);
        const slider = screen.getByRole('slider');
        fireEvent.keyDown(slider, { key: 'ArrowRight' });
        expect(mockOnChange).toHaveBeenCalled();
    });
    // Label Props Tests
    describe('Label Props', () => {
        test('PropertyTaxPercentageField_shouldCallOnLabelSetWithLabelElement', () => {
            const mockOnChange = vi.fn();
            const mockOnLabelSet = vi.fn();

            render(
                <PropertyTaxPercentageField
                    value={20}
                    onChange={mockOnChange}
                    onLabelSet={mockOnLabelSet}
                />
            );

            // onLabelSet should be called with a React element
            expect(mockOnLabelSet).toHaveBeenCalledTimes(1);
            expect(mockOnLabelSet).toHaveBeenCalledWith(expect.any(Object));
        });

        test('PropertyTaxPercentageField_shouldHideLabelWhenShowLabelIsFalse', () => {
            const mockOnChange = vi.fn();

            render(
                <PropertyTaxPercentageField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={false}
                />
            );

            // Label should not be visible
            const label = screen.queryByText('Property Tax');
            expect(label).not.toBeInTheDocument();
        });

        test('PropertyTaxPercentageField_shouldShowLabelByDefault', () => {
            const mockOnChange = vi.fn();

            render(
                <PropertyTaxPercentageField
                    value={20}
                    onChange={mockOnChange}
                />
            );

            // Label should be visible by default
            const label = screen.getByText('Property Tax');
            expect(label).toBeInTheDocument();
        });

        test('PropertyTaxPercentageField_shouldShowLabelWhenShowLabelIsTrue', () => {
            const mockOnChange = vi.fn();

            render(
                <PropertyTaxPercentageField
                    value={20}
                    onChange={mockOnChange}
                    showLabel={true}
                />
            );

            // Label should be visible
            const label = screen.getByText('Property Tax');
            expect(label).toBeInTheDocument();
        });
    });
});
