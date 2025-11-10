



import React from 'react';
// Fix: Use named imports for react-router-dom to fix module resolution issues
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { HeaderLogo } from './HeaderLogo';

interface HeaderProps {
  cartCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categories: string[];
}

const Header: React.FC<HeaderProps> = ({ cartCount, searchTerm, setSearchTerm, categories }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    const categoryId = category.toLowerCase().replace(/\s+/g, '-');
    if (location.pathname !== '/') {
      navigate(`/#${categoryId}`);
    } else {
      const element = document.getElementById(categoryId);
      if (element) {
        // We calculate the offset to account for the sticky header
        const headerOffset = 120; // Adjust this value based on your header's height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
      }
    }
  };
  
  const handleLogoClick = () => {
    if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <header className="bg-black shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <NavLink to="/" onClick={handleLogoClick}>
              <HeaderLogo />
            </NavLink>
          </div>

          <div className="flex-1 max-w-xl mx-4 hidden sm:block">
            <div className="relative">
              <input 
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-gray-900 rounded-lg py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center text-gray-300">
              <span className="text-sm font-medium">+225 0787324514</span>
            </div>
            <NavLink to="/cart" className="relative text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800" aria-label="Panier">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        {/* Bottom Bar - Categories */}
        <nav className="flex items-center justify-center flex-wrap h-auto py-3 gap-x-6 md:gap-x-8 gap-y-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="text-sm md:text-base font-medium transition-colors duration-200 pb-1 border-b-2 text-gray-300 border-transparent hover:text-lime-400"
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;