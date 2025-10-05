import { ValidationResult } from '@/services/validation';
import { Percent } from 'lucide-react';
import { FC, useMemo } from 'react';
import { FlexibleInputField, FieldValue } from '../common/FlexibleInputField';

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
}

/**
 * Parse a formatted percentage string to a number
 * @param formatted - The formatted string (e.g., "7.50" or "7.5")
 * @returns The numeric value or empty string if invalid
 */
const parsePercentage = (formatted: string): number | '' => {
    // Remove all non-digit characters except decimal point and minus sign
    const cleaned = formatted.replace(/[^\d.-]/g, '');
    if (cleaned === '' || cleaned === '-') return '';
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? '' : parsed;
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
    onValidationChange
}) => {
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
                    if (val === '') return true; // Empty is valid in optional mode
                    const numVal = parsePercentage(val);
                    return numVal !== '';
                }
            },
            {
                name: 'maxValue',
                message: 'Expected yearly investment return must not exceed 100%',
                validator: (val: string) => {
                    if (val === '') return true;
                    const numVal = parsePercentage(val);
                    return numVal === '' || numVal <= 100;
                }
            },
            {
                name: 'minValue',
                message: 'Expected yearly investment return must be at least -100%',
                validator: (val: string) => {
                    if (val === '') return true;
                    const numVal = parsePercentage(val);
                    return numVal === '' || numVal >= -100;
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
            numberType="percentage"
            label="Expected Yearly Investment Return"
            labelIcon={Percent}
            tooltipContent={
                <p>
                    The expected annual return on your investment if you choose to invest instead of buying property. This represents the percentage growth you anticipate from alternative investments like stocks, bonds, or other financial instruments. Common long-term stock market returns average around 7-10% annually, but you should adjust this based on your investment strategy and risk tolerance.
                </p>
            }
            enableValidation={enableValidation}
            validationMode={validationMode}
            validationRules={validationRules}
            onValidationChange={onValidationChange}
            parseValue={parsePercentage}
        />
    );
};

export default InvestmentAnnualReturnField;
