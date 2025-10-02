import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { DollarSign, Info } from 'lucide-react';
import { ChangeEvent, FC, useMemo, useState } from 'react';

export interface MonthlyRentFieldProps {
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
 * Format a number as Canadian dollar currency
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "1,234.56")
 */
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

/**
 * Parse a formatted currency string to a number
 * @param formatted - The formatted string (e.g., "1,234.56" or "1234.56")
 * @returns The numeric value or empty string if invalid
 */
const parseCurrency = (formatted: string): number | '' => {
    // Remove all non-digit characters except decimal point and minus sign
    const cleaned = formatted.replace(/[^\d.-]/g, '');
    if (cleaned === '' || cleaned === '-') return '';
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? '' : parsed;
};

export const MonthlyRentField: FC<MonthlyRentFieldProps> = ({
    id = 'monthlyRent',
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder = '0.00',
    enableValidation = false,
    validationMode = 'optional',
    onValidationChange
}) => {
    // Track the displayed formatted value
    const [displayValue, setDisplayValue] = useState<string>(() => {
        return value === '' ? '' : formatCurrency(value);
    });
    
    // Track if the input is focused
    const [isFocused, setIsFocused] = useState(false);

    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: 'Monthly rent is required',
                validator: (val: string) => {
                    if (val === '') return false;
                    const numVal = parseCurrency(val);
                    return numVal !== '' && numVal > 0;
                }
            }] : []),
            {
                name: 'positive',
                message: 'Monthly rent must be a positive number',
                validator: (val: string) => {
                    if (val === '') return true; // Empty is valid in optional mode
                    const numVal = parseCurrency(val);
                    return numVal === '' || numVal > 0;
                }
            },
            {
                name: 'maxValue',
                message: 'Monthly rent must not exceed $1,000,000',
                validator: (val: string) => {
                    if (val === '') return true;
                    const numVal = parseCurrency(val);
                    return numVal === '' || numVal <= 1000000;
                }
            }
        ];
    }, [enableValidation, validationMode]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'monthlyRent',
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
        if (newValue === '' || newValue.trim() === '') {
            onChange('');
        } else {
            const numericValue = parseCurrency(newValue);
            onChange(numericValue);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        handlers.handleFocus();
        
        // When focused, show unformatted value for easier editing
        if (value !== '') {
            setDisplayValue(value.toString());
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        handlers.handleBlur();
        
        // When blurred, format the value for display
        if (value !== '') {
            setDisplayValue(formatCurrency(value));
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
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <Label htmlFor={id} className="text-xs">
                    Monthly Rent
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" className="ml-1" aria-label="More information about monthly rent">
                                <Info className="h-3 w-3 text-muted-foreground" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs">
                                The total monthly rent amount, including parking and utilities, 
                                that you would pay to the landlord (and/or other entities) per month 
                                if you choose to rent a place (not buy).
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-sm text-muted-foreground">$</span>
                </div>
                <Input
                    id={id}
                    type="text"
                    inputMode="decimal"
                    placeholder={placeholder}
                    value={displayValue}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`pl-7 ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={disabled}
                />
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

export default MonthlyRentField;
