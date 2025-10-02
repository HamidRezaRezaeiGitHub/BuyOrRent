import React from 'react';
import { BrowserRouter } from 'react-router-dom';

interface RouterProviderProps {
  children: React.ReactNode;
}

/**
 * RouterProvider component that wraps the application with React Router's BrowserRouter.
 * 
 * Uses BrowserRouter for clean URLs without hash fragments.
 * This provider should be at the top level of your provider hierarchy.
 * 
 * The basename is set to match the Vite base configuration (/BuyOrRent/)
 * so that React Router routes work correctly with the deployment base path.
 * 
 * Benefits:
 * - Clean URLs (e.g., /BuyOrRent/dashboard instead of /#/dashboard)
 * - Better SEO support
 * - History API integration
 * - Proper back/forward button behavior
 * - Works correctly with Vite base path configuration
 */
export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  return (
    <BrowserRouter basename="/BuyOrRent">
      {children}
    </BrowserRouter>
  );
};

export default RouterProvider;