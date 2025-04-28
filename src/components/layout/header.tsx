import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-green">
              FeedConnect
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-neutral-charcoal hover:text-primary-green">
              About
            </Link>
            <Link to="/blog" className="text-neutral-charcoal hover:text-primary-green">
              Blog
            </Link>
            <Link to="/contact" className="text-neutral-charcoal hover:text-primary-green">
              Contact
            </Link>
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className="text-neutral-charcoal"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/about" className="text-neutral-charcoal hover:text-primary-green">
                About
              </Link>
              <Link to="/blog" className="text-neutral-charcoal hover:text-primary-green">
                Blog
              </Link>
              <Link to="/contact" className="text-neutral-charcoal hover:text-primary-green">
                Contact
              </Link>
              <Button variant="outline" asChild className="w-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};