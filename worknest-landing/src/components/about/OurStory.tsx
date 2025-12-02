"use client";
import { motion } from 'framer-motion';

export default function OurStory() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="px-6 md:px-12 lg:px-16 xl:px-24">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16 md:mb-20">
            <h2 className="sorts-mill-goudy-regular text-5xl md:text-6xl lg:text-7xl text-[#001BB7] leading-tight mb-6">
              Our Story
            </h2>
            <p className="funnel-sans-regular text-xl md:text-2xl text-[#001BB7]/70 max-w-3xl mx-auto">
              Every great company starts with a simple idea and the determination to make it real.
            </p>
          </motion.div>

          {/* Story Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h3 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-4">
                  The Beginning
                </h3>
                <p className="funnel-sans-regular text-lg text-[#001BB7]/80 leading-relaxed">
                  WorkNest was born from a simple observation: HR professionals spend too much time 
                  on administrative tasks and not enough time on what truly matters—supporting people 
                  and building great workplace cultures.
                </p>
              </div>

              <div>
                <h3 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-4">
                  Our Vision
                </h3>
                <p className="funnel-sans-regular text-lg text-[#001BB7]/80 leading-relaxed">
                  We envision a world where technology amplifies human potential rather than replacing it. 
                  Where HR teams are empowered with intelligent tools that help them create more engaging, 
                  supportive, and productive work environments.
                </p>
              </div>

              <div>
                <h3 className="sorts-mill-goudy-regular text-3xl md:text-4xl text-[#001BB7] mb-4">
                  Today & Tomorrow
                </h3>
                <p className="funnel-sans-regular text-lg text-[#001BB7]/80 leading-relaxed">
                  We're still in the early stages of our journey, but we're committed to building 
                  something meaningful. Every feature we develop, every decision we make, is guided 
                  by our core belief that great technology should make work more human, not less.
                </p>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Team collaboration"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}