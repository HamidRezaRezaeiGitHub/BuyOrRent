import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ValidationResult } from '@/services/validation';
import { useSmartFieldValidation } from '@/services/validation/useSmartFieldValidation';
import { Calendar, Info } from 'lucide-react';
import { FC, useMemo, useState } from 'react';

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
    onValidationChange
}) => {
    // Track tooltip open state for mobile-friendly click interaction
    const [tooltipOpen, setTooltipOpen] = useState(false);

    // Memoized validation rules configuration
    const validationRules = useMemo(() => {
        if (!enableValidation) return [];

        return [
            ...(validationMode === 'required' ? [{
                name: 'required',
                message: 'Analysis period is required',
                validator: (val: string) => {
                    const numVal = parseInt(val, 10);
                    return !isNaN(numVal) && numVal >= 1 && numVal <= 100;
                }
            }] : []),
            {
                name: 'range',
                message: 'Analysis period must be between 1 and 100 years',
                validator: (val: string) => {
                    if (val === '') return validationMode === 'optional';
                    const numVal = parseInt(val, 10);
                    return !isNaN(numVal) && numVal >= 1 && numVal <= 100;
                }
            }
        ];
    }, [enableValidation, validationMode]);

    // Memoized config for the hook to prevent infinite re-renders
    const hookConfig = useMemo(() => ({
        fieldName: 'analysisYears',
        fieldType: 'text' as const,
        required: validationMode === 'required',
        validationRules
    }), [validationMode, validationRules]);

    // Use the smart field validation hook
    const { state, handlers } = useSmartFieldValidation({
        value: value.toString(),
        config: hookConfig,
        enableValidation,
        onValidationChange
    });

    const handleValueChange = (values: number[]) => {
        const newValue = Math.round(values[0]); // Ensure integer
        
        // Use the hook's change handler
        handlers.handleChange(newValue.toString(), value.toString());
        
        onChange(newValue);
    };

    const handleBlur = () => {
        handlers.handleBlur();
    };

    // Determine which errors to display
    const displayErrors = enableValidation ? state.displayErrors : errors;
    const hasErrors = displayErrors.length > 0;

    // Determine if field is required for label display
    const isRequired = enableValidation && validationMode === 'required';

    return (
        <div className={`space-y-2 ${className}`}>
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
                                aria-label="More information about analysis period"
                                onClick={() => setTooltipOpen(!tooltipOpen)}
                            >
                                <Info className="h-3 w-3 text-muted-foreground" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                            <p className="text-xs">
                                The number of years over which you want to analyze and compare the rent vs. buy decision. This helps project long-term costs and benefits.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Slider
                        id={id}
                        min={1}
                        max={100}
                        step={1}
                        value={[value]}
                        onValueChange={handleValueChange}
                        onBlur={handleBlur}
                        disabled={disabled}
                        className={`flex-1 ${hasErrors ? 'opacity-50' : ''}`}
                    />
                    <div className="min-w-[3rem] text-center">
                        <span className="text-sm font-medium">{value}</span>
                        <span className="text-xs text-muted-foreground ml-1">years</span>
                    </div>
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

export default YearsField;
