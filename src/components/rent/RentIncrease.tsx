import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { Info, Percent } from 'lucide-react';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';

export interface RentIncreaseFieldProps {
    id?: string;
    value: number | '';
    onChange: (value: number | '') => void;
    disabled?: boolean;
    className?: string;
    errors?: string[];
    placeholder?: string;
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (validationResult: ValidationResult) => void;
    displayMode?: 'slider' | 'input' | 'combined'; // Default: 'combined'
    defaultValue?: number; // Default: 2.5
    minValue?: number; // Default: 0
    maxValue?: number; // Default: 20
}

/**
 * Parse a formatted percentage string to a number
 * @param formatted - The formatted string (e.g., "2.50" or "2.5")
 * @returns The numeric value or empty string if invalid
 */
const parsePercentage = (formatted: string): number | '' => {
    // Remove all non-digit characters except decimal point and minus sign
    const cleaned = formatted.replace(/[^\d.-]/g, '');
    if (cleaned === '' || cleaned === '-') return '';

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? '' : parsed;
};

/**
 * Format a number as percentage (with 1-2 decimal places as needed)
 */
const formatPercentage = (value: number): string => {
    // Show up to 2 decimal places, but remove trailing zeros
    return new Intl.NumberFormat('en-CA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
};

export const RentIncreaseField: FC<RentIncreaseFieldProps> = ({
    id = 'rentIncrease',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = '2.50',
    enableValidation = false,
    validationMode = 'optional',
    onValidationChange,
    displayMode = 'combined',
    defaultValue = 2.5,
    minValue = 0,
    maxValue = 20
}) => {
    // Track tooltip open state for mobile-friendly click interaction
    const [tooltipOpen, setTooltipOpen] = useState(false);

    // Track focus state for input formatting
    const [isFocused, setIsFocused] = useState(false);

    // Track display value for input field (formatted vs unformatted)
    const [displayValue, setDisplayValue] = useState<string>(() => {
        // Initialize with formatted value since input starts unfocused
        if (value === '') return '';
        return formatPercentage(value as number);
    });

    // Internal formatted value state (not exposed to parent)
    const [formattedValue, setFormattedValue] = useState<string>(() => {
        if (value === '') return '';
        return formatPercentage(value as number);
    });

    // Formatting function for percentage values
    const formatValue = useMemo(() => {
        return (val: number): string => {
            return formatPercentage(val);
        };
    }, []);

    useEffect(() => {
        if (isFocused) {
            // When focused, show unformatted value
            setDisplayValue(value === '' ? '' : value.toString());
        } else {
            // When not focused, show formatted value
            if (value !== '') {
                const formattedVal = formatValue(value as number);
                setFormattedValue(formattedVal);
            } else {
                setFormattedValue('');
            }
        }
    }, [value, isFocused, formatValue]);

    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formattedValue);
        }
    }, [formattedValue, isFocused]);

    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: 'Annual rent increase is required',
                validator: (val: string) => {
                    if (val === '') return false;
                    const numVal = parsePercentage(val);
                    return numVal !== '';
                }
            }] : []),
            {
                name: 'nonNegative',
                message: 'Annual rent increase must be a non-negative number',
                validator: (val: string) => {
                    if (val === '') return validationMode === 'optional';
                    const numVal = parsePercentage(val);
                    return numVal === '' || (numVal as number) >= minValue;
                }
            },
            {
                name: 'maxValue',
                message: `Annual rent increase must not exceed ${formatPercentage(maxValue)}%`,
                validator: (val: string) => {
                    if (val === '') return validationMode === 'optional';
                    const numVal = parsePercentage(val);
                    return numVal === '' || (numVal as number) <= maxValue;
                }
            }
        ];
    }, [enableValidation, validationMode, minValue, maxValue]);

    // Determine field name for validation
    const fieldName = useMemo(() => id || 'rentIncrease', [id]);

    // Memoized config for the validation hook
    const hookConfig = useMemo(() => ({
        fieldName,
        fieldType: 'text' as const,
        required: validationMode === 'required',
        validationRules
    }), [fieldName, validationMode, validationRules]);

    // Use the smart field validation hook
    const { state, handlers } = useSmartFieldValidation({
        value: value === '' ? '' : value.toString(),
        config: hookConfig,
        enableValidation,
        onValidationChange
    });

    // Handle slider change
    const handleSliderChange = (values: number[]) => {
        // Round to 2 decimal places for percentages
        const newValue = Math.round(values[0] * 100) / 100;

        // Use the hook's change handler
        handlers.handleChange(newValue.toString(), value === '' ? '' : value.toString());

        onChange(newValue);
    };

    const handleSliderBlur = () => {
        handlers.handleBlur();
    };

    // Handle input change
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const oldValue = displayValue;
        const newValue = e.target.value;

        // Use the hook's change handler for validation
        handlers.handleChange(newValue, oldValue);

        // Update display value immediately (unformatted while typing)
        setDisplayValue(newValue);

        // The input field is changing when in focus, so we don't call onChange here.
        // onChange will be called on blur after validation and formatting.
    };

    const handleInputFocus = () => {
        setIsFocused(true); // This will trigger useEffect to set the actual unformatted value to display
        handlers.handleFocus();
    };

    const handleInputBlur = () => {
        const lastInputValue = displayValue;
        const numericValue = parsePercentage(lastInputValue);
        let finalValue: number | '';

        if (lastInputValue.trim() === '' || numericValue === '') {
            finalValue = validationMode === 'required' ? defaultValue : '';
        } else {
            // Clamp value between min and max, round to 2 decimal places
            finalValue = Math.round(Math.max(minValue, Math.min(maxValue, numericValue as number)) * 100) / 100;
        }
        onChange(finalValue); // This will trigger the useEffect to update displayValue

        setIsFocused(false);
        handlers.handleBlur();
    };

    // Determine which errors to display
    const displayErrors = enableValidation ? state.displayErrors : errors;
    const hasErrors = displayErrors.length > 0;

    // Determine if field is required for label display
    const isRequired = enableValidation && validationMode === 'required';

    // Label component with icon and tooltip
    const labelComponent = (
        <div className="flex items-center gap-1">
            <Percent className="h-3 w-3 text-muted-foreground" />
            <Label htmlFor={id} className="text-xs">
                Annual Rent Increase
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <TooltipProvider>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="ml-1"
                            aria-label="More information about Annual Rent Increase"
                            onClick={() => setTooltipOpen(!tooltipOpen)}
                        >
                            <Info className="h-3 w-3 text-muted-foreground" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                        <div className="text-xs">
                            <p>
                                The annual percentage increase in rent. This represents the expected yearly growth in your rental costs. The default value of 2.5% is a common estimate for rental market increases, but you can adjust this based on your specific rental agreement or local market conditions.
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );

    // Error display component
    const errorDisplay = hasErrors && (
        <div className="space-y-1">
            {displayErrors.map((error, index) => (
                <p key={index} className="text-xs text-red-500">{error}</p>
            ))}
        </div>
    );

    // Slider component
    const sliderComponent = (
        <Slider
            id={displayMode === 'slider' ? id : `${id}-slider`}
            min={minValue}
            max={maxValue}
            step={0.1} // 0.1% increments for fine granularity
            value={[typeof value === 'number' ? value : minValue]}
            onValueChange={handleSliderChange}
            onBlur={handleSliderBlur}
            disabled={disabled}
            className={`${displayMode === 'combined' ? 'flex-1' : 'w-full'} ${hasErrors ? 'opacity-50' : ''}`}
        />
    );

    // Input component
    const inputComponent = (
        <div className="relative">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-sm text-muted-foreground">%</span>
            </div>
            <Input
                id={displayMode === 'input' ? id : `${id}-input`}
                type="text"
                inputMode="decimal"
                placeholder={placeholder}
                value={displayValue}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={disabled}
                className={`${displayMode === 'combined' ? 'w-32' : 'w-full'} pr-7 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
            />
        </div>
    );

    // Value display (for slider and combined modes)
    const valueDisplay = (
        <div className="min-w-[5rem] text-center">
            <span className="text-sm font-medium">
                {typeof value === 'number' ? formatPercentage(value) : '0'}%
            </span>
            <span className="text-xs text-muted-foreground block">per year</span>
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
            {labelComponent}
            {renderField()}
            {errorDisplay}
        </div>
    );
};

export default RentIncreaseField;
