import { createContext, useContext, ReactNode } from 'react';
import { ConfigProvider, defaultConfigProvider } from './ConfigProvider';

/**
 * Context for providing ConfigProvider instance to React components
 */
const ConfigContext = createContext<ConfigProvider>(defaultConfigProvider);

/**
 * Provider component for ConfigContext
 */
export function ConfigContextProvider({ children, country = 'Canada' }: { children: ReactNode; country?: string }) {
  const configProvider = new ConfigProvider(country);
  
  return (
    <ConfigContext.Provider value={configProvider}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * Hook to access the ConfigProvider instance
 * 
 * @returns ConfigProvider instance
 * 
 * @example
 * ```tsx
 * const config = useConfig();
 * const rentConfig = config.getRentConfig();
 * const monthlyRentConfig = config.getField('rent', 'monthlyRent');
 * ```
 */
export function useConfig(): ConfigProvider {
  const context = useContext(ConfigContext);
  
  if (!context) {
    // This should never happen if properly wrapped with ConfigContextProvider
    // Return default as fallback
    return defaultConfigProvider;
  }
  
  return context;
}
