import logoLight from '@/assets/brand/logo-2-light-with-text-no-bg.svg';
import logoDark from '@/assets/brand/logo-2-dark-with-text-no-bg.svg';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/utils';
import React from 'react';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * BuyOrRent Logo component
 * Displays the BuyOrRent brand logo with responsive sizing and theme awareness.
 * The logo automatically switches between light and dark versions based on the current theme.
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md'
}) => {
  const { actualTheme } = useTheme();

  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8 sm:h-10',
    lg: 'h-12 sm:h-14'
  };

  // Select the appropriate logo based on the current theme
  const logoSrc = actualTheme === 'dark' ? logoDark : logoLight;

  return (
    <div className={cn('flex items-center', className)}>
      <img
        src={logoSrc}
        alt="BuyOrRent logo"
        className={cn('w-auto', sizeClasses[size])}
      />
    </div>
  );
};

export default Logo;