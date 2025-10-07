import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DollarSign, Info } from 'lucide-react';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface PropertyTaxAmountFieldProps {
    id?: string;
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    className?: string;
    displayMode?: 'slider' | 'input' | 'combined';
    defaultValue?: number;
    minValue?: number;
    maxValue?: number;
    onLabelSet?: (label: React.ReactElement) => void;
    showLabel?: boolean; // Default: true
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

export const PropertyTaxAmountField: FC<PropertyTaxAmountFieldProps> = ({
    id = 'propertyTaxAmount',
    value,
    onChange,
    disabled = false,
    className = '',
    displayMode = 'combined',
    defaultValue = 4500,
    minValue = 0,
    maxValue = 50000,
    onLabelSet,
    showLabel = true
}) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    const clampValue = useCallback((inputValue: number): number => {
        return Math.max(minValue, Math.min(maxValue, Math.round(inputValue)));
    }, [minValue, maxValue]);

    const validatedValue = useMemo(() => {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
            return clampValue(defaultValue);
        }
        return clampValue(value);
    }, [value, defaultValue, clampValue]);

    const displayValue = useMemo(() => {
        if (isFocused) {
            return inputValue;
        }
        return formatCurrency(validatedValue);
    }, [isFocused, inputValue, validatedValue]);

    useEffect(() => {
        if (!isFocused) {
            setInputValue(validatedValue.toString());
        }
    }, [validatedValue, isFocused]);

    const lastNotifiedValue = useRef<number>(value);

    useEffect(() => {
        if (validatedValue !== value && lastNotifiedValue.current !== validatedValue) {
            lastNotifiedValue.current = validatedValue;
            onChange(validatedValue);
        }
    }, [validatedValue, value, onChange]);

    const handleSliderChange = (values: number[]) => {
        const rawValue = values[0];
        if (typeof rawValue === 'number' && !isNaN(rawValue) && isFinite(rawValue)) {
            const clampedValue = clampValue(rawValue);
            onChange(clampedValue);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        try {
            const numericValue = parseFloat(newValue.replace(/,/g, ''));
            if (!isNaN(numericValue) && isFinite(numericValue) && numericValue >= minValue && numericValue <= maxValue) {
                const clampedValue = clampValue(numericValue);
                onChange(clampedValue);
            }
        } catch (error) {
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
            const cleanedValue = trimmedValue.replace(/[$,]/g, '');
            const numericValue = parseFloat(cleanedValue);

            if (cleanedValue === '' || isNaN(numericValue) || !isFinite(numericValue)) {
                finalValue = clampValue(defaultValue);
            } else {
                finalValue = clampValue(numericValue);
            }
        } catch (error) {
            console.debug('Input blur parsing error:', error);
            finalValue = clampValue(defaultValue);
        }

        setIsFocused(false);

        const originalInputValue = parseFloat(inputValue.replace(/[$,]/g, '').trim());
        const epsilon = 0.001;

        if (isNaN(originalInputValue) || Math.abs(finalValue - originalInputValue) > epsilon) {
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

    const labelComponent = useMemo(() => (
        <FieldLabel htmlFor={getMainControlId()} className="flex items-center gap-1 text-xs">
            <DollarSign className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            Property Tax
            <TooltipProvider>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="ml-1"
                            aria-label="More information about Property Tax Amount"
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
                                The annual property tax amount in dollars. This is typically paid to your local municipality.
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

    const sliderComponent = (
        <Slider
            id={displayMode === 'slider' ? id : `${id}-slider`}
            min={minValue}
            max={maxValue}
            step={100}
            value={[validatedValue]}
            onValueChange={handleSliderChange}
            disabled={disabled}
            className={`${displayMode === 'combined' ? 'flex-1' : 'w-full'}`}
            aria-label={`Property tax amount: $${validatedValue}`}
            aria-valuemin={minValue}
            aria-valuemax={maxValue}
            aria-valuenow={validatedValue}
            aria-valuetext={`${validatedValue} dollars`}
        />
    );

    const inputComponent = (
        <InputGroup className={displayMode === 'combined' ? 'w-32' : 'w-full'}>
            <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
                id={displayMode === 'input' ? id : `${id}-input`}
                type={isFocused ? 'number' : 'text'}
                inputMode={isFocused ? 'numeric' : 'text'}
                min={minValue}
                max={maxValue}
                step={100}
                placeholder="Enter amount"
                value={displayValue}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={disabled}
                aria-label={`Property tax amount in dollars, current value: $${validatedValue}`}
                aria-describedby={`${id}-suffix ${id}-tooltip`}
            />
            <InputGroupAddon align="inline-end">
                <InputGroupText id={`${id}-suffix`}>/yr</InputGroupText>
            </InputGroupAddon>
        </InputGroup>
    );

    const valueDisplay = (
        <div className="min-w-[6rem] text-center" aria-live="polite">
            <span className="text-sm font-medium" aria-label={`Current value: ${validatedValue} dollars per year`}>
                ${formatCurrency(validatedValue)}
            </span>
            <span className="text-xs text-muted-foreground block" aria-hidden="true">per year</span>
        </div>
    );

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
            <FieldDescription className="text-xs text-muted-foreground">
                Annual property tax paid to municipality
            </FieldDescription>
        </Field>
    );
};

export default PropertyTaxAmountField;
