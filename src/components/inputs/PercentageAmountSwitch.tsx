import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cloneElement, FC, ReactElement, useCallback, useEffect, useState } from 'react';

export interface PercentageAmountSwitchProps {
    id?: string;
    label: string;
    percentageComponent: ReactElement;
    amountComponent: ReactElement;
    mode: 'percentage' | 'amount';
    onModeChange: (mode: 'percentage' | 'amount') => void;
    percentageValue: number;
    amountValue: number;
    onPercentageChange: (value: number) => void;
    onAmountChange: (value: number) => void;
    totalAmount?: number | (() => number);
    className?: string;
    disabled?: boolean;
}

/**
 * A wrapper component that allows users to switch between percentage and amount input modes.
 * Automatically calculates the corresponding value when switching between modes.
 */
export const PercentageAmountSwitch: FC<PercentageAmountSwitchProps> = ({
    id = 'percentageAmountSwitch',
    label,
    percentageComponent,
    amountComponent,
    mode,
    onModeChange,
    percentageValue,
    amountValue,
    onPercentageChange,
    onAmountChange,
    totalAmount,
    className = '',
    disabled = false
}) => {
    const [internalMode, setInternalMode] = useState<'percentage' | 'amount'>(mode);
    const [percentageLabel, setPercentageLabel] = useState<React.ReactElement | null>(null);
    const [amountLabel, setAmountLabel] = useState<React.ReactElement | null>(null);

    // Sync internal mode with prop
    useEffect(() => {
        setInternalMode(mode);
    }, [mode]);

    // Memoized callback for percentage label
    const handlePercentageLabelSet = useCallback((label: React.ReactElement) => {
        setPercentageLabel(label);
    }, []);

    // Memoized callback for amount label
    const handleAmountLabelSet = useCallback((label: React.ReactElement) => {
        setAmountLabel(label);
    }, []);

    // Handle mode change
    const handleModeChange = (newMode: 'percentage' | 'amount') => {
        if (disabled) return;

        setInternalMode(newMode);
        onModeChange(newMode);

        // Calculate the corresponding value when switching modes
        const total = typeof totalAmount === 'function' ? totalAmount() : totalAmount;

        if (total && total > 0) {
            if (newMode === 'amount') {
                // Switching to amount mode: calculate amount from percentage
                const calculatedAmount = (percentageValue / 100) * total;
                onAmountChange(calculatedAmount);
            } else {
                // Switching to percentage mode: calculate percentage from amount
                const calculatedPercentage = (amountValue / total) * 100;
                onPercentageChange(calculatedPercentage);
            }
        }
    };

    // Clone the components to inject the onLabelSet and showLabel props
    const enhancedPercentageComponent = cloneElement(percentageComponent, {
        onLabelSet: handlePercentageLabelSet,
        showLabel: false
    } as Partial<typeof percentageComponent.props>);

    const enhancedAmountComponent = cloneElement(amountComponent, {
        onLabelSet: handleAmountLabelSet,
        showLabel: false
    } as Partial<typeof amountComponent.props>);

    // Use the captured label from the active component, fallback to prop label
    const displayLabel = internalMode === 'percentage' ? 
        (percentageLabel || <span className="text-sm font-medium">{label}</span>) : 
        (amountLabel || <span className="text-sm font-medium">{label}</span>);

    // Radio group component
    const radioGroupComponent = (
        <RadioGroup
            value={internalMode}
            onValueChange={(value) => handleModeChange(value as 'percentage' | 'amount')}
            className="flex items-center gap-4"
            disabled={disabled}
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id={`${id}-percentage`} disabled={disabled} />
                <Label htmlFor={`${id}-percentage`} className="text-xs cursor-pointer">
                    Percentage (%)
                </Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="amount" id={`${id}-amount`} disabled={disabled} />
                <Label htmlFor={`${id}-amount`} className="text-xs cursor-pointer">
                    Amount ($)
                </Label>
            </div>
        </RadioGroup>
    );

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                {displayLabel}
                {radioGroupComponent}
            </div>
            <div>
                {internalMode === 'percentage' ? enhancedPercentageComponent : enhancedAmountComponent}
            </div>
        </div>
    );
};

export default PercentageAmountSwitch;
