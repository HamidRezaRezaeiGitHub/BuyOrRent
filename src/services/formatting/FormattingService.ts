/**
 * Formatting Service
 * 
 * Provides utility functions for formatting numbers, currency, and other display values.
 * This service centralizes formatting logic to avoid duplication across components.
 */

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
