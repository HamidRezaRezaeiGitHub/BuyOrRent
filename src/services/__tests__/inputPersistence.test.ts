import { InputPersistenceService } from '../inputPersistence';
import type { BuyOrRentInputs } from '@/types/inputs';
import { defaultInputs } from '@/types/inputs';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('InputPersistenceService', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveInputs', () => {
    it('should save inputs to localStorage', () => {
      const testInputs: BuyOrRentInputs = {
        ...defaultInputs,
        homePrice: 600000,
        monthlyRent: 3000,
      };

      InputPersistenceService.saveInputs(testInputs);

      const stored = localStorage.getItem('buyorrent-inputs');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.homePrice).toBe(600000);
      expect(parsed.monthlyRent).toBe(3000);
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      InputPersistenceService.saveInputs(defaultInputs);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save inputs to localStorage:',
        expect.any(Error)
      );

      // Restore
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('loadInputs', () => {
    it('should return default inputs when no data is stored', () => {
      const loaded = InputPersistenceService.loadInputs();
      expect(loaded).toEqual(defaultInputs);
    });

    it('should load stored inputs correctly', () => {
      const testInputs: BuyOrRentInputs = {
        ...defaultInputs,
        homePrice: 750000,
        mortgageRate: 7.5,
      };

      InputPersistenceService.saveInputs(testInputs);
      const loaded = InputPersistenceService.loadInputs();

      expect(loaded.homePrice).toBe(750000);
      expect(loaded.mortgageRate).toBe(7.5);
      expect(loaded.monthlyRent).toBe(defaultInputs.monthlyRent); // Should retain default for unmodified fields
    });

    it('should merge with defaults for partial data', () => {
      const partialData = { homePrice: 800000 };
      localStorage.setItem('buyorrent-inputs', JSON.stringify(partialData));

      const loaded = InputPersistenceService.loadInputs();

      expect(loaded.homePrice).toBe(800000);
      expect(loaded.monthlyRent).toBe(defaultInputs.monthlyRent);
      expect(loaded.mortgageRate).toBe(defaultInputs.mortgageRate);
    });

    it('should validate and sanitize invalid data', () => {
      const invalidData = {
        homePrice: 'invalid',
        mortgageRate: -5,
        loanTerm: 999,
        taxRate: 150,
      };
      localStorage.setItem('buyorrent-inputs', JSON.stringify(invalidData));

      const loaded = InputPersistenceService.loadInputs();

      expect(loaded.homePrice).toBe(defaultInputs.homePrice); // Should fallback to default
      expect(loaded.mortgageRate).toBe(defaultInputs.mortgageRate); // Should fallback to default
      expect(loaded.loanTerm).toBe(defaultInputs.loanTerm); // Should fallback to default
      expect(loaded.taxRate).toBe(defaultInputs.taxRate); // Should fallback to default
    });

    it('should handle corrupted JSON gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      localStorage.setItem('buyorrent-inputs', 'invalid json');

      const loaded = InputPersistenceService.loadInputs();

      expect(loaded).toEqual(defaultInputs);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load inputs from localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('clearInputs', () => {
    it('should remove inputs from localStorage', () => {
      InputPersistenceService.saveInputs(defaultInputs);
      expect(localStorage.getItem('buyorrent-inputs')).toBeTruthy();

      InputPersistenceService.clearInputs();
      expect(localStorage.getItem('buyorrent-inputs')).toBeNull();
    });

    it('should handle errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      InputPersistenceService.clearInputs();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to clear inputs from localStorage:',
        expect.any(Error)
      );

      localStorage.removeItem = originalRemoveItem;
      consoleSpy.mockRestore();
    });
  });

  describe('hasStoredInputs', () => {
    it('should return false when no inputs are stored', () => {
      expect(InputPersistenceService.hasStoredInputs()).toBe(false);
    });

    it('should return true when inputs are stored', () => {
      InputPersistenceService.saveInputs(defaultInputs);
      expect(InputPersistenceService.hasStoredInputs()).toBe(true);
    });

    it('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      expect(InputPersistenceService.hasStoredInputs()).toBe(false);

      localStorage.getItem = originalGetItem;
    });
  });
});