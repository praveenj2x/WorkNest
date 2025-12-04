'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Type definitions
interface FooterLink {
  name: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

// Constants for better maintainability
const FOOTER_LINKS: FooterLink[] = [
  { name: 'About', href: '/about' },
  { name: 'Features', href: '/#features' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy', href: '/privacy' }
];

const SOCIAL_ICONS = {
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  )
} as const;

const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Twitter', href: '#', icon: SOCIAL_ICONS.twitter },
  { name: 'LinkedIn', href: '#', icon: SOCIAL_ICONS.linkedin },
  { name: 'GitHub', href: '#', icon: SOCIAL_ICONS.github }
];

export default function Footer() {
  const footerLinks = FOOTER_LINKS;
  const socialLinks = SOCIAL_LINKS;
  const brandingRef = useRef(null);
  const isInView = useInView(brandingRef, { once: false });

  // Handle potential image loading errors gracefully
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  const letterVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 12,
        duration: 0.4,
        delay: i * 0.08,
      },
    }),
    hidden: {
      y: 100,
      opacity: 0
    },
  };

  const brandText = 'GhostNet'.split('');

  return (
    <footer className="bg-gradient-to-b from-[#0a0a0a] to-[#1a0a1a] text-white relative overflow-hidden">
      {/* Spooky background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-8xl">🕸️</div>
        <div className="absolute top-20 right-20 text-7xl">🦇</div>
        <div className="absolute bottom-20 left-1/4 text-6xl">🎃</div>
        <div className="absolute bottom-10 right-1/3 text-7xl">👻</div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-16 md:py-20 relative z-10">
        {/* Animated Branding */}
        <div className="mb-12 border-y-2 border-[#6a0dad]/30 py-8 md:py-12" ref={brandingRef}>
          <div className="flex justify-center items-center overflow-hidden">
            <span className="text-6xl md:text-8xl mr-4">👻</span>
            {brandText.map((letter, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={letterVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="sorts-mill-goudy-regular text-6xl md:text-8xl lg:text-9xl text-[#ff6b35] inline-block drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Brand */}
          <div className="flex-1">
            <p className="funnel-sans-regular text-[#ff8c00]/80 text-base md:text-lg max-w-md">
              Haunting workflows with spectral intelligence since the witching hour. 🎃
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="funnel-sans-medium text-[#ff6b35]/70 hover:text-[#ff6b35] text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6a0dad]/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded-sm"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-[#6a0dad]/20 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p className="funnel-sans-regular text-[#ff8c00]/60 text-sm">
            © 2025 GhostNet. Haunting the digital realm with{' '}
            <span className="text-[#ff6b35] font-medium">spooky</span>
            {' '}vibes 🎃
          </p>

          {/* Social Links */}
          <div className="flex gap-4" role="list" aria-label="Social media links">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#6a0dad]/20 hover:bg-[#6a0dad]/40 border border-[#6a0dad]/30 hover:border-[#ff6b35] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6a0dad]/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                aria-label={`Follow us on ${social.name}`}
                role="listitem"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}