import { CanadaConfig } from '@/config/config-canada';
import type { CountryConfig, FieldConfig, RentConfig, PurchaseConfig, InvestmentConfig } from '@/config/config-canada';

/**
 * ConfigProvider class for accessing country-specific configuration values
 * 
 * This class provides a centralized way to access min/max/default values
 * for all input fields. It supports country-based configurations with
 * Canada as the default.
 */
export class ConfigProvider {
  private config: CountryConfig;
  private countryName: string;

  /**
   * Create a new ConfigProvider instance
   * @param country - Country name (currently only "Canada" is supported)
   */
  constructor(country: string = 'Canada') {
    this.countryName = country;
    
    // For now, only Canada is supported
    // In the future, this could dynamically import other country configs
    if (country === 'Canada' || !country) {
      this.config = CanadaConfig;
    } else {
      // Fallback to Canada if unsupported country
      console.warn(`Country "${country}" not supported, falling back to Canada`);
      this.config = CanadaConfig;
    }
  }

  /**
   * Get configuration for a specific section
   * @param section - Section name ('rent', 'purchase', or 'investment')
   * @returns Section configuration object
   */
  getSection(section: 'rent'): RentConfig;
  getSection(section: 'purchase'): PurchaseConfig;
  getSection(section: 'investment'): InvestmentConfig;
  getSection(section: 'rent' | 'purchase' | 'investment'): RentConfig | PurchaseConfig | InvestmentConfig {
    return this.config[section];
  }

  /**
   * Get configuration for a specific field
   * @param section - Section name ('rent', 'purchase', or 'investment')
   * @param field - Field name
   * @returns Field configuration with min, max, and default values
   */
  getField(section: 'rent' | 'purchase' | 'investment', field: string): FieldConfig | null {
    const sectionConfig = this.config[section];
    if (!sectionConfig) {
      console.warn(`Section "${section}" not found in config`);
      return null;
    }

    // Type-safe access to field config
    const fieldConfig = sectionConfig[field as keyof typeof sectionConfig] as FieldConfig | undefined;
    if (!fieldConfig) {
      console.warn(`Field "${field}" not found in section "${section}"`);
      return null;
    }

    return fieldConfig;
  }

  /**
   * Get the rent section configuration
   */
  getRentConfig() {
    return this.config.rent;
  }

  /**
   * Get the purchase section configuration
   */
  getPurchaseConfig() {
    return this.config.purchase;
  }

  /**
   * Get the investment section configuration
   */
  getInvestmentConfig() {
    return this.config.investment;
  }

  /**
   * Get the current country name
   */
  getCountry(): string {
    return this.countryName;
  }

  /**
   * Get the entire configuration object
   */
  getConfig(): CountryConfig {
    return this.config;
  }
}

/**
 * Default ConfigProvider instance for Canada
 */
export const defaultConfigProvider = new ConfigProvider('Canada');
