import '@testing-library/jest-dom';

import { render, fireEvent, screen } from '@testing-library/react';
import { ClosingCostsPercentageField } from './ClosingCostsPercentage';

describe('ClosingCostsPercentageField', () => {
    test('ClosingCostsPercentageField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = vi.fn();
        render(<ClosingCostsPercentageField value={1.5} onChange={mockOnChange} />);

        expect(screen.getByText('Closing Costs')).toBeInTheDocument();
    });

    test('ClosingCostsPercentageField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = vi.fn();
        render(<ClosingCostsPercentageField value={1.5} onChange={mockOnChange} />);
        
        const slider = screen.getByRole('slider');
        fireEvent.keyDown(slider, { key: 'ArrowRight' });
        expect(mockOnChange).toHaveBeenCalled();
    });

    // Label Props Tests
    describe('Label Props', () => {
        test('ClosingCostsPercentageField_shouldCallOnLabelSetWithLabelElement', () => {
            const mockOnChange = vi.fn();
            const mockOnLabelSet = vi.fn();

            render(
                <ClosingCostsPercentageField
                    value={1.5}
                    onChange={mockOnChange}
                    onLabelSet={mockOnLabelSet}
                />
            );

            // onLabelSet should be called with a React element
            expect(mockOnLabelSet).toHaveBeenCalledTimes(1);
            expect(mockOnLabelSet).toHaveBeenCalledWith(expect.any(Object));
        });

        test('ClosingCostsPercentageField_shouldHideLabelWhenShowLabelIsFalse', () => {
            const mockOnChange = vi.fn();

            render(
                <ClosingCostsPercentageField
                    value={1.5}
                    onChange={mockOnChange}
                    showLabel={false}
                />
            );

            // Label should not be visible
            const label = screen.queryByText('Closing Costs');
            expect(label).not.toBeInTheDocument();
        });

        test('ClosingCostsPercentageField_shouldShowLabelByDefault', () => {
            const mockOnChange = vi.fn();

            render(
                <ClosingCostsPercentageField
                    value={1.5}
                    onChange={mockOnChange}
                />
            );

            // Label should be visible by default
            const label = screen.getByText('Closing Costs');
            expect(label).toBeInTheDocument();
        });

        test('ClosingCostsPercentageField_shouldShowLabelWhenShowLabelIsTrue', () => {
            const mockOnChange = vi.fn();

            render(
                <ClosingCostsPercentageField
                    value={1.5}
                    onChange={mockOnChange}
                    showLabel={true}
                />
            );

            // Label should be visible
            const label = screen.getByText('Closing Costs');
            expect(label).toBeInTheDocument();
        });
    });
});
