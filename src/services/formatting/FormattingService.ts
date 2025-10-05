/**
 * Format a number as Canadian dollar currency
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "$1,234")
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

/**
 * Format large numbers in short form (e.g., 1.5K, 2.3M)
 * @param value - The numeric value to format
 * @returns Formatted short currency string (e.g., "$1.5M", "$2K")
 */
export const formatShortCurrency = (value: number): string => {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
};

export const formatToInteger = (value: number): string => {
    return Math.round(value).toString();
};

export const parsePercentage = (formatted: string): number | undefined => {
    // Remove all non-digit characters except decimal point and minus sign
    const cleaned = formatted.replace(/[^\d.-]/g, '');
    if (cleaned === '' || cleaned === '-') return undefined;

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
};

/**
 * Format a number as percentage (with 1-2 decimal places as needed)
 */
export const formatPercentage = (value: number): string => {
    // Show up to 2 decimal places, but remove trailing zeros
    return new Intl.NumberFormat('en-CA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
};