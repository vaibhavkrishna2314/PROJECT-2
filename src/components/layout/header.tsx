import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="relative w-full z-50 bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out">
      <nav className="mx-auto px-4 sm:px-6 lg:px-32 h-16 flex items-center justify-between" aria-label="Top">
        {/* Logo - Elegant and aligned to the far left */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-2xl font-serif font-extrabold text-green-700 hover:text-green-800 transition-colors duration-200 tracking-tight">
            FeedConnect
          </Link>
        </div>

        {/* Desktop Navigation Links & Buttons - Now grouped and aligned to the right */}
        {/* The key change here is moving the nav links into the same container as the auth buttons */}
        <div className="hidden md:flex items-center space-x-8 font-serif"> {/* space-x-8 for overall spacing between nav items and auth buttons */}
          {/* Navigation Links */}
          <Link to="/about" className="text-gray-700 hover:text-green-700 font-medium transition-colors duration-200 relative group text-base">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/blog" className="text-gray-700 hover:text-green-700 font-medium transition-colors duration-200 relative group text-base">
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-green-700 font-medium transition-colors duration-200 relative group text-base">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Spacer to create separation before auth buttons (optional, but good for visual balance) */}
          <div className="w-px h-6 bg-gray-200 mx-2"></div> {/* A thin vertical separator */}

          {/* Auth Buttons */}
          <Button variant="outline" asChild className="px-5 py-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 rounded-full font-serif font-semibold text-sm">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white transition-all duration-200 rounded-full font-serif font-semibold text-sm shadow-md">
            <Link to="/register">Register</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 rounded-md p-2 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Content - Remains the same, just re-check the font-serif for consistency if not already there */}
      <div
        className={`md:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden py-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col space-y-3 px-4 sm:px-6 lg:px-8 font-serif">
          <Link to="/about" className="text-gray-800 hover:text-green-600 font-medium text-base py-2 block" onClick={handleLinkClick}>
            About
          </Link>
          <Link to="/blog" className="text-gray-800 hover:text-green-600 font-medium text-base py-2 block" onClick={handleLinkClick}>
            Blog
          </Link>
          <Link to="/contact" className="text-gray-800 hover:text-green-600 font-medium text-base py-2 block" onClick={handleLinkClick}>
            Contact
          </Link>
          <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
            <Button variant="outline" asChild className="w-full px-5 py-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 rounded-full font-semibold text-sm" onClick={handleLinkClick}>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="w-full px-5 py-2 bg-green-600 hover:bg-green-700 text-white transition-all duration-200 rounded-full font-semibold text-sm shadow-md" onClick={handleLinkClick}>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};