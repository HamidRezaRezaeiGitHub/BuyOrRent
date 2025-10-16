/**
 * MortgageAmortizationCalculator Service
 * 
 * This service calculates a complete per-month amortization schedule for a fixed-payment mortgage.
 * It computes monthly payments, interest/principal breakdown, and cumulative totals over the loan term.
 * 
 * This is a pure math service with no I/O or time-dependent logic.
 * All calculations are deterministic based on the provided inputs.
 */

// Type Definitions

/**
 * Rounding control for monetary values
 * - 'none': No rounding applied (full floating-point precision)
 * - 'cents': Round to 2 decimal places (typical currency precision)
 */
export type RoundMode = 'none' | 'cents';

/**
 * Data for a single month in the amortization schedule
 */
export interface AmortizationMonth {
    /** Month number (1 to total months) */
    index: number;
    /** Year number (1 to amortizationYears) */
    year: number;
    /** Month within the year (1-12) */
    monthInYear: number;
    /** Total payment for this month */
    payment: number;
    /** Interest portion of payment */
    interest: number;
    /** Principal portion of payment */
    principal: number;
    /** Balance at start of month (before payment) */
    balanceStart: number;
    /** Balance at end of month (after payment) */
    balanceEnd: number;
    /** Cumulative principal paid through this month */
    cumulativePrincipal: number;
    /** Cumulative interest paid through this month */
    cumulativeInterest: number;
}

/**
 * Complete mortgage amortization schedule with summary data
 */
export interface MortgageAmortizationData {
    /** Fixed monthly payment amount */
    monthlyPayment: number;
    /** Total principal paid over loan term */
    totalPrincipalPaid: number;
    /** Total interest paid over loan term */
    totalInterestPaid: number;
    /** Total amount paid (principal + interest) */
    totalPaid: number;
    /** Array of monthly amortization data */
    months: AmortizationMonth[];
}

// Helper Functions

/**
 * Helper function to round a number based on the roundMode setting
 * @param value - The value to round
 * @param roundMode - The rounding mode
 * @returns The rounded value
 */
const applyRounding = (value: number, roundMode: RoundMode): number => {
    if (roundMode === 'cents') {
        return Math.round(value * 100) / 100;
    }
    return value;
};

// Core Calculation Functions

/**
 * Calculate the fixed monthly payment for a mortgage
 * 
 * Uses the standard mortgage payment formula:
 * - If rate > 0: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * - If rate = 0: M = P / n
 * 
 * Where:
 * - M = monthly payment
 * - P = principal (loan amount)
 * - r = monthly interest rate (as decimal)
 * - n = number of months
 * 
 * @param loanAmount - The principal loan amount
 * @param monthlyRate - Monthly interest rate (as decimal, e.g., 0.004167 for 5% APR)
 * @param totalMonths - Total number of payment months
 * @param roundMode - Rounding control
 * @returns Fixed monthly payment amount
 */
const calculateMonthlyPayment = (
    loanAmount: number,
    monthlyRate: number,
    totalMonths: number,
    roundMode: RoundMode
): number => {
    if (monthlyRate === 0) {
        // Zero interest case: simple division
        return applyRounding(loanAmount / totalMonths, roundMode);
    }

    // Standard mortgage formula
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
    const denominator = Math.pow(1 + monthlyRate, totalMonths) - 1;
    const payment = loanAmount * (numerator / denominator);

    return applyRounding(payment, roundMode);
};

/**
 * Calculate complete mortgage amortization schedule
 * 
 * Generates a month-by-month breakdown of payments, showing how each payment
 * is split between principal and interest, and tracks the declining balance.
 * 
 * The calculation follows standard fixed-payment mortgage amortization:
 * 1. Calculate fixed monthly payment
 * 2. For each month:
 *    - Calculate interest on remaining balance
 *    - Subtract interest from payment to get principal
 *    - Reduce balance by principal paid
 * 3. On final month, adjust for any rounding residue to ensure balance = 0
 * 
 * @param purchasePrice - The purchase price of the property (must be > 0)
 * @param downPaymentPercentage - Down payment as percentage (0-100)
 * @param annualInterestRate - Annual interest rate as percentage (e.g., 5.0 for 5%)
 * @param amortizationYears - Loan term in years (must be positive integer)
 * @param roundMode - Rounding control: 'none' or 'cents' (default 'cents')
 * @returns Complete amortization data or null if inputs are invalid
 * 
 * @example
 * // Standard 25-year mortgage
 * calculateMortgageAmortization(800000, 20, 5.0, 25)
 * 
 * @example
 * // Zero interest loan
 * calculateMortgageAmortization(500000, 10, 0, 10)
 * 
 * @example
 * // No rounding
 * calculateMortgageAmortization(300000, 15, 4.5, 30, 'none')
 */
export const calculateMortgageAmortization = (
    purchasePrice: number,
    downPaymentPercentage: number,
    annualInterestRate: number,
    amortizationYears: number,
    roundMode: RoundMode = 'cents'
): MortgageAmortizationData | null => {
    // Validation: guard against invalid inputs
    if (
        Number.isNaN(purchasePrice) ||
        Number.isNaN(downPaymentPercentage) ||
        Number.isNaN(annualInterestRate) ||
        Number.isNaN(amortizationYears)
    ) {
        return null;
    }

    // Validate positive values
    if (purchasePrice <= 0 || amortizationYears <= 0) {
        return null;
    }

    // Validate percentage ranges
    if (downPaymentPercentage < 0 || downPaymentPercentage > 100) {
        return null;
    }

    if (annualInterestRate < 0) {
        return null;
    }

    // Validate integer years
    if (!Number.isInteger(amortizationYears)) {
        return null;
    }

    // Calculate derived values
    const loanAmount = purchasePrice * (1 - downPaymentPercentage / 100);
    const monthlyRate = annualInterestRate > 0 ? (annualInterestRate / 12) / 100 : 0;
    const totalMonths = amortizationYears * 12;

    // Calculate fixed monthly payment
    const monthlyPayment = calculateMonthlyPayment(
        loanAmount,
        monthlyRate,
        totalMonths,
        roundMode
    );

    // Initialize tracking variables
    const months: AmortizationMonth[] = [];
    let balance = loanAmount;
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;

    // Generate month-by-month schedule
    for (let i = 1; i <= totalMonths; i++) {
        const balanceStart = balance;

        // Calculate interest for this month
        let interest = balanceStart * monthlyRate;
        interest = applyRounding(interest, roundMode);

        // Calculate principal payment
        let principal = monthlyPayment - interest;

        // Handle final month: adjust for rounding residue
        if (i === totalMonths) {
            // Ensure we pay off exactly the remaining balance
            principal = balanceStart;
            // Recalculate payment for final month
            const finalPayment = principal + interest;
            
            // Update balance to exactly zero
            balance = 0;

            // Update cumulative totals
            cumulativePrincipal += principal;
            cumulativeInterest += interest;

            // Determine year and month in year
            const year = Math.ceil(i / 12);
            const monthInYear = ((i - 1) % 12) + 1;

            months.push({
                index: i,
                year,
                monthInYear,
                payment: applyRounding(finalPayment, roundMode),
                interest: applyRounding(interest, roundMode),
                principal: applyRounding(principal, roundMode),
                balanceStart: applyRounding(balanceStart, roundMode),
                balanceEnd: 0,
                cumulativePrincipal: applyRounding(cumulativePrincipal, roundMode),
                cumulativeInterest: applyRounding(cumulativeInterest, roundMode),
            });
        } else {
            // Normal month
            principal = applyRounding(principal, roundMode);
            balance = balanceStart - principal;
            balance = applyRounding(balance, roundMode);

            // Update cumulative totals
            cumulativePrincipal += principal;
            cumulativeInterest += interest;

            // Determine year and month in year
            const year = Math.ceil(i / 12);
            const monthInYear = ((i - 1) % 12) + 1;

            months.push({
                index: i,
                year,
                monthInYear,
                payment: applyRounding(monthlyPayment, roundMode),
                interest: applyRounding(interest, roundMode),
                principal: applyRounding(principal, roundMode),
                balanceStart: applyRounding(balanceStart, roundMode),
                balanceEnd: applyRounding(balance, roundMode),
                cumulativePrincipal: applyRounding(cumulativePrincipal, roundMode),
                cumulativeInterest: applyRounding(cumulativeInterest, roundMode),
            });
        }
    }

    // Calculate totals
    const totalPrincipalPaid = applyRounding(loanAmount, roundMode);
    const totalInterestPaid = applyRounding(cumulativeInterest, roundMode);
    const totalPaid = applyRounding(totalPrincipalPaid + totalInterestPaid, roundMode);

    return {
        monthlyPayment: applyRounding(monthlyPayment, roundMode),
        totalPrincipalPaid,
        totalInterestPaid,
        totalPaid,
        months,
    };
};
