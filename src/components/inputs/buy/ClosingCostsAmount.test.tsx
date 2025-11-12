import '@testing-library/jest-dom';

import { render, fireEvent, screen } from '@testing-library/react';
import { ClosingCostsAmountField } from './ClosingCostsAmount';

describe('ClosingCostsAmountField', () => {
    test('ClosingCostsAmountField_shouldRenderWithDefaultProps', () => {
        const mockOnChange = vi.fn();
        render(<ClosingCostsAmountField value={12000} onChange={mockOnChange} />);

        expect(screen.getByText('Closing Costs')).toBeInTheDocument();
    });

    test('ClosingCostsAmountField_shouldUpdateValue_whenSliderChanged', () => {
        const mockOnChange = vi.fn();
        render(<ClosingCostsAmountField value={12000} onChange={mockOnChange} />);
        
        const slider = screen.getByRole('slider');
        fireEvent.keyDown(slider, { key: 'ArrowRight' });
        expect(mockOnChange).toHaveBeenCalled();
    });

    // Label Props Tests
    describe('Label Props', () => {
        test('ClosingCostsAmountField_shouldCallOnLabelSetWithLabelElement', () => {
            const mockOnChange = vi.fn();
            const mockOnLabelSet = vi.fn();

            render(
                <ClosingCostsAmountField
                    value={12000}
                    onChange={mockOnChange}
                    onLabelSet={mockOnLabelSet}
                />
            );

            // onLabelSet should be called with a React element
            expect(mockOnLabelSet).toHaveBeenCalledTimes(1);
            expect(mockOnLabelSet).toHaveBeenCalledWith(expect.any(Object));
        });

        test('ClosingCostsAmountField_shouldHideLabelWhenShowLabelIsFalse', () => {
            const mockOnChange = vi.fn();

            render(
                <ClosingCostsAmountField
                    value={12000}
                    onChange={mockOnChange}
                    showLabel={false}
                />
            );

            // Label should not be visible
            const label = screen.queryByText('Closing Costs');
            expect(label).not.toBeInTheDocument();
        });

        test('ClosingCostsAmountField_shouldShowLabelByDefault', () => {
            const mockOnChange = vi.fn();

            render(
                <ClosingCostsAmountField
                    value={12000}
                    onChange={mockOnChange}
                />
            );

            // Label should be visible by default
            const label = screen.getByText('Closing Costs');
            expect(label).toBeInTheDocument();
        });

        test('ClosingCostsAmountField_shouldShowLabelWhenShowLabelIsTrue', () => {
            const mockOnChange = vi.fn();

            render(
                <ClosingCostsAmountField
                    value={12000}
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
