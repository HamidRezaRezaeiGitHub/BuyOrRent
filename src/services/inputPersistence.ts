import type { BuyOrRentInputs } from '@/types/inputs';
import { defaultInputs } from '@/types/inputs';

const STORAGE_KEY = 'buyorrent-inputs';

export class InputPersistenceService {
  /**
   * Save inputs to localStorage
   */
  static saveInputs(inputs: BuyOrRentInputs): void {
    try {
      const serialized = JSON.stringify(inputs);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save inputs to localStorage:', error);
    }
  }

  /**
   * Load inputs from localStorage
   * Returns default inputs if none are found or if there's an error
   */
  static loadInputs(): BuyOrRentInputs {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { ...defaultInputs };
      }

      const parsed = JSON.parse(stored);
      
      // Validate that all required fields exist
      const merged = { ...defaultInputs, ...parsed };
      
      // Ensure all values are numbers and within reasonable ranges
      return this.validateInputs(merged);
    } catch (error) {
      console.error('Failed to load inputs from localStorage:', error);
      return { ...defaultInputs };
    }
  }

  /**
   * Clear stored inputs from localStorage
   */
  static clearInputs(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear inputs from localStorage:', error);
    }
  }

  /**
   * Check if inputs are stored in localStorage
   */
  static hasStoredInputs(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Validate and sanitize inputs
   */
  private static validateInputs(inputs: Partial<BuyOrRentInputs>): BuyOrRentInputs {
    const validated: BuyOrRentInputs = { ...defaultInputs };

    // Helper function to ensure number is positive and finite
    const ensurePositiveNumber = (value: unknown, fallback: number): number => {
      const num = Number(value);
      return isFinite(num) && num >= 0 ? num : fallback;
    };

    // Helper function to ensure percentage is between 0 and 100
    const ensurePercentage = (value: unknown, fallback: number): number => {
      const num = Number(value);
      return isFinite(num) && num >= 0 && num <= 100 ? num : fallback;
    };

    // Helper function to ensure year count is reasonable
    const ensureYears = (value: unknown, fallback: number): number => {
      const num = Number(value);
      return isFinite(num) && num >= 1 && num <= 50 ? num : fallback;
    };

    // Validate each field
    if (inputs.homePrice !== undefined) {
      validated.homePrice = ensurePositiveNumber(inputs.homePrice, defaultInputs.homePrice);
    }
    if (inputs.downPayment !== undefined) {
      validated.downPayment = ensurePositiveNumber(inputs.downPayment, defaultInputs.downPayment);
    }
    if (inputs.mortgageRate !== undefined) {
      validated.mortgageRate = ensurePercentage(inputs.mortgageRate, defaultInputs.mortgageRate);
    }
    if (inputs.loanTerm !== undefined) {
      validated.loanTerm = ensureYears(inputs.loanTerm, defaultInputs.loanTerm);
    }
    if (inputs.monthlyRent !== undefined) {
      validated.monthlyRent = ensurePositiveNumber(inputs.monthlyRent, defaultInputs.monthlyRent);
    }
    if (inputs.rentGrowthRate !== undefined) {
      validated.rentGrowthRate = ensurePercentage(inputs.rentGrowthRate, defaultInputs.rentGrowthRate);
    }
    if (inputs.sp500GrowthRate !== undefined) {
      validated.sp500GrowthRate = ensurePercentage(inputs.sp500GrowthRate, defaultInputs.sp500GrowthRate);
    }
    if (inputs.propertyTax !== undefined) {
      validated.propertyTax = ensurePositiveNumber(inputs.propertyTax, defaultInputs.propertyTax);
    }
    if (inputs.homeInsurance !== undefined) {
      validated.homeInsurance = ensurePositiveNumber(inputs.homeInsurance, defaultInputs.homeInsurance);
    }
    if (inputs.hoa !== undefined) {
      validated.hoa = ensurePositiveNumber(inputs.hoa, defaultInputs.hoa);
    }
    if (inputs.maintenance !== undefined) {
      validated.maintenance = ensurePercentage(inputs.maintenance, defaultInputs.maintenance);
    }
    if (inputs.taxRate !== undefined) {
      validated.taxRate = ensurePercentage(inputs.taxRate, defaultInputs.taxRate);
    }
    if (inputs.yearsToAnalyze !== undefined) {
      validated.yearsToAnalyze = ensureYears(inputs.yearsToAnalyze, defaultInputs.yearsToAnalyze);
    }

    return validated;
  }
}