import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ValidationResult, ValidationRule } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { DollarSign, Percent, Info, LucideIcon } from 'lucide-react';
import { ChangeEvent, FC, ReactNode, useMemo, useState, useEffect } from 'react';

/**
 * Field category types
 */
export type FieldCategory = 'normal' | 'slider';

/**
 * Number types for formatting
 */
export type NumberType = 'normal' | 'currency' | 'percentage';

/**
 * Input mode types
 */
export type InputMode = 'text' | 'decimal' | 'numeric';

/**
 * Value type - can be number or empty string
 */
export type FieldValue = number | '';

/**
 * Helper component to render an icon
 */
interface IconRendererProps {
    Icon: LucideIcon;
    className?: string;
}

const IconRenderer: FC<IconRendererProps> = ({ Icon, className }) => {
    return <Icon className={className} />;
};

/**
 * Props for FlexibleInputField
 */
export interface FlexibleInputFieldProps {
    // Basic props
    id?: string;
    value: FieldValue;
    onChange: (value: FieldValue) => void;
    disabled?: boolean;
    className?: string;
    errors?: string[];
    placeholder?: string;
    
    // Field configuration
    category?: FieldCategory;
    type?: string;
    inputMode?: InputMode;
    numberType?: NumberType;
    
    // Slider configuration (only applicable when category='slider')
    min?: number;
    max?: number;
    step?: number;
    sliderValueUnit?: string; // e.g., "years", "months"
    
    // Label and tooltip
    label: string;
    labelIcon?: LucideIcon;
    tooltipContent?: ReactNode;
    
    // Validation
    enableValidation?: boolean;
    validationMode?: 'required' | 'optional';
    validationRules?: ValidationRule[];
    onValidationChange?: (validationResult: ValidationResult) => void;
    
    // Formatting
    formatValue?: (value: number) => string;
    parseValue?: (formatted: string) => FieldValue;
    
    // Icon configuration (for normal input fields)
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    iconIncluded?: boolean; // If true and no icon provided, use default based on numberType
    
    // Grid layout configuration
    colSpan?: 1 | 2; // For 2-column grids, specify how many columns this field should span (defaults to 1)
}

/**
 * Format a number as currency (2 decimal places)
 */
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

/**
 * Format a number as percentage (2 decimal places)
 */
const formatPercentage = (value: number): string => {
    return value.toFixed(2);
};

/**
 * Parse a formatted string to a number
 */
const parseNumber = (formatted: string): FieldValue => {
    // Remove all non-digit characters except decimal point and minus sign
    const cleaned = formatted.replace(/[^\d.-]/g, '');
    if (cleaned === '' || cleaned === '-') return '';
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? '' : parsed;
};

/**
 * Get default icon based on number type
 */
const getDefaultIcon = (numberType: NumberType): LucideIcon | undefined => {
    switch (numberType) {
        case 'currency':
            return DollarSign;
        case 'percentage':
            return Percent;
        default:
            return undefined;
    }
};

/**
 * Get default icon position based on number type
 */
const getDefaultIconPosition = (numberType: NumberType): 'left' | 'right' => {
    return numberType === 'currency' ? 'left' : 'right';
};

/**
 * FlexibleInputField Component
 * 
 * A highly configurable input field component that supports:
 * - Normal text/number inputs
 * - Slider inputs
 * - Currency and percentage formatting
 * - Smart validation integration
 * - Icons and tooltips
 * - Focus/blur formatting behavior
 */
export const FlexibleInputField: FC<FlexibleInputFieldProps> = ({
    id,
    value,
    onChange,
    disabled = false,
    className = '',
    errors = [],
    placeholder,
    category = 'normal',
    type = 'text',
    inputMode = 'decimal',
    numberType = 'normal',
    min = 0,
    max = 100,
    step = 1,
    sliderValueUnit = '',
    label,
    labelIcon,
    tooltipContent,
    enableValidation = false,
    validationMode = 'optional',
    validationRules = [],
    onValidationChange,
    formatValue,
    parseValue,
    icon,
    iconPosition,
    iconIncluded = true,
    colSpan = 1
}) => {
    // Determine formatting functions
    const defaultFormatValue = useMemo(() => {
        if (formatValue) return formatValue;
        
        switch (numberType) {
            case 'currency':
                return formatCurrency;
            case 'percentage':
                return formatPercentage;
            default:
                return (val: number) => val.toString();
        }
    }, [numberType, formatValue]);

    const defaultParseValue = useMemo(() => {
        return parseValue || parseNumber;
    }, [parseValue]);

    // Track the displayed formatted value (for normal inputs)
    const [displayValue, setDisplayValue] = useState<string>(() => {
        if (category === 'slider' || value === '') return '';
        return defaultFormatValue(value);
    });

    // Track tooltip open state for mobile-friendly click interaction
    const [tooltipOpen, setTooltipOpen] = useState(false);

    // Track focus state to prevent formatting while user is typing
    const [isFocused, setIsFocused] = useState(false);

    // Sync displayValue when value prop changes externally (e.g., from drawer selection)
    // Only update if the field is not currently focused (to avoid interfering with user typing)
    useEffect(() => {
        if (category === 'slider') return;
        
        if (!isFocused) {
            if (value !== '' && typeof value === 'number') {
                setDisplayValue(defaultFormatValue(value));
            } else {
                setDisplayValue('');
            }
        }
    }, [value, category, defaultFormatValue, isFocused]);

    // Determine field name for validation
    const fieldName = useMemo(() => id || 'field', [id]);

    // Memoized config for the validation hook
    // Note: We don't include validationRules in dependencies to avoid infinite loops
    // Consumers should pass stable validation rules (memoized or defined outside render)
    const hookConfig = useMemo(() => ({
        fieldName,
        fieldType: 'text' as const,
        required: validationMode === 'required',
        validationRules
    }), [fieldName, validationMode]); // eslint-disable-line react-hooks/exhaustive-deps -- validationRules intentionally omitted to avoid infinite loops; consumers must pass stable validationRules

    // Determine the value to pass to validation hook
    const validationValue = category === 'slider' ? value.toString() : displayValue;

    // Use the smart field validation hook
    const { state, handlers } = useSmartFieldValidation({
        value: validationValue,
        config: hookConfig,
        enableValidation,
        onValidationChange
    });

    // Handlers for normal input
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const oldValue = displayValue;
        const newValue = e.target.value;

        // Use the hook's change handler for autofill detection
        handlers.handleChange(newValue, oldValue);

        // Update the display value immediately (unformatted while typing)
        setDisplayValue(newValue);

        // Parse and update the actual numeric value
        if (newValue.trim() === '') {
            onChange('');
        } else {
            const numericValue = defaultParseValue(newValue);
            onChange(numericValue);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        handlers.handleFocus();
        
        // When focused, show unformatted value for easier editing
        if (value !== '' && typeof value === 'number') {
            setDisplayValue(value.toString());
        } else if (value === '') {
            setDisplayValue('');
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        handlers.handleBlur();
        
        // When blurred, format the value for display
        if (value !== '' && typeof value === 'number') {
            setDisplayValue(defaultFormatValue(value));
        } else {
            setDisplayValue('');
        }
    };

    // Handlers for slider
    const handleSliderChange = (values: number[]) => {
        const newValue = category === 'slider' ? Math.round(values[0]) : values[0];
        
        // Use the hook's change handler
        handlers.handleChange(newValue.toString(), value.toString());
        
        onChange(newValue);
    };

    const handleSliderBlur = () => {
        handlers.handleBlur();
    };

    // Determine which errors to display
    const displayErrors = enableValidation ? state.displayErrors : errors;
    const hasErrors = displayErrors.length > 0;

    // Determine if field is required for label display
    const isRequired = enableValidation && validationMode === 'required';

    // Determine icon to use
    const finalIcon = icon || (iconIncluded ? getDefaultIcon(numberType) : undefined);
    const finalIconPosition = iconPosition || getDefaultIconPosition(numberType);

    // Label component with icon and tooltip
    const labelComponent = (
        <div className="flex items-center gap-1">
            {labelIcon && <IconRenderer Icon={labelIcon} className="h-3 w-3 text-muted-foreground" />}
            <Label htmlFor={id} className="text-xs">
                {label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {tooltipContent && (
                <TooltipProvider>
                    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                        <TooltipTrigger asChild>
                            <button 
                                type="button" 
                                className="ml-1" 
                                aria-label={`More information about ${label}`}
                                onClick={() => setTooltipOpen(!tooltipOpen)}
                            >
                                <Info className="h-3 w-3 text-muted-foreground" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                            <div className="text-xs">
                                {tooltipContent}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
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

    // Normal input field
    const normalInputField = (
        <div className="relative">
            {finalIcon && finalIconPosition === 'left' && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {numberType === 'currency' ? (
                        <span className="text-sm text-muted-foreground">$</span>
                    ) : (
                        <IconRenderer Icon={finalIcon} className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            )}
            <Input
                id={id}
                type={type}
                inputMode={inputMode}
                placeholder={placeholder}
                value={displayValue}
                onFocus={handleFocus}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${finalIcon && finalIconPosition === 'left' ? 'pl-7' : ''} ${finalIcon && finalIconPosition === 'right' ? 'pr-7' : ''} ${hasErrors ? 'border-red-500 focus:border-red-500' : ''}`}
                disabled={disabled}
            />
            {finalIcon && finalIconPosition === 'right' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {numberType === 'percentage' ? (
                        <span className="text-sm text-muted-foreground">%</span>
                    ) : (
                        <IconRenderer Icon={finalIcon} className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>
            )}
        </div>
    );

    // Slider field
    const sliderField = (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <Slider
                    id={id}
                    min={min}
                    max={max}
                    step={step}
                    value={[typeof value === 'number' ? value : min]}
                    onValueChange={handleSliderChange}
                    onBlur={handleSliderBlur}
                    disabled={disabled}
                    className={`flex-1 ${hasErrors ? 'opacity-50' : ''}`}
                />
                <div className="min-w-[3rem] text-center">
                    <span className="text-sm font-medium">{value}</span>
                    {sliderValueUnit && <span className="text-xs text-muted-foreground ml-1">{sliderValueUnit}</span>}
                </div>
            </div>
        </div>
    );

    // Render based on category
    const colSpanClass = colSpan === 2 ? 'col-span-2' : '';
    return (
        <div className={`space-y-2 ${colSpanClass} ${className}`}>
            {labelComponent}
            {category === 'slider' ? sliderField : normalInputField}
            {errorDisplay}
        </div>
    );
};

export default FlexibleInputField;
