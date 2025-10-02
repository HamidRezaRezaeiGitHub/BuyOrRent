import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { Percent, Info } from 'lucide-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';

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
}

/**
 * Format a number as percentage
 * @param value - The numeric value to format
 * @returns Formatted percentage string (e.g., "2.50")
 */
const formatPercentage = (value: number): string => {
    return value.toFixed(2);
};

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
    onValidationChange
}) => {
    // Track the displayed formatted value
    const [displayValue, setDisplayValue] = useState<string>(() => {
        return value === '' ? '' : formatPercentage(value);
    });

    // Track tooltip open state for mobile-friendly click interaction
    const [tooltipOpen, setTooltipOpen] = useState(false);

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
                    return numVal !== '' && numVal >= 0;
                }
            }] : []),
            {
                name: 'nonNegative',
                message: 'Annual rent increase must be a non-negative number',
                validator: (val: string) => {
                    if (val === '') return true; // Empty is valid in optional mode
                    const numVal = parsePercentage(val);
                    return numVal === '' || numVal >= 0;
                }
            },
            {
                name: 'maxValue',
                message: 'Annual rent increase must not exceed 100%',
                validator: (val: string) => {
                    if (val === '') return true;
                    const numVal = parsePercentage(val);
                    return numVal === '' || numVal <= 100;
                }
            }
        ];
    }, [enableValidation, validationMode]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'rentIncrease',
        fieldType: 'text' as const,
        required: validationMode === 'required',
        validationRules
    }), [validationMode, validationRules]);

    // Use the smart field validation hook
    const { state, handlers } = useSmartFieldValidation({
        value: displayValue,
        config: hookConfig,
        enableValidation,
        onValidationChange
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const oldValue = displayValue;
        const newValue = e.target.value;

        // Use the hook's change handler for autofill detection
        handlers.handleChange(newValue, oldValue);

        // Update the display value
        setDisplayValue(newValue);

        // Parse and update the actual numeric value
        // Special handling for empty value
        if (newValue.trim() === '') {
            onChange('');
        } else {
            const numericValue = parsePercentage(newValue);
            onChange(numericValue);
        }
    };

    const handleFocus = () => {
        handlers.handleFocus();
        
        // When focused, show unformatted value for easier editing
        if (value !== '') {
            setDisplayValue(value.toString());
        }
    };

    const handleBlur = () => {
        handlers.handleBlur();
        
        // When blurred, format the value for display
        if (value !== '') {
            setDisplayValue(formatPercentage(value));
        } else {
            setDisplayValue('');
        }
    };

    // Determine which errors to display
    const displayErrors = enableValidation ? state.displayErrors : errors;
    const hasErrors = displayErrors.length > 0;

    // Determine if field is required for label display
    const isRequired = enableValidation && validationMode === 'required';

    return (
        <div className={`space-y-2 ${className}`}>
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
                                aria-label="More information about annual rent increase"
                                onClick={() => setTooltipOpen(!tooltipOpen)}
                            >
                                <Info className="h-3 w-3 text-muted-foreground" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs">
                                The annual percentage increase in rent. This represents the expected yearly growth in your rental costs. The default value of 2.5% is a common estimate for rental market increases, but you can adjust this based on your specific rental agreement or local market conditions.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="relative">
                <Input
                    id={id}
                    type="text"
                    inputMode="decimal"
                    placeholder={placeholder}
                    value={displayValue}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pr-7 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={disabled}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-sm text-muted-foreground">%</span>
                </div>
            </div>
            {hasErrors && (
                <div className="space-y-1">
                    {displayErrors.map((error, index) => (
                        <p key={index} className="text-xs text-red-500">{error}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RentIncreaseField;
