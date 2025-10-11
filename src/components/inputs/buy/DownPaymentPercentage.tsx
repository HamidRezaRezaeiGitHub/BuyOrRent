import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Percent } from 'lucide-react';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface DownPaymentPercentageFieldProps {
    id?: string;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    className?: string;
    displayMode?: 'slider' | 'input' | 'combined'; // Default: 'combined'
    defaultValue?: number; // Default: 20
    minValue?: number; // Default: 0
    maxValue?: number; // Default: 100
    onLabelSet?: (label: React.ReactElement) => void;
    showLabel?: boolean; // Default: true
    showDescription?: boolean; // Default: true
}

export const DownPaymentPercentageField: FC<DownPaymentPercentageFieldProps> = ({
    id = 'downPaymentPercentage',
    value,
    onChange,
    disabled = false,
    className = '',
    displayMode = 'combined',
    defaultValue = 20,
    minValue = 0,
    maxValue = 100,
    onLabelSet,
    showLabel = true,
    showDescription = true
}) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    // Reusable function to clamp and round percentage values within valid range
    const clampValue = useCallback((inputValue: number): number => {
        return Math.max(minValue, Math.min(maxValue, Math.round(inputValue * 100) / 100));
    }, [minValue, maxValue]);

    // Validate and clamp the initial value with comprehensive error handling
    const validatedValue = useMemo(() => {
        // Handle invalid inputs: NaN, Infinity, null, undefined, etc.
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
            return clampValue(defaultValue);
        }

        return clampValue(value);
    }, [value, defaultValue, clampValue]);

    // Compute display value based on focus state
    const displayValue = useMemo(() => {
        if (isFocused) {
            return inputValue;
        }
        return validatedValue.toFixed(2);
    }, [isFocused, inputValue, validatedValue]);

    // Sync inputValue when value changes externally (but not when focused)
    useEffect(() => {
        if (!isFocused) {
            setInputValue(validatedValue.toString());
        }
    }, [validatedValue, isFocused]);

    // Track if we've already notified parent to prevent infinite loops
    const lastNotifiedValue = useRef<number>(value);

    // Notify parent if validated value differs from prop value (only once per change)
    useEffect(() => {
        if (validatedValue !== value && lastNotifiedValue.current !== validatedValue) {
            lastNotifiedValue.current = validatedValue;
            onChange(validatedValue);
        }
    }, [validatedValue, value, onChange]);


    // Handle slider change
    const handleSliderChange = (values: number[]) => {
        const rawValue = values[0];
        if (typeof rawValue === 'number' && !isNaN(rawValue) && isFinite(rawValue)) {
            const clampedValue = clampValue(rawValue);
            onChange(clampedValue);
        }
    };

    // Handle input change with comprehensive error handling
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // Provide immediate feedback for valid numeric values
        try {
            const numericValue = parseFloat(newValue);
            if (!isNaN(numericValue) && isFinite(numericValue) && numericValue >= minValue && numericValue <= maxValue) {
                const clampedValue = clampValue(numericValue);
                onChange(clampedValue);
            }
        } catch (error) {
            // Silently handle parsing errors - validation will happen on blur
            console.debug('Input parsing error:', error);
        }
    };

    const handleInputFocus = () => {
        setInputValue(validatedValue.toString());
        setIsFocused(true);
    };

    const handleInputBlur = () => {
        let finalValue: number;

        try {
            const trimmedValue = inputValue.trim();
            const numericValue = parseFloat(trimmedValue);

            if (trimmedValue === '' || isNaN(numericValue) || !isFinite(numericValue)) {
                finalValue = clampValue(defaultValue);
            } else {
                // Clamp value between min and max
                finalValue = clampValue(numericValue);
            }
        } catch (error) {
            console.debug('Input blur parsing error:', error);
            finalValue = defaultValue;
        }

        setIsFocused(false);

        // Only call onChange if the finalValue is different from the input value that was just typed
        // This prevents redundant onChange calls when the user types a valid value and then blurs
        const originalInputValue = parseFloat(inputValue.trim());
        const epsilon = 0.001;

        if (isNaN(originalInputValue) || Math.abs(finalValue - originalInputValue) > epsilon) {
            // Only call onChange if:
            // 1. The original input was invalid (NaN), so we need to notify about the fallback value
            // 2. The final value is different from what the user typed (clamping occurred)
            onChange(finalValue);
        }
    };

    // Determine the correct htmlFor based on display mode
    const getMainControlId = () => {
        switch (displayMode) {
            case 'slider':
                return id;
            case 'input':
                return id;
            case 'combined':
                return `${id}-slider`; // Point to slider as primary control in combined mode
            default:
                return id;
        }
    };

    // Label component with icon and tooltip (memoized)
    const labelComponent = useMemo(() => (
        <FieldLabel htmlFor={getMainControlId()} className="flex items-center gap-1 text-xs">
            <Percent className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            Down Payment
            <TooltipProvider>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="ml-1"
                            aria-label="More information about Down Payment Percentage"
                            aria-describedby={`${id}-tooltip`}
                            aria-expanded={tooltipOpen}
                            onClick={() => setTooltipOpen(!tooltipOpen)}
                        >
                            <Info className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs" id={`${id}-tooltip`}>
                        <div className="text-xs">
                            <p>
                                The percentage of the purchase price you pay upfront as a down payment. A higher down payment reduces your mortgage amount and monthly payments.
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </FieldLabel>
    ), [id, tooltipOpen]);

    // Notify parent about label if onLabelSet is provided
    useEffect(() => {
        if (onLabelSet) {
            onLabelSet(labelComponent);
        }
    }, [onLabelSet, labelComponent]);

    // Slider component
    const sliderComponent = (
        <Slider
            id={displayMode === 'slider' ? id : `${id}-slider`}
            min={minValue}
            max={maxValue}
            step={0.1} // 0.1% increments for fine granularity
            value={[validatedValue]}
            onValueChange={handleSliderChange}
            disabled={disabled}
            className={`${displayMode === 'combined' ? 'flex-1' : 'w-full'}`}
            aria-label={`Down payment percentage: ${validatedValue}%`}
            aria-valuemin={minValue}
            aria-valuemax={maxValue}
            aria-valuenow={validatedValue}
            aria-valuetext={`${validatedValue} percent`}
        />
    );

    // Input component
    const inputComponent = (
        <InputGroup className={displayMode === 'combined' ? 'w-32' : 'w-full'}>
            <InputGroupInput
                id={displayMode === 'input' ? id : `${id}-input`}
                type={isFocused ? 'number' : 'text'}
                inputMode={isFocused ? 'decimal' : 'text'}
                min={minValue}
                max={maxValue}
                step={0.1}
                placeholder="Enter percentage"
                value={displayValue}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={disabled}
                aria-label={`Down payment percentage, current value: ${validatedValue}%`}
                aria-describedby={`${id}-suffix ${id}-tooltip`}
            />
            <InputGroupAddon align="inline-end">
                <InputGroupText id={`${id}-suffix`}>%</InputGroupText>
            </InputGroupAddon>
        </InputGroup>
    );

    // Value display (for slider and combined modes)
    const valueDisplay = (
        <div className="min-w-[5rem] text-center" aria-live="polite">
            <span className="text-sm font-medium" aria-label={`Current value: ${validatedValue} percent`}>
                {validatedValue.toFixed(2)}%
            </span>
        </div>
    );

    // Render field based on displayMode
    const renderField = () => {
        switch (displayMode) {
            case 'slider':
                return (
                    <div className="flex items-center gap-3">
                        {sliderComponent}
                        {valueDisplay}
                    </div>
                );

            case 'input':
                return inputComponent;

            case 'combined':
                return (
                    <div className="flex items-center gap-3">
                        {sliderComponent}
                        {inputComponent}
                    </div>
                );

            default:
                return (
                    <div className="flex items-center gap-3">
                        {sliderComponent}
                        {valueDisplay}
                    </div>
                );
        }
    };

    return (
        <Field className={className}>
            {showLabel && labelComponent}
            {renderField()}
            {showDescription && (
                <FieldDescription className="text-xs text-muted-foreground">
                    Upfront payment percentage to reduce mortgage amount
                </FieldDescription>
            )}
        </Field>
    );
};

export default DownPaymentPercentageField;
