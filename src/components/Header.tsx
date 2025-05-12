
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-secondary">rent</span>
              <span className="text-primary">in</span>
              <span className="text-secondary">london</span>
            </h1>
          </Link>
          
          <nav className="hidden md:flex ml-10 space-x-8">
            <Link to="/" className="text-secondary hover:text-primary transition-colors font-medium">Home</Link>
            <Link to="/properties" className="text-secondary hover:text-primary transition-colors font-medium">Properties</Link>
            <Link to="/how-it-works" className="text-secondary hover:text-primary transition-colors font-medium">How it Works</Link>
          </nav>
        </div>
        
        <div className="hidden md:flex space-x-4 items-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <span className="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
              </svg>
            </span>
            Log In
          </Button>
          <Button className="bg-primary hover:bg-primary-hover text-white">Publish Property</Button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <span className="sr-only">Open main menu</span>
            {!isMobileMenuOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-gray-50">Home</Link>
            <Link to="/properties" className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-gray-50">Properties</Link>
            <Link to="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-gray-50">How it Works</Link>
            <div className="flex flex-col space-y-2 mt-4 px-3 py-2">
              <Button variant="outline" className="w-full justify-center border-primary text-primary hover:bg-primary hover:text-white">Log In</Button>
              <Button className="w-full justify-center bg-primary hover:bg-primary-hover text-white">Publish Property</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
