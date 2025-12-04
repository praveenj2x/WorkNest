"use client";
import { motion } from 'framer-motion';

export default function AboutHero() {
  const headingVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a0a] flex items-center relative overflow-hidden">
      {/* Spooky floating elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-8xl animate-bounce">🎃</div>
        <div className="absolute top-40 right-20 text-7xl animate-pulse">👻</div>
        <div className="absolute bottom-40 left-1/4 text-6xl animate-bounce delay-100">🦇</div>
        <div className="absolute bottom-20 right-1/3 text-7xl animate-pulse delay-200">🕷️</div>
        <div className="absolute top-1/2 left-1/2 text-5xl animate-bounce">🌙</div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32 w-full relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headingVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="sorts-mill-goudy-regular text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#ff6b35] leading-tight drop-shadow-[0_0_30px_rgba(255,107,53,0.5)]">
              Summoning the Future
              <span className="block mt-4 text-[#6a0dad] drop-shadow-[0_0_30px_rgba(106,13,173,0.5)]">
                of Spectral Work 👻
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <p className="funnel-sans-regular text-xl md:text-2xl text-[#ff8c00]/80 leading-relaxed">
              We're a haunted team of phantom innovators, spectral designers, and supernatural professionals
              working to create dark magic that puts ghosts first and makes the afterlife more ethereal. 🎃
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}