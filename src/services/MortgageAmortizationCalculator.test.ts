import '@testing-library/jest-dom';

import {
    calculateMortgageAmortization,
} from './MortgageAmortizationCalculator';

describe('MortgageAmortizationCalculator Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Input Validation', () => {
        test('should return null for NaN purchasePrice', () => {
            const result = calculateMortgageAmortization(NaN, 20, 5.0, 25);
            expect(result).toBeNull();
        });

        test('should return null for NaN downPaymentPercentage', () => {
            const result = calculateMortgageAmortization(800000, NaN, 5.0, 25);
            expect(result).toBeNull();
        });

        test('should return null for NaN annualInterestRate', () => {
            const result = calculateMortgageAmortization(800000, 20, NaN, 25);
            expect(result).toBeNull();
        });

        test('should return null for NaN amortizationYears', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, NaN);
            expect(result).toBeNull();
        });

        test('should return null for zero purchasePrice', () => {
            const result = calculateMortgageAmortization(0, 20, 5.0, 25);
            expect(result).toBeNull();
        });

        test('should return null for negative purchasePrice', () => {
            const result = calculateMortgageAmortization(-100000, 20, 5.0, 25);
            expect(result).toBeNull();
        });

        test('should return null for zero amortizationYears', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, 0);
            expect(result).toBeNull();
        });

        test('should return null for negative amortizationYears', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, -25);
            expect(result).toBeNull();
        });

        test('should return null for negative downPaymentPercentage', () => {
            const result = calculateMortgageAmortization(800000, -10, 5.0, 25);
            expect(result).toBeNull();
        });

        test('should return null for downPaymentPercentage > 100', () => {
            const result = calculateMortgageAmortization(800000, 150, 5.0, 25);
            expect(result).toBeNull();
        });

        test('should return null for negative annualInterestRate', () => {
            const result = calculateMortgageAmortization(800000, 20, -5.0, 25);
            expect(result).toBeNull();
        });

        test('should return null for non-integer amortizationYears', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, 25.5);
            expect(result).toBeNull();
        });

        test('should accept zero downPaymentPercentage', () => {
            const result = calculateMortgageAmortization(800000, 0, 5.0, 25);
            expect(result).not.toBeNull();
        });

        test('should accept 100% downPaymentPercentage', () => {
            const result = calculateMortgageAmortization(800000, 100, 5.0, 25);
            expect(result).not.toBeNull();
            expect(result?.totalPrincipalPaid).toBe(0);
        });
    });

    describe('Happy Path - Standard Mortgage', () => {
        test('should calculate correct monthly payment for standard case', () => {
            // 800k purchase, 20% down, 5% rate, 25 years
            const result = calculateMortgageAmortization(800000, 20, 5.0, 25);

            expect(result).not.toBeNull();
            // Expected: ~3,721 CAD/month (using standard formula)
            // Loan amount: 640,000
            // Monthly rate: 5/12/100 = 0.004167
            // n = 300 months
            // M = 640000 * [0.004167(1.004167)^300] / [(1.004167)^300 - 1]
            expect(result!.monthlyPayment).toBeGreaterThan(3700);
            expect(result!.monthlyPayment).toBeLessThan(3750);
        });

        test('should have correct number of months', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, 25);

            expect(result).not.toBeNull();
            expect(result!.months).toHaveLength(300); // 25 years * 12 months
        });

        test('should have month indices from 1 to totalMonths', () => {
            const result = calculateMortgageAmortization(500000, 15, 4.0, 10);

            expect(result).not.toBeNull();
            expect(result!.months[0].index).toBe(1);
            expect(result!.months[result!.months.length - 1].index).toBe(120);
        });

        test('should calculate correct year and monthInYear values', () => {
            const result = calculateMortgageAmortization(500000, 15, 4.0, 3);

            expect(result).not.toBeNull();
            
            // First month
            expect(result!.months[0].year).toBe(1);
            expect(result!.months[0].monthInYear).toBe(1);
            
            // Last month of year 1
            expect(result!.months[11].year).toBe(1);
            expect(result!.months[11].monthInYear).toBe(12);
            
            // First month of year 2
            expect(result!.months[12].year).toBe(2);
            expect(result!.months[12].monthInYear).toBe(1);
            
            // Last month
            expect(result!.months[35].year).toBe(3);
            expect(result!.months[35].monthInYear).toBe(12);
        });

        test('should have final balance of exactly zero', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, 25);

            expect(result).not.toBeNull();
            const lastMonth = result!.months[result!.months.length - 1];
            expect(lastMonth.balanceEnd).toBe(0);
        });

        test('should have sum of principal equal to loan amount', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, 25);

            expect(result).not.toBeNull();
            const loanAmount = 800000 * 0.8; // 640,000
            expect(result!.totalPrincipalPaid).toBeCloseTo(loanAmount, 1);
        });

        test('should have totalPaid equal to sum of principal and interest', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, 25);

            expect(result).not.toBeNull();
            const sumCheck = result!.totalPrincipalPaid + result!.totalInterestPaid;
            expect(result!.totalPaid).toBeCloseTo(sumCheck, 1);
        });

        test('should have cumulative principal at end equal to totalPrincipalPaid', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, 25);

            expect(result).not.toBeNull();
            const lastMonth = result!.months[result!.months.length - 1];
            expect(lastMonth.cumulativePrincipal).toBeCloseTo(result!.totalPrincipalPaid, 1);
        });

        test('should have cumulative interest at end equal to totalInterestPaid', () => {
            const result = calculateMortgageAmortization(800000, 20, 5.0, 25);

            expect(result).not.toBeNull();
            const lastMonth = result!.months[result!.months.length - 1];
            expect(lastMonth.cumulativeInterest).toBeCloseTo(result!.totalInterestPaid, 1);
        });

        test('should have interest declining over time', () => {
            const result = calculateMortgageAmortization(500000, 10, 6.0, 15);

            expect(result).not.toBeNull();
            // Interest should be highest in first month and lowest in last
            const firstMonth = result!.months[0];
            const lastMonth = result!.months[result!.months.length - 1];
            expect(firstMonth.interest).toBeGreaterThan(lastMonth.interest);
        });

        test('should have principal increasing over time', () => {
            const result = calculateMortgageAmortization(500000, 10, 6.0, 15);

            expect(result).not.toBeNull();
            // Principal should be lowest in first month and highest in last
            const firstMonth = result!.months[0];
            const lastMonth = result!.months[result!.months.length - 1];
            expect(lastMonth.principal).toBeGreaterThan(firstMonth.principal);
        });

        test('should have balanceStart decrease monotonically', () => {
            const result = calculateMortgageAmortization(300000, 25, 4.5, 10);

            expect(result).not.toBeNull();
            for (let i = 1; i < result!.months.length; i++) {
                expect(result!.months[i].balanceStart).toBeLessThan(result!.months[i - 1].balanceStart);
            }
        });

        test('should have balanceEnd equal to next month balanceStart', () => {
            const result = calculateMortgageAmortization(400000, 15, 5.5, 20);

            expect(result).not.toBeNull();
            for (let i = 0; i < result!.months.length - 1; i++) {
                expect(result!.months[i].balanceEnd).toBeCloseTo(result!.months[i + 1].balanceStart, 1);
            }
        });

        test('should satisfy balance equation for each month', () => {
            const result = calculateMortgageAmortization(500000, 20, 5.0, 15);

            expect(result).not.toBeNull();
            result!.months.forEach((month) => {
                // balanceEnd = balanceStart - principal
                const expectedBalanceEnd = month.balanceStart - month.principal;
                expect(month.balanceEnd).toBeCloseTo(expectedBalanceEnd, 1);
            });
        });
    });

    describe('Zero Interest Edge Case', () => {
        test('should handle zero interest rate', () => {
            const result = calculateMortgageAmortization(600000, 20, 0, 10);

            expect(result).not.toBeNull();
            const loanAmount = 600000 * 0.8; // 480,000
            const totalMonths = 10 * 12; // 120
            const expectedPayment = loanAmount / totalMonths; // 4,000
            expect(result!.monthlyPayment).toBeCloseTo(expectedPayment, 1);
        });

        test('should have zero interest in all months for zero rate', () => {
            const result = calculateMortgageAmortization(600000, 20, 0, 10);

            expect(result).not.toBeNull();
            result!.months.forEach((month) => {
                expect(month.interest).toBe(0);
            });
        });

        test('should have all payment go to principal for zero rate', () => {
            const result = calculateMortgageAmortization(600000, 20, 0, 10);

            expect(result).not.toBeNull();
            result!.months.forEach((month) => {
                expect(month.principal).toBeCloseTo(month.payment, 1);
            });
        });

        test('should have totalInterestPaid of zero for zero rate', () => {
            const result = calculateMortgageAmortization(600000, 20, 0, 10);

            expect(result).not.toBeNull();
            expect(result!.totalInterestPaid).toBe(0);
        });

        test('should have totalPaid equal to loan amount for zero rate', () => {
            const result = calculateMortgageAmortization(600000, 20, 0, 10);

            expect(result).not.toBeNull();
            const loanAmount = 600000 * 0.8;
            expect(result!.totalPaid).toBeCloseTo(loanAmount, 1);
        });
    });

    describe('Short Amortization Periods', () => {
        test('should handle 1-year amortization', () => {
            const result = calculateMortgageAmortization(240000, 10, 4.0, 1);

            expect(result).not.toBeNull();
            expect(result!.months).toHaveLength(12);
            expect(result!.months[11].balanceEnd).toBe(0);
        });

        test('should handle 2-year amortization', () => {
            const result = calculateMortgageAmortization(360000, 15, 5.5, 2);

            expect(result).not.toBeNull();
            expect(result!.months).toHaveLength(24);
            expect(result!.months[23].balanceEnd).toBe(0);
        });

        test('should have higher monthly payments for shorter terms', () => {
            const result10 = calculateMortgageAmortization(500000, 20, 5.0, 10);
            const result25 = calculateMortgageAmortization(500000, 20, 5.0, 25);

            expect(result10).not.toBeNull();
            expect(result25).not.toBeNull();
            expect(result10!.monthlyPayment).toBeGreaterThan(result25!.monthlyPayment);
        });

        test('should have less total interest for shorter terms', () => {
            const result10 = calculateMortgageAmortization(500000, 20, 5.0, 10);
            const result25 = calculateMortgageAmortization(500000, 20, 5.0, 25);

            expect(result10).not.toBeNull();
            expect(result25).not.toBeNull();
            expect(result10!.totalInterestPaid).toBeLessThan(result25!.totalInterestPaid);
        });
    });

    describe('Long Amortization Periods', () => {
        test('should handle 30-year amortization', () => {
            const result = calculateMortgageAmortization(750000, 15, 4.5, 30);

            expect(result).not.toBeNull();
            expect(result!.months).toHaveLength(360);
            expect(result!.months[359].balanceEnd).toBe(0);
        });

        test('should handle 35-year amortization', () => {
            const result = calculateMortgageAmortization(900000, 10, 5.0, 35);

            expect(result).not.toBeNull();
            expect(result!.months).toHaveLength(420);
            expect(result!.months[419].balanceEnd).toBe(0);
        });

        test('should have lower monthly payments for longer terms', () => {
            const result10 = calculateMortgageAmortization(500000, 20, 5.0, 10);
            const result30 = calculateMortgageAmortization(500000, 20, 5.0, 30);

            expect(result10).not.toBeNull();
            expect(result30).not.toBeNull();
            expect(result30!.monthlyPayment).toBeLessThan(result10!.monthlyPayment);
        });

        test('should have more total interest for longer terms', () => {
            const result10 = calculateMortgageAmortization(500000, 20, 5.0, 10);
            const result30 = calculateMortgageAmortization(500000, 20, 5.0, 30);

            expect(result10).not.toBeNull();
            expect(result30).not.toBeNull();
            expect(result30!.totalInterestPaid).toBeGreaterThan(result10!.totalInterestPaid);
        });
    });

    describe('Rounding Modes', () => {
        test('should apply cents rounding by default', () => {
            const result = calculateMortgageAmortization(123456.789, 12.345, 4.567, 15);

            expect(result).not.toBeNull();
            // Check that values have at most 2 decimal places
            result!.months.forEach((month) => {
                expect(month.payment).toBe(Math.round(month.payment * 100) / 100);
                expect(month.interest).toBe(Math.round(month.interest * 100) / 100);
                expect(month.principal).toBe(Math.round(month.principal * 100) / 100);
                expect(month.balanceStart).toBe(Math.round(month.balanceStart * 100) / 100);
                expect(month.balanceEnd).toBe(Math.round(month.balanceEnd * 100) / 100);
            });
        });

        test('should apply cents rounding when explicitly requested', () => {
            const result = calculateMortgageAmortization(123456.789, 12.345, 4.567, 15, 'cents');

            expect(result).not.toBeNull();
            // Monthly payment should be rounded to cents
            const payment = result!.monthlyPayment;
            expect(payment).toBe(Math.round(payment * 100) / 100);
        });

        test('should not round with roundMode none', () => {
            const result = calculateMortgageAmortization(123456.789, 12.345, 4.567, 15, 'none');

            expect(result).not.toBeNull();
            // Verify that calculation completes successfully without rounding
            expect(result!.monthlyPayment).not.toBeUndefined();
            expect(result!.monthlyPayment).toBeGreaterThan(0);
        });

        test('should ensure final balance is exactly zero with cents rounding', () => {
            const result = calculateMortgageAmortization(777777.77, 13.13, 6.66, 20, 'cents');

            expect(result).not.toBeNull();
            const lastMonth = result!.months[result!.months.length - 1];
            expect(lastMonth.balanceEnd).toBe(0);
        });

        test('should ensure final balance is zero with none rounding', () => {
            const result = calculateMortgageAmortization(777777.77, 13.13, 6.66, 20, 'none');

            expect(result).not.toBeNull();
            const lastMonth = result!.months[result!.months.length - 1];
            expect(lastMonth.balanceEnd).toBe(0);
        });
    });

    describe('Rounding Residue Handling', () => {
        test('should handle rounding residue in final month', () => {
            // Use values that create rounding challenges
            const result = calculateMortgageAmortization(333333.33, 17.77, 5.55, 13, 'cents');

            expect(result).not.toBeNull();
            const lastMonth = result!.months[result!.months.length - 1];
            
            // Final balance must be exactly zero
            expect(lastMonth.balanceEnd).toBe(0);
            
            // Final month payment may differ slightly from regular payment
            // to account for rounding residue
            expect(lastMonth.payment).toBeGreaterThan(0);
        });

        test('should maintain invariants with awkward numbers', () => {
            const result = calculateMortgageAmortization(987654.32, 23.45, 3.21, 17, 'cents');

            expect(result).not.toBeNull();
            
            // Check that each month satisfies: balanceEnd = balanceStart - principal
            result!.months.forEach((month) => {
                const calculatedEnd = month.balanceStart - month.principal;
                expect(month.balanceEnd).toBeCloseTo(calculatedEnd, 1);
            });
            
            // Final balance must be zero
            expect(result!.months[result!.months.length - 1].balanceEnd).toBe(0);
        });

        test('should handle cumulative rounding correctly', () => {
            const result = calculateMortgageAmortization(555555.55, 11.11, 4.44, 12, 'cents');

            expect(result).not.toBeNull();
            
            // Sum of all principal payments should equal loan amount (within rounding)
            const sumPrincipal = result!.months.reduce((sum, month) => sum + month.principal, 0);
            const loanAmount = 555555.55 * (1 - 11.11 / 100);
            expect(sumPrincipal).toBeCloseTo(loanAmount, 0);
            
            // Sum of all interest payments should equal total interest
            const sumInterest = result!.months.reduce((sum, month) => sum + month.interest, 0);
            expect(sumInterest).toBeCloseTo(result!.totalInterestPaid, 0);
        });
    });

    describe('Edge Cases and Boundaries', () => {
        test('should handle 0% down payment', () => {
            const result = calculateMortgageAmortization(500000, 0, 5.0, 25);

            expect(result).not.toBeNull();
            expect(result!.totalPrincipalPaid).toBeCloseTo(500000, 1);
        });

        test('should handle 100% down payment', () => {
            const result = calculateMortgageAmortization(500000, 100, 5.0, 25);

            expect(result).not.toBeNull();
            expect(result!.totalPrincipalPaid).toBe(0);
            expect(result!.totalInterestPaid).toBe(0);
            expect(result!.totalPaid).toBe(0);
            expect(result!.monthlyPayment).toBe(0);
        });

        test('should handle very low interest rate', () => {
            const result = calculateMortgageAmortization(500000, 20, 0.1, 25);

            expect(result).not.toBeNull();
            expect(result!.totalInterestPaid).toBeGreaterThan(0);
            expect(result!.totalInterestPaid).toBeLessThan(result!.totalPrincipalPaid);
        });

        test('should handle very high interest rate', () => {
            const result = calculateMortgageAmortization(500000, 20, 20.0, 25);

            expect(result).not.toBeNull();
            // With 20% rate, interest should be substantial
            expect(result!.totalInterestPaid).toBeGreaterThan(result!.totalPrincipalPaid);
        });

        test('should handle small loan amount', () => {
            const result = calculateMortgageAmortization(10000, 10, 5.0, 5);

            expect(result).not.toBeNull();
            expect(result!.months).toHaveLength(60);
            expect(result!.months[59].balanceEnd).toBe(0);
        });

        test('should handle large loan amount', () => {
            const result = calculateMortgageAmortization(10000000, 10, 5.0, 25);

            expect(result).not.toBeNull();
            expect(result!.months).toHaveLength(300);
            expect(result!.months[299].balanceEnd).toBe(0);
        });
    });

    describe('Determinism', () => {
        test('should produce identical results for identical inputs', () => {
            const result1 = calculateMortgageAmortization(750000, 18, 4.75, 22, 'cents');
            const result2 = calculateMortgageAmortization(750000, 18, 4.75, 22, 'cents');

            expect(result1).toEqual(result2);
        });

        test('should produce different results for different inputs', () => {
            const result1 = calculateMortgageAmortization(750000, 18, 4.75, 22, 'cents');
            const result2 = calculateMortgageAmortization(750000, 18, 4.76, 22, 'cents');

            expect(result1).not.toEqual(result2);
        });
    });

    describe('Performance', () => {
        test('should calculate 30-year mortgage in reasonable time', () => {
            const startTime = Date.now();
            const result = calculateMortgageAmortization(800000, 20, 5.0, 30);
            const endTime = Date.now();

            expect(result).not.toBeNull();
            expect(result!.months).toHaveLength(360);
            // Should complete in less than 1 second
            expect(endTime - startTime).toBeLessThan(1000);
        });

        test('should calculate 35-year mortgage in reasonable time', () => {
            const startTime = Date.now();
            const result = calculateMortgageAmortization(1000000, 15, 6.0, 35);
            const endTime = Date.now();

            expect(result).not.toBeNull();
            expect(result!.months).toHaveLength(420);
            // Should complete in less than 1 second
            expect(endTime - startTime).toBeLessThan(1000);
        });
    });
});
