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
    <section className="min-h-screen bg-[#F5F1DC] flex items-center">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24 py-20 md:py-32 w-full">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headingVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="sorts-mill-goudy-regular text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#001BB7] leading-tight">
              Building the Future
              <span className="block mt-4">
                of HR Together
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
            <p className="funnel-sans-regular text-xl md:text-2xl text-[#001BB7]/80 leading-relaxed">
              We're a passionate team of innovators, designers, and HR professionals 
              working to create technology that puts people first and makes work more human.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}