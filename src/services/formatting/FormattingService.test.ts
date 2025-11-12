import '@testing-library/jest-dom';

import { formatCurrency, formatShortCurrency } from './FormattingService';

describe('FormattingService', () => {
    describe('formatCurrency', () => {
        test('FormattingService_shouldFormatSmallNumber_whenValueIsBelow1000', () => {
            const result = formatCurrency(500);
            expect(result).toBe('$500');
        });

        test('FormattingService_shouldFormatLargeNumber_whenValueIsAbove1000', () => {
            const result = formatCurrency(1500);
            expect(result).toBe('$1,500');
        });

        test('FormattingService_shouldFormatWithCommas_whenValueIsLarge', () => {
            const result = formatCurrency(1234567);
            expect(result).toBe('$1,234,567');
        });

        test('FormattingService_shouldNotShowDecimals_whenFormatCurrencyCalled', () => {
            const result = formatCurrency(1234.56);
            expect(result).toBe('$1,235'); // Rounds to nearest dollar
        });

        test('FormattingService_shouldHandleZero_whenValueIsZero', () => {
            const result = formatCurrency(0);
            expect(result).toBe('$0');
        });

        test('FormattingService_shouldHandleNegativeNumbers_whenValueIsNegative', () => {
            const result = formatCurrency(-1500);
            expect(result).toBe('-$1,500');
        });
    });

    describe('formatShortCurrency', () => {
        test('FormattingService_shouldFormatAsMillions_whenValueIsAbove1Million', () => {
            const result = formatShortCurrency(1500000);
            expect(result).toBe('$1.5M');
        });

        test('FormattingService_shouldFormatAsMillions_whenValueIsExactly1Million', () => {
            const result = formatShortCurrency(1000000);
            expect(result).toBe('$1.0M');
        });

        test('FormattingService_shouldFormatAsThousands_whenValueIsAbove1000', () => {
            const result = formatShortCurrency(1500);
            expect(result).toBe('$2K'); // Rounds to nearest thousand
        });

        test('FormattingService_shouldFormatAsThousands_whenValueIsExactly1000', () => {
            const result = formatShortCurrency(1000);
            expect(result).toBe('$1K');
        });

        test('FormattingService_shouldUseCurrencyFormat_whenValueIsBelow1000', () => {
            const result = formatShortCurrency(500);
            expect(result).toBe('$500');
        });

        test('FormattingService_shouldFormatWithCommas_whenValueIsBelow1000', () => {
            const result = formatShortCurrency(0);
            expect(result).toBe('$0');
        });

        test('FormattingService_shouldRoundMillions_whenValueHasDecimals', () => {
            const result = formatShortCurrency(2345678);
            expect(result).toBe('$2.3M');
        });

        test('FormattingService_shouldRoundThousands_whenValueHasDecimals', () => {
            const result = formatShortCurrency(1234);
            expect(result).toBe('$1K');
        });
    });
});
