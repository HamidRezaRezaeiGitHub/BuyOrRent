import { ConfigProvider } from './ConfigProvider';

describe('ConfigProvider', () => {
  describe('constructor', () => {
    it('should create instance with Canada as default country', () => {
      const provider = new ConfigProvider();
      expect(provider.getCountry()).toBe('Canada');
    });

    it('should create instance with specified country', () => {
      const provider = new ConfigProvider('Canada');
      expect(provider.getCountry()).toBe('Canada');
    });

    it('should fallback to Canada for unsupported country', () => {
      const provider = new ConfigProvider('UnsupportedCountry');
      expect(provider.getCountry()).toBe('UnsupportedCountry');
      // Should still return valid config (Canada as fallback)
      expect(provider.getRentConfig()).toBeDefined();
    });
  });

  describe('getSection', () => {
    it('should return rent section config', () => {
      const provider = new ConfigProvider();
      const rentConfig = provider.getSection('rent');
      
      expect(rentConfig).toBeDefined();
      expect(rentConfig.monthlyRent).toBeDefined();
      expect(rentConfig.rentIncreaseRate).toBeDefined();
    });

    it('should return purchase section config', () => {
      const provider = new ConfigProvider();
      const purchaseConfig = provider.getSection('purchase');
      
      expect(purchaseConfig).toBeDefined();
      expect(purchaseConfig.purchasePrice).toBeDefined();
      expect(purchaseConfig.mortgageRate).toBeDefined();
    });

    it('should return investment section config', () => {
      const provider = new ConfigProvider();
      const investmentConfig = provider.getSection('investment');
      
      expect(investmentConfig).toBeDefined();
      expect(investmentConfig.investmentReturn).toBeDefined();
    });
  });

  describe('getField', () => {
    it('should return field config for rent.monthlyRent', () => {
      const provider = new ConfigProvider();
      const fieldConfig = provider.getField('rent', 'monthlyRent');
      
      expect(fieldConfig).not.toBeNull();
      expect(fieldConfig?.min).toBe(0);
      expect(fieldConfig?.max).toBe(10000);
      expect(fieldConfig?.default).toBe(2000);
    });

    it('should return field config for purchase.purchasePrice', () => {
      const provider = new ConfigProvider();
      const fieldConfig = provider.getField('purchase', 'purchasePrice');
      
      expect(fieldConfig).not.toBeNull();
      expect(fieldConfig?.min).toBe(100000);
      expect(fieldConfig?.max).toBe(3000000);
      expect(fieldConfig?.default).toBe(600000);
    });

    it('should return field config for investment.investmentReturn', () => {
      const provider = new ConfigProvider();
      const fieldConfig = provider.getField('investment', 'investmentReturn');
      
      expect(fieldConfig).not.toBeNull();
      expect(fieldConfig?.min).toBe(-20);
      expect(fieldConfig?.max).toBe(100);
      expect(fieldConfig?.default).toBe(7.5);
    });

    it('should return null for non-existent field', () => {
      const provider = new ConfigProvider();
      const fieldConfig = provider.getField('rent', 'nonExistentField');
      
      expect(fieldConfig).toBeNull();
    });
  });

  describe('section-specific getters', () => {
    it('getRentConfig should return rent configuration', () => {
      const provider = new ConfigProvider();
      const rentConfig = provider.getRentConfig();
      
      expect(rentConfig.monthlyRent.default).toBe(2000);
      expect(rentConfig.rentIncreaseRate.default).toBe(2.5);
    });

    it('getPurchaseConfig should return purchase configuration', () => {
      const provider = new ConfigProvider();
      const purchaseConfig = provider.getPurchaseConfig();
      
      expect(purchaseConfig.purchasePrice.default).toBe(600000);
      expect(purchaseConfig.mortgageRate.default).toBe(5.5);
      expect(purchaseConfig.mortgageLength.default).toBe(25);
    });

    it('getInvestmentConfig should return investment configuration', () => {
      const provider = new ConfigProvider();
      const investmentConfig = provider.getInvestmentConfig();
      
      expect(investmentConfig.investmentReturn.default).toBe(7.5);
    });
  });

  describe('getConfig', () => {
    it('should return entire configuration object', () => {
      const provider = new ConfigProvider();
      const config = provider.getConfig();
      
      expect(config.rent).toBeDefined();
      expect(config.purchase).toBeDefined();
      expect(config.investment).toBeDefined();
    });
  });

  describe('Canadian default values', () => {
    const provider = new ConfigProvider('Canada');

    it('should have correct rent defaults', () => {
      const rentConfig = provider.getRentConfig();
      expect(rentConfig.monthlyRent.default).toBe(2000);
      expect(rentConfig.rentIncreaseRate.default).toBe(2.5);
    });

    it('should have correct purchase defaults', () => {
      const purchaseConfig = provider.getPurchaseConfig();
      expect(purchaseConfig.purchasePrice.default).toBe(600000);
      expect(purchaseConfig.mortgageRate.default).toBe(5.5);
      expect(purchaseConfig.mortgageLength.default).toBe(25);
      expect(purchaseConfig.downPaymentPercentage.default).toBe(20);
      expect(purchaseConfig.downPaymentAmount.default).toBe(120000);
      expect(purchaseConfig.closingCostsPercentage.default).toBe(1.5);
      expect(purchaseConfig.closingCostsAmount.default).toBe(12000);
      expect(purchaseConfig.propertyTaxPercentage.default).toBe(0.75);
      expect(purchaseConfig.propertyTaxAmount.default).toBe(4500);
      expect(purchaseConfig.maintenancePercentage.default).toBe(1.0);
      expect(purchaseConfig.maintenanceAmount.default).toBe(6000);
      expect(purchaseConfig.assetAppreciationRate.default).toBe(3.0);
    });

    it('should have correct investment defaults', () => {
      const investmentConfig = provider.getInvestmentConfig();
      expect(investmentConfig.investmentReturn.default).toBe(7.5);
    });
  });
});
