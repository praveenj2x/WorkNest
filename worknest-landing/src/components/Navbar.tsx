'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'FAQ', href: '/#faq' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${isScrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg shadow-[#6a0dad]/20'
          : 'bg-[#0a0a0a]'
        }`}
    >
      <div className="px-6 md:px-12 lg:px-16 xl:px-24">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a href="/#home" className="sorts-mill-goudy-regular text-3xl text-[#ff6b35] hover:text-[#ff8c00] transition-colors duration-200 flex items-center gap-2">
              <span className="text-4xl">👻</span>
              GhostNet
            </a>
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="relative text-base funnel-sans-medium text-[#ff6b35]/70 hover:text-[#ff6b35] transition-colors duration-200 group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#6a0dad] transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}

            {/* CTA Button */}
            <motion.a
              href="https://app.worknest.kushinpi.me/"
              className="px-6 py-2.5 bg-[#6a0dad] text-white funnel-sans-semibold rounded-full hover:bg-[#8b2dd9] transition-all duration-300 hover:shadow-lg hover:shadow-[#6a0dad]/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter the Haunt
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#ff6b35] hover:text-[#ff8c00] transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-[#6a0dad]/20 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-3 text-base funnel-sans-medium text-[#ff6b35]/70 hover:text-[#ff6b35] hover:bg-[#6a0dad]/10 rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-2">
                  <a
                    href="#contact"
                    className="block px-4 py-3 text-center bg-[#6a0dad] text-white funnel-sans-semibold rounded-full hover:bg-[#8b2dd9] transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Enter the Haunt
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}