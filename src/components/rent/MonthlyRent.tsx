import { ValidationResult } from '@/services/validation';
import { DollarSign } from 'lucide-react';
import { FC, useMemo } from 'react';
import { FlexibleInputField, FieldValue } from '../common/FlexibleInputField';

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

    return (
        <FlexibleInputField
            id={id}
            value={value as FieldValue}
            onChange={onChange}
            disabled={disabled}
            className={className}
            errors={errors}
            placeholder={placeholder}
            category="normal"
            type="text"
            inputMode="decimal"
            numberType="currency"
            label="Monthly Rent"
            labelIcon={DollarSign}
            tooltipContent={
                <p>
                    {`The total monthly rent amount, including parking and utilities, that you would pay to the landlord (and/or other entities) per month if you choose to rent a place (not buy).`}
                </p>
            }
            enableValidation={enableValidation}
            validationMode={validationMode}
            validationRules={validationRules}
            onValidationChange={onValidationChange}
            parseValue={parseCurrency}
        />
    );
};

export default MonthlyRentField;
