import { useState, useEffect } from 'react';
import logo from '../assets/main logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`bg-white px-6 py-4 fixed top-0 left-0 w-full z-50 transition-all duration-200 ${scrolled ? 'shadow-sm border-b border-gray-100' : ''}`}>
      <div className="flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-3">
          <img 
            src={logo}
            alt="Lyzr Icon" 
            className="h-10 w-auto pr-2 border-r border-r-[#9d9d9d]"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Saksoft
            </span> 
            <h1 className="-mt-1 text-xl font-bold text-purple-500">
              QA Agent
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
