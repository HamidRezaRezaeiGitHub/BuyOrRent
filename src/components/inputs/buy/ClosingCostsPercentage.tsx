import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Percent } from 'lucide-react';
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultConfigProvider } from '@/common/ConfigProvider';

export interface ClosingCostsPercentageFieldProps {
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
    showDescription?: boolean; // Default: true
}

export const ClosingCostsPercentageField: FC<ClosingCostsPercentageFieldProps> = ({
    id = 'closingCostsPercentage',
    value,
    onChange,
    disabled = false,
    className = '',
    displayMode = 'combined',
    defaultValue,
    minValue,
    maxValue,
    onLabelSet,
    showLabel = true,
    showDescription = true
}) => {
    // Get config values, allowing props to override
    const fieldConfig = defaultConfigProvider.getField('purchase', 'closingCostsPercentage');
    const configDefault = defaultValue ?? fieldConfig?.default ?? 0;
    const configMin = minValue ?? fieldConfig?.min ?? 0;
    const configMax = maxValue ?? fieldConfig?.max ?? 100;

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    const clampValue = useCallback((inputValue: number): number => {
        return Math.max(configMin, Math.min(configMax, Math.round(inputValue * 100) / 100));
    }, [configMin, configMax]);

    const validatedValue = useMemo(() => {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
            return clampValue(configDefault);
        }
        return clampValue(value);
    }, [value, defaultValue, clampValue]);

    const displayValue = useMemo(() => {
        if (isFocused) {
            return inputValue;
        }
        return validatedValue.toFixed(2);
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
            const numericValue = parseFloat(newValue);
            if (!isNaN(numericValue) && isFinite(numericValue) && numericValue >= configMin && numericValue <= configMax) {
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
            const numericValue = parseFloat(trimmedValue);

            if (trimmedValue === '' || isNaN(numericValue) || !isFinite(numericValue)) {
                finalValue = clampValue(configDefault);
            } else {
                finalValue = clampValue(numericValue);
            }
        } catch (error) {
            console.debug('Input blur parsing error:', error);
            finalValue = configDefault;
        }

        setIsFocused(false);

        const originalInputValue = parseFloat(inputValue.trim());
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

    // Label component with icon and tooltip (memoized)
    const labelComponent = useMemo(() => (
        <FieldLabel htmlFor={getMainControlId()} className="flex items-center gap-1 text-xs">
            <Percent className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            Closing Costs
            <TooltipProvider>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="ml-1"
                            aria-label="More information about Closing Costs Percentage"
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
                                Closing costs as a percentage of the purchase price. Typical closing costs include legal fees, land transfer tax, title insurance, and other transaction fees. Costs vary by province and municipality.
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
            min={configMin}
            max={configMax}
            step={0.1}
            value={[validatedValue]}
            onValueChange={handleSliderChange}
            disabled={disabled}
            className={`${displayMode === 'combined' ? 'flex-1' : 'w-full'}`}
            aria-label={`Closing costs percentage: ${validatedValue}%`}
            aria-valuemin={configMin}
            aria-valuemax={configMax}
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
                min={configMin}
                max={configMax}
                step={0.1}
                placeholder="Enter percentage"
                value={displayValue}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                disabled={disabled}
                aria-label={`Closing costs percentage, current value: ${validatedValue}%`}
                aria-describedby={`${id}-suffix ${id}-tooltip`}
            />
            <InputGroupAddon align="inline-end">
                <InputGroupText id={`${id}-suffix`}>%</InputGroupText>
            </InputGroupAddon>
        </InputGroup>
    );

    const valueDisplay = (
        <div className="min-w-[5rem] text-center" aria-live="polite">
            <span className="text-sm font-medium" aria-label={`Current value: ${validatedValue} percent`}>
                {validatedValue.toFixed(2)}%
            </span>
            <span className="text-xs text-muted-foreground block" aria-hidden="true">of price</span>
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
                    Closing costs as percentage of purchase price
                </FieldDescription>
            )}
        </Field>
    );
};

export default ClosingCostsPercentageField;
