import { buyOrRentSchema } from '../buyOrRentSchema';
import { defaultInputs } from '@/types/inputs';

describe('BuyOrRentSchema', () => {
  describe('valid inputs', () => {
    it('should validate default inputs successfully', () => {
      const result = buyOrRentSchema.safeParse(defaultInputs);
      expect(result.success).toBe(true);
    });

    it('should validate custom valid inputs', () => {
      const validInputs = {
        homePrice: 600000,
        downPayment: 120000,
        mortgageRate: 7.0,
        loanTerm: 30,
        monthlyRent: 3000,
        rentGrowthRate: 3.5,
        sp500GrowthRate: 8.5,
        propertyTax: 7200,
        homeInsurance: 1500,
        hoa: 150,
        maintenance: 1.5,
        taxRate: 28,
        yearsToAnalyze: 15,
      };

      const result = buyOrRentSchema.safeParse(validInputs);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject negative home price', () => {
      const invalidInputs = { ...defaultInputs, homePrice: -100000 };
      const result = buyOrRentSchema.safeParse(invalidInputs);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Home price must be greater than 0');
      }
    });

    it('should reject home price that is too high', () => {
      const invalidInputs = { ...defaultInputs, homePrice: 15000000 };
      const result = buyOrRentSchema.safeParse(invalidInputs);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Home price must be less than $10,000,000');
      }
    });

    it('should reject down payment greater than home price', () => {
      const invalidInputs = { 
        ...defaultInputs, 
        homePrice: 400000,
        downPayment: 500000 
      };
      const result = buyOrRentSchema.safeParse(invalidInputs);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Down payment cannot be greater than home price');
      }
    });

    it('should reject negative mortgage rate', () => {
      const invalidInputs = { ...defaultInputs, mortgageRate: -1 };
      const result = buyOrRentSchema.safeParse(invalidInputs);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mortgage rate cannot be negative');
      }
    });

    it('should reject mortgage rate that is too high', () => {
      const invalidInputs = { ...defaultInputs, mortgageRate: 35 };
      const result = buyOrRentSchema.safeParse(invalidInputs);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Mortgage rate must be less than 30%');
      }
    });

    it('should reject invalid loan term', () => {
      const invalidInputs = { ...defaultInputs, loanTerm: 0 };
      const result = buyOrRentSchema.safeParse(invalidInputs);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Loan term must be at least 1 year');
      }
    });

    it('should reject negative monthly rent', () => {
      const invalidInputs = { ...defaultInputs, monthlyRent: -500 };
      const result = buyOrRentSchema.safeParse(invalidInputs);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Monthly rent must be greater than 0');
      }
    });

    it('should reject invalid tax rate', () => {
      const invalidInputs = { ...defaultInputs, taxRate: 60 };
      const result = buyOrRentSchema.safeParse(invalidInputs);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Tax rate must be less than 50%');
      }
    });

    it('should reject invalid years to analyze', () => {
      const invalidInputs = { ...defaultInputs, yearsToAnalyze: 0 };
      const result = buyOrRentSchema.safeParse(invalidInputs);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Years to analyze must be at least 1');
      }
    });
  });

  describe('boundary values', () => {
    it('should accept minimum valid values', () => {
      const boundaryInputs = {
        homePrice: 1,
        downPayment: 0,
        mortgageRate: 0,
        loanTerm: 1,
        monthlyRent: 1,
        rentGrowthRate: 0,
        sp500GrowthRate: -10,
        propertyTax: 0,
        homeInsurance: 0,
        hoa: 0,
        maintenance: 0,
        taxRate: 0,
        yearsToAnalyze: 1,
      };

      const result = buyOrRentSchema.safeParse(boundaryInputs);
      expect(result.success).toBe(true);
    });

    it('should accept maximum valid values', () => {
      const boundaryInputs = {
        homePrice: 10000000,
        downPayment: 5000000,
        mortgageRate: 30,
        loanTerm: 50,
        monthlyRent: 50000,
        rentGrowthRate: 20,
        sp500GrowthRate: 30,
        propertyTax: 100000,
        homeInsurance: 20000,
        hoa: 2000,
        maintenance: 10,
        taxRate: 50,
        yearsToAnalyze: 50,
      };

      const result = buyOrRentSchema.safeParse(boundaryInputs);
      expect(result.success).toBe(true);
    });
  });
});