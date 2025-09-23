// Types for the BuyOrRent form inputs
export interface BuyOrRentInputs {
  // Property Information
  homePrice: number;
  downPayment: number;
  
  // Mortgage Information
  mortgageRate: number; // Annual percentage rate
  loanTerm: number; // Years
  
  // Rental Information
  monthlyRent: number;
  rentGrowthRate: number; // Annual percentage rate
  
  // Investment Information
  sp500GrowthRate: number; // Annual percentage rate
  
  // Other Costs
  propertyTax: number; // Annual amount
  homeInsurance: number; // Annual amount
  hoa: number; // Monthly HOA fees
  maintenance: number; // Annual maintenance percentage of home value
  
  // Tax Information
  taxRate: number; // Income tax rate percentage
  
  // Analysis Period
  yearsToAnalyze: number; // How many years to analyze
}

export const defaultInputs: BuyOrRentInputs = {
  homePrice: 500000,
  downPayment: 100000,
  mortgageRate: 6.5,
  loanTerm: 30,
  monthlyRent: 2500,
  rentGrowthRate: 3,
  sp500GrowthRate: 10,
  propertyTax: 6000,
  homeInsurance: 1200,
  hoa: 0,
  maintenance: 1,
  taxRate: 25,
  yearsToAnalyze: 10,
};