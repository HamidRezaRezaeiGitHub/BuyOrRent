import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { Calendar, Info } from 'lucide-react';
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';

export interface YearsFieldProps {
    id?: string;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    className?: string;
    errors?: string[];
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    onValidationChange?: (validationResult: ValidationResult) => void;
    displayMode?: 'slider' | 'input' | 'combined'; // Default: 'slider'
    defaultValue?: number; // Default: 25
    minValue?: number; // Default: 1
    maxValue?: number; // Default: 50
}

export const YearsField: FC<YearsFieldProps> = ({
    id = 'analysisYears',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    enableValidation = false,
    validationMode = 'optional',
    onValidationChange,
    displayMode = 'combined',
    defaultValue = 25,
    minValue = 1,
    maxValue = 50
}) => {

    // Track tooltip open state for mobile-friendly click interaction
    const [tooltipOpen, setTooltipOpen] = useState(false);

    // Track focus state for input formatting
    const [isFocused, setIsFocused] = useState(false);

    // Track display value for input field (formatted vs unformatted)
    const [displayValue, setDisplayValue] = useState<string>(() => {
        // Initialize with formatted value since input starts unfocused
        return Math.round(value).toString();
    });

    // Internal formatted value state (not exposed to parent)
    const [formattedValue, setFormattedValue] = useState<string>(() => {
        return Math.round(value).toString();
    });

    // Formatting function for integer values
    const formatValue = useMemo(() => {
        return (val: number): string => {
            // Ensure integer formatting (no floating point)
            return Math.round(val).toString();
        };
    }, []);

    useEffect(() => {
        if (isFocused) {
            setDisplayValue(value.toString());
        } else {
            const numericValue = parseInt(value.toString(), 10);
            const formattedVal = formatValue(numericValue);
            setFormattedValue(formattedVal);
        }
    }, [value, isFocused, formatValue]);

    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formattedValue);
        }
    }, [formattedValue]);

    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: 'Analysis period is required',
                validator: (val: string) => {
                    const numVal = parseInt(val, 10);
                    return !isNaN(numVal) && numVal >= minValue && numVal <= maxValue;
                }
            }] : []),
            {
                name: 'range',
                message: `Analysis period must be between ${minValue} and ${maxValue} years`,
                validator: (val: string) => {
                    if (val === '') return validationMode === 'optional';
                    const numVal = parseInt(val, 10);
                    return !isNaN(numVal) && numVal >= minValue && numVal <= maxValue;
                }
            }
        ];
    }, [enableValidation, validationMode, minValue, maxValue]);

    // Determine field name for validation
    const fieldName = useMemo(() => id || 'analysisYears', [id]);

    // Memoized config for the validation hook
    const hookConfig = useMemo(() => ({
        fieldName,
        fieldType: 'text' as const,
        required: validationMode === 'required',
        validationRules
    }), [fieldName, validationMode, validationRules]);

    // Use the smart field validation hook
    const { state, handlers } = useSmartFieldValidation({
        value: value.toString(),
        config: hookConfig,
        enableValidation,
        onValidationChange
    });

    // Handle slider change
    const handleSliderChange = (values: number[]) => {
        const newValue = Math.round(values[0]);

        // Use the hook's change handler
        handlers.handleChange(newValue.toString(), value.toString());

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
        const numericValue = parseInt(lastInputValue, 10);
        let finalValue: number;

        if (lastInputValue.trim() === '' || isNaN(numericValue)) {
            finalValue = defaultValue;
        } else {
            // Clamp value between min and max
            finalValue = Math.max(minValue, Math.min(maxValue, numericValue));
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
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <Label htmlFor={id} className="text-xs">
                Analysis Period
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <TooltipProvider>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="ml-1"
                            aria-label="More information about Analysis Period"
                            onClick={() => setTooltipOpen(!tooltipOpen)}
                        >
                            <Info className="h-3 w-3 text-muted-foreground" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                        <div className="text-xs">
                            <p>
                                The number of years over which you want to analyze and compare the rent vs. buy decision. This helps project long-term costs and benefits.
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
            step={1}
            value={[value]}
            onValueChange={handleSliderChange}
            onBlur={handleSliderBlur}
            disabled={disabled}
            className={`${displayMode === 'combined' ? 'flex-1' : 'w-full'} ${hasErrors ? 'opacity-50' : ''}`}
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
                className={`${displayMode === 'combined' ? 'w-32' : 'w-full'} ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-sm text-muted-foreground">yrs</span>
            </div>
        </div>
    );

    // Value display (for slider and combined modes)
    const valueDisplay = (
        <div className="min-w-[3rem] text-center">
            <span className="text-sm font-medium">{value}</span>
            <span className="text-xs text-muted-foreground ml-1">years</span>
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

export default YearsField;
