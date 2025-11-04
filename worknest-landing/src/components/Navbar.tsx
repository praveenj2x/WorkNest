'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-white'
      }`}
    >
      
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg sorts-mill-goudy-regular-italic font-semibold text-black tracking-tight">
              WorkNest
            </h1>
          </div>

          {/* Navigation Links - Right Side */}
          <div className="hidden lg:flex items-center space-x-6">
            <a
              href="#product"
              className="relative text-sm funnel-sans-regular text-gray-700 hover:text-black transition-colors duration-200 group"
            >
              Product
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#features"
              className="relative text-sm funnel-sans-regular text-gray-700 hover:text-black transition-colors duration-200 group"
            >
              Features
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#pricing"
              className="relative text-sm funnel-sans-regular text-gray-700 hover:text-black transition-colors duration-200 group"
            >
              Pricing
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#resources"
              className="relative text-sm funnel-sans-regular text-gray-700 hover:text-black transition-colors duration-200 group"
            >
              Resources
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#company"
              className="relative text-sm funnel-sans-regular text-gray-700 hover:text-black transition-colors duration-200 group"
            >
              Company
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#signin"
              className="relative text-sm funnel-sans-regular text-gray-700 hover:text-black transition-colors duration-200 group"
            >
              Sign In
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-gray-700 hover:text-black transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#product"
                className="block px-3 py-2 text-base funnel-sans-regular text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                Product
              </a>
              <a
                href="#features"
                className="block px-3 py-2 text-base funnel-sans-regular text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-base funnel-sans-regular text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#resources"
                className="block px-3 py-2 text-base funnel-sans-regular text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                Resources
              </a>
              <a
                href="#company"
                className="block px-3 py-2 text-base funnel-sans-regular text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                Company
              </a>
              <div className="pt-4 pb-2 border-t border-gray-200">
                <a
                  href="#signin"
                  className="block px-3 py-2 text-base funnel-sans-regular text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}