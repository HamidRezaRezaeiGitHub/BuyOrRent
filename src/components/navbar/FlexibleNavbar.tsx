import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { LoginButton } from './LoginButton';
import { Logo } from './Logo';
import { SignUpButton } from './SignUpButton';
import { NavbarUser } from './types';

// Type for theme toggle component
export type ThemeToggleComponent = React.ComponentType<{
  showLabel?: boolean;
}>;

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FlexibleNavbarProps {
  className?: string;

  // Brand configuration
  showLogo?: boolean;
  logoSize?: 'sm' | 'md' | 'lg';

  // Authentication state
  isAuthenticated?: boolean;
  user?: NavbarUser | null;

  // Navigation items
  navItems?: NavItem[];

  // Authentication buttons (when not authenticated)
  showAuthButtons?: boolean;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  loginButtonText?: string;
  signUpButtonText?: string;

  // User menu (when authenticated)
  onAvatarClick?: () => void;

  // Theme toggle configuration
  ThemeToggleComponent?: ThemeToggleComponent;
  showThemeToggle?: boolean;

  // Mobile menu
  enableMobileMenu?: boolean;
}

/**
 * FlexibleNavbar - A highly flexible navbar component
 * 
 * Features:
 * - Logo with customizable size
 * - Navigation items with onClick handlers 
 * - Authentication state handling (login/signup buttons or user avatar)
 * - Theme toggle with multiple styles (compact, dropdown, switch, etc.)
 * - Mobile responsive with hamburger menu
 * - Fully customizable through props
 */
export const FlexibleNavbar: React.FC<FlexibleNavbarProps> = ({
  className = '',

  // Brand props
  showLogo = true,
  logoSize = 'md',

  // Auth props
  isAuthenticated = false,
  user = null,

  // Navigation props
  navItems = [],

  // Auth button props
  showAuthButtons = true,
  onLoginClick,
  onSignUpClick,
  loginButtonText = 'Login',
  signUpButtonText = 'Sign Up',

  // User menu props
  onAvatarClick,

  // Theme toggle props
  ThemeToggleComponent,
  showThemeToggle = true,

  // Mobile menu props
  enableMobileMenu = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  // Helper function to render theme toggle with appropriate props
  const renderThemeToggle = (showLabel: boolean = false) => {
    if (!ThemeToggleComponent) {
      return (
        <div className="text-sm text-muted-foreground">
          Theme Toggle (Configure ThemeToggleComponent prop)
        </div>
      );
    }
    return <ThemeToggleComponent showLabel={showLabel} />;
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-3 lg:px-4 h-14 sm:h-16 flex items-center justify-between">

        {/* Left side - Logo and Brand */}
        <div className="flex items-center gap-1 sm:gap-3 lg:gap-5 min-w-0">
          {showLogo && (
            <Logo
              size={logoSize}
              className="flex-shrink-0"
            />
          )}

          {/* Desktop Navigation */}
          {navItems.length > 0 && (
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavItemClick(item)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Right side - Theme Toggle and Auth */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">

          {/* Theme Toggle - Always visible on mobile for your use case */}
          {showThemeToggle && (
            <div className="flex-shrink-0">
              {renderThemeToggle(false)}
            </div>
          )}

          {/* Authentication Section */}
          {isAuthenticated && user ? (
            // Authenticated: Show Avatar
            <Avatar
              user={user}
              onClick={onAvatarClick}
              size="md"
              className="flex-shrink-0"
            />
          ) : showAuthButtons ? (
            // Not Authenticated: Show Login/SignUp buttons
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <LoginButton
                onClick={onLoginClick}
                variant="ghost"
                size="sm"
              >
                {loginButtonText}
              </LoginButton>
              <SignUpButton
                onClick={onSignUpClick}
                variant="default"
                size="sm"
              >
                {signUpButtonText}
              </SignUpButton>
            </div>
          ) : null}

          {/* Mobile Menu Button */}
          {enableMobileMenu && (navItems.length > 0 || showAuthButtons) && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 h-8 w-8 sm:h-9 sm:w-9"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {enableMobileMenu && isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/20 bg-background/95 backdrop-blur">
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">

            {/* Mobile Navigation */}
            {navItems.length > 0 && (
              <nav className="space-y-1">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavItemClick(item)}
                    className="block w-full text-left text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 sm:py-3 px-2 rounded-md hover:bg-muted/50"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}

            {/* Mobile Auth Buttons */}
            {!isAuthenticated && showAuthButtons && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-border/20">
                <LoginButton
                  onClick={() => {
                    onLoginClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="justify-start w-full h-12 text-base"
                >
                  {loginButtonText}
                </LoginButton>
                <SignUpButton
                  onClick={() => {
                    onSignUpClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="default"
                  className="justify-start w-full h-12 text-base"
                >
                  {signUpButtonText}
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default FlexibleNavbar;