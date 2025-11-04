"use client";
import { motion } from 'framer-motion';

export default function TeamSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="mb-16 md:mb-20">
            <h2 className="sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#001BB7] leading-tight mb-6">
              Meet the Team
            </h2>
            <p className="funnel-sans-regular text-xl md:text-2xl text-[#001BB7]/70 max-w-3xl mx-auto">
              We're a small but passionate team working to make HR more human and effective.
            </p>
          </motion.div>

          {/* Team Message */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <div className="bg-[#F5F1DC] rounded-3xl p-8 md:p-12">
              <h3 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-6">
                We're Building Something Special
              </h3>
              <p className="funnel-sans-regular text-lg md:text-xl text-[#001BB7]/80 leading-relaxed mb-8">
                Our team is currently small but growing. We're a group of designers, developers, 
                and HR professionals who believe technology can make work more fulfilling for everyone.
              </p>
              
              <div className="space-y-4">
                <p className="funnel-sans-regular text-base text-[#001BB7]/70">
                  Interested in joining our mission? We'd love to hear from you.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[#001BB7] text-white funnel-sans-medium rounded-full hover:bg-[#0046FF] transition-colors duration-300"
                >
                  Get in Touch
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Future Team Section */}
          <motion.div variants={itemVariants} className="mt-16 md:mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#001BB7]/10 rounded-full flex items-center justify-center mx-auto mb-4"></div>
                <h4 className="sorts-mill-goudy-regular text-xl text-[#001BB7] mb-2">Design</h4>
                <p className="funnel-sans-regular text-[#001BB7]/70">
                  Creating beautiful, intuitive experiences
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-[#001BB7]/10 rounded-full flex items-center justify-center mx-auto mb-4"></div>
                <h4 className="sorts-mill-goudy-regular text-xl text-[#001BB7] mb-2">Engineering</h4>
                <p className="funnel-sans-regular text-[#001BB7]/70">
                  Building robust, scalable solutions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-[#001BB7]/10 rounded-full flex items-center justify-center mx-auto mb-4"></div>
                <h4 className="sorts-mill-goudy-regular text-xl text-[#001BB7] mb-2">HR Expertise</h4>
                <p className="funnel-sans-regular text-[#001BB7]/70">
                  Understanding real-world HR challenges
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}