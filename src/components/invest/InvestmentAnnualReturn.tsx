import { ValidationResult } from '@/services/validation';
import { Info, Percent } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { useSmartFieldValidation } from '../../services/validation/useSmartFieldValidation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { InvestmentReturnHelperDrawer } from './InvestmentReturnHelperDrawer';

export type DisplayMode = 'slider' | 'input' | 'combined';

export interface InvestmentAnnualReturnFieldProps {
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
    showHelper?: boolean;
    displayMode?: DisplayMode; // Default: 'combined'
    defaultValue?: number; // Default: 7.5
    minValue?: number; // Default: -100
    maxValue?: number; // Default: 100
}

/**
 * Format a number as a percentage string
 * @param value - The numeric value
 * @returns The formatted percentage string
 */
const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

/**
 * Parse a formatted percentage string to a number
 * @param formatted - The formatted string (e.g., "7.50" or "7.5")
 * @returns The numeric value or empty string if invalid
 */
const parsePercentage = (formatted: string): number => {
    // Remove all non-digit characters except decimal point and minus sign
    const cleaned = formatted.replace(/[^\d.-]/g, '');
    if (cleaned === '' || cleaned === '-') return 0;

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
};

export const InvestmentAnnualReturnField: FC<InvestmentAnnualReturnFieldProps> = ({
    id = 'investmentAnnualReturn',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = '7.50',
    enableValidation = false,
    validationMode = 'optional',
    onValidationChange,
    showHelper = false,
    displayMode = 'combined',
    defaultValue = 7.5,
    minValue = -100,
    maxValue = 100
}) => {
    // Track tooltip open state for mobile-friendly click interaction
    const [tooltipOpen, setTooltipOpen] = useState(false);

    // Track drawer open state for helper
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Track display value for input field
    const [displayValue, setDisplayValue] = useState<string>('');

    // Internal state to manage formatted value - not exposed outside
    const [formattedValue, setFormattedValue] = useState<string>('');

    // Track focus state of input field - Formatting happens only after blur
    const [isFocused, setIsFocused] = useState(false);

    // Update display value when value prop changes
    useEffect(() => {
        if (isFocused) {
            setDisplayValue(value.toString());
        } else {
            const numericValue = parsePercentage(value.toString());
            const formattedVal = formatPercentage(numericValue);
            setFormattedValue(formattedVal);
        }

        if (typeof value === 'number') {
            setDisplayValue(isFocused ? value.toString() : formatPercentage(value));
        } else {
            setDisplayValue('');
        }
    }, [value, isFocused]);

    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: 'Expected yearly investment return is required',
                validator: (val: string) => {
                    if (val === '') return false;
                    const numVal = parsePercentage(val);
                    return numVal !== '';
                }
            }] : []),
            {
                name: 'validNumber',
                message: 'Expected yearly investment return must be a valid number',
                validator: (val: string) => {
                    if (val === '') return validationMode === 'optional';
                    const numVal = parsePercentage(val);
                    return numVal !== '';
                }
            },
            {
                name: 'maxValue',
                message: `Expected yearly investment return must not exceed ${maxValue}%`,
                validator: (val: string) => {
                    if (val === '') return true;
                    const numVal = parsePercentage(val);
                    return numVal === '' || numVal <= maxValue;
                }
            },
            {
                name: 'minValue',
                message: `Expected yearly investment return must be at least ${minValue}%`,
                validator: (val: string) => {
                    if (val === '') return true;
                    const numVal = parsePercentage(val);
                    return numVal === '' || numVal >= minValue;
                }
            }
        ];
    }, [enableValidation, validationMode]);

    // Determine field name for validation
    const fieldName = useMemo(() => id || 'investmentAnnualReturn', [id]);

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

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setDisplayValue(newValue);

        // Use the hook's change handler
        handlers.handleChange(newValue, value === '' ? '' : value.toString());

        const parsedValue = parsePercentage(newValue);
        onChange(parsedValue);
    };

    // Handle input focus
    const handleFocus = () => {
        setIsFocused(true);
        handlers.handleFocus();
        if (typeof value === 'number') {
            setDisplayValue(value.toString());
        }
    };

    // Handle input blur
    const handleBlur = () => {
        setIsFocused(false);
        handlers.handleBlur();
        if (typeof value === 'number') {
            setDisplayValue(formatPercentage(value));
        }
    };

    // Handle slider change
    const handleSliderChange = (newValue: number[]) => {
        const sliderValue = newValue[0];

        // Use the hook's change handler
        handlers.handleChange(sliderValue.toString(), value === '' ? '' : value.toString());

        onChange(sliderValue);
    };

    // Determine which errors to display
    const displayErrors = enableValidation ? state.displayErrors : errors;
    const hasErrors = displayErrors.length > 0;

    // Determine if field is required for label display
    const isRequired = enableValidation && validationMode === 'required';

    // Input component
    const inputComponent = (
        <div className="relative">
            <Input
                id={displayMode === 'input' ? id : `${id}-input`}
                type="text"
                inputMode="decimal"
                value={displayValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                placeholder={placeholder}
                className={`${displayMode === 'combined' ? 'w-32' : 'w-full'} ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Percent className="h-3 w-3 text-muted-foreground" />
            </div>
        </div>
    );

    // Slider component
    const sliderComponent = (
        <Slider
            id={displayMode === 'slider' ? id : `${id}-slider`}
            min={minValue}
            max={maxValue}
            step={0.1}
            value={[typeof value === 'number' ? value : defaultValue]}
            onValueChange={handleSliderChange}
            disabled={disabled}
            className={`${displayMode === 'combined' ? 'flex-1' : 'w-full'} ${hasErrors ? 'opacity-50' : ''}`}
        />
    );

    // Value display (for slider and combined modes)
    const valueDisplay = (
        <div className="min-w-[4rem] text-center">
            <span className="text-sm font-medium">
                {typeof value === 'number' ? formatPercentage(value) : formatPercentage(defaultValue)}%
            </span>
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
            {/* Label component with icon and tooltip */}
            <div className="flex items-center gap-1">
                <Percent className="h-3 w-3 text-muted-foreground" />
                <Label htmlFor={id} className="text-xs">
                    Expected Return
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <TooltipProvider>
                    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                className="ml-1"
                                aria-label="More information about Expected Return"
                                onClick={() => setTooltipOpen(!tooltipOpen)}
                            >
                                <Info className="h-3 w-3 text-muted-foreground" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                            <div className="text-xs">
                                <p>
                                    The expected annual return on your investment if you choose to invest instead of buying property. This represents the percentage growth you anticipate from alternative investments like stocks, bonds, or other financial instruments. Common long-term stock market returns average around 7-10% annually, but you should adjust this based on your investment strategy and risk tolerance.
                                </p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {renderField()}

            {/* Error display component */}
            {hasErrors && (
                <div className="space-y-1">
                    {displayErrors.map((error, index) => (
                        <p key={index} className="text-xs text-red-500">{error}</p>
                    ))}
                </div>
            )}

            {showHelper && (
                <div className="mt-2">
                    <button
                        type="button"
                        onClick={() => setDrawerOpen(true)}
                        className="text-sm text-primary hover:underline focus:outline-none focus:underline underline"
                    >
                        You're not sure?
                    </button>
                </div>
            )}

            <InvestmentReturnHelperDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                onSelectReturn={onChange}
                currentValue={value}
            />
        </div>
    );
};

export default InvestmentAnnualReturnField;
