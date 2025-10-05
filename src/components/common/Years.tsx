import { ValidationResult } from '@/services/validation';
import { Calendar } from 'lucide-react';
import { FC, useMemo } from 'react';
import { FlexibleInputField } from './FlexibleInputField';

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

    // Adapter for onChange to convert FieldValue to number
    const handleChange = (val: number | '') => {
        if (typeof val === 'number') {
            onChange(val);
        }
    };

    return (
        <FlexibleInputField
            id={id}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={className}
            errors={errors}
            category="slider"
            min={1}
            max={100}
            step={1}
            sliderValueUnit="years"
            label="Analysis Period"
            labelIcon={Calendar}
            tooltipContent={
                <p>
                    The number of years over which you want to analyze and compare the rent vs. buy decision. This helps project long-term costs and benefits.
                </p>
            }
            enableValidation={enableValidation}
            validationMode={validationMode}
            validationRules={validationRules}
            onValidationChange={onValidationChange}
        />
    );
};

export default YearsField;
