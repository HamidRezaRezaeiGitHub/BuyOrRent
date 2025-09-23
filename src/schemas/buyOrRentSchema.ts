import { z } from 'zod';

export const buyOrRentSchema = z.object({
  // Property Information
  homePrice: z
    .number()
    .min(1, 'Home price must be greater than 0')
    .max(10000000, 'Home price must be less than $10,000,000'),
  
  downPayment: z
    .number()
    .min(0, 'Down payment cannot be negative')
    .max(5000000, 'Down payment must be less than $5,000,000'),
  
  // Mortgage Information
  mortgageRate: z
    .number()
    .min(0, 'Mortgage rate cannot be negative')
    .max(30, 'Mortgage rate must be less than 30%'),
  
  loanTerm: z
    .number()
    .min(1, 'Loan term must be at least 1 year')
    .max(50, 'Loan term must be less than 50 years'),
  
  // Rental Information
  monthlyRent: z
    .number()
    .min(1, 'Monthly rent must be greater than 0')
    .max(50000, 'Monthly rent must be less than $50,000'),
  
  rentGrowthRate: z
    .number()
    .min(0, 'Rent growth rate cannot be negative')
    .max(20, 'Rent growth rate must be less than 20%'),
  
  // Investment Information
  sp500GrowthRate: z
    .number()
    .min(-10, 'S&P 500 growth rate must be greater than -10%')
    .max(30, 'S&P 500 growth rate must be less than 30%'),
  
  // Other Costs
  propertyTax: z
    .number()
    .min(0, 'Property tax cannot be negative')
    .max(100000, 'Property tax must be less than $100,000'),
  
  homeInsurance: z
    .number()
    .min(0, 'Home insurance cannot be negative')
    .max(20000, 'Home insurance must be less than $20,000'),
  
  hoa: z
    .number()
    .min(0, 'HOA fees cannot be negative')
    .max(2000, 'HOA fees must be less than $2,000'),
  
  maintenance: z
    .number()
    .min(0, 'Maintenance percentage cannot be negative')
    .max(10, 'Maintenance percentage must be less than 10%'),
  
  // Tax Information
  taxRate: z
    .number()
    .min(0, 'Tax rate cannot be negative')
    .max(50, 'Tax rate must be less than 50%'),
  
  // Analysis Period
  yearsToAnalyze: z
    .number()
    .min(1, 'Years to analyze must be at least 1')
    .max(50, 'Years to analyze must be less than 50'),
})
.refine(
  (data) => data.downPayment <= data.homePrice,
  {
    message: "Down payment cannot be greater than home price",
    path: ["downPayment"],
  }
);

export type BuyOrRentFormData = z.infer<typeof buyOrRentSchema>;