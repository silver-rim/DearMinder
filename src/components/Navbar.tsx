
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, CreditCard } from 'lucide-react'; 
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate('/auth');
  };

  const handleGetStarted = () => {
    setIsMenuOpen(false);
    navigate('/auth?mode=signup');
  };

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    await signOut();
  };

  const handleNavLinkClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('#')) {
      if (isLandingPage) {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const homeElement = document.querySelector(href);
          homeElement?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  // Reusable NavLink component for consistent styling
  const NavLink = ({ href, children, isButton = false, variant = 'ghost', className = '' }: { href: string; children: React.ReactNode, isButton?: boolean, variant?: any, className?: string }) => {
    if (isButton) {
      return (
        <Button
          size="sm"
          variant={variant}
          className={`rounded-full ${className}`}
          onClick={() => handleNavLinkClick(href)}
        >
          {children}
        </Button>
      );
    }
    return (
      <a 
        onClick={() => handleNavLinkClick(href)}
        className={`text-sm text-gray-600 hover:text-dearminder-purple transition-colors cursor-pointer ${className}`}
      >
        {children}
      </a>
    );
  };


  return (
    <nav className="w-full py-4 px-4 md:px-8 bg-white/90 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand Name */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-dearminder-purple to-dearminder-blue flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-playfair font-bold bg-gradient-to-r from-dearminder-purple-dark to-dearminder-blue bg-clip-text text-transparent">
            DearMinder
          </span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {/* Conditional Rendering based on user login status */} 
          {user ? (
            <> {/* Logged-in links */} 
              <NavLink href="/dashboard" isButton variant="outline">Dashboard</NavLink>
              <NavLink href="/subscription" isButton variant="outline">Subscription</NavLink>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full text-red-500 border-red-300 hover:border-red-500 hover:text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <> {/* Logged-out links and buttons */} 
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full"
                onClick={handleLogin}
              >
                Log in
              </Button>
              <Button 
                size="sm" 
                className="bg-dearminder-purple hover:bg-dearminder-purple-dark rounded-full"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="outline" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */} 
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md py-4 px-6 z-50 animate-fade-in">
          <div className="flex flex-col space-y-4">
            {/* Conditional Rendering */} 
            {user ? (
              <> {/* Logged-in links */} 
                <NavLink href="/dashboard" className="block py-1 font-medium">Dashboard</NavLink>
                <NavLink href="/subscription" className="block py-1 font-medium"> 
                  <CreditCard className="inline-block mr-2 h-4 w-4"/>Subscription
                </NavLink>
                <hr className="my-2"/>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-500 border-red-300 hover:border-red-500 hover:text-red-600"
                  onClick={handleSignOut}
                >
                   <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <> {/* Logged-out links and buttons */} 
                <NavLink href="#features" className="block py-1">Features</NavLink>
                <NavLink href="#pricing" className="block py-1">Pricing</NavLink>
                <NavLink href="#testimonials" className="block py-1">Testimonials</NavLink>
                <hr className="my-2"/>
                <div className="flex flex-col space-y-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center rounded-full"
                    onClick={handleLogin}
                  >
                    Log in
                  </Button>
                  <Button 
                    className="w-full justify-center bg-dearminder-purple hover:bg-dearminder-purple-dark rounded-full"
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
