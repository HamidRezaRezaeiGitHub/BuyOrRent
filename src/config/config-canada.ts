/**
 * Canadian configuration for min/max/default values
 * 
 * This file contains all the configurable values for the Canadian market.
 * All monetary values are in CAD, rates are percentages, and lengths are in years.
 */

export interface FieldConfig {
  min: number;
  max: number;
  default: number;
}

export interface RentConfig {
  monthlyRent: FieldConfig;
  rentIncreaseRate: FieldConfig;
}

export interface PurchaseConfig {
  purchasePrice: FieldConfig;
  mortgageRate: FieldConfig;
  mortgageLength: FieldConfig;
  downPaymentPercentage: FieldConfig;
  downPaymentAmount: FieldConfig;
  closingCostsPercentage: FieldConfig;
  closingCostsAmount: FieldConfig;
  propertyTaxPercentage: FieldConfig;
  propertyTaxAmount: FieldConfig;
  maintenancePercentage: FieldConfig;
  maintenanceAmount: FieldConfig;
  assetAppreciationRate: FieldConfig;
}

export interface InvestmentConfig {
  investmentReturn: FieldConfig;
}

export interface CountryConfig {
  rent: RentConfig;
  purchase: PurchaseConfig;
  investment: InvestmentConfig;
}

/**
 * Canada-specific configuration values
 * Based on typical Canadian real estate market conditions
 */
export const CanadaConfig: CountryConfig = {
  rent: {
    monthlyRent: {
      min: 0,
      max: 10000,
      default: 2000,
    },
    rentIncreaseRate: {
      min: 0,
      max: 20,
      default: 2.5,
    },
  },
  purchase: {
    purchasePrice: {
      min: 100000,
      max: 3000000,
      default: 600000,
    },
    mortgageRate: {
      min: 0,
      max: 15,
      default: 5.5,
    },
    mortgageLength: {
      min: 1,
      max: 40,
      default: 25,
    },
    downPaymentPercentage: {
      min: 0,
      max: 100,
      default: 20,
    },
    downPaymentAmount: {
      min: 0,
      max: 3000000,
      default: 120000,
    },
    closingCostsPercentage: {
      min: 0,
      max: 5,
      default: 1.5,
    },
    closingCostsAmount: {
      min: 0,
      max: 100000,
      default: 12000,
    },
    propertyTaxPercentage: {
      min: 0,
      max: 5,
      default: 0.75,
    },
    propertyTaxAmount: {
      min: 0,
      max: 50000,
      default: 4500,
    },
    maintenancePercentage: {
      min: 0,
      max: 10,
      default: 1.0,
    },
    maintenanceAmount: {
      min: 0,
      max: 100000,
      default: 6000,
    },
    assetAppreciationRate: {
      min: -5,
      max: 20,
      default: 3.0,
    },
  },
  investment: {
    investmentReturn: {
      min: -20,
      max: 100,
      default: 7.5,
    },
  },
};
