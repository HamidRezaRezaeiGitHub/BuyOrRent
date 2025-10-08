import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Info } from 'lucide-react';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface MortgageLengthFieldProps {
    id?: string;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    className?: string;
    displayMode?: 'slider' | 'input' | 'combined'; // Default: 'combined'
    defaultValue?: number; // Default: 25 (most common in Canada)
    minValue?: number; // Default: 1
    maxValue?: number; // Default: 40
    onLabelSet?: (label: React.ReactElement) => void;
    showLabel?: boolean; // Default: true
}

export const MortgageLengthField: FC<MortgageLengthFieldProps> = ({
    id = 'mortgageLength',
    value,
    onChange,
    disabled = false,
    className = '',
    displayMode = 'combined',
    defaultValue = 25,
    minValue = 1,
    maxValue = 40,
    onLabelSet,
    showLabel = true
}) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    // Reusable function to clamp and round values within valid range
    const clampValue = useCallback((inputValue: number): number => {
        // Round to nearest 2.5 year increment
        const rounded = Math.round(inputValue / 2.5) * 2.5;
        return Math.max(minValue, Math.min(maxValue, rounded));
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
        // Format to show decimals only when needed (e.g., 25.5 but 25 for whole numbers)
        return validatedValue % 1 === 0 ? validatedValue.toString() : validatedValue.toFixed(1);
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
            const numericValue = parseFloat(trimmedValue); // Use parseFloat to handle decimals

            if (trimmedValue === '' || isNaN(numericValue) || !isFinite(numericValue)) {
                finalValue = clampValue(defaultValue);
            } else {
                // Clamp value between min and max, ensure it's an integer
                finalValue = clampValue(numericValue);
            }
        } catch (error) {
            console.debug('Input blur parsing error:', error);
            finalValue = clampValue(defaultValue);
        }

        // Only call onChange if the value actually changed
        if (finalValue !== validatedValue) {
            onChange(finalValue);
        }
        setIsFocused(false);
    };

    // Label component with icon and tooltip (memoized)
    const labelComponent = useMemo(() => (
        <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            <Label htmlFor={id} className="text-xs">
                Mortgage Length
            </Label>
            <TooltipProvider>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="ml-1"
                            aria-label="More information about Mortgage Length"
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
                                The total number of years over which you'll repay your mortgage. A longer term means lower monthly payments but more interest paid overall.
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
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
            step={2.5}
            value={[validatedValue]}
            onValueChange={handleSliderChange}
            disabled={disabled}
            className={`${displayMode === 'combined' ? 'flex-1' : 'w-full'}`}
            aria-label={`Mortgage length: ${validatedValue} years`}
            aria-valuemin={minValue}
            aria-valuemax={maxValue}
            aria-valuenow={validatedValue}
            aria-valuetext={`${validatedValue} years`}
        />
    );

    // Input component
    const inputComponent = (
        <div className="relative">
            <Input
                id={displayMode === 'input' ? id : `${id}-input`}
                type="number"
                inputMode="numeric"
                min={minValue}
                max={maxValue}
                placeholder="Enter years"
                value={displayValue}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={disabled}
                className={`${displayMode === 'combined' ? 'w-32 pr-12' : 'w-full pr-12'}`}
                aria-label={`Mortgage length in years, current value: ${validatedValue}`}
                aria-describedby={`${id}-suffix ${id}-tooltip`}
            />
            <div
                id={`${id}-suffix`}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
            >
                <span className="text-sm text-muted-foreground">yrs</span>
            </div>
        </div>
    );

    // Value display (for slider and combined modes)
    const valueDisplay = (
        <div className="min-w-[3rem] text-center" aria-live="polite">
            <span className="text-sm font-medium" aria-label={`Current value: ${validatedValue} years`}>
                {validatedValue}
            </span>
            <span className="text-xs text-muted-foreground ml-1" aria-hidden="true">years</span>
        </div>
    );

    // Render field based on displayMode
    const renderField = () => {
        switch (displayMode) {
            case 'slider':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            {sliderComponent}
                            {valueDisplay}
                        </div>
                    </div>
                );

            case 'input':
                return (
                    <div className="space-y-2">
                        {inputComponent}
                    </div>
                );

            case 'combined':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            {sliderComponent}
                            {inputComponent}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            {sliderComponent}
                            {valueDisplay}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {showLabel && labelComponent}
            {renderField()}
        </div>
    );
};

export default MortgageLengthField;
